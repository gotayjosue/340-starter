const form = document.querySelector('.editCar')
    form.addEventListener('change', function(){
        const updateBtn = document.querySelector('button')
        updateBtn.removeAttribute('disabled')
    })