// https://angulartutorial.blogspot.com/2014/03/rating-stars-in-angular-js-using.html

angular.module("angular-star-rating-new", [])
/*
.directive("starRating", function() {
  return {
    restrict : "EA",
    template : "<ul class='rating' ng-class='{readonly: readonly}'>" +
               "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
               "    <i class='fa fa-star'></i>" + //&#9733
               "  </li>" +
               "</ul>",
    scope : {
      ratingValue : "=ngModel",
      max : "=?", //optional: default is 5
      onRatingSelected : "&?",
      readonly: "=?"
    },
    link : function(scope, elem, attrs) {
      if (scope.max == undefined) { scope.max = 5; }
      function updateStars() {
        scope.stars = [];
        for (var i = 0; i < scope.max; i++) {
          scope.stars.push({
            filled : (i < scope.ratingValue.rating)
          });
        }
      };
      scope.toggle = function(index) {
        if (scope.readonly == undefined || scope.readonly == false){
          scope.ratingValue.rating = index + 1;
          scope.onRatingSelected({
            rating: index + 1
          });
        }
      };
      scope.$watch("ratingValue.rating", function(oldVal, newVal) {
        if (newVal) { updateStars(); }
      });
    }
  };
})*/
.directive("averageStarRating", function() {
  return {
    restrict : "EA",
    template : "<div class='average-rating-container'>" +
               "  <ul class='rating background' class='readonly'>" +
               "    <li ng-repeat='star in stars' class='star'>" +
               "      <i class='fa fa-star'></i>" + //&#9733
               "    </li>" +
               "  </ul>" +
               "  <ul class='rating foreground' class='readonly' style='width:{{filledInStarsContainerWidth}}%'>" +
               "    <li ng-repeat='star in stars' class='star filled'>" +
               "      <i class='fa fa-star'></i>" + //&#9733
               "    </li>" +
               "  </ul>" +
               "</div>",
    scope : {
      averageRatingValue : "=ngModel",
      max : "=?", //optional: default is 5
    },
    link : function(scope, elem, attrs) {
      if (scope.max == undefined) { scope.max = 5; }
      function updateStars() {
        scope.stars = [];
        for (var i = 0; i < scope.max; i++) {
          scope.stars.push({});
        }
        var starContainerMaxWidth = 100; //%
        scope.filledInStarsContainerWidth = scope.averageRatingValue / scope.max * starContainerMaxWidth;
      };
      scope.$watch("averageRatingValue", function(newVal,oldVal) {
        if (newVal) { updateStars(); }
      });
    }
  };
});
