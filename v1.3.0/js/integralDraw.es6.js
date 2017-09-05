import PT_utils from './pt_util.es6.js';
PT_utils.namespace('PT.integralDraw');

PT.integralDraw = function() {
    this.swiper = null;
    this.swiper2 = new Swiper('.swiper-container2', {
    		initialSlide :0,
    		observer:true,//修改swiper自己或子元素时，自动初始化swiper
   		observeParents:true,//修改swiper的父元素时，自动初始化swiper
    		autoplay : 1000,
    		direction : 'vertical',
		slidesPerView: 1,
		loop: true,
		height: 35.5,
		onlyExternal : true//禁止手滑
	});
	//请求所需参数,全部是非必填
	this.appid = PT_utils.getUrlParameter("appid");
	this.device_id = PT_utils.getUrlParameter("device_id");
	this.token = PT_utils.getUrlParameter("token");
	this.uid = PT_utils.getUrlParameter("uid");
	
	this.init();
	this._bindEvent();
}
PT.integralDraw.prototype = {
	init: function() {
		var self = this;
		self.getintegralDraw();
	},
	_bindEvent: function(){
		var self = this;
		$("#btn-draw-rule").click(function(){
			$(".draw-rule").show();
		});
		$("#close").click(function(){
			$(".draw-rule").hide();
		});
		$("#show-box .btn").click(function(){
			$("#show-box").hide();
//			$(".draw-an").removeClass("slideOutDown");
			$(".draw-an").removeClass("slideOutDown").addClass("wobble");
			$("img.handom").show();
			//重新请求中奖信息的接口
		});
		var startX,startY,moveEndX,moveEndY,X,Y,imgY,imgX;
			imgX = $('#shengzhi').offset().left,
	　　　　	imgY =  $('#shengzhi').offset().top;
		$(".draw-price").on("touchstart", function(e) {
		   e.stopPropagation();
	　　　　e.preventDefault();
	　　　　startX = e.originalEvent.changedTouches[0].pageX,
	　　　　startY = e.originalEvent.changedTouches[0].pageY;
	　　});
	　　$(".draw-price").on("touchmove", function(e) {
		   e.stopPropagation();
	　　　　e.preventDefault();
	　　　　moveEndX = e.originalEvent.changedTouches[0].pageX,
	　　　　moveEndY = e.originalEvent.changedTouches[0].pageY,
	　　　　X = moveEndX - startX,
	　　　　Y = moveEndY - startY;
	
	　　　　if ( Math.abs(X) > Math.abs(Y) && X > 0 ) {
				if(Math.abs(moveEndX-parseInt(imgX))>=0 && Math.abs(moveEndX-parseInt(imgX))<=2){
					if(self.token!== "null" || self.token!== "undefined" || self.token!== ""){
						//已登陆,请求抽奖接口,每次扣15积分
						 self.getDrawPrize();
					}else{
						//未登陆
						pt_jssdk.openNativeView({
							  type: "unlogin",
							  title: '',
							  id: 0
						 })
					}
				}
	　　　　}
	　　});
	},
	//戳一戳抽奖
	getDrawPrize: function(){
		var self = this;
		var datajson = {
			appid: self.appid,
			device_id: self.device_id,
			token: self.token,
			uid: self.uid
		};
		$.ajax({
			type:"post",
			url:parkStatic.url+"v1.3.0/integral/draw/build",
			dataType: "json",
			data: datajson,
			cache: false,
			async:true,
			success: function(result){
				if(result.http_code == 200){
					if(result.data.is_win == true){
						$(".draw-an").removeClass("wobble").addClass("slideOutDown");
						$("img.handom").hide();
						var time = window.setTimeout(function(){
							$("#prizeName").text(result.data.prize.title);
							$("#prizeIcon").attr("src",result.data.prize.cover_pic);
							$("#show-box").show();
							clearTimeout(time);
						},500);
					}else if(result.data.is_win == false){
						layer.open({
					      content: "很遗憾您没有中奖",
					      time: 2,
					      skin: 'msg'
					    });
					    $(".draw-an").removeClass("slideOutDown").addClass("wobble");
						$("img.handom").show();
					}else{
						layer.open({
					      content: "数据不能为空",
					      time: 2,
					      skin: 'msg'
					    });
					    $(".draw-an").removeClass("slideOutDown").addClass("wobble");
						$("img.handom").show();
					}
				}else if(result.http_code == 648){
					layer.open({
				      content: "积分不够喽!",
				      time: 2,
				      skin: 'msg'
				    });
				    $(".draw-an").removeClass("slideOutDown").addClass("wobble");
					$("img.handom").show();
				}else if(result.http_code == 700){
					layer.open({
				      content: "抽奖失败,请重新尝试",
				      time: 2,
				      skin: 'msg'
				    });
				    $(".draw-an").removeClass("slideOutDown").addClass("wobble");
					$("img.handom").show();
				}else if(result.http_code == 602){
						layer.open({
					      content: "登录失效,请重新登录",
					      time: 2,
					      skin: 'msg'
					    });
					    $(".draw-an").removeClass("slideOutDown").addClass("wobble");
						$("img.handom").show();
						//未登陆
						pt_jssdk.openNativeView({
							  type: "unlogin",
							  title: '',
							  id: 0
						})
				}
			}
		});
	},
	//获取信息
	getintegralDraw: function(){
		var self = this;
		$.ajax({
			url:  parkStatic.url+'v1.3.0/integral/draw/pageData',
			type: 'post',
			cache: false,
			async: true,
			success: function(data) {
				if(data.http_code == 200){
					$.each(data.data.winners, function(index,winner) {
						self.swiper2.appendSlide('<div class="swiper-slide">'+winner.winner_name+"中"+winner.prize+'</div>');
					});
					var renderHtml = '';
					$.each(data.data.prize, function(index,prize) {
						renderHtml+='<div class="swiper-slide"><figure><img src="'+prize.cover_pic+'"><figcaption>'+prize.title+'</figcaption></figure></div>';
					});
					$("#swiper-wrapper").append(renderHtml);
					var slidesPerColumn = 1;
					window.innerWidth <= 320 ? slidesPerColumn = 1 : slidesPerColumn = 2;
					if($(".winpro-list").height()>=$(".swiper-container").height()*2+30){
						slidesPerColumn = 2;
					}else{
						slidesPerColumn = 1;
					}
					self.swiper = new Swiper('.swiper-container', {
				        slidesPerView: 3,
				        slidesPerColumn: slidesPerColumn,
				        slidesPerColumnFill : 'row',
				        slidesOffsetBefore : 15,
				        spaceBetween: 15,
				        freeMode: true,
				        freeModeSticky : true,
				        freeModeMomentumRatio: 1,
				        width: 318
				   });
					var padtop = ($(".winpro-list").height()-$(".swiper-container").height())/2;
					$(".swiper-container").css("padding",padtop+"px 0px");
				}else{
					layer.open({
				      content: data.msg,
				      time: 2,
				      skin: 'msg'
				    });
				}
				
			},
			error: function(data) {
				layer.open({
			      content: data.msg,
			      time: 2,
			      skin: 'msg'
			    });
			}
		});
	}
}
$(document).ready(() => {
	new PT.integralDraw();
})
