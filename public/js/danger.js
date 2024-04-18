
const danger = document.querySelector(".alert-danger")




if (danger.classList.contains("active")){
    setTimeout(() => {
         danger.classList.remove("active")
    }, 2000)
}









