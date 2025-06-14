
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.editCar')
    if (form) {
        form.addEventListener('change', function(){
            const updateBtn = document.querySelector('button')
            if (updateBtn) updateBtn.removeAttribute('disabled')
        })
    }


    const form2 = document.querySelector('#updateClass')
    if (form2){
    
        form2.addEventListener('change', function(){
            const updateBtn2 = document.querySelector('#updateClassButton')
            if (updateBtn2) updateBtn2.removeAttribute('disabled')
        })
    }
})