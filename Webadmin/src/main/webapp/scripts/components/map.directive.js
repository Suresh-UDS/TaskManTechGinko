'use strict';

angular.module('timeSheetApp')
    .directive('mapCoords', function() {
        var directive = {};

        directive.restrict = 'E'; /* restrict this directive to elements */
        
        directive.scope = {
                lat : "&lat",
                lng : "&lng"
        }

        directive.template = "<div id=\"map_canvas\">\n" + 
        		"									<ui-gmap-google-map center=\"map.center\" zoom=\"map.zoom\" draggable=\"true\" options=\"options\"> \n" + 
        		"										<ui-gmap-search-box\n" + 
        		"										template=\"searchbox.template\" events=\"searchbox.events\">\n" + 
        		"									<ui-gmap-marker coords=\"marker.coords\" options=\"marker.options\"\n" + 
        		"										events=\"marker.events\" idkey=\"1\"> </ui-gmap-marker> </ui-gmap-search-box> </ui-gmap-google-map>\n" + 
        		"								</div>";

        
        directive.controller = function( $scope, $element, $attrs, $transclude ) {
        	var vm =$scope;
        	
        	vm.map = { center: { latitude: $scope.lat, longitude: $scope.lng }, zoom: 13 };
            
            vm.marker = {
            	      id: 0,
            	      coords: vm.map.center,
            	      options: { draggable: true },
            	      events: {
            	        dragend: function (marker, eventName, args) {
            	        	console.log(lat,lng)
            	          var lat = marker.getPosition().lat();
            	          var lng = marker.getPosition().lng();
            	          $scope.lat  = lat;
            	          $scope.lng = lng;
            	          
            	        }
            	      }
           };
            
            
        	vm.searchbox= { 
                    template:'scripts/app/admin/project/search-box.html', 
                    events:{
                      places_changed: function (searchBox) {
                    	  var pos = searchBox.getPlaces()[0].geometry.location
                    	  vm.map.center= { 
                    		  latitude: searchBox.getPlaces()[0].geometry.location.lat(), 
                    		  longitude: searchBox.getPlaces()[0].geometry.location.lng() } 
                    	  vm.map.zoom= 15 
                    	  vm.marker.coords= vm.map.center 

                      }
                    }
                }
        }
        directive.compile = function(element, attributes) {
            
        	var linkFunction = function($scope, element, atttributes) {
        		var unwatch =  $scope.$watch(atttributes.lat, function(v) {
                      $scope.map = { center: { latitude: $scope.$parent.project.addressLat, longitude: $scope.$parent.project.addressLng }, zoom: 13 };
                 });

            	
            }

            return linkFunction;
        }

        return directive;
    });
        