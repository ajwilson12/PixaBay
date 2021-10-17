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
let pageNumber = 2


searchButton.addEventListener('click', function () {

    const query = searchBox.value 
    if(query == ""){
        alertText.innerHTML = `<div class="alert alert-danger" role="alert">
        Type something in the search bar.
      </div>`
    } else {
    searchPixaBay(query)
    alertText.innerHTML = ""
    }

})



async function searchPixaBay(query) {

    let perPage = perPageElement.value
    const res = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${query}&per_page=${perPage}&page=`)
    const json = await res.json()
    url = res.url
    
    resultsDiv.innerHTML = ''  
    pageNumber = 2

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
    console.log(json)
    console.log(url)
}

async function nextPageBtn(url) {
    const res = await fetch(url)
    const json = await res.json()
    resultsDiv.innerHTML = ''
    pageNumber+=1
    displayData(json);
    console.log(pageNumber)
}
async function prevPageBtn(url) {
    const res = await fetch(url)
    const json = await res.json()
    resultsDiv.innerHTML = ''
    pageNumber--
    displayData(json);
    console.log(pageNumber);
}

async function numPageBtn(url) {
    const res = await fetch(url)
    const json = await res.json()
    resultsDiv.innerHTML = ''
    displayData(json);
    console.log(pageNumber);
}



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
                    <a href="${imgURL}" target="_blank"><img src="${img}" class="card-img-top previewImg" alt="..."></a>

                        <div class="card-body">
 
                            <div id="test2" class="card-text">${createButton(tagSingle)}</div>

                            <div class="flex">
                            <img class="userProfilePic"src="${userProfilePic}"></img>
                            <a href="https://pixabay.com/users/${user}" target="_blank"><h6 class="card-title">${user}</h6></a>
                            </div>

                            <p class="card-text">Views: ${views}</p>
                            <p class="card-text">Likes: ${likes}</p>


                        <!-- Button to activate modal -->
                        <button onclick="insertImage('${String(imgURL)}')" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        See Full Size
                        </button>
  
                    </div>
                </div>
            </div>`;


        resultsDiv.insertAdjacentHTML('beforeend',imgCard) 
        
    });        
}

// modal image function

function insertImage(imgURL){
console.log(imgURL)
     modalImage.innerHTML = `<img src="${imgURL}"></img>`   
}


// pagination functions

function createButton(b){
    let btn = ''
for (var i = 0; i < b.length; i++) {
    btn += `<button class="btn btn-primary m-1" onclick="searchPixaBay('${String(b[i])}')" value=${b[i]}>${b[i]}</button>`;
  }
  return btn;
}

function createPageNumbers(total, perPage){
    total = Math.ceil(total/perPage+1)
    pagi = ""
for (var i=1; i<total; i++){
    pagi += `<li class="page-item"><a class="page-link" href="#" onclick="numPageBtn(url + ${[i]})">${[i]}</a></li>`
}
return pagi;
}