(function () {
    var map = $('google-map');

    map.latitude = 59.957570;

    map.longitude = 30.307946;

    map.addEventListener('google-map-ready', function (e) {
        loadData();
    });

    var loadData = function(){
        var jqxhr = $.get( "INITURL", function(data) {
            var markers = extractMarkers();

            drawMarkers(markers);

            var regions = extractRegions();

            drawRegions(regions);
        })
            .fail(function() {
                console.log(error);
            });
    };

    var drawMarkers = function (markers) {
        var markerContainer = $(".marker-container");

        markerContainer.empty();

        _.forEach(markers, function (marker) {
            markerContainer.append('<google-map-marker' +
                +' latitude="' + marker.lat +
                '" longitude="' + marker.long +
                '" title="' + marker.name +
                '" draggable="false"></google-map-marker>');
        });
    };

    var regionCircles = [];

    var drawRegions = function (regions) {
        _.forEach(regionCircles, function(regionCircle){
            regionCircle.setMap(null);
        });

        var regionsContainer = $(".regions-container");

        regionsContainer.empty();

        _.forEach(regions, function (region) {
            regionsContainer.append('<google-map-marker' +
                +' latitude="' + region.lat +
                '" longitude="' + region.long +
                '" draggable="false"></google-map-marker>');

            var cityCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map,
                center: region.center,
                radius: region.redius
            });
        });

    };
})();

