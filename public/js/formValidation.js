console.log("hi");
const form = document.querySelector(".form");
const title = document.getElementById("schoolname-input");
const location = document.getElementById("location-input");
const imgurl = document.getElementById("imgurl");
const tuition = document.getElementById("tution-input");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  validateInputs();
});

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

const validateInputs = () => {
  const nameValue = title.value.trim();
  const locationValue = location.value.trim();
  const tuitionValue = tuition.value.trim();
  const imgurlValue = imgurl.value.trim();

  if (nameValue === "") {
    setError(username, "Name is required");
  } else {
    setSuccess(username);
  }

  if (locationValue === "") {
    setError(email, "Location is required");
  } else {
    setSuccess(email);
  }

  if (tuitionValue === "") {
    setError(password, "Tuition is required");
  } else {
    setSuccess(password);
  }

  if (imgurlValue === "") {
    setError(password2, "Please confirm your password");
  } else {
    setSuccess(password2);
  }
};
