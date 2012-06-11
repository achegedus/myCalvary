function MapView() {
	var self = Ti.UI.createView();
	
	var travelMapView = Titanium.Map.createView();
	var storedata;
	var points = [];
	var origin;
	var latitude;
	var longitude;
	
	var thislat;
	var thislon;
	
	// Information and settings to use Geolocation
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.distanceFilter = 10;
	Titanium.Geolocation.purpose = "Calculate Position";
	
	
	
	// var lbl = Ti.UI.createLabel({
		// text:'Please select an item',
		// height:'auto',
		// width:'auto',
		// color:'#000'
	// });
	// self.add(lbl);
	
	self.addEventListener('itemSelected', function(e) {
		//lbl.text = e.name+': $'+e.price;
		thislat = e.lat;
		thislon = e.lon;
	});
	
	//////////////////////////////////////////////////////////////////////////////
	///////Mark McClure's DecodeLine code This decodes the encoded polylines//////
	//////////////////////////////////////////////////////////////////////////////
	//																			//
	////////////////////////													//
	/////////To-Do//////////													//
	////////////////////////													//
	//																			//
	// example of encoded: ajr~Hkqz\oAlQoIrQ_DpGe@n@u@j@m@LqVgA 				//
	// these outputs should come inbetween a start_location and end_location	//
	// of a step (using xml output from google)									//
	//																			//
	//////////////////////////////////////////////////////////////////////////////
	function decodeLine (encoded) {
	// This decodes the lines
		var len = encoded.length;
		var index = 0;
		var array = [];
		var lat = 0;
		var lng = 0;

		while (index < len) 
		{
			var b;
			var shift = 0;
			var result = 0;
			do 
			{
				b = encoded.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);
	    
			var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
			lat += dlat;
			
			shift = 0;
			result = 0;
			do 
			{
				b = encoded.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);
	    
			var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
			lng += dlng;
			
			// Create new Vars for the created lats and lng
			var newLat = lat * 1e-5;
			var newLon = lng * 1e-5;
	
			// push them into the array at the end (thus adding it to the correct place)
			points.push({latitude: newLat, longitude: newLon});
		}
	}
	
	// Get users location, this executes right away and only once
	Titanium.Geolocation.getCurrentPosition(function(e) {
	    if (e.error)
	    {
	        alert('HFL cannot get your current location');
	        return;
	    }
	 
	    longitude = e.coords.longitude;
	    latitude = e.coords.latitude;
	    var altitude = e.coords.altitude;
	    var heading = e.coords.heading;
	    var accuracy = e.coords.accuracy;
	    var speed = e.coords.speed;
	    var timestamp = e.coords.timestamp;
	    var altitudeAccuracy = e.coords.altitudeAccuracy;
	   	
	   	alert("Long: "+longitude+" Lat: "+latitude);
	   	// set location and zoom level of the map
	   	travelMapView.setLocation({latitude: latitude, longitude: longitude, latitudeDelta: 0.01, longitudeDelta: 0.01});
	   	
	   	// Geocode the latitude and longitude to an adress
	   	Titanium.Geolocation.reverseGeocoder(latitude, longitude, function(evt) 
	   	{
			Ti.API.debug("reverse geolocation result = "+JSON.stringify(evt));
			var places = evt.places;
	 
			origin = places[0].address;
			Ti.API.debug("reverse geolocation result = "+JSON.stringify(evt));
			// Take the data with us to the next function (there the magic happens hehe
			loadLocations(origin);
	    });
	   	
	});
	
	
	function loadLocations(origin) 
	{ 
	    storedata = [];
	    var url2="http://localhost/Geocoded_adresses.xml";
	    xhr2 = Titanium.Network.createHTTPClient();
	    xhr2.open('GET',url2);
	    Ti.API.info('>>> go get data for Rgeocode! ...URL: '+url2);
	    xhr2.onload = function(){
	    	alert('in here');
	        // Now parse the XML 
	        var xml = this.responseXML;
	        // Find the stores in response
	        var itemList = xml.documentElement.getElementsByTagName("location");
	        
	        // Show about 40 stores (have to change this a bit but will come to that later
	        // idea: show the stores in a radius of 3 KM if possible
	        // my Store data holds about 560 stores so yeah...
	        for (var cc=0;cc < 5;cc++) 
	        {
				var resultName = itemList.item(cc).getElementsByTagName("street").item(0).text;
				var resultCity = itemList.item(cc).getElementsByTagName('city').item(0).text;
				var resultLat = itemList.item(cc).getElementsByTagName("lat").item(0).text;
				var resultLng = itemList.item(cc).getElementsByTagName("lon").item(0).text;
				var postId = itemList.item(cc).getElementsByTagName("id").item(0).text;
				
				// pin all the stores
				var mapit = Ti.Map.createAnnotation({
					latitude: resultLat,
					longitude: resultLng,
					myid: postId,
					animate: true,
					title: resultName,
					subtitle: resultCity,
					rightButton: Titanium.UI.iPhone.SystemButtonStyle.DONE,
					pincolor: Ti.Map.ANNOTATION_RED
				});
	
				travelMapView.addAnnotation(mapit);
			}
			
			travelMapView.addEventListener('click', function(e) 
			{
				alert('hi');
				// when you click the rightButton of a annotation lable
				// we create and show an option dialog with the buttons:
				// 'Directions' and 'Cancel'
				if(e.clicksource == 'rightButton') 
				{
					alert('hi2');
					var dialog = Titanium.UI.createOptionDialog({
	    				title: 'Wat wil je doen?',
	    				options: ['Routebeschrijving','Annuleer'],
	    				destructive:1
					});
					dialog.show();
					
					// grab the title of the annotation
					// which in this case is the street and city
					// of the store you clicked
					var title = e.title;
					Ti.API.info(title);
					
					dialog.addEventListener('click', function(e) {
						
						if(e.index == 0) {
							// When the directions button is pressed
							// we grab the origin (which is youre current pos)
							// and we grab the street and city from the pressed
							// store annotation, and start the functions
							loadGPSInformation(origin, latitude+','+longitude);
						} else if(e.index == 1) {
							// Close 
						} else {
							// do nothing
						}
					});
				}
			});
	    };
	    xhr2.send();
	}
	
	/*
	* For the brave souls who get this far: You are the chosen ones,
	* the valiant knights of programming who toil away, without rest,
	* fixing our most awful code. To you, true saviors, kings of men,
	* I say this: never gonna give you up, never gonna let you down,
	* never gonna run around and desert you. Never gonna make you cry,
	* never gonna say goodbye. Never gonna tell a lie and hurt you.
	*/
	
	
	// create 2 functions for later when a route is planned
	function addStartPin() 
	{
		var startPin = Ti.Map.createAnnotation({
			latitude: latitude,
			longitude: longitude,
			animate: true,
			title: 'Start Positie',
			pincolor: Ti.Map.ANNOTATION_GREEN
		});
		travelMapView.addAnnotation(startPin);
	};
	
	
	// Add a end annotation, this is gonna have a leftNavButton (or right)
	// that deletes the current route, deletes the annotations
	// and calls the functions again to remap the stores thus giving the
	// option to get a route to a different store
	function addEndPin(lats, lons) 
	{
		var endPin = Ti.Map.createAnnotation({
			latitude: lats,
			longitude: lons,
			animate: true,
			title: 'Eind Positie',
			pincolor: Ti.Map.ANNOTATION_RED
		});
		travelMapView.addAnnotation(endPin);
	};
	
	
	function loadGPSInformation(origin,destination)
	{ 
	    data = [];
	    var myLat;
	    var myLon;
	    // the url for the xml of the directions using the origin address and the destination address (the title of the annotation)
	    var url="http://maps.googleapis.com/maps/api/directions/xml?origin="+origin+"&destination="+destination+"&sensor=true";
	    xhr = Titanium.Network.createHTTPClient();
	    xhr.open('GET',url);
	    Ti.API.info('>>> go get data for Rgeocode! ...URL: '+url);
	    xhr.onload = function(){
	    	travelMapView.removeAllAnnotations();
	    	var xml = this.responseXML;
	        var itemList = xml.documentElement.getElementsByTagName("step");
	        
	        // forward geocode the destination address and get the lat and lng
	        Titanium.Geolocation.forwardGeocoder(destination, function(e) {
	        	myLat = e.latitude;
	        	myLon = e.longitude;
	        	Ti.API.info(myLat)
	        	Ti.API.info(myLon);
	        	// add the endPin (destination)
	        	addEndPin(myLat, myLon);	
	        });
	        
	        // Loop through the steps to get the Start_locations lat and lng values
	        // and push the data into an array, after that, the decoded line values
	        // get pushed at the end of this array in the decodeLine() function
	        // this allows for the array to be in correct order with all points
	        for (var cc=0;cc < itemList.length;cc++) {
	        	var lats = itemList.item(cc).getElementsByTagName("lat").item(0).text;
	       		var longs = itemList.item(cc).getElementsByTagName("lng").item(0).text;
	       		points.push({latitude: lats, longitude: longs});
	        	var xtraPoints = itemList.item(cc).getElementsByTagName("polyline").item(0).text;
	        	decodeLine(xtraPoints);
			}
			
			// fired right away the data for the start pin was already there
			// so we can add this right whenever the route is created
			addStartPin();
			
			// create and addthe route
			var route = {
				name: 'Directions',
				color: 'blue',
				points: points,
				width: 3
			};
			
			travelMapView.addRoute(route);
	    };
	    xhr.send();
	}
	
	self.add(travelMapView);

	return self;
};

module.exports = MapView;
