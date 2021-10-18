const apiKey = '23829158-8e5b8c65dfcd19ccf0c91c5c8'
const searchBox = document.getElementById("searchBox");
const searchButton = document.getElementById("searchButton");
const resultsDiv = document.getElementById("results")
const backBtn = document.getElementById("back")
const perPageElement = document.getElementById("perPage")
const displayImage = document.getElementById('display')
const alertText = document.getElementById('alert')
const pagination = document.getElementById('pagination')
let modalImage = document.getElementById('modalImage')
let pageNumber = 1
let query = ""

searchButton.addEventListener('click', function () {
    searchPixaBay()
})

function searchTag(tag) {
  searchBox.value = tag
  searchPixaBay()
}

async function searchPixaBay(URLpageNumber) {
    if(query != searchBox.value){
      pageNumber = 1
    }
    
    query = searchBox.value 
    let perPage = perPageElement.value
    const res = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${query}&per_page=${perPage}&page=${URLpageNumber}`)
    const json = await res.json()
    console.log(json)
    url = res.url
    console.log(url)
    resultsDiv.innerHTML = ''  

    if(json.totalHits == 0){
        alertText.innerHTML = `<div class="alert alert-danger" role="alert">
        Sorry, no results found...
      </div>`
    } else {
    displayData(json);
    }

    // pagination
    pagination.innerHTML = `<div class="pagination"></div>
    <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item"><a class="page-link" onclick="prevPageBtn(url + pageNumber)">Previous</a></li>
        
          ${createPageNumbers(json.totalHits, perPage)}

          <li class="page-item"><a class="page-link" href="#" onclick="nextPageBtn(url + pageNumber)">Next</a></li>
        </ul>
      </nav>`
}

// pagination navigation functions

function nextPageBtn() {
    pageNumber++
    searchPixaBay(pageNumber)
    console.log(pageNumber)
}
function prevPageBtn() {
    
    pageNumber--
    searchPixaBay(pageNumber)
    console.log(pageNumber);
    } 


// display cards

function displayData(data){
    data.hits.forEach(imageData => {
        let img = imageData.previewURL
        let tags =imageData.tags
        let userProfilePic = imageData.userImageURL
        let user = imageData.user
        let views = imageData.views
        let likes = imageData.likes
        let imgURL = imageData.largeImageURL
        let tagSingle = tags.split(",")

        if(userProfilePic == ""){
            userProfilePic = "../img/noPic.jpg"
        }
        
          
        let imgCard = 
            `<div class="col-4 p-1">
                <div class="card">
                <a onclick="insertImage('${String(imgURL)}')" data-bs-toggle="modal" data-bs-target="#exampleModal"><img src="${img}" class="card-img-top previewImg" alt="..."></a>

                        <div class="card-body">
 
                            <div id="test2" class="card-text">${createButton(tagSingle)}</div>

                                <div class="flex">
                                    <img class="userProfilePic"src="${userProfilePic}"></img>
                                    <a href="https://pixabay.com/users/${user}" target="_blank"><h6 class="card-title">${user}</h6></a>
                                </div>

                            <p class="card-text">Views: ${views}</p>
                            <p class="card-text">Likes: ${likes}</p>

                            </div>
                    </div>
                </div>`;


        resultsDiv.insertAdjacentHTML('beforeend',imgCard) 
        
    });        
}

// modal image function

function insertImage(imgURL){
console.log(imgURL)
     modalImage.innerHTML = `<img src="${imgURL}" class="img-fluid"></img>`   
}



// create tag buttons

function createButton(b){
    let btn = ''
for (var i = 0; i < b.length; i++) {
    btn += `<button class="btn btn-primary m-1" onclick="searchTag('${String(b[i])}')" value=${b[i]}>${b[i]}</button>`;
  }
  return btn;
}

// pagination functions

function createPageNumbers(totalHits, perPage){
    totalHits = Math.ceil(totalHits/perPage+1)
    pagi = ""
for (var i=1; i<totalHits; i++){
    pagi += `<li class="page-item"><a class="page-link" href="#" onclick="searchPixaBay(value(${[i]}))">${[i]}</a></li>`
    
}
return pagi;
}

function value(i){
    pageNumber = i
    return i
}