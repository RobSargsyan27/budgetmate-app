AOS.init({
    duration: 800,
});

let scrollPos = window.scrollY
const header = document.querySelector(".navbar")
const header_height = header.offsetHeight

const add_class_on_scroll = () => header.classList.add("scrolled", "shadow-sm")
const remove_class_on_scroll = () => header.classList.remove("scrolled", "shadow-sm")

window.addEventListener('scroll', function() {
    scrollPos = window.scrollY;

    if (scrollPos >= header_height) { add_class_on_scroll() }
    else { remove_class_on_scroll() }

    console.log(scrollPos)
})