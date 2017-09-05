var vm = new Vue({
	el: "#app",
	data: {
		result:{},
		article_id: 3,
		inapp: 0,
		isShow: false,
		loading: true
	},
	mounted: function() {
		this.$nextTick(function() {
			//保证 this.$el已经插入文档
			vm.article_id = vm.getUrlParameter("article_id");
			vm.inapp = parseInt(vm.getUrlParameter("inapp"));
			vm.render();
		})
	},
	methods: {
		//获取数据
		render: function(){
			let _this = this;
			axios.post(parkStatic.url+"article/detail",{"aid":_this.article_id}).then(res => {
				_this.result = res.data.data;
				document.title  = _this.result.title;
				_this.loading = false;
			}).catch(function (error) {
			    console.log(error);
			 });
//			axios.get("data/article.json",{"aid":_this.article_id}).then(res => {
//				_this.result = res.data.data;
//				document.getElementsByTagName("title")[0].innerHTML = _this.result.title;
//			}).catch(function (error) {
//			    console.log(error);
//			 });
		},
		// 根据参数名称获取value    
        getUrlParameter: function (paramKey) {
            var sURLVariables, i, sParameterName, sPageURL = window.location.search.substring(1);
            if(sPageURL) {
                sURLVariables = sPageURL.split("&");
                for(i = 0; i < sURLVariables.length; i++) {
                    sParameterName = sURLVariables[i].split("=");
                    if(sParameterName[0] === paramKey) return sParameterName[1]
                }
            }
        },
        openApp: function(){
        		function iswx(){
				var ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger" || ua.match(/WeiBo/i) == "weibo" || ua.match(/QQ/i) == "qq") {
					return true;
				}else{
					return false;
				}
			};
        		if(iswx()){
				this.isShow = true;
			}else{
			   this.isShow = false;
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
});