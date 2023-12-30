// all elements
const day_heading = document.querySelector("#day_heading");
const img = document.querySelector("#img_conatiner img");
const img_heading = document.querySelector("#img_heading");
const img_info = document.querySelector("#img_info");
const form = document.querySelector("#search-form");
const dateInput = document.querySelector("#search-input");
const search_list = document.querySelector("#search-history");

let prevSearchArray = [];

let currentDate;

const api_key = "CgNagta9ivozVVEsebeezCcfIN9Y3Isj2hzsE6Fb";

function getCurrentImageOfTheDay() {
  let today = new Date();

  //format date in yyyy-mm-dd format
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, 0);
  const day = String(today.getDate()).padStart(2, 0);
  const formattedDate = `${year}-${month}-${day}`;
  currentDate = formattedDate;
  // print data on UI
  fetchData(currentDate);
}

async function fetchData(date) {
  const url = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${api_key}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // if data is received call printData Function to print the data
    printData(data);
  } catch (error) {
    console.error("Error fetching data from NASA.com:", error);
  }
}

function printData(dataObj) {
  const explanation = dataObj.explanation;
  const title = dataObj.title;
  const img_src = dataObj.url;

  //cache-busting parameter to the image URL => imestamp
  const cacheBuster = new Date().getTime();
  const imgSrcWithCacheBuster = `${img_src}?${cacheBuster}`;

  img_info.innerHTML = `${explanation}`;
  img_heading.innerHTML = `${title}`;
  img.src = `${imgSrcWithCacheBuster}`;
}

function saveSearch(date) {
  prevSearchArray.push({ date: date });
  localStorage.setItem("searches", JSON.stringify(prevSearchArray));
  addSearchToHistory();
}

function addSearchToHistory() {
  const data = localStorage.getItem("searches");
  const dateArray = JSON.parse(data);
  search_list.innerHTML = "";
  dateArray.forEach((element) => {
    const listElement = document.createElement("li");
    const listAnchor = document.createElement("a");
    listAnchor.innerText = element.date;
    listAnchor.href = "#";
    listElement.appendChild(listAnchor);
    search_list.appendChild(listElement);
  });
}

//handling the events
// handling prevSeacrh click event
search_list.addEventListener("click", (event) => {
  const date = event.target.innerText;
  fetchData(date);
  day_heading.innerHTML = "";
  day_heading.innerHTML = `Picture on ${date}`;
});

//handling form date click evevnt
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const date = dateInput.value;
  fetchData(date);
  if (date != currentDate) {
    day_heading.innerHTML = "";
    day_heading.innerHTML = `Picture on ${date}`;
    saveSearch(date);
  } else {
    day_heading.innertext = `NASA Picture of the Day`;
  }
});

// onload evevnt

window.addEventListener("load", getCurrentImageOfTheDay);
