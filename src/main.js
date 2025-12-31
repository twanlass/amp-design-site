// Designer Card Web Component
class DesignerCard extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name') || 'Designer Name'
    const firstName = name.split(' ')[0]
    const title = this.getAttribute('title') || 'Design Title'
    const location = this.getAttribute('location') || 'Location'
    const photo = this.getAttribute('photo') || 'https://placehold.co/200x200/e2e8f0/64748b?text=Photo'

    this.innerHTML = `
      <div class="text-left bg-gray-50">
        <div class="pt-6 pr-6 ml-6 border-b border-[#EBEBEB]">
          <img
            src="${photo}"
            alt="${name}"
            class="w-24 h-24 object-cover ml-2"
          />
        </div>
        <div class="p-6">
          <h3 class="font-normal text-gray-900">${firstName}</h3>
          <p class="text-sm text-gray-600">${title}</p>
          <p class="text-sm text-gray-500">${location}</p>
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
      <a
        href="${url}"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-between bg-gray-50 p-6 hover:bg-white transition-colors"
      >
        <div>
          <h3 class="font-normal text-gray-900">${title}</h3>
          <p class="text-sm text-gray-600">${subtitle}</p>
        </div>
        <span class="text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100">Apply Now ↗</span>
      </a>
    `
  }
}

customElements.define('job-card', JobCard)

// ASCII Art Hover Effect
document.addEventListener('DOMContentLoaded', () => {
  const asciiArt = document.getElementById('ascii-art')
  if (!asciiArt) return

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
  const radius = 24 // pixels

  chars.forEach(span => {
    span.style.transition = 'color 2s ease-out'
  })

  asciiArt.parentElement.addEventListener('mousemove', (e) => {
    const rect = asciiArt.parentElement.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    chars.forEach(span => {
      const spanRect = span.getBoundingClientRect()
      const spanX = spanRect.left - rect.left + spanRect.width / 2
      const spanY = spanRect.top - rect.top + spanRect.height / 2

      const distance = Math.sqrt((mouseX - spanX) ** 2 + (mouseY - spanY) ** 2)

      if (distance < radius) {
        span.style.transition = 'color 0.1s ease-in'
        span.style.color = '#1E61F0'
        setTimeout(() => {
          span.style.transition = 'color 2s ease-out'
          span.style.color = ''
        }, 100)
      }
    })
  })

  // Sparkle effect - randomly highlight characters
  const sparkle = () => {
    const randomChar = chars[Math.floor(Math.random() * chars.length)]
    randomChar.style.transition = 'color 0.1s ease-in'
    randomChar.style.color = '#1E61F0'
    setTimeout(() => {
      randomChar.style.transition = 'color 2s ease-out'
      randomChar.style.color = ''
    }, 100)
  }

  setInterval(sparkle, 200)
})
