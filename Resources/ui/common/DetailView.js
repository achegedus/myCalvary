function DetailView() {
	var self = Ti.UI.createView();
	
	var thisLat;
	var thisLon;
	var thisTitle;
	var thisLocation;
	var thisDay;
	var details;
	
	var lbl = Ti.UI.createLabel({
		text:'Please select an item',
		height:'auto',
		width:'auto',
		color:'#000'
	});
	// self.add(lbl);
	
	var showMap = Ti.UI.createButton({
		title: 'Get me there',
		height: 40,
		width: 100, 
		bottom: 20
	});
	// self.add(showMap);
	
	self.addEventListener('itemSelected', function(e) {
		thisLat = e.dataObject.lat;
		thisLon = e.dataObject.lon;
		thisTitle = e.dataObject.name;
		thisLocation = e.dataObject.location;
		thisDay = e.dataObject.day;
		details = e.dataObject;
		
		var sectionService = Ti.UI.createTableViewSection({ headerTitle: 'Services' });
		var row1 = Ti.UI.createTableViewRow({ title: details.day + " " + details.time });
		sectionService.add(row1);
		
		var sectionDesc = Ti.UI.createTableViewSection({ headerTitle: 'Description' });
		var row2 = Ti.UI.createTableViewRow({ title: details.description });
		sectionDesc.add(row2);
		
		var sectionAddress = Ti.UI.createTableViewSection({ headerTitle: 'Address' });
		var row3 = Ti.UI.createTableViewRow({ title: details.location });
		sectionAddress.add(row3);
		var row4 = Ti.UI.createTableViewRow({ title: details.address });
		sectionAddress.add(row4);
		
		var sectionNews = Ti.UI.createTableViewSection({ headerTitle: 'News' });
		
		var sectionPastor = Ti.UI.createTableViewSection({ headerTitle: 'Pastor' });
		// var row1 = Ti.UI.createTableViewRow({ title: 'Apples' });
		// var row2 = Ti.UI.createTableViewRow({ title: 'Bananas' });
		// sectionFruit.add(row1);
		// sectionFruit.add(row2);
		
		table.setData([sectionService, sectionDesc, sectionAddress, sectionNews, sectionPastor]);
	});
	
	showMap.addEventListener('click', function(e) {
		self.fireEvent('showMap', {
			name:thisTitle,
			location:thisLocation,
			day:thisDay,
			lat:thisLat,
			lon:thisLon
		});
	});
	
	

	
	var table = Ti.UI.createTableView({
		style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	});
	self.add(table);

	return self;
};

module.exports = DetailView;
