var args = arguments[0] || {};
var loading = Alloy.createController("loading");

function navToPurse(){
	Alloy.Globals.Navigator.open("purse");
}

function navToMerchant(){
	Alloy.Globals.Navigator.open("merchant");
}

function doLogout(){
	
	var user = require("user");
	user.logout(function(){
		Alloy.Globals.Navigator.navGroup.close();
		var index = Alloy.createController("index");
		var win = index.getView();
    	win.open();
	});
	$.win.close();
}

function refresh(){
	
}

function init(){
	console.log('init');
	$.win.add(loading.getView());
}

init();
console.log('after init');
Ti.App.addEventListener('home:refresh',refresh);

$.win.addEventListener("close", function(){
	Ti.App.removeEventListener('home:refresh',refresh);
	$.destroy();
});
