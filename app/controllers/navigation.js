var args = arguments[0] || {};
/**
 * Global Navigation Handler
 */

_.debounce(navTo, 5000);

Alloy.Globals.Navigator = {
	/**
	 * Handle to the Navigation Controller
	 */
	navGroup: $.nav,
	
	open: navTo,
	openWindow: function(win){
		if(OS_IOS){
			this.navGroup.openWindow(win);
		}
		else{
			// added this property to the payload to know if the window is a child
			if(typeof payload != "undefined"){
				if (payload.displayHomeAsUp){
					win.addEventListener('open',function(evt){
						var activity=win.activity;
						activity.actionBar.displayHomeAsUp=payload.displayHomeAsUp;
						activity.actionBar.onHomeIconItemSelected=function(){
							evt.source.close();
						};
					});
				}
			}
			win.open({navBarHidden: false, fullscreen: false});
		}
	}
};

function navTo(controller, payload){
		var controller = Alloy.createController(controller, payload || {});
		var win = controller.getView();
		if(OS_IOS){
			_.debounce(this.navGroup.openWindow(win), 1000, true);
			
		}else{
			// added this property to the payload to know if the window is a child
			if(typeof payload != "undefined"){
				if (payload.displayHomeAsUp){
					win.addEventListener('open',function(evt){
						var activity=win.activity;
						activity.actionBar.displayHomeAsUp=payload.displayHomeAsUp;
						activity.actionBar.onHomeIconItemSelected=function(){
							evt.source.close();
						};
					});
				}
			}
			_.debounce(win.open({navBarHidden: false, fullscreen: false}), 1000, true);
			
		}
		return controller;
	}

if(!OS_IOS){
	Alloy.Globals.Navigator.navGroup = $.index.getView();
}

function _callback(){
	console.log('android callback');
	Alloy.Globals.Navigator.navGroup.open({navBarHidden: true, fullscreen: false});
}

function init(){
	console.log("open navigation");
	_callback();
}

init();
