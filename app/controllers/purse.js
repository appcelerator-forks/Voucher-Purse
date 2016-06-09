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

function socket_connect(){
	Ti.App.fireEvent("web:setRoom", {room_id: 1});
}

function cardMovement(e){
	console.log("what you want to say "+e.message);
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

var lastPosition = {
    set: function(point) {
        this.x = $.logo.rect.x;
        this.y = $.logo.rect.y;
    }
};

$.game.addEventListener("touchstart", function(e){
	lastPosition.set();
	e.source.currentpoint = {x: e.x, y:e.y};
	e.source.diffX = e.x ;
	e.source.diffY = e.y ;
});

$.game.addEventListener("touchmove", function(e){
	//e.source.setLeft(e.x  - e.source.diffX);
	//e.source.setTop(e.y  - e.source.diffY);
	var x = lastPosition.x + e.x  - e.source.diffX;
	var y = lastPosition.y + e.y  - e.source.diffY;
	$.logo.setLeft(x);
	$.logo.setTop(y);
	Ti.App.fireEvent("web:cardmovement", {y: y, x: x, room_id: 1});
	/*
	if((e.x - e.source.currentpoint.x) < 0){
		if(floatpoint < -0.10){
			answer = "left";
		}else{
			answer = "";
		}
		
	}else{
		
		if(floatpoint > 0.10){
			answer = "right";
		}
	}*/
	
});

Ti.App.addEventListener('purse:refresh',refresh);
Ti.App.addEventListener('app:cardMovement', cardMovement);
$.win.addEventListener("close", function(){
	Ti.App.removeEventListener('purse:refresh',refresh);
	$.destroy();
	console.log("window close");
});
