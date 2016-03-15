angular.module('BeerMap').controller('MapCtrl', MapController);

function MapController($scope) {
  var mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng(-23.5575628, -46.6753629)
  };

  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  $scope.infoWindow = new google.maps.InfoWindow();

  $scope.createMarker = function (info){
    var marker = new google.maps.Marker({
      map: $scope.map,
      position: info.geometry.location,
      title: info.name
    });

    marker.content = '<div class="infoWindowContent">' +
      '<img src="' + info.icon + '"/>' + 
      '<h3>' + info.vicinity + '</h3>' +
      '<h5>Rating:' + info.rating + '</h5>' +
      '</div>';

    google.maps.event.addListener(marker, 'click', function(){
        $scope.infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
        $scope.infoWindow.open($scope.map, marker);
    });

    //$scope.markers.push(marker);
  }; 

  $scope.openInfoWindow = function(e, selectedMarker){
    e.preventDefault();
    google.maps.event.trigger(selectedMarker, 'click');
  };

  var request = {
    location: mapOptions.center,
    radius: '2000',
    openNow: true,
    types: ['bar']
  };

  service = new google.maps.places.PlacesService($scope.map);
  service.nearbySearch(request, function(results, status){
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        $scope.createMarker(results[i]);
      }
    }
  });

}
