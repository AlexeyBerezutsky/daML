var map, markerContainer = [], areaContainer = [], postData = {};


var mapController = (function ($) {
    var initAndBound = function () {
        postData = {
            searchRadius: 2000,

            cultureRate: 100,

            foodRate: 100,

            nightLifeRate: 100,

            segmentAmount: 3,

            segmentMax: 1000,

            segmentMin: 200
        };

        $(".search-radius").on('updateValues', function (customEvent) {
            postData.searchRadius = +this.valueMax;

            var found = _.find(areaContainer, function (area) {
                return area.areaType === 'searchArea';
            });

            if (!!found) {
                found.circle.setRadius(postData.searchRadius);
            }
        });

        $(".food-rate").on('updateValues', function (customEvent) {
            postData.foodRate = +this.valueMax;
        });

        $(".night-life-rate").on('updateValues', function (customEvent) {
            postData.nightLifeRate = +this.valueMax;
        });

        $(".culture-rate").on('updateValues', function (customEvent) {
            postData.cultureRate = +this.valueMax;
        });

        $(".search-radius")[0].setValues(null, postData.searchRadius);

        $(".culture-rate")[0].setValues(null, postData.cultureRate);

        $(".food-rate")[0].setValues(null, postData.foodRate);

        $(".night-life-rate")[0].setValues(null, postData.nightLifeRate);

        $('.segment-min').val(postData.segmentMin);

        $('.segment-max').val(postData.segmentMax);

        $('.segment-amount').val(postData.segmentAmount);
    };

    var loadData = function (map) {
        collectRequestData();

        var url = createUrl('http://localhost:8080');

        var jqxhr = fakeGet(url, function (data) {
            removeMarkers(markerContainer);

            removeAreas(areaContainer);

            areaContainer = extractAreas(data);

            markerContainer = extractMarkers(data);

            drawAreas(areaContainer, map);

            drawMarkers(markerContainer, map);

            setSearchRadius();
        })
    };

    var createUrl = function (base) {
        return base + '/' + $.param(postData);
    };

    var collectRequestData = function () {
        postData.segmentMin = $('.segment-min').val();

        postData.segmentMax = $('.segment-max').val();

        postData.segmentAmount = $('.segment-amount').val();
    };

    var setSearchRadius = function () {
        var found = _.find(areaContainer, function (area) {
            return area.areaType === 'searchArea';
        });

        if (!!found) {
            $(".search-radius")[0].setValues(null, found.rad);
        }
    };

    var extractAreas = function (data) {
        var areas = [];

        areas.push({
            latLng: {lat: +data.pinlat, lng: +data.pinlng},

            rad: +data.pinrad,

            areaType: 'searchArea'
        });

        _.forEach(data.segments, function (segment) {
            areas.push({
                latLng: segment.latLng,

                rating: segment.rating,

                rad: +segment.rad
            });
        });

        return areas;
    };

    var extractMarkers = function (data) {
        var markers = [];

        markers.push({
            latLng: {lat: +data.pinlat, lng: +data.pinlng},

            markerType: 'whereEmI'
        });

        _.forEach(data.segments, function (segment) {
            markers.push({
                latLng: segment.latLng,

                markerType: 'segment'
            });

            _.forEach(segment.places, function (place) {
                markers.push({
                    latLng: place.latLng,

                    name: place.name,

                    rating: place.rating
                });
            });
        });

        return markers;
    };

    var removeMarkers = function (markers) {
        _.forEach(markers, function (marker) {
            marker.pin.setMap(null);
        });

        _.remove(markers);
    };

    var removeAreas = function (areas) {
        _.forEach(areas, function (area) {
            area.circle.setMap(null);
        });

        _.remove(areas);
    };

    var drawMarkers = function (markers, map) {
        _.forEach(markers, function (marker) {
            var marker = new google.maps.Marker({
                position: marker.latLng,
                map: map,
                icon: getIcon(marker.markerType),
                title: marker.name || ''
            });

            marker.pin = marker;
        });
    };

    var drawAreas = function (areas, map) {
        _.forEach(areas, function (area) {
            var circle = new google.maps.Circle({
                strokeColor: getColor(area.areaType),
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: getColor(area.areaType),
                fillOpacity: 0.35,
                map: map,
                center: area.latLng,
                radius: area.rad
            });

            area.circle = circle;
        });
    };

    var getIcon = function (markerType) {
        switch (markerType) {
            case 'whereEmI':
                return 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|2F40FF';

            case 'segment':
                return 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FF0000';

            default:
                return 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FBFF3D';
        }
    };

    var getColor = function (areaType) {
        switch (areaType) {
            case 'searchArea':
                return '#9EFFB9';

            default:
                return '#FF0000';

        }
    };

    return {load:loadData, init: initAndBound};
})(jQuery);

var initMap = function () {
    map = new google.maps.Map($('#map')[0], {
        zoom: 13,

        center: {lat: 59.957570, lng: 30.307946}
    });

    mapController.init();

    mapController.load(map);
};

var fakeGet = function (url, response) {

    console.log(url);
    var json = '{ "pinlat": "59.957570", "pinlng": "30.307946", "pinrad": "4000", "segments": [ { "lat": 59.9397513701937, "lng": 30.33033963504616, "rad": 417.3191710256402, "icon": "http://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/Map-Marker-Marker-Outside-Azure-icon.png", "places": [ { "lat": 59.94348796819766, "lng": 30.330861279429218, "rad": 0.0, "icon": "resources/icons/vista.ball.light.red.32.png", "id": "4c247fecf1272d7f5e1983c5", "name": "Field of Mars (Марсово поле)", "placeType": "PLAZA", "phone": null, "address": "Марсово поле", "city": "Saint_Petersburg", "country": "Russia", "source": "Foursquare", "additionalInfo": "checkinsCoun=56218", "url": null, "rating": 127524.0, "point": [ 59.94348796819766, 30.330861279429218 ], "latLng": { "lat": 59.94348796819766, "lng": 30.330861279429218 } }, { "lat": 59.940027808329596, "lng": 30.332906648768653, "rad": 0.0, "icon": "resources/icons/vista.ball.green.32.png", "id": "4c162f2d82a3c9b666dbfff8", "name": "Mikhailovsky Garden (Михайловский сад)", "placeType": "PARK", "phone": null, "address": "Садовая ул.", "city": "Saint_Petersburg", "country": "Russia", "source": "Foursquare", "additionalInfo": "checkinsCoun=23401", "url": null, "rating": 35248.0, "point": [ 59.940027808329596, 30.332906648768653 ], "latLng": { "lat": 59.940027808329596, "lng": 30.332906648768653 } }, { "lat": 59.93871704466662, "lng": 30.332318544387817, "rad": 0.0, "icon": "resources/icons/vista.ball.bronze.32.png", "id": "4bbc64cd51b89c742155872a", "name": "The State Russian Museum (Русский музей)", "placeType": "MUSEUM", "phone": "+7 812 595-42-48", "address": "Инженерная ул., 4", "city": "Saint_Petersburg", "country": "Russia", "source": "Foursquare", "additionalInfo": "checkinsCoun=23105", "url": "http://www.rusmuseum.ru", "rating": 30909.0, "point": [ 59.93871704466662, 30.332318544387817 ], "latLng": { "lat": 59.93871704466662, "lng": 30.332318544387817 } }, { "lat": 59.93866111775865, "lng": 30.328853130340576, "rad": 0.0, "icon": "resources/icons/vista.ball.bronze.32.png", "id": "4dbd3e31fa8cee727361cfae", "name": "The Russian Museum (Benois Wing) (Русский музей (Корпус Бенуа))", "placeType": "MUSEUM", "phone": "+7 812 595-42-48", "address": "наб. Канала Грибоедова, 2", "city": "Saint_Petersburg", "country": "Russia", "source": "Foursquare", "additionalInfo": "checkinsCoun=13319", "url": "http://www.rusmuseum.ru/benois-wing/", "rating": 17736.0, "point": [ 59.93866111775865, 30.328853130340576 ], "latLng": { "lat": 59.93866111775865, "lng": 30.328853130340576 } }, { "lat": 59.94081730579484, "lng": 30.325173583774674, "rad": 0.0, "icon": "resources/icons/vista.ball.light.red.32.png", "id": "4db982a24df0ded98bd3742c", "name": "Конюшенная площадь", "placeType": "PLAZA", "phone": null, "address": "Конюшенная ул.", "city": "Saint_Petersburg", "country": "Russia", "source": "Foursquare", "additionalInfo": "checkinsCoun=6978", "url": null, "rating": 14759.0, "point": [ 59.94081730579484, 30.325173583774674 ], "latLng": { "lat": 59.94081730579484, "lng": 30.325173583774674 } }, { "lat": 59.936796976414804, "lng": 30.33192462357603, "rad": 0.0, "icon": "resources/icons/vista.ball.green.32.png", "id": "4c6ffeda344437045498225f", "name": "Arts Square (Площадь Искусств)", "placeType": "PARK", "phone": null, "address": "Инженерная ул.", "city": "Saint_Petersburg", "country": "Russia", "source": "Foursquare", "additionalInfo": "checkinsCoun=20600", "url": null, "rating": 42379.0, "point": [ 59.936796976414804, 30.33192462357603 ], "latLng": { "lat": 59.936796976414804, "lng": 30.33192462357603 } } ], "message": "Cluster rating=1229.0407546913643, radius=417.3191710256402", "rating": 1229.0407546913643, "point": [ 59.9397513701937, 30.33033963504616 ], "latLng": { "lat": 59.9397513701937, "lng": 30.33033963504616 } } ], "places": null }';
    response(JSON.parse(json));
};