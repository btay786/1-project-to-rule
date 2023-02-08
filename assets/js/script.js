var pageNumber = document.getElementById('page-number');
// totalNumberOfPages will be a concatonation of the book collection
var totalNumberOfPages = ['']
// can be changed later to diffent speeds
var readingSpeed = 30
var readingDays = totalNumberOfPages/readingSpeed 
// book selection in search
var selectedBook = $('#txtBookSearch');




// https://openlibrary.org/api/books?bibkeys={ISBN:9780980200447}&jscmd=data&format=json
// Must be "ISBN:00000000000000"

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
                    response($.map(data.items, function (item) {
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
                            };
                        }
                    }));
                }
            });
        },
        select: function (event, ui) {
            // what to do when an item is selected
            // first clear anything that may already be in the description
            $('#divDescription').empty();
            // we get the currently selected item using ui.item
            // show a pic if we have one
            // if (item.image != '')
            // {
                //     $('#divDescription').append('<img src="' + ui.item.image + '" style="float: left; padding: 10px;">');
                // }
                // and title, author, and year
                $('#divDescription').append('<p><b>Title:</b> ' + ui.item.title  + '</p>');
                $('#divDescription').append('<p><b>Author:</b> ' + ui.item.author  + '</p>');
                $('#divDescription').append('<p><b>First published year:</b> ' + ui.item.publishedDate  + '</p>');          
                // and the usual description of the book
                $('#divDescription').append('<p><b>Description:</b> ' + ui.item.description  + '</p>');
                // and show the link to oclc (if we have an isbn number)
                if (ui.item.isbn && ui.item.isbn[0].identifier)
                {
                    $('#divDescription').append('<P><b>ISBN:</b> ' + ui.item.isbn[0].identifier + '</p>');
                    $('#divDescription').append('<a href="http://www.worldcat.org/isbn/' + ui.item.isbn[0].identifier + '" target="_blank">View item on worldcat</a>');
                }
                var isbnKey = "ISBN:"+ String(ui.item.isbn[0].identifier);
                var getPageNumber = function(){
                    var apiUrl = "https://openlibrary.org/api/books?bibkeys="+isbnKey+"&jscmd=data&format=json";
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
                getPageNumber();
                checkISBN(apiUrl);
                console.log(isbnKey);
            },
            minLength: 5 // set minimum length of text the user must enter
        });
    });
    
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
        
        //       repoEl.appendChild(statusEl);
        
        //       repoContainerEl.appendChild(repoEl);
//     }
//   };
var apiUrl = "https://openlibrary.org/api/books?bibkeys=ISBN:9780980200447&jscmd=data&format=json";
// ======================================================================
// use later
// searchBtn.addEventListener(‘click’, getCity)
// =====================================================================