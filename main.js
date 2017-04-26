var drawMarkers = function(markers){
  var markerContainer = $(".marker-container");
  
  markerContainer.empty();
  
  _.forEach(markers, function(marker){
  
  markerContainer.append('<google-map-marker'+
  +' latitude="'+marker.lat+
  '" longitude="'+marker.long+
  '" title="'+marker.name+
  '" draggable="false"></google-map-marker>');   
  });
}