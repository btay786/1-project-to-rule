
var bookInput = document.querySelector("#book-text");
var bookList = document.querySelector("#book-list");
var bookCountSpan = document.querySelector("#book-count");
var books = [];

var pageNumber = document.getElementById('page-number');


var isbnKey = "ISBN:9780980200447";

var totalNumberOfPages = 0;
var readingSpeed = 30; // 30 pages per hours
var readingDays = (totalNumberOfPages/readingSpeed);


// totalNumberOfPages will be a concatonation of the book collection
var totalNumberOfPages = ['']
// can be changed later to diffent speeds
var readingSpeed = 30
var readingDays = totalNumberOfPages/readingSpeed 
// book selection in search
var selectedBook = $('#txtBookSearch');


$(document).ready(function () {  // only begin once page has loaded
    $("#txtBookSearch").autocomplete({ // attach auto-complete functionality to textbox
        // define source of the data
        source: function (request, response) {
            // url link to google books, including text entered by user (request.term)
            var booksUrl = "https://www.googleapis.com/books/v1/volumes?printType=books&q=" + encodeURIComponent(request.term);
            $.ajax({
                url: booksUrl,
                dataType: "jsonp",
                success: function(data) {
                    console.log (data)
                    response($.map(data.items, function (item) {
                        if(item.volumeInfo.title && item.volumeInfo.pageCount){
                            //var pageNumber = $('#page-number');
                            totalNumberOfPages = item.volumeInfo.pageCount;
                            //var rowHTML = "<tr><td>" + item.volumeInfo.title + "</td><td>" + item.volumeInfo.pageCount + "</td><td>" + "</td></tr>";
                            //pageNumber.html(pageNumber.html() + rowHTML);
                        }
                        if (item.volumeInfo.authors && item.volumeInfo.title && item.volumeInfo.industryIdentifiers && item.volumeInfo.publishedDate)
                        {
                            return {
                                // label value will be shown in the suggestions
                                label: item.volumeInfo.title + ', ' + item.volumeInfo.authors[0] + ', ' + item.volumeInfo.publishedDate,
                                // value is what gets put in the textbox once an item selected
                                value: item.volumeInfo.title,
                                // other individual values to use later
                                title: item.volumeInfo.title,
                                author: item.volumeInfo.authors[0],
                                isbn: item.volumeInfo.industryIdentifiers,
                                publishedDate: item.volumeInfo.publishedDate,
                                image: (item.volumeInfo.imageLinks == null ? "" : item.volumeInfo.imageLinks.thumbnail),
                                description: item.volumeInfo.description,
                                pages:item.volumeInfo.pageCount,
                            };
                        }
                        
                    }));
                }
            });
        },
        select: function (event, ui) {
            
            $('#divDescription').empty();
        
            // show a pic if we have one
            
            
                $('#divDescription').append('<p><b>Title:</b> ' + ui.item.title  + '</p>');
                $('#divDescription').append('<p><b>Author:</b> ' + ui.item.author  + '</p>');
                $('#divDescription').append('<p><b>First published year:</b> ' + ui.item.publishedDate  + '</p>');          
                
                $('#divDescription').append('<p><b>Description:</b> ' + ui.item.description  + '</p>');

                if (ui.item.isbn && ui.item.isbn[0].identifier)
                {
                    $('#divDescription').append('<P><b>ISBN:</b> ' + ui.item.isbn[0].identifier + '</p>');
                    $('#divDescription').append('<a href="http://www.worldcat.org/isbn/' + ui.item.isbn[0].identifier + '" target="_blank">View item on worldcat</a>');
                }
                
                // Add new bookText to books array, clear the input
                
                // Store updated books in localStorage, re-render the list
                
                var isbnKey = "ISBN:"+ String(ui.item.isbn[0].identifier);
                var getPageNumber = function(){
                    var apiUrl = "https://openlibrary.org/api/books?bibkeys="+isbnKey+"&jscmd=data&format=json";
                    var pageNumber = $('#page-number');
                    console.log ("<tr><td>" + ui.item.title + "</td><td>" + ui.item.pages + "</td><td>" +  "</td></tr>")
                    var rowHTML = "<tr><td>" + ui.item.title + "</td><td>" + ui.item.pages + "</td><td>" +  "</td></tr>"
                                        
                                        
                    pageNumber.html(pageNumber.html() + rowHTML);

                    getpokemonImage();
                    fetch(apiUrl)
                    var numberOfPages = 0
                    
                    .then(function(response){
                        return response.json();

                    })
                    .then(function(data){
                        console.log(data[isbnKey].number_of_pages);
                        var total = document.createElement('h2'); // create a paragraph
                        
                        total.textContent = "number of page is " + data[isbnKey].number_of_pages;
                        // pageNumber.appendChild(total);
                        numberOfPages = data[isbnKey].number_of_pages
                        return numberOfPages
                    });

                        })
                        .then(function(data){
                            console.log(data);
                            
                        });

                    console.log(apiUrl)
                }
                                
                           
                getPageNumber();
                
                
                console.log(numberOfPages)
                
                // Add submit event to form
                
                
                
                
                // 
                  
                // get ISBN from url
                // function checkISBN(selectedURL){
                //       if(selectedURL.includes("ISBN")){
                          
                //         var isbnNum = document.createElement('h3');
                        

                //         isbnNum.textContent = "Inside checkISBN: " + selectedURL.substring(42,60);
                //         pageNumber.appendChild(isbnNum);
                //     }
                // };
                var bookText = ui.item.title + numberOfPages
                console.log(bookText)
                books.push(bookText);
                
                storeBooks();
                renderBooks();

                        isbnNum.textContent = "Inside checkISBN: " + selectedURL.substring(42,60);
                        //pageNumber.appendChild(isbnNum);
                    }
                };

                getPageNumber();
                // checkISBN(apiUrl);
                console.log(isbnKey);

            },
            minLength: 5 // set minimum length of text the user must enter

        });
    });
    
    function getpokemonImage() {
        
        fetch('https://pokeapi.co/api/v2/pokemon/ditto').then((response) => response.json()).then((data) => {
          console.log(data);
          var pokeimage = document.createElement('img')
        pokeimage.src = data.sprites.front_default
        console.log (data.sprites.front_default)
        document.querySelector("#pokemonImage").append(pokeimage)
        }).catch((err) => {
          console.log('pokemon not found', err);
        })
      }
    // var displayRepos = function (repos, searchTerm) {
        //     if (repos.length === 0) {
            //       repoContainerEl.textContent = 'No repositories found.';
            //       // Without a `return` statement, the rest of this function will continue to run and perhaps throw an error if `repos` is empty
            //       return;
            //     }
            
            //     repoSearchTerm.textContent = searchTerm;
            
//     for (var i = 0; i < repos.length; i++) {
    //       // The result will be `<github-username>/<github-repository-name>`
//       var bookName = repos[i].owner.login + '/' + repos[i].name;
  
//       var repoEl = document.createElement('div');
//       repoEl.classList = 'list-item flex-row justify-space-between align-center';



//$(document).ready(function () {  // only begin once page has loaded
    //$("#txtBookSearch").autocomplete({ // attach auto-complete functionality to textbox
        // define source of the data
        //source: function (request, response) {
            // url link to google books, including text entered by user (request.term)
            //var booksUrl = "https://www.googleapis.com/books/v1/volumes?printType=books&q=" + encodeURIComponent(request.term);
            //$.ajax({
                //url: booksUrl,
                //dataType: "jsonp",
                //success: function(data) {
                    //response($.map(data.items, function (item) {
                        //if (item.volumeInfo.authors && item.volumeInfo.title && item.volumeInfo.industryIdentifiers && item.volumeInfo.publishedDate)
                        //{
                            //return {
                                // label value will be shown in the suggestions
                                //label: item.volumeInfo.title + ', ' + item.volumeInfo.authors[0] + ', ' + item.volumeInfo.publishedDate,
                                // value is what gets put in the textbox once an item selected
                                //value: item.volumeInfo.title,
                                // other individual values to use later
                                //title: item.volumeInfo.title,
                                //isbn: item.volumeInfo.industryIdentifiers,
                                //author: item.volumeInfo.authors[0],
                               // //publishedDate: item.volumeInfo.publishedDate,
                                //image: (item.volumeInfo.imageLinks == null ? "" : item.volumeInfo.imageLinks.thumbnail),
                                //description: item.volumeInfo.description,
                            //};//
                        //}//
                    //}));//
                //}//
            //});//
        //},//
        //select: function (event, ui) {
            // what to do when an item is selected
            // first clear anything that may already be in the description
            //$('#divDescription').empty();
            // we get the currently selected item using ui.item
            // show a pic if we have one
            // if (item.image != '')
            // {
            //     $('#divDescription').append('<img src="' + ui.item.image + '" style="float: left; padding: 10px;">');
            // }
            // and title, author, and year
            //$('#divDescription').append('<p><b>Title:</b> ' + ui.item.title  + '</p>');
            //$('#divDescription').append('<p><b>Author:</b> ' + ui.item.author  + '</p>');
            //$('#divDescription').append('<p><b>First published year:</b> ' + ui.item.publishedDate  + '</p>');          
            // and the usual description of the book
            //$('#divDescription').append('<p><b>Description:</b> ' + ui.item.description  + '</p>');
            // and show the link to oclc (if we have an isbn number)
            //if (ui.item.isbn && ui.item.isbn[0].identifier)
            //{
                //$('#divDescription').append('<P><b>ISBN:</b> ' + ui.item.isbn[0].identifier + '</p>');
                //$('#divDescription').append('<a href="http://www.worldcat.org/isbn/' + ui.item.isbn[0].identifier + '" target="_blank">View item on worldcat</a>');
            //}
        //},
        //minLength: 5 // set minimum length of text the user must enter
    //});//
//});///

var apiUrl = "https://openlibrary.org/api/books?bibkeys=ISBN:9780980200447&jscmd=data&format=json";





//       var titleEl = document.createElement('span');
//       titleEl.textContent = repoName;

//       repoEl.appendChild(titleEl);

//       var statusEl = document.createElement('span');
//       statusEl.classList = 'flex-row align-center';

//       if (repos[i].open_issues_count > 0) {
    //         statusEl.innerHTML =
    //           "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
    //       } else {
        //         statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        //       }

    function renderBooks() {
        // Clear bookList element and update bookCountSpan
        bookList.innerHTML = "";
        bookCountSpan.textContent = books.length;
      
        // Render a new li for each book
        for (var i = 0; i < books.length; i++) {
          var book = books[i];
      
          var li = document.createElement("li");
          li.textContent = book;
          li.setAttribute("data-index", i);
      
          var button = document.createElement("button");
          button.textContent = "Delete ❌";
      
          li.appendChild(button);
          bookList.appendChild(li);
        }
      }
      // Calls init to retrieve data and render it to the page on load
      init()
    // Add click event to bookList element
    function init() {
        // Get stored books from localStorage
      var storedBooks = JSON.parse(localStorage.getItem("books"));
    
      // If books were retrieved from localStorage, update the books array to it
      if (storedBooks !== null) {
          books = storedBooks;
        }
 dev
        
        // This is a helper function that will render books to the DOM
        renderBooks();
    }
    
    function storeBooks() {
        // Stringify and set key in localStorage to books array
      localStorage.setItem("books", JSON.stringify(books));
    }
    bookList.addEventListener("click", function(event) {
        var element = event.target;
        
        // Checks if element is a button
        if (element.matches("button") === true) {
          // Get its data-index value and remove the book element from the list
          var index = element.parentElement.getAttribute("data-index");
          books.splice(index, 1);
          
          // Store updated books in localStorage, re-render the list
          storeBooks();
          renderBooks();
        }
    });

    // Create a function that will read the local storage and create entries into personal library.
    //   ================================================================================================================================================================================  // 
    
var apiUrl = "https://openlibrary.org/api/books?bibkeys=ISBN:9780980200447&jscmd=data&format=json";
// ======================================================================
// use later
// searchBtn.addEventListener(‘click’, getCity)
// =====================================================================

