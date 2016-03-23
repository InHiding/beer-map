angular.module('BeerMap').controller('MapCtrl', MapController);

function MapController($scope) {
  var vm = this;

  vm.markers = [];
  vm.openNow = false;

  var initMap = function() {
    var mapOptions = { 
      zoom: 15,
      center: new google.maps.LatLng(-23.55000, -46.633333)
    };

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    vm.placesSrv = new google.maps.places.PlacesService($scope.map);
    vm.infoWindow = new google.maps.InfoWindow();
    
    $scope.map.addListener('center_changed', searchPlaces);
    $scope.map.addListener('click', setMapCenter);
  };

  var markerInfo = function(place, marker) {
      google.maps.event.addListener(marker, 'click', function(){
        vm.placesSrv.getDetails(place, function(result, status) {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            console.error(status);
            return;
          }

          var content = 
            '<h2>' + result.name + '</h2>' +
            '<div class="infoWindowContent">' +
            '<img src="' + result.icon + '"/>' +
            '<p>' + result.vicinity + '</p>' +
            '<p><strong>Rating: ' + result.rating + '</strong></p>' +
            '</div>';

          vm.infoWindow.setContent(content);
          vm.infoWindow.open($scope.map, marker);
        });
      }); 
  };

  var createMarker = function (place){
    var marker = new google.maps.Marker({
      map: $scope.map,
      position: place.geometry.location,
      title: place.name
    });

    markerInfo(place, marker);
    vm.markers.push(marker);
  }; 

  var createMarkers = function(list) {
    if(!list) {
      return;
    }

    for (var i = 0; i < list.length; i++) {
      createMarker(list[i]);
    }
  };

  var clearMarkers = function() {
    vm.markers.forEach(function(marker){
      marker.setMap(null);
    });
    vm.markers.length = 0;
  };

  var searchPlaces = function() {
    var request = {
      location: $scope.map.getCenter(),
      radius: '2000',
      openNow: vm.openNow,
      types: ['bar']
    };

    clearMarkers();

    vm.placesSrv.nearbySearch(
      request, 
      function(results, status, pagination){
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          createMarkers(results);

          while(pagination.hasNextPage) {
            results = pagination.nextPage();
            if(!results) { // protect against infinite loop if gmaps api let us down :P
              break;
            }
            createMarkers(results);
          }
        }
      });
  };

  var getGeolocation = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var pos = {
            latLng: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
          };

          setMapCenter(pos);
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
      // Browser doesn't support Geolocation
      error = browserHasGeolocation ? 'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.';
        console.log(error);
    }
  };

  var setMapCenter = function(position) {
    $scope.map.setCenter(position.latLng);
  };

  initMap();
  getGeolocation();
}
