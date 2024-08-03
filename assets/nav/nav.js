// boton nav
document.addEventListener('DOMContentLoaded', () => {
    const btnNav = document.querySelector('.btn-nav')
    const nav = document.querySelector('nav')
    btnNav.addEventListener('click', () => {
        nav.classList.toggle('fx')
    })
})