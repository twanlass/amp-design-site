// Designer Card Web Component
class DesignerCard extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name') || 'Designer Name'
    const firstName = name.split(' ')[0]
    const title = this.getAttribute('title') || 'Design Title'
    const location = this.getAttribute('location') || 'Location'
    const photo = this.getAttribute('photo') || 'https://placehold.co/200x200/e2e8f0/64748b?text=Photo'

    this.innerHTML = `
      <div class="designer-card-inner text-left bg-gray-50 aspect-square flex flex-col justify-end gap-2 hover:bg-white transition-colors">
        <div class="px-4 sm:px-8">
          <img
            src="${photo}"
            alt="${name}"
            class="w-24 h-24 sm:w-40 sm:h-40 object-cover mix-blend-multiply select-none"
          />
        </div>
        <div class="px-4 sm:px-8 pb-4 sm:pb-6">
          <h3 class="text-gray-900 text-sm sm:text-base" style="font-weight: 490">${firstName}</h3>
          <p class="text-sm sm:text-base text-gray-500">${title}</p>
          <p class="text-sm sm:text-base text-gray-500">${location}</p>
        </div>
      </div>
    `
  }
}

customElements.define('designer-card', DesignerCard)

// Job Card Web Component
class JobCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'Job Title'
    const subtitle = this.getAttribute('subtitle') || 'Job Subtitle'
    const url = this.getAttribute('url') || '#'

    this.innerHTML = `
      <div class="group flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-4 sm:p-6 hover:bg-white transition-colors gap-3 sm:gap-0">
        <div>
          <h3 class="text-gray-900 text-sm sm:text-base" style="font-weight: 490">${title}</h3>
          <p class="text-sm sm:text-base text-gray-500">${subtitle}</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="share-btn text-sm text-gray-900 border border-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-gray-100 cursor-pointer sm:opacity-0 sm:group-hover:opacity-100 transition-opacity select-none" style="font-weight: 490">Share</button>
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-900 border border-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-gray-100 select-none" style="font-weight: 490">Apply Now ↗</a>
        </div>
      </div>
    `

    const shareBtn = this.querySelector('.share-btn')
    shareBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(url).then(() => {
        shareBtn.textContent = 'Copied!'
        setTimeout(() => {
          shareBtn.textContent = 'Share'
        }, 3000)
      })
    })
  }
}

customElements.define('job-card', JobCard)

// About Item Web Component
class AboutItem extends HTMLElement {
  connectedCallback() {
    const number = this.getAttribute('number') || '1'
    const title = this.getAttribute('title') || 'Title'
    const description = this.getAttribute('description') || 'Description'

    this.innerHTML = `
      <div class="bg-gray-50 px-4 sm:px-8 py-4 sm:py-6 md:aspect-square hover:bg-white transition-colors">
        <span class="text-sm text-gray-400">${number}</span>
        <h3 class="mt-2 text-gray-900 text-sm sm:text-base" style="font-weight: 490">${title}</h3>
        <p class="mt-1 text-sm sm:text-base text-gray-500 leading-6 sm:leading-7">${description}</p>
      </div>
    `
  }
}

customElements.define('about-item', AboutItem)

// Hover card effect - add data-hover-card="/path/to/image.png" to any element
// Optionally add data-hover-achievement="achievementKey:Achievement Title" to trigger an easter egg
document.addEventListener('DOMContentLoaded', () => {
  const hoverCardElements = document.querySelectorAll('[data-hover-card]')

  // Achievement tracking for hover cards
  const hoverAchievements = {}

  // Track viewed cards for collection achievement
  const viewedCards = new Set()
  const totalCards = hoverCardElements.length

  hoverCardElements.forEach(element => {
    const imageSrc = element.dataset.hoverCard
    const achievementData = element.dataset.hoverAchievement

    // Random rotation between -8 and 8 degrees
    const randomRotation = Math.floor(Math.random() * 17) - 8

    const floatingCard = document.createElement('img')
    floatingCard.src = imageSrc
    floatingCard.className = 'fixed pointer-events-none z-50 w-64 opacity-0 scale-[0.8] transition-all duration-300 ease-out -translate-x-1/2 -translate-y-1/2 rounded-md shadow-xl'
    floatingCard.style.rotate = '0deg'
    document.body.appendChild(floatingCard)

    element.addEventListener('mouseenter', () => {
      // Only show hover cards if toggle is enabled
      if (!document.body.classList.contains('card-hover-enabled')) {
        return
      }

      floatingCard.classList.remove('opacity-0', 'scale-[0.8]')
      floatingCard.classList.add('opacity-100', 'scale-100')
      floatingCard.style.rotate = `${randomRotation}deg`

      // Track viewed cards for collection achievement
      viewedCards.add(imageSrc)
      if (viewedCards.size === totalCards) {
        window.dispatchEvent(new CustomEvent('hoverAchievement', { detail: { key: 'collectionComplete', title: 'Collection Complete' } }))
      }

      // Trigger achievement if set
      if (achievementData && !hoverAchievements[achievementData]) {
        hoverAchievements[achievementData] = true
        const [key, title] = achievementData.split(':')
        window.dispatchEvent(new CustomEvent('hoverAchievement', { detail: { key, title } }))
      }
    })

    element.addEventListener('mouseleave', () => {
      floatingCard.classList.remove('opacity-100', 'scale-100')
      floatingCard.classList.add('opacity-0', 'scale-[0.8]')
      floatingCard.style.rotate = '0deg'
    })

    element.addEventListener('mousemove', (e) => {
      floatingCard.style.left = `${e.clientX}px`
      floatingCard.style.top = `${e.clientY}px`
    })
  })
})

// ASCII Art Hover Effect
document.addEventListener('DOMContentLoaded', () => {
  const asciiArt = document.getElementById('ascii-art')
  if (!asciiArt) return

  // Dynamic brush settings
  let brushRadius = 16
  let brushColor = '#1E61F0'
  let rainbowMode = false
  let rainbowIndex = 0
  const rainbowColors = ['#1E61F0', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981']

  // Cycle rainbow colors every 1 second
  setInterval(() => {
    if (rainbowMode) {
      rainbowIndex = (rainbowIndex + 1) % rainbowColors.length
    }
  }, 1000)

  const text = asciiArt.innerText
  let html = ''

  for (const char of text) {
    if (char === '\n') {
      html += '\n'
    } else if (char === '+') {
      html += `<span class="ascii-char">+</span>`
    } else if (char === ' ') {
      html += ' '
    } else {
      html += char
    }
  }

  asciiArt.innerHTML = html

  const chars = asciiArt.querySelectorAll('.ascii-char')
  const container = asciiArt.parentElement
  const controlsWrapper = document.getElementById('ascii-controls-wrapper')
  const brushSizeSlider = document.getElementById('brush-size')
  const colorSwatches = document.querySelectorAll('.color-swatch')
  const brushCursor = document.getElementById('brush-cursor')

  // Update brush cursor size
  const updateBrushCursor = () => {
    const size = brushRadius * 2
    brushCursor.style.width = `${size}px`
    brushCursor.style.height = `${size}px`
  }
  updateBrushCursor()

  chars.forEach(span => {
    span.style.transition = 'color 2s ease-out'
  })

  // Track if controls have been shown (once shown, stay visible)
  let controlsRevealed = false

  const showControls = () => {
    if (!controlsRevealed) {
      controlsWrapper.classList.remove('opacity-0', 'pointer-events-none', 'scale-[0.8]', '-bottom-8')
      controlsWrapper.classList.add('opacity-100', 'pointer-events-auto', 'scale-100', 'bottom-0')
      controlsRevealed = true
    }
  }

  // Show brush cursor on container enter
  container.addEventListener('mouseenter', () => {
    brushCursor.classList.remove('opacity-0')
    brushCursor.classList.add('opacity-100')
    container.style.cursor = 'none'
  })

  container.addEventListener('mouseleave', () => {
    brushCursor.classList.remove('opacity-100')
    brushCursor.classList.add('opacity-0')
    container.style.cursor = ''
  })

  // Hide brush cursor when hovering over controls
  controlsWrapper.addEventListener('mouseenter', () => {
    brushCursor.classList.remove('opacity-100')
    brushCursor.classList.add('opacity-0')
    container.style.cursor = ''
  })

  controlsWrapper.addEventListener('mouseleave', () => {
    brushCursor.classList.remove('opacity-0')
    brushCursor.classList.add('opacity-100')
    container.style.cursor = 'none'
  })

  // Brush size slider
  brushSizeSlider.addEventListener('input', (e) => {
    brushRadius = parseInt(e.target.value, 10)
    updateBrushCursor()
  })

  // Easter egg achievements
  const achievements = {
    hotkeyWizard: false,
    tasteTheRainbow: false,
    yourNextRole: false,
    noTldr: false,
    collectionComplete: false
  }
  let achievementCount = 0
  const totalAchievements = 5

  const showAchievementToast = (title) => {
    achievementCount++
    const count = achievementCount // Capture count at trigger time

    // 1s delay before showing toast
    setTimeout(() => {
      const toast = document.createElement('div')
      toast.className = 'fixed left-6 bg-gray-900 text-white px-4 py-3 rounded-lg z-50 flex items-center gap-3 transition-all duration-300 ease-out opacity-0 scale-[0.8] -bottom-8'
      toast.innerHTML = `
        <div class="text-left">
          <div class="text-xs text-gray-400">Achievement Unlocked</div>
          <div class="text-sm font-medium">${title}</div>
        </div>
        <span class="w-6 h-6 rounded-full bg-white text-gray-900 text-xs font-medium flex items-center justify-center shrink-0">${count}/${totalAchievements}</span>
      `
      document.body.appendChild(toast)

      // Animate in (double rAF to ensure initial state is painted first)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          toast.classList.remove('opacity-0', 'scale-[0.8]', '-bottom-8')
          toast.classList.add('opacity-100', 'scale-100', 'bottom-6')
        })
      })

      // Animate out and remove after 5 seconds
      setTimeout(() => {
        toast.classList.remove('opacity-100', 'scale-100', 'bottom-6')
        toast.classList.add('opacity-0', 'scale-[0.8]', '-bottom-8')
        setTimeout(() => toast.remove(), 300)
      }, 5000)
    }, 1000)
  }

  // Listen for hover card achievements
  window.addEventListener('hoverAchievement', (e) => {
    const { key, title } = e.detail
    if (!achievements[key]) {
      achievements[key] = true
      showAchievementToast(title)
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === '[') {
      brushRadius = Math.max(8, brushRadius - 4)
      brushSizeSlider.value = brushRadius
      updateBrushCursor()
      if (!achievements.hotkeyWizard) {
        achievements.hotkeyWizard = true
        showAchievementToast('Hotkey Wizard')
      }
    } else if (e.key === ']') {
      brushRadius = Math.min(64, brushRadius + 4)
      brushSizeSlider.value = brushRadius
      updateBrushCursor()
      if (!achievements.hotkeyWizard) {
        achievements.hotkeyWizard = true
        showAchievementToast('Hotkey Wizard')
      }
    }
  })

  // Color swatch selection
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const color = swatch.dataset.color

      if (color === 'rainbow') {
        rainbowMode = true
        rainbowIndex = 0
      } else {
        rainbowMode = false
        brushColor = color
      }

      // Update swatch visual states
      colorSwatches.forEach(s => {
        s.classList.remove('ring-2', 'ring-offset-2')
        s.classList.add('ring-0')
        s.style.removeProperty('--tw-ring-color')
      })
      swatch.classList.remove('ring-0')
      swatch.classList.add('ring-2', 'ring-offset-2')
      if (color === 'rainbow') {
        swatch.style.setProperty('--tw-ring-color', '#9ca3af')
      } else {
        swatch.style.setProperty('--tw-ring-color', color)
      }
    })
  })

  // Shared paint function for mouse and touch
  const paintAtPosition = (clientX, clientY) => {
    const rect = container.getBoundingClientRect()
    const posX = clientX - rect.left
    const posY = clientY - rect.top

    chars.forEach(span => {
      const spanRect = span.getBoundingClientRect()
      const spanX = spanRect.left - rect.left + spanRect.width / 2
      const spanY = spanRect.top - rect.top + spanRect.height / 2

      const distance = Math.sqrt((posX - spanX) ** 2 + (posY - spanY) ** 2)

      if (distance < brushRadius) {
        const paintColor = rainbowMode ? rainbowColors[rainbowIndex] : brushColor
        span.style.transition = 'color 0.1s ease-in'
        span.style.color = paintColor
        setTimeout(() => {
          span.style.transition = 'color 2s ease-out'
          span.style.color = ''
        }, 100)

        // Show controls when user actually paints a character (once shown, stays visible)
        showControls()

        // Rainbow achievement
        if (rainbowMode && !achievements.tasteTheRainbow) {
          achievements.tasteTheRainbow = true
          showAchievementToast('Taste the Rainbow')
        }
      }
    })
  }

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Update brush cursor position
    brushCursor.style.left = `${mouseX}px`
    brushCursor.style.top = `${mouseY}px`

    paintAtPosition(e.clientX, e.clientY)
  })

  // Touch support for mobile painting
  let isTouchPainting = false

  container.addEventListener('touchstart', (e) => {
    isTouchPainting = true
    const touch = e.touches[0]
    paintAtPosition(touch.clientX, touch.clientY)
  }, { passive: true })

  container.addEventListener('touchmove', (e) => {
    if (!isTouchPainting) return
    const touch = e.touches[0]
    paintAtPosition(touch.clientX, touch.clientY)
  }, { passive: true })

  container.addEventListener('touchend', () => {
    isTouchPainting = false
  })

  // Scroll to bottom achievement
  window.addEventListener('scroll', () => {
    if (achievements.noTldr) return
    const scrolledToBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50
    if (scrolledToBottom) {
      achievements.noTldr = true
      showAchievementToast('No tl;dr for you')
    }
  })

  // Sparkle effect - randomly highlight characters
  const sparkle = () => {
    const randomChar = chars[Math.floor(Math.random() * chars.length)]
    const sparkleColor = rainbowMode ? rainbowColors[Math.floor(Math.random() * rainbowColors.length)] : brushColor
    randomChar.style.transition = 'color 0.1s ease-in'
    randomChar.style.color = sparkleColor
    setTimeout(() => {
      randomChar.style.transition = 'color 2s ease-out'
      randomChar.style.color = ''
    }, 100)
  }

  setInterval(sparkle, 200)
})

// Card hover toggle easter egg
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('#card-hover-toggle input')
  const toggleLabel = document.getElementById('card-hover-toggle')
  if (!toggle) return

  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      document.body.classList.add('card-hover-enabled')
      toggleLabel.classList.remove('opacity-0', 'group-hover:opacity-100')
      toggleLabel.classList.add('opacity-100')
    } else {
      document.body.classList.remove('card-hover-enabled')
      toggleLabel.classList.remove('opacity-100')
      toggleLabel.classList.add('opacity-0', 'group-hover:opacity-100')
    }
  })
})
