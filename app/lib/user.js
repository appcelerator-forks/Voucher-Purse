var fullname;
var mobile;
var username; 

exports.checkAuth = function(_callback) {
	var u_id = Ti.App.Properties.getString('user_id'); 
	if(u_id == "" || u_id == null){
		var win = Alloy.createController("auth/login").getView();
    	win.open();
	} else {
		Ti.App.fireEvent("home:refresh");
    	_callback && _callback();
    }
};

exports.updateProfile = function(params, _callback){
	
};

exports.logout = function(_callback) {
	Ti.App.Properties.setString('u_id', "");
	Ti.App.Properties.setString('fullname', "");
	Ti.App.Properties.setString('email', "");
	Ti.App.Properties.setString('mobile', "");
	Ti.App.Properties.setString('img_path', "");
	Ti.App.Properties.setString('thumb_path', "");
	_callback && _callback();
};