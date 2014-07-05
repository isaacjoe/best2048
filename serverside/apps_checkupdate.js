
var apps = apps || {};

apps['com.rjfun.best2048'] = {
	name : '欢乐2048',
	icon : 'http://rjfun.com/best2048/icon.png',
	desc : "热门小游戏 2048，没玩过你就OUT了。这是欢乐配音版，根本停不下来，有木有！",
	android : {
		version : '1.0.20140705',
		vercode : 20140705,
		url : 'http://rjfun.com/best2048/jumprope-1.0.20140705.apk'
	},
	ios : {
		version : '1.0.20140705',
		vercode : 20140705,
		url : "javascript:doAlert('已提交苹果审核，敬请期待！');" 
		// url: 'https://itunes.apple.com/cn/app/tian-tian-tiao-sheng/id892775490?l=zh&ls=1&mt=8'
	}
};

function doAlert(msg, title) {
	if(navigator && navigator.notification && navigator.notification.alert) {
		navigator.notification.alert(msg, function(){}, title);
	} else {
		alert(msg);
	}
}

function doConfirm(msg, title, okfunc, cancelfunc) {
	if(navigator && navigator.notification && navigator.notification.confirm) {
		navigator.notification.confirm(msg, function(btnIndex){
			if(btnIndex == 1) okfunc();
			else cancelfunc();
		}, title);
	} else {
		if(confirm(msg)) okfunc();
		else cancelfunc();
	}
}

function openURL( url ) {
	if (typeof navigator !== "undefined" && navigator.app) {
		// Mobile device.
		navigator.app.loadUrl(url, {
			openExternal : true
		});
	} else {
		// Possible web browser
		window.open(url, "_blank");
	}
}


// Note: all apps using applist need have following items:
// app_key, like 'com.rjfun.jumprope'
// app_vercode, like 20140622
// app_data.versionAsked
// saveData(); 

function listApp( div_id ) {
	var html = "";
	var platforms = ['android', 'ios'];
	
	for(var k in apps) {
		var appitem = apps[k];
		
		html += "<p><img src='" + appitem.icon + "'/>" + '<br/>' + appitem.name + '<br/>介绍: ' + appitem.desc + '<br/>下载: <ul>';
		for(var i=0; i<platforms.length; i++) {
			var platform = platforms[i];
			var veritem = appitem[ platform ];
			if(veritem && veritem.url) {
				html += "<li><a href=\"" + veritem.url + "\">" + platform + "版</a>, v" + veritem.version + "</li>";
			}
		}
		html += '<ul></p>';
	}
	
	var div = document.getElementById( div_id );
	div.innerHTML = html;
}

// now check version update
function checkUpdate( manual_check ) {
	if(manual_check == null) manual_check = true;
	
	// not from an cordova apps, ignore
	if(! app_key) return;
	if(! app_vercode) return;
	if(typeof app_data !== 'object') return;
	if(typeof saveData !== 'function') return;
	
	var platform = 'android';
	if( /(android)/i.test(navigator.userAgent) ) platform = 'android';
	else if( /(iphone|ipad|ipod)/i.test(navigator.userAgent) ) platform = 'ios';

	var appitem = apps[ app_key ];
	if(! appitem) return;
	
	var veritem = appitem[ platform ];
	if(! veritem) return;

	// already newer version
	if(app_vercode >= veritem.vercode) {
		if(manual_check) doAlert('这已经是最新版本了。', '无需更新');
		return;
	}
	
	var needAsk = (!! manual_check) 
			|| (! app_data.versionAsked)
			|| (app_data.versionAsked < veritem.vercode);
	if(! needAsk) return;

	doConfirm(
		'发现新版本: \n' + appitem.name + ' v' + veritem.version + ', \n要更新吗？',
		'可以更新',
		function() {
			openURL( veritem.url );
		}, function() {
			app_data.versionAsked = veritem.vercode;
			saveData();
		});
}

checkUpdate( false );
