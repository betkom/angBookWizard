var app = angular.module('angBookWizardAPI',['ngSanitize']).config( function($sceProvider){
	$sceProvider.enabled(false);
});
app.controller('appController',['$scope','$http',function($scope, $http){
	var base = "https://www.googleapis.com/books/v1/volumes";
	config = {
		params: {
			maxResults: 40,
			orderBy: 'newest',
			callback: 'JSON_CALLBACK'
		}
	};
	//Checks if more than one author and adds a comma at the end of each if yes
		$scope.hasNext = function(array,i)
		{ if (array){
			var lastIndex = array.length-1;
			if(lastIndex === array.indexOf(i))
				return false;
			else return true;
		}
		else return false; 
			//return !((array.length-1)===array.indexOf(i));
		} 
		//Gets book info based on Id		
		$scope.ratings = [null,"img/star_small.png","img/2star.png","img/3star.png","img/4star.png","img/5star.png"];
		$scope.loadInfo = function(id){
			$scope.showPreview = true;
			$scope.showInfo = true;
			$scope.thisBook = "";	
			$http.jsonp(base + '/'+ id,config).success(function(response){
				$scope.thisBook = response;
			});
		}
		$scope.getRating = function(rating){
			rating = Math.floor(rating);
			return $scope.ratings[rating]; 
		}
		$scope.validate = function(){
			$scope.resultStatus = false;
		var srchField = $scope.bookName;		
		if(srchField){
				srchField = srchField.trim();
				if((srchField.length > 1)&&!/^\d/.test(srchField))
				{
					$scope.search(srchField);					
					 return;
				}
				else{
				$scope.resultStatus = true;
				$scope.resultStatus ="You made an invalid input";
				}
			}
			else{
				$scope.resultStatus = true;
				$scope.resultStatus = "You made an invalid input";
			}
		}
		$scope.search = function(q){
			config.params.q = q?q:$scope.bookName;
			$scope.noResult = false;
			$scope.loading = false;
			$scope.showResult = false;
			$scope.showInfo = false;
			$http.jsonp(base,config).success(function(response){
				if(response.totalItems < 1){
					$scope.noResult = true;
					$scope.loading = true;
					$scope.showResult= false;
					$scope.showInfo = false;
				}
				else{
				$scope.noResult = false;
				$scope.books = response.items;
				$scope.loading = true;
				$scope.showResult = true;
				}

			})
		// .fail(function(failure){
		// 	$('#bookResult').append("errormessage");
		// });
		}
	$scope.search("e");



}]);

// var stars_url = "";
// var message = ('<p id="message">'+ "Click on the book image to get more info"+ '</p>');
// var errormessage = '<p id="error1">' + "Hoops! There\'s been a network error" + "Pls try again later" +'</p>';
// BookWizard = {
// 	base: "https://www.googleapis.com/books/v1/volumes",
// 	base1:"https://www.googleapis.com/books/v1/volumes?q=e&orderBy=newest", 
// 	params:{q: "", maxResults: 40},
// 	searchBookField: null,
// 	searchButton: null,
// 	bookResult: null,
// 	resultStatus: null,

// 	init: function(){
// 		BookWizard.searchBookField = $('#searchBookField');
// 		BookWizard.searchButton = $('#searchButton');
// 		BookWizard.bookResult = $('#bookResult');
// 		BookWizard.resultStatus = $('#resultStatus');
// 		BookWizard.initEvent();
// 	},	
// 	initEvent: function(){
// 		$.getJSON(BookWizard.base1,function(response){
// 			BookWizard.loadBooks(response);
// 			$('.bookPreview').append(message);
// 		});
// 		BookWizard.searchButton.click(BookWizard.onSearch);
// 		$(document).on("click",".photo", function(){
// 			var elems = $(this).next().text();
// 			 // console.log(elems);
// 			BookWizard.getMore(elems);
// 		});
// 	},
// 	getMore: function (elems) {		     
//         $('.bookPreview').empty();
//         $('.bookPreview').append('<img class="state1" src="img/loading.gif"/>');
// 		$.getJSON(BookWizard.base + '/' + elems, function(response){
// 			BookWizard.loadMore(response);
// 		}).fail(function(failure){
// 			$('.bookPreview').append("errormessage");
// 		});
			
//       },
//       loadMore: function(response){
//       	if (response.totalItems < 1){
// 			$('.bookPreview').append('<h1>'+ "No Result Found" + '</h1>');
// 		}
//       		var title = response.volumeInfo.title;
// 			var author = response.volumeInfo.authors;
// 			var category = response.volumeInfo.categories;
// 			var image_url = response.volumeInfo.imageLinks.thumbnail;
// 			var publisher = response.volumeInfo.publisher;
// 			var pageCount = response.volumeInfo.pageCount;
// 			var ratings = parseInt(response.volumeInfo.averageRating);
// 			var ratingsCount = response.volumeInfo.ratingsCount;
// 			var description = response.volumeInfo.description;
// 			var preview = response.accessInfo.webReaderLink;
// 			console.log(preview);
// 			var datePublished = response.volumeInfo.publishedDate;
// 			$('.ratings').hide();

// 			if (typeof ratings === 'undefined'){
// 				var ratings = "Not Available";
// 			}
// 			else if(Math.floor(ratings) === 5){				
// 				stars_url = "img/5star.png";
// 			}
// 			else if(Math.floor(ratings) === 4){
// 				stars_url = "img/4star.png";
// 			}
// 			else if(Math.floor(ratings) === 3){
// 				stars_url = "img/3star.png";
// 			}
// 			else if (Math.floor(ratings) === 2){
// 				stars_url = "img/2star.png"; 
// 			}
// 			else if (Math.floor(ratings) === 1){
// 				stars_url = "img/star_small.png";
// 			}
// 			if (typeof ratingsCount === 'undefined'){
// 				var ratingsCount = "No";
// 			}
		
// 			var postDiv = '<div class="post1">' + '<div class="title1">' + title +'</div>'+'<div id="pics1">' +
// 			'<img class="photo1" src="' + image_url + '" alt="image"/>'+'</div>' +'<div id="info1">'+ '<div class="author1">' + author +'</div>'+ '<div class="datePublished">'+ datePublished +'</div>'+'<div class="category">' + category +'</div>' +'<div class="pageCount">'+ pageCount + " Pages " +'</div>'+'<div class="ratings">' + ratings +'</div>' +'<img class="stars" src="'+ stars_url + '" />'+ '<div class="ratingsCount">' + ratingsCount + " reviews" + '</div>'+'</div>' + '<div class="description">' + description + '</div>' + '<a href="' + preview + '">' + "Preview this Book >>" + '</a>'+ 
// 			'</div>';
// 				$('.bookPreview').append(postDiv);
// 				$('.ratings').hide();	
// 				$('.state1').hide();
			
//       },
// 	search: function(bookName){
// 		BookWizard.params.q = bookName;
// 		$('#bookResult').empty();
// 		$('#bookResult').append('<img class="state" src="img/loading.gif"/>');
// 		$.getJSON(BookWizard.base,BookWizard.params, function(response){
// 			BookWizard.loadBooks(response);
// 		}).fail(function(failure){
// 			$('#bookResult').append("errormessage");
// 		});
// 	},
// 	loadBooks: function(response){
// 		if (response.totalItems < 1){
// 			$('#bookResult').append('<div class="error">' + '<h1>'+ "No Result Found" + '</h1>' +'<img class="state2" src="img/ohno.gif"/>' + '</div>');
// 			$('.state').hide();
// 			BookWizard.searchBookField.prop("disabled", false);
// 			BookWizard.searchButton.attr("disabled", false);
// 		}

// 		$.each(response.items, function(){
// 			var title = this.volumeInfo.title;
// 			var author = this.volumeInfo.authors;
// 			var image_url = this.volumeInfo.imageLinks.thumbnail;
// 			var bookID = this.id;
// 			var postDiv = '<div class="post">' + 
// 			'<img class="photo" src="' + image_url + '" alt="image"/>' + '<div class = "bookId">' + bookID + '</div>'+'<div id="info">'+'<div class="title">' +"Title: " + title +'</div>'+ '<div class="author">' + "Author: " + author +'</div>' +'</div>' +
// 			'</div>';
// 			$('.state').hide();
// 			$('#bookResult').append(postDiv);
// 			BookWizard.searchBookField.prop("disabled", false);
// 			BookWizard.searchButton.attr("disabled", false);
// 		});
// 	}
	
// }
// $(document).ready(BookWizard.init);