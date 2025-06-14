const form = document.querySelector('.editCar')
    form.addEventListener('change', function(){
        const updateBtn = document.querySelector('button')
        updateBtn.removeAttribute('disabled')
    })

const form2 = document.querySelector('.updateClassificationData')
    form2.addEventListener('change', function(){
        const updateBtn2 = document.querySelector('button')
        updateBtn2.removeAttribute('disabled')
    })