
const danger = document.querySelector(".alert-danger")




if (danger.classList.contains("active")){
    setTimeout(() => {
         danger.classList.remove("active")
    }, 2000)
}

if (danger.classList.contains("showactive")){
    setTimeout(() => {
         danger.classList.remove("showactive")
    }, 2000)
}











