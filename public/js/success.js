const alertSuccess = document.querySelector(".alert-success");

if (alertSuccess.classList.contains("active")) {
  setTimeout(() => {
    alertSuccess.classList.remove("active");
  }, 2000);
}
