function ApplicationWindow() {
	//declare module dependencies
	var MasterView = require('ui/common/MasterView'),
		DetailView = require('ui/common/DetailView'),
		MapView = require('ui/common/MapView');
		
	//create object instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#ffffff'
	});
		
	//construct UI
	var masterView = new MasterView();
		
	//create master view container
	var masterContainerWindow = Ti.UI.createWindow({
		title:'Calvary'
	});
	masterContainerWindow.add(masterView);
	
	//create iOS specific NavGroup UI
	var navGroup = Ti.UI.iPhone.createNavigationGroup({
		window:masterContainerWindow
	});
	self.add(navGroup);
	
	//add behavior for master view
	masterView.addEventListener('itemSelected', function(e) {
		detailView = new DetailView();
		
		//create detail view container
		var detailContainerWindow = Ti.UI.createWindow({
			title:e.name
		});
		detailContainerWindow.add(detailView);
		
		detailView.fireEvent('itemSelected',e);
		navGroup.open(detailContainerWindow);
		
		// Handle Map open
		detailView.addEventListener('showMap', function(e) {
			mapView = new MapView();
			
			var mapContainerWindow = Ti.UI.createWindow({
				title: 'Map'
			});
			mapContainerWindow.add(mapView);
			
			navGroup.open(mapContainerWindow);
		});
		
	});
	
	return self;
};

module.exports = ApplicationWindow;
