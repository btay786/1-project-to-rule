var pageNumber = document.getElementById('page-number');
var isbnKey = "ISBN:9780980200447";

// https://openlibrary.org/api/books?bibkeys={ISBN:9780980200447}&jscmd=data&format=json
// Must be "ISBN:00000000000000"

var getPageNumber = function(){
    var apiUrl = "https://openlibrary.org/api/books?bibkeys=" +isbnKey+ "&jscmd=data&format=json";
    fetch(apiUrl)
        
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log("page number: " + data[isbnKey].number_of_pages);
            var total = document.createElement('h2'); // create a paragraph

            total.textContent = "number of page is " + data[isbnKey].number_of_pages;
            pageNumber.appendChild(total);
        });
    console.log(apiUrl)
}

// get ISBN from url
// 

function checkISBN(selectedURL){
    if(selectedURL.includes("ISBN")){
        
        var isbnNum = document.createElement('h3');
        
        
        isbnNum.textContent = "Inside checkISBN: " + selectedURL.substring(42,60);
        pageNumber.appendChild(isbnNum);
    }
};

var apiUrl = "https://openlibrary.org/api/books?bibkeys=ISBN:9780980200447&jscmd=data&format=json";


getPageNumber();
checkISBN(apiUrl);