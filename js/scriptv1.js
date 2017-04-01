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

    for (var i = 0; i < locations.length; i++) {
        locations[i].marker = new google.maps.Marker({
            map: map,
            position: locations[i].location,
            title: locations[i].title,
        });
        locations[i].marker.addListener('click', function() {
            populateInfoWindow(this, self.largeInfowindow);
        });
    }

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
            filteredLocations[i].marker.setMap(map);
        }


        return filteredLocations;
    });

    this.filteredLocations = ko.observableArray();

    ko.applyBindings(filteredLocations);
}

function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){marker.setAnimation(null);}, 2800);

    yelp(marker.title, function(data){
        var contentString = "<div id='yelpWindow'>" +
                            "<h5>" +  "<a href='" + data.mobile_url + "' target='_blank'>" +data.name + "</a>" + "</h5>" +
                            "<img src='" + data.image_url + "'>" +
                            "<p>" + data.snippet_text + "</p>" +
                            "</div>";
        infowindow.setContent(contentString);
    });
    infowindow.open(map, marker);
    infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
    });
    }
}