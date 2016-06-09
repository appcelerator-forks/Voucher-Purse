var args = arguments[0] || {};
var loading = Alloy.createController("loading");

/**
 * Navigate to Conversation by u_id
 */
function navToFriendItem(e){
	var f_id = parent({name: "f_id"}, e.source);
	Alloy.Globals.Navigator.open("friends_items", {f_id: f_id});
}

/*
 	render friends list
 * */
function render_friends_list(){
	return;
}

function cardMovement(e){
	console.log(e.x+" "+e.y);
	$.logo.setLeft(e.x);
	$.logo.setTop(e.y);
}

function socket_connect(){
	Ti.App.fireEvent("web:setRoom", {room_id: 1});
}

/*
 	Refresh
 * */
function refresh(){
	
}

/**
 * Closes the Window
 */
function closeWindow(){
	$.win.close();
}

function init(){
	socket_connect();
	$.win.add(loading.getView());
	refresh();
}

init();
Ti.App.addEventListener('app:fromWebView', function(e) {
    console.log("message from america "+e.message);
});
Ti.App.addEventListener('purse:refresh',refresh);
Ti.App.addEventListener('app:cardMovement', cardMovement);
$.win.addEventListener("close", function(){
	Ti.App.removeEventListener('purse:refresh',refresh);
	$.destroy();
	console.log("window close");
});
