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
                var isbnKey = "ISBN:"+ String(ui.item.isbn[0].identifier);
                var getPageNumber = function(){
                    var apiUrl = "https://openlibrary.org/api/books?bibkeys="+isbnKey+"&jscmd=data&format=json";
                    var pageNumber = $('#page-number');
                    console.log ("<tr><td>" + ui.item.title + "</td><td>" + ui.item.pages + "</td><td>" +  "</td></tr>")
                    var rowHTML = "<tr><td>" + ui.item.title + "</td><td>" + ui.item.pages + "</td><td>" +  "</td></tr>"
                    pageNumber.html(pageNumber.html() + rowHTML);
                    fetch(apiUrl)
                    .then(function(response){
                        return response.json();
                        })
                        .then(function(data){
                            console.log(data);
                        });
                    console.log(apiUrl)
                }
                getPageNumber();
                getpokemonImage();
            },
            minLength: 5 // set minimum length of text the user must enter
        });
    });
    function getpokemonImage() {
        var pokeDex = String(Math.floor(Math.random() * 808))
        fetch('https://pokeapi.co/api/v2/pokemon/'+pokeDex+'/').then((response) => response.json()).then((data) => {
            console.log(data);
            var pokeimage = document.createElement('img');
            pokeimage.src = data.sprites.front_default;
            console.log (data.sprites.front_default);
            document.querySelector("#pokemonImage").append(pokeimage);
            // document.querySelector("#page-number").append(pokeimage)
        }).catch((err) => {
            console.log('pokemon not found', err);
        })};