const background = document.getElementById('background')

window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        background.classList.add('visible');
    }else{
        background.classList.add('hide')
    }
})