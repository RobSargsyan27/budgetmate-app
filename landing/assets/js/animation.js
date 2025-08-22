AOS.init({ duration: 800 })

const header = document.querySelector('.navbar')
const header_height = header.offsetHeight

window.addEventListener('scroll', function() {
    window.scrollY >= header_height
        ? header.classList.add('scrolled', 'shadow-sm')
        : header.classList.remove('scrolled', 'shadow-sm')
})
