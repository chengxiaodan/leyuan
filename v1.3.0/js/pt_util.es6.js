/**
 * 公共方法
 */
const pt_utils = {
	namespace: (...obj) => {
		var a, v, x, o, d, i, j, len1, len2;
		a = obj;
		len1 = a.length;
		// 支持多参数,如两个参数（a.b.c, d.e）
		for(i = 0; i < len1; i++) {
			d = a[i].split('.'); // 分解成数组，如把a.b.c分解成[a,b,c]
			o = window[d[0]] = window[d[0]] || {}; // 保证a是对象,若果全局有就用全局的，如果没有就新建{}
			x = d.slice(1); //取出[b,c]
			len2 = x.length;

			// 支持嵌套，对b和c
			for(j = 0; j < len2; j++) {
				v = x[j]
				o = o[v] = o[v] || {}; // o逐层深入，保证每层都是对象，如果是b，o变为a.b，如果是c，o最后变成a.b.c
			}
		}
	},
	// 根据参数名称获取value    
	getUrlParameter: (paramKey) => {
		var sURLVariables, i, sParameterName, sPageURL = window.location.search.substring(1);
		if(sPageURL) {
			sURLVariables = sPageURL.split("&");
			for(i = 0; i < sURLVariables.length; i++) {
				sParameterName = sURLVariables[i].split("=");
				if(sParameterName[0] === paramKey) return sParameterName[1]
			}
		}
	},
	/*判断输入是否为合法的手机号码*/
	isphone: (inputString) => {
		var partten = /^1[0-9]{10}$/;
		var bchk = partten.test(inputString);
		return bchk;
	},
	openApp: () => {
    		function iswx(){
			var ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger" || ua.match(/WeiBo/i) == "weibo" || ua.match(/QQ/i) == "qq") {
				return true;
			}else{
				return false;
			}
		};
    		if(iswx()){
			$(".openBrowser").show();
		}else{
			$(".openBrowser").hide();
	       var timeout, t = 1000, hasApp = true;
	       /*
			* 智能机浏览器版本信息:
			*/
			var browser = {
				versions: function() {
				var u = navigator.userAgent, app = navigator.appVersion;
				return {//移动终端浏览器版本信息 
				trident: u.indexOf('Trident') > -1, //IE内核
				presto: u.indexOf('Presto') > -1, //opera内核
				webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
				mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
				iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1, //是否iPad
				webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
				};
				}(),
				language: (navigator.browserLanguage || navigator.language).toLowerCase()
			}
			setTimeout(function () {
				if (hasApp) {
				} else {
//					if (browser.versions.android) {
//						location.href = 'https://fir.im/l3dn?release_id=5983e0f5959d69319d00005c';
//					}else{
//						location.href = 'https://fir.im/PTPark'
//					}
					location.href = 'http://store.putao.com/toys/putaoleyuan'
				}
			}, 2000)
			
			if (browser.versions.android) {
				var t1 = Date.now();
				var ifr = document.createElement("iframe");
				ifr.src = 'ptpark://putaopark';
				ifr.style.display = "none";
				document.body.appendChild(ifr);
				timeout = setTimeout(function () {
					try_to_open_app(t1);
				}, t);
			} else {
				var t1 = Date.now();
//					var ifr = document.createElement("iframe");
//					ifr.src = 'putaoparkh5://park';
//					ifr.style.display = "none";
//					document.body.appendChild(ifr);
//					alert(ifr.src)
				window.location.href = 'putaoparkh5://park';
				timeout = setTimeout(function () {
//						alert(ifr.src)
					try_to_open_app(t1);
				}, t);
			}

			function try_to_open_app(t1) {
				var t2 = Date.now();
				if (!t1 || t2 - t1 < t + 200) {
					hasApp = false;
				}
			}
	  }
    }
}
export default pt_utils;