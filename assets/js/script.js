var isbnKey = "ISBN:9780980200447";
var totalNumberOfPages = 0;
var readingSpeed = 30; // 30 pages per hours
var readingDays = (totalNumberOfPages / readingSpeed);
var books = [];
var bookList = document.querySelector("#book-list");
// totalNumberOfPages will be a concatonation of the book collection
var totalNumberOfPages = ['']
// can be changed later to diffent speeds
var readingSpeed = 30
var readingDays = totalNumberOfPages / readingSpeed
// book selection in search
var selectedBook = $('#txtBookSearch');

$(document).ready(function () {  // only begin once page has loaded
    $("#submitButton").click(function(){
        var pagesLeft= books[books.length -1].bPage; 
        pagesLeft= pagesLeft-$("#pagesRead").val();
        console.log (pagesLeft);
    })
    $("#txtBookSearch").autocomplete({ // attach auto-complete functionality to textbox
        // define source of the data
        source: function (request, response) {
            // url link to google books, including text entered by user (request.term)
            var booksUrl = "https://www.googleapis.com/books/v1/volumes?printType=books&q=" + encodeURIComponent(request.term);
            $.ajax({
                url: booksUrl,
                dataType: "jsonp",
                success: function (data) {
                    console.log(data)
                    response($.map(data.items, function (item) {
                        if (item.volumeInfo.title && item.volumeInfo.pageCount) {
                            //var pageNumber = $('#page-number');
                            totalNumberOfPages = item.volumeInfo.pageCount;
                            //var rowHTML = "<tr><td>" + item.volumeInfo.title + "</td><td>" + item.volumeInfo.pageCount + "</td><td>" + "</td></tr>";
                            //pageNumber.html(pageNumber.html() + rowHTML);
                        }
                        if (item.volumeInfo.authors && item.volumeInfo.title && item.volumeInfo.industryIdentifiers && item.volumeInfo.publishedDate) {
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
                                pages: item.volumeInfo.pageCount,
                            };
                        }
                    }));
                }
            });
        },
        select: function (event, ui) {
            $('#divDescription').empty();
            // show a pic if we have one
            $('#divDescription').append('<p><b>Title:</b> ' + ui.item.title + '</p>');
            $('#divDescription').append('<p><b>Author:</b> ' + ui.item.author + '</p>');
            $('#divDescription').append('<p><b>First published year:</b> ' + ui.item.publishedDate + '</p>');
            $('#divDescription').append('<p><b>Description:</b> ' + ui.item.description + '</p>');
            if (ui.item.isbn && ui.item.isbn[0].identifier) {
                $('#divDescription').append('<P><b>ISBN:</b> ' + ui.item.isbn[0].identifier + '</p>');
                $('#divDescription').append('<a href="http://www.worldcat.org/isbn/' + ui.item.isbn[0].identifier + '" target="_blank">View item on worldcat</a>');
            }
            var isbnKey = "ISBN:" + String(ui.item.isbn[0].identifier);

            var pokeDex = String(Math.floor(Math.random() * 808))
            fetch('https://pokeapi.co/api/v2/pokemon/' + pokeDex + '/').then((response) => response.json()).then((data) => {
                console.log(data);
                var pokeimage = document.createElement('img');
                pokeimage.src = data.sprites.front_default;
                console.log(data.sprites.front_default);
                //document.querySelector("#pokemonImage").append(pokeimage);
                // document.querySelector("#page-number").append(pokeimage)
            }).catch((err) => {
                console.log('pokemon not found', err);
            });

            console.log(pokeDex);
            var pokeFinder = " <img src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/ultra-sun-ultra-moon/" + pokeDex + ".png>";
            var getPageNumber = function () {
                var apiUrl = "https://openlibrary.org/api/books?bibkeys=" + isbnKey + "&jscmd=data&format=json";
                var pageNumber = $('#page-number');
                console.log("<tr><td>" + ui.item.title + "</td><td>" + ui.item.pages + "</td><td>" + "</td></tr>")
                var rowHTML = "<tr><td>" + ui.item.title + "</td><td>" + ui.item.pages + "</td><td>" + pokeFinder + "</td></tr>"
                pageNumber.html(pageNumber.html() + rowHTML);
                fetch(apiUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        console.log(data);
                    });
                console.log(apiUrl)
            }
            getPageNumber();
            var bookText = {
                btitle: ui.item.title,
                bPage: ui.item.pages,
                bPokemon: pokeFinder,
            };
            console.log(bookText);
            console.log(books);
            books.push(bookText);
            storeBooks();
            renderBooks();
        },
        minLength: 5 // set minimum length of text the user must enter
    });
});

function renderBooks() {
    $("#page-number").empty();
    for (var i = 0; i < books.length; i++) {
        var book = books[i].btitle;
        var pageHistory = books[i].bPage;
        var li = document.createElement("page-number");
        //li.setAttribute("data-index, i");
        
        $("#page-number").append("<tr><td>" + book + "</td><td>" + pageHistory + "</td><td>"+books[i].bPokemon+"</td></tr>");
    }
}

init()
// Add click event to bookList element
function init() {
    // Get stored books from localStorage
    var storedBooks = JSON.parse(localStorage.getItem("books"));
        // If books were retrieved from localStorage, update the books array to it
    if (storedBooks !== null) {
        books = storedBooks;
    }
    renderBooks();
}

function storeBooks() {
    // Stringify and set key in localStorage to books array
    localStorage.setItem("books", JSON.stringify(books));
}

bookList.addEventListener("click", function (event) {
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