const apiKey = '23829158-8e5b8c65dfcd19ccf0c91c5c8';
const searchBox = document.getElementById("searchBox");
const landingWrapper = document.getElementById("landingWrapper");
const welcomeHeading = document.getElementById("welcomeHeading");
const searchButton = document.getElementById("searchButton");
const searchHeading = document.getElementById("searchHeading");
const settingsButton = document.getElementById("settingsButton");
const settingsContainer = document.getElementById("settingsContainer");
const closeBtn = document.getElementById("closeBtn");
const resultsDiv = document.getElementById("results");
const perPageElement = document.getElementById("perPage");
const typeElement = document.getElementById("type");
const displayImage = document.getElementById('display');
const alertText = document.getElementById('alert');
const pagination = document.getElementById('pagination');
let modalImage = document.getElementById('modalImage');
let mostLikes = document.getElementById('mostLikes');
let mostViews = document.getElementById('mostViews');
let pageNumber = 1;
let query = "";
const safeSearch= document.getElementById('safeSearch');

window.addEventListener('load', function(){
    let lastQuery = localStorage.getItem("query");
    searchBox.value = lastQuery;
})

safeSearch.addEventListener('click', function(){
if(safeSearch.checked){
    document.getElementById('ageLimitIcon').src = "./img/age-limit.png";
} else {
    document.getElementById('ageLimitIcon').src = "./img/age-limit-open.png";
}

});

// search button function
searchButton.addEventListener('click', function () {
    searchPixaBay();
});
// hit enter to run functions attached to the searchButton click event
searchBox.addEventListener("keyup", function(KeyboardEvent) {
    if (KeyboardEvent.code == "Enter") {
     document.getElementById("searchButton").click();
    }
});

// animations
settingsButton.addEventListener('click', function () {
    settingsContainer.style.visibility = "visible";
    settingsContainer.style.transition = "0.3s";
    settingsContainer.style.opacity = 1;
    settingsButton.style.background = "#0d6efd";
    

});

// this script closes the settings menu by adjusting css properties
closeBtn.addEventListener('click', function () {
    settingsContainer.style.opacity = 0;
    settingsContainer.style.visibility = "hidden";
    settingsButton.style.background = "#fff";
});

// add class that tells browser that navigation is pinned
const observer = new IntersectionObserver( 
  ([e]) => e.target.classList.toggle("is-pinned", e.intersectionRatio < 1),
  { threshold: [1] }
);

observer.observe(landingWrapper);

// search function
async function searchPixaBay(URLpageNumber) {
    if (query != searchBox.value) {
        pageNumber = 1;
    }
    console.log(pageNumber);
    query = searchBox.value;
    localStorage.setItem('query', query);
    let perPage = perPageElement.value;
    let type = typeElement.value;
    const res = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=${type}&safesearch=${safeSearch.checked}&per_page=${perPage}&page=${URLpageNumber}`);
    const json = await res.json();
    console.log(json);
    url = res.url;
    console.log(url);


// removes landing screen
    landingWrapper.classList.remove('landingScreen');
    welcomeHeading.style.display="none";
    searchHeading.style.visibility="visible";
    searchHeading.style.opacity="1";




// sorting functions
    if(mostViews.checked){
        sortByHighViews(json.hits);
    }
    else if(mostLikes.checked){
        sortByHighLikes(json.hits);
    }

// clear old searches
    resultsDiv.innerHTML = '';
  
    
// alert if search has no hits
    if (json.totalHits == 0) {
        alertText.innerHTML = `<div class="alert alert-danger" role="alert">
        Sorry, no results found...
      </div>`;
    } else {
        displayData(json);
        alertText.innerHTML = "";
    }

// pagination
    pagination.innerHTML =

    `<div="wrap">
    <div class="paginationFlexbox">
        ${displayPrevBtn()}
            <div class ="scrollBox">
                <div class ="paginationBtnWrapper">
                    ${createPageNumbers(json.totalHits, perPage)}
                </div>
            </div>
        ${displayNextBtn(json.totalHits, perPage)}
        </div>
        </div>`;
}

// pagination navigation functions

function displayPrevBtn() {
    if (pageNumber <= 1){
       return `<a id="previousBtn">&#171;</a>`;
    } else {
       return `<a id="previousBtn" href="#" onclick="prevPageBtn(url + pageNumber)">&#171;</a>`;
    }
}
function displayNextBtn(totalHits, perPage) {
    if (pageNumber >= Math.ceil(totalHits / perPage)){
       return `<a id="nextBtn" id="nextBtn">&#187;</a>`;
    } else {
       return `<a id="nextBtn" href="#" onclick="nextPageBtn(url + pageNumber)">&#187;</a>`;
    }
}

function nextPageBtn() {
    pageNumber++;
    searchPixaBay(pageNumber);
}
function prevPageBtn() {
    pageNumber--;
    searchPixaBay(pageNumber);
}


// display cards

function displayData(data) {
    data.hits.forEach(imageData => {
        let img = imageData.previewURL;
        let tags = imageData.tags;
        let userProfilePic = imageData.userImageURL;
        let user = imageData.user;
        let views = imageData.views;
        let likes = imageData.likes;
        let imgURL = imageData.largeImageURL;
        let tagSingle = tags.split(", ");
 
        if(userProfilePic == ""){
            userProfilePic = "./img/no_pic.jpg";
        }

        let imgCard =
            `<div class="customColumn">
                <div class="displayCard">
        
                    <div class="card">

                        <a class="overlay" onclick="insertImage('${String(imgURL)}')" data-bs-toggle="modal" data-bs-target="#exampleModal">

                        <img id="zoomIcon" src="./img/enlargeWhite.png" alt="">
                            
                        <span>
                        <img src="./img/likeWhite.png" class="imageIconLikes"alt=""> ${likes} &nbsp; &nbsp;
                        <img src="./img/viewWhite.png" class="imageIconViews"alt=""> ${views}
                        </span>
                        <img class="userProfilePic"src="${userProfilePic}"></img>
                        </a>
                        
                    <img src="${img}" class="rounded previewImg" alt="...">
                    <a class="userName" href="https://pixabay.com/users/${user}" target="_blank"><p class="card-title">${user}</p></a>
                </div>
                        <div class="card-body">
 
                            <div id="test2" class="card-text">${createButton(tagSingle)}</div>

                             

                             
                                
                            </div>
                    </div>
                </div>`;


        resultsDiv.insertAdjacentHTML('beforeend', imgCard);

    });
}

// modal image function

function insertImage(imgURL) {
    console.log(imgURL);
    modalImage.innerHTML = `<img src="${imgURL}" class="img-fluid"></img>`;
}

// search tag function

function searchTag(tag) {
    searchBox.value = tag;
    searchPixaBay();
}

// create tag buttons

function createButton(b) {
    let btn = '';
    for (var i = 0; i < b.length; i++) {
        btn += `<a class="tagButton m-1 text-capitalize" href="#" onclick="searchTag('${String(b[i])}')" value=${b[i]}>${b[i]}</a>`;
    }
    return btn;
}

// pagination functions

function createPageNumbers(totalHits, perPage) {
    totalHits = Math.ceil(totalHits / perPage + 1);
    pagi = "";
    for (var i = 1; i < totalHits; i++) {
        if (i == pageNumber) {
            pagi += `<li id="${i}" class="pageBtn active"><a href="#" onclick="searchPixaBay(value(${[i]}))">${[i]}</a></li>`;
        } else {
            pagi += `<li id="${i}" class="pageBtn"><a  href="#" onclick="searchPixaBay(value(${[i]}))">${[i]}</a></li>`;
        }
    }
    return pagi;
}

function value(i) {
    pageNumber = i;
    return i;
}


// sorting functions

function sortByHighViews(json){
    json.sort(function (b, a) {
        return a.views - b.views;
        });
    }

    function sortByHighLikes(json){
    json.sort(function (b, a) {
        return a.likes - b.likes;
        });
    }
