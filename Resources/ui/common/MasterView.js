//Master View Component Constructor
function MasterView() {
	
	var inData;
	var tableData = [];
		
	var url = "http://localhost/services.json";
	var client = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			services = JSON.parse(this.responseText);
			//Ti.API.info("Received text: " + this.responseText);
			//Ti.API.info("Services: " + services[c].name);
			for (var c = 0; c < services.length; c++) 
			{	
                var row = Ti.UI.createTableViewRow({
                    title: services[c].name,
                    hasChild: true,
                    o: services[c]
                });
 
				tableData.push(row);
            }
            table.setData(tableData);
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.info(e.error);
			alert('error');
		},
		timeout : 5000	// in milliseconds
	});
	// Prepare the connection.
	client.open("GET", url);
	// Send the request.
	client.send(); 
	
	
	//create object instance, parasitic subclass of Observable
	var self = Ti.UI.createView({
		backgroundColor:'white'
	});
	
	//some dummy data for our table view
	// var tableData = [
		// {title:'The Table', day:'Saturday', location:'1250 University Drive', latitude: '37.784808', longitude: '-122.420808', hasChild:true, color: '#000'},
		// {title:'Traditions', day:'Sunday', location:'1250 University Drive', latitude: '37.784808', longitude: '-122.420808', hasChild:true, color: '#000'},
		// {title:'Classic', day:'Sunday', location:'1250 University Drive', latitude: '37.784808', longitude: '-122.420808', hasChild:true, color: '#000'},
		// {title:'Gray\'s Woods', day:'Sunday', location:'Gray\'s Woods Elementary School', latitude: '37.784808', longitude: '-122.420808', hasChild:true, color: '#000'},
		// {title:'Warriors Mark', day:'Sunday', location:'Camp Kanesetake', latitude: '37.784808', longitude: '-122.420808', hasChild:true, color: '#000'},
		// {title:'Midtown', day:'Sunday', location:'The State Theater', latitude: '37.784808', longitude: '-122.420808', hasChild:true, color: '#000'},
		// {title:'Encore', day:'Sunday', location:'1250 University Drive', latitude: '37.784808', longitude: '-122.420808', hasChild:true, color: '#000'}
	// ];
	
	var table = Ti.UI.createTableView({
		data:tableData
	});
	self.add(table);
// 	
	//add behavior
	table.addEventListener('click', function(e) {
		self.fireEvent('itemSelected', {
			name:e.rowData.title,
			dataObject:e.rowData.o,
		});
	});
	
	return self;
};

module.exports = MasterView;