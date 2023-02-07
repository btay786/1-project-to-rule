var pageNumber = document.getElementById('page-number');
var getPageNumber = function(){
    var apiUrl = "https://openlibrary.org/api/books?bibkeys=ISBN:9780980200447&jscmd=data&format=json";
    fetch(apiUrl)
        
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log("page number: " + data["ISBN:9780980200447"].number_of_pages);
            var total = document.createElement('h2'); // create a paragraph

            total.textContent = "number of page is " + data["ISBN:9780980200447"].number_of_pages;

        });

        
    console.log(apiUrl)
}

getPageNumber()