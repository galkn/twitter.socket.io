$(function() {
	
	var socket = io.connect('http://localhost');
	
	window.wordsDict = {};
	window.datat = [];
	socket.on('tweet', function (data) {
		var words = data.text.split(" ");
		for(var i in words) {
			if(words[i] in window.wordsDict) {
				window.wordsDict[words[i]] += 1;
			} else {
				window.wordsDict[words[i]] = 1;
			}
		}
		
		if(data.geo != null) {
			var myLatlng = new google.maps.LatLng(data.geo.coordinates[0],data.geo.coordinates[1]);
			var marker = new google.maps.Marker({
			    position: myLatlng,
			    map: window.map,
			    title:"Hello World!"
			});
		}
		
		if(data.place != null) {
			console.log("hi");
		}
	});
	
	function mostPopularWords() {
		var sortable = [];
		for (var i in window.wordsDict)
		      sortable.push([i, window.wordsDict[i]]);
		sortable.sort(function(a, b) {return a[1] - b[1]});
		return sortable;
	}
	window.mostPopularWords = mostPopularWords;
	
	function initialize() {
	  	var styles = [
		  {
		    "stylers": [
		      { "gamma": 0.56 },
		      { "lightness": 1 },
		      { "saturation": 25 },
		      { "visibility": "on" }
		    ]
		  }
		];
      var mapOptions = {
        center: new google.maps.LatLng(25, 0),
        zoom: 2,
		panControl: false,
		  zoomControl: false,
		  mapTypeControl: false,
		  scaleControl: false,
		  streetViewControl: false,
		  overviewMapControl: false
      };
	var styledMap = new google.maps.StyledMapType(styles,
	    {name: "Styled Map"});
      var map = new google.maps.Map(document.getElementById("map-canvas"),
          mapOptions);
		map.mapTypes.set('map_style', styledMap);
		  map.setMapTypeId('map_style');
		window.map = map;
    }
    google.maps.event.addDomListener(window, 'load', initialize);

});