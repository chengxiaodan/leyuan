Vue.filter("formatMoney",function(value){
		var f = parseFloat(value); 
	      if (isNaN(f)) { 
	        return "¥  0.00"; 
	      } 
	      f = Math.round(value*100)/100;
	      var s = f.toString(); 
	      var rs = s.indexOf('.'); 
	      if (rs < 0) { 
	        rs = s.length; 
	        s += '.'; 
	      } 
	      while (s.length <= rs + 2) { 
	        s += '0'; 
	      } 
		return "¥  " + s;
})
var vm = new Vue({
	el: "#app",
	data: {
		productId: 0,
		sku_id: 0,
		result: {},
		userlist: {},
		ok: false,
//		isvideoBtn: true,
		client_id: "5c30db50b42ae8c4",
		showImg: false,
		imgSrc: '',
		isShow: false,
		video_title: "",
		features: [],
		generalization: "",
		isVideo: false,
		video_cover: "",
		sku_name: ""
	},
	computed: {
	    price: function () {
	      return  Vue.filter("formatMoney")(this.result.price);
	    }
	},
	mounted: function() {
		this.$nextTick(function() {
			//保证 this.$el已经插入文档
			vm.productId = parseInt(vm.getUrlParameter("product_id"));
			vm.sku_id = parseInt(vm.getUrlParameter("sku_id"));
			vm.productView();
		})
	},
	methods: {
		productView: function() {
			let _this = this;
			//获取产品详情
			axios.get(storeStatic.url+"product/product/h5View?product_id="+_this.productId).then(res => {
				if(res.data.http_code == 200){
					_this.result = res.data.data;
					document.title = _this.result.title;
					_this.video_title = _this.result.product_extras.video_title;
					_this.features = _this.result.product_extras.features;
					_this.generalization = _this.result.product_extras.generalization;
					_this.video_cover = _this.result.product_extras.video_cover;
					_this.isimgOrVideo();
					var editor = document.getElementById("editor");
					_this.$nextTick(() =>{
						let height = 0;
						let wh = 0;
						getHeight();
						function getHeight(){
							_this.timer = setTimeout(() => {
								if(editor.clientHeight == height && editor.clientHeight>=1440) {
									wh++;
								}
								height = editor.clientHeight;
								if(wh== 1){
									if(editor.clientHeight>=1440){
										editor.style.height= "33.75rem";
										_this.ok = true;
					            		}else{
										editor.style.height= "auto";
					            		 	_this.ok = false;
					            		}
					            		clearTimeout(_this.timer);
								}else{
									getHeight();
								}
							}, 500)
						}
					})
					if(_this.sku_id !==NaN){
						axios.get(storeStatic.url+"sales/activity/skuActivity?sku_id="+_this.sku_id).then(res1 => {
							var arr = res1.data.data.activity;
							if(res1.data.http_code == 200 && arr.length>0){
								for (var i=0; i<arr.length; i++) {
									if(arr[i].type === 1){
										_this.sku_name = "限时抢购";
										_this.result.price = arr[i].price;
									}else if(arr[i].type === 5){
										_this.sku_name = "秒杀";
										_this.result.price = arr[i].price;
									}
								}
							}
						}).catch(function (error) {
						    console.log(error);
						});
					}
				}
			}).catch(function (error) {
			    console.log(error);
			});
			//获取用户评价列表
			axios.get(storeStatic.url+"product/comment/h5CommentList?product_id="+_this.productId).then(res => {
				if(res.data.http_code == 200){
					_this.userlist = res.data.data;
				}
			}).catch(function (error) {
			    console.log(error);
			});
			
//			axios.get("data/cartData.json", {
//				"product_id": _this.productId
//			}).then(res => {
//				_this.result = res.data.result;
//				document.title = _this.result.productName;
//				if(_this.result.video_id!=='' && _this.result.video_id!==null){
//					_this.videoPlay();
//				}
//			}).catch(function (error) {
//			    console.log(error);
//			});
		},
		isimgOrVideo: function(){
			let _this = this;
			if(_this.result.product_extras.video_url!=='' && _this.result.product_extras.video_url!==null){
				_this.isVideo = true;
				_this.videoPlay();
			}
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
		changeEditorH: function(dom){
			var editor = this.$el.querySelector('.editor');
			editor.style.height = "auto";
			this.ok = false;
		},
		videoPlay: function(){
			let _this = this;
//			_this.isvideoBtn = false;
			var player = new YKU.Player('youkuplayer', {
                    styleid: '0',
                    autoplay: true,
                    client_id: '5c30db50b42ae8c4',
                    vid: _this.result.product_extras.video_url,
                    newPlayer: true
            });
		},
		clickImg: function(e) {
            this.showImg = true;
            // 获取当前图片地址
            this.imgSrc = e.currentTarget.src;
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
       },
       dateFormat: function(time) {
       		var datetime = new Date();
         	datetime.setTime(time * 1000);
			var format_result = datetime.getFullYear() + "/";
	
			if(datetime.getMonth() + 1 < 10) {
				format_result += "0";
			}
			format_result += datetime.getMonth() + 1 + "/";
			if(datetime.getDate() < 10) {
				format_result += "0";
			}
			format_result += datetime.getDate() + " ";
			if(datetime.getHours() < 10) {
				format_result += "0";
			}
			format_result += datetime.getHours() + ":";
			if(datetime.getMinutes() < 10) {
				format_result += "0";
			}
			format_result += datetime.getMinutes();
			return format_result;
		}
	}
});