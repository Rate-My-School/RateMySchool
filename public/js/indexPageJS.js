console.log("HELLO")
const cardContainer = document.getElementById("cardContainer");
const schools = JSON.parse(
  cardContainer.getAttribute("data-server-variable")
);
const schoolTitles = schools.map((school) => school.title);
console.log(schoolTitles);
const resultBox = document.querySelector(".result-box");
const inputBox = document.getElementById("search");
inputBox.onkeyup = function () {
  resultBox.classList.remove("display-hidden");
  let result = [];
  let input = inputBox.value;
  if (input.length) {
    result = schoolTitles.filter((keyword) => {
      return keyword.toLowerCase().includes(input.toLowerCase());
    });
  }
  display(result);
};
function display(result) {
  const content = result.map((list) => {
    let displaySchool = schools.find((school) => school.title === list);
    const schoolLink = `/schools/${displaySchool._id}`;
    return `<a href='${schoolLink}'> <li >` + list + "</li></a>";
  });

  resultBox.innerHTML = "<ul>" + content.join("") + "</ul>";
}
function findID(list) { }
function selectInput(list) {
  inputBox.value = list.innerHTML;
}

document.addEventListener("click", (event) => {
  if (event.target.closest(".result-box")) return;
  resultBox.classList.add("display-hidden");
});



let posts = [];
let size = 16;
const cardLoad = size;
window.onload = function () {
  loadData();
};
loadData = () => {
  for (let i = size - cardLoad; i < size; i++) {
    posts.push(schools[i]);
  }
  if (posts.length > 0) {
    for (let j = size - cardLoad; j < size; j++) {
      let cardItem = ` <div class="card">
                            <a href="/schools/${posts[j]._id}" class="box">
                              <div class="image">
                                <img src="${posts[j].image}" alt="" />
                              </div>
                              <div class="info">
                                <div class="title">
                                  <span class="schoolTitle">${posts[j].title
        } </span>
                                </div>
                                <div class="info-sub">
                                  <div>${posts[j].reviews.length} review${posts[j].reviews.length != 1 ? "s" : ""
        }</div>
                                  <div class="location">${posts[j].location
        }</div>
                                </div>
                              </div>
                            </a>
                          </div>`;
      cardContainer.insertAdjacentHTML("beforeEnd", cardItem);
    }
  }
  window.onscroll = function () {
    const { scrollTop, scrollHeight, clientHeight } =
      document.documentElement;
    if (scrollTop + clientHeight + 0.80005 >= scrollHeight) {
      setTimeout(() => {
        size += cardLoad;
        loadData();
      }, 500);
    }
  };
};