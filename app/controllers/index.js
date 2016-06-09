var args = arguments[0] || {};
var loading = Alloy.createController("loading");
var loadingView = Alloy.createController("loader");

/*
 * after checked login only call loader
 */
function call_loader(){
	loadingView.getView().open();
	loadingView.start();
}

function loadingViewFinish(){
	console.log('loadingViewFinish open navigation');
	loadingView.finish(function(){
		var win = Alloy.createController("navigation");
		$.win.close();
	});
}

/*
 * login parts
 */
function checkAuth() {
	Ti.App.Properties.setString('u_id', 1);
	var u_id = Ti.App.Properties.getString('u_id'); 
	if(u_id != "" && u_id != null){
		if(OS_ANDROID){$.win.open();}
		console.log('call loader'+u_id);
		call_loader();
    }else{
    	$.win.open();
    }
};

function do_signup(){
	var win = Alloy.createController("auth/signup").getView();
	win.open();
}

function do_login(){
	var username     = $.username.value;
	var password	 = $.password.value;
	if(username ==""){
		Common.createAlert("Fail","Please fill in your username");
		return false;
	}
	if(password =="" ){
		Common.createAlert("Fail","Please fill in your password");
		return false;
	}
	var device_token = Ti.App.Properties.getString('deviceToken');
	console.log(device_token);
	var params = { 
	 	device_token: device_token,
		username: username,  
		password: password
	};
	//API.doLogin(params, $); 
	loading.start();
	API.callByPost({url: "doLoginUrl", params: params}, function(responseText){
		var result = JSON.parse(responseText); 
		if(result.status == "error"){
			Common.createAlert("Error", result.data[0]);
			loading.finish();
			return false;
		}else{
			loading.finish();
			var userModel = Alloy.createCollection('user'); 
			var arr = result.data;
			userModel.saveArray(arr);
	   		Ti.App.Properties.setString('u_id', arr.id);
	   		Ti.App.Properties.setString('fullname', arr.fullname);
	   		Ti.App.Properties.setString('email', arr.email);
	   		Ti.App.Properties.setString('mobile', arr.mobile);
	   		Ti.App.Properties.setString('img_path', arr.img_path);
	   		Ti.App.Properties.setString('thumb_path', arr.thumb_path);
	   		
			call_loader();
		}
	});
}

$.doLogout = function(_callback){
	Ti.App.Properties.setString('u_id', "");
	Ti.App.Properties.setString('fullname', "");
	Ti.App.Properties.setString('email', "");
	Ti.App.Properties.setString('mobile', "");
	Ti.App.Properties.setString('img_path', "");
	Ti.App.Properties.setString('thumb_path', "");
	console.log('start callback');
	_callback && _callback();
};

function init(){
	$.win.add(loading.getView());
	//reset notification badge for Iphone
	if (OS_IOS) {
		Titanium.UI.iPhone.setAppBadge("0");
	}
	
	//set status in app for ntification use.
	PUSH.setInApp();
	checkAuth();
}

Ti.App.addEventListener('app:loadingViewFinish', loadingViewFinish);

init();

$.win.addEventListener("close",function(e){
	console.log('window close?');
	Ti.App.removeEventListener('app:loadingViewFinish', loadingViewFinish);
});
