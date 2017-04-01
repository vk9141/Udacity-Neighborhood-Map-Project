var locations = [
	{
		title: 'Oak Park Conservatory',
		location: {lat: 41.8714332580566, lng: -87.7896881103516}
	},
	{
		title: 'CTA - Oak Park',
		location: {lat: 41.872, lng: -87.791726}
	},
	{
		title: 'Hole in the Wall Frozen Custard',
		location: {lat: 41.8719406, lng: -87.7943192}
	},
	{
		title: 'Rehm Park and Pool',
		location: {lat: 41.871162, lng: -87.788459}
	},
	{
		title: 'West Suburban Montessori School',
		location: {lat: 41.8691444396973, lng: -87.7893447875977}
	},
];

var ViewModel = function() {
    var self = this;    
	self.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.871634, lng: -87.791726},
        zoom: 16
        });
	self.largeInfowindow = new google.maps.InfoWindow();
    self.filterTerm = ko.observable("");

    // Setup markers and infowindows

    for (var i = 0; i < locations.length; i++) {
        locations[i].marker = new google.maps.Marker({
            map: self.map,
            position: locations[i].location,
            title: locations[i].title,
        });
        locations[i].marker.addListener('click', function() {
            self.populateInfoWindow(this);
        });
    }

    // Filter markers based on text input and only show the filtered markers

    self.filterLocations = ko.computed(function() {
        for (var i = 0; i < locations.length; i++) {
            locations[i].marker.setMap(null);
        }

        var filteredLocations = [];
        filteredLocations =  $.grep(locations, function(a) {
            var filter = a.title.toLowerCase().indexOf(self.filterTerm().toLowerCase());
            return (filter > -1);
        });

        for (var i = 0; i < filteredLocations.length; i++) {
            filteredLocations[i].marker.setMap(self.map);
        }

        return filteredLocations;
    });


    clicked = function(clickedLocation) {
        self.populateInfoWindow(clickedLocation.marker)
    }

    self.populateInfoWindow = function(marker) {
        if (self.largeInfowindow.marker != marker) {
            self.largeInfowindow.marker = marker;
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){marker.setAnimation(null);}, 1000);

            var contentString = "<div id='yelpWindow'><h5>Loading Yelp data</h5></div>" 
            self.largeInfowindow.setContent(contentString);

            yelp(marker.title, function(data){
                var contentString = "<div id='yelpWindow'>" +
                                    "<h5>" +  "<a href='" + data.mobile_url + "' target='_blank'>" +data.name + "</a>" + "</h5>" +
                                    "<img src='" + data.image_url + "'>" +
                                    "<p>" + data.snippet_text + "</p>" +
                                    "</div>";
                self.largeInfowindow.setContent(contentString);
            });
            self.largeInfowindow.open(map, marker);
            self.largeInfowindow.addListener('closeclick',function(){
                self.largeInfowindow.setMarker = null;
            });
        }
    }
}

function initiate() {
    var setup = new ViewModel(locations);
    ko.applyBindings(setup);
}

function errorHandler() {
    alert("Google Maps is unable to load. Please check your internet connection and retry.");
}