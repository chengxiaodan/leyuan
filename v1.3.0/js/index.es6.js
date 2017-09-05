import PT_utils from './pt_util.es6.js';
PT_utils.namespace('PT.Index');

PT.Index = function() {
	this.swiper1 = new Swiper('#shoplists', {
        slidesPerView: 'auto'
    });
    this.swiper2 = new Swiper('#shoplists-top', {
        slidesPerView: 'auto'
    });
	this.init();
}
PT.Index.prototype = {
	init: function() {
		var self = this;
		if(parseInt(PT_utils.getUrlParameter("inapp")) !== 1){
			$("#goback").hide();
			$("#sharebtn").hide();
			$(".cxd-recommend").hide();
			$("#cxd-footer").show();
			$(".cxd-edit").css("padding-bottom","2.4rem");
			$(".open-app").click(function(){
				PT_utils.openApp();
			});
		}
		$("#goback").on("click",function(){
			pt_jssdk.openNativeView({
				  type: "goback",
				  title: '',
				  id: 0
			  })
		});
		var id = PT_utils.getUrlParameter("id");
		self.getlist(id);
//		pt_jssdk.on("openTopic",function(data){
//			self.getlist(data.id);
//		});
//	 	setTimeout(function(){
//          pt_dispatch('openTopic',JSON.stringify({id:3}))
//     	},1000)
	},
	bindEvent: function() {
		var self = this;
		self.swiper1.on('click', (swiper)=>{
//			$(swiper.clickedSlide).click(function(){
				let id = $(swiper.clickedSlide).find("a").data("id");
				let parkid = $(swiper.clickedSlide).find("a").data("parkid");
				let title = $(swiper.clickedSlide).find("a figcaption").val();
			  	if(parseInt(PT_utils.getUrlParameter("inapp")) == 1){
			      pt_jssdk.openNativeView({
					  type: "product",
					  title: title,
					  id: id,
					  parkid: parkid
				  })
			  	}else{
			  		window.location.href = "wx_product.html?product_id="+id;
			  	}
//		   });
		});
		self.swiper2.on('click',(swiper)=>{
//			$(swiper.clickedSlide).click(function(){
				let id = $(swiper.clickedSlide).find("a").data("id");
				let parkid = $(swiper.clickedSlide).find("a").data("parkid");
			    let title = $(swiper.clickedSlide).find("a").data("title");
			    if(parseInt(PT_utils.getUrlParameter("inapp")) == 1){
			      pt_jssdk.openNativeView({
					  type: "product",
					  title: title,
					  id: id,
					  parkid: parkid
				  });
				}else{
			  		window.location.href = "wx_product.html?product_id="+id;
			  	}
//			})
		});
		$(window).scroll(function(e){
			//获取距离浏览器顶部距离并赋值th
			var th = $(window).scrollTop();
			var windowHeight = $(".cxd-header-center").height()+$(".cxd-header-center").position().top;
			//用if判断，距离顶部大于窗口高度时就显示，小于就隐藏
			
			if(th<windowHeight){
				$(".goback").removeClass("goback2").addClass("goback1");
				$("#sharebtn").removeClass("sharebtn2").addClass("sharebtn1");
				$(".cxd-header-top").css("visibility","hidden");
			}else{
				$(".goback").removeClass("goback1").addClass("goback2");
				$("#sharebtn").removeClass("sharebtn1").addClass("sharebtn2");
				$(".cxd-header-top").css("visibility","visible");
			}
			if($(".cxd-header-top .swiper-slide").length<=3){
				self.swiper2.lockSwipes();
				self.swiper2.params.centeredSlides=true;
				$(".cxd-header-top .swiper-wrapper").css("right",.44*$(".cxd-header-top .swiper-slide").length+'rem');
			}else{
				self.swiper2.unlockSwipes();
				self.swiper2.params.centeredSlides=false;
				$(".cxd-header-top .swiper-wrapper").css("right",'0rem');
			}
			self.swiper2.onResize();
			e.preventDefault();
		});
		$("body").on("touchmove",function(){
			$(".cxd-header-top").css("top","0px");
		});
		$("body").on("touchstart",function(){
			$(".cxd-header-top").css("top","0px");
		});
		$("body").on("touchend",function(){
			$(".cxd-header-top").css("top","0px");
		});
	},
	getlist: function(tid){
		var self = this;
		$.ajax({
			url:  parkStatic.url+'topic/detail?tid='+tid,
			type: 'get',
			dataType: "json",
			cache: false,
			async: true,
			success: function(data) {
				if(data.code == 200) {
					if(data.data.length!==0){
						self.render(data.data);
					}
				}else{
					alert(data.message);
				}
			},
			error: function(data) {
			}
		});
	},
	render: function(data){
		var self = this;
		if(data.relation.length>0 ){
			if(data.relation.length==1){
				self.swiper1.params.centeredSlides=true;
				self.swiper1.lockSwipes();
				$(".cxd-header-center .swiper-wrapper").css("right",.15*$(".cxd-header-center .swiper-slide").length+'rem');
			}else if(data.relation.length==2){
				self.swiper1.params.centeredSlides=true;
				self.swiper1.lockSwipes();
				$(".cxd-header-center .swiper-wrapper").css("right",'15%');
			}else if(data.relation.length<=3){
				self.swiper2.lockSwipes();
				self.swiper2.params.centeredSlides=true;
			}else{
				self.swiper1.unlockSwipes();
				self.swiper2.unlockSwipes();
				$(".cxd-header-center .swiper-wrapper").css("right",'0px');
				self.swiper1.params.centeredSlides=false;
				self.swiper2.params.centeredSlides=false;
			}
			self.swiper1.update();
			self.swiper2.onResize();
			$("title").text(data.name);
			$("#banner-icon").attr("src",data.banner);
			$(".cxd-edit").append(data.content);
			$.each(data.relation, function(index,item) {
				self.swiper1.appendSlide('<div class="swiper-slide"><a data-id="'+item.code+'" data-parkid="'+item.id+'"><figure><img src="'+item.image+'" /><figcaption>'+item.title+'</figcaption></figure></a></div>');
				self.swiper2.appendSlide('<div class="swiper-slide"><a data-id="'+item.code+'" data-parkid="'+item.id+'" data-title="'+item.title+'"><figure><img src="'+item.image+'" /></figure></a></div>');
			});
		}else{
			$(".cxd-header-top").hide();
			$(".cxd-header-center").hide();
		}
		if(data.recommend.length>0){
			var ul = $(".cxd-recommend ul");
			$.each(data.recommend, function(index,item) {
					var li = $('<li data-id="'+item.code+'" data-parkid="'+item.id+'"><figure><img src="'+item.image+'"><figcaption>'+item.title+'</figcaption>'
	                    +'<div class="rice"><span class="danwei">&yen;&nbsp;</span>'
	                    +'<span class="rice-value">'+item.start_price+'</span></div></figure></li>');
					li.appendTo(ul);
			});
			var list = ul.find("li");
			for(var i = 0; i < list.length; i++) {
				(function(Index) {
					list[Index].addEventListener('click', function(e) {
						 pt_jssdk.openNativeView({
							  type: "product",
							  title: $(list[Index]).find("figcaption").text(),
							  id: $(list[Index]).data("id"),
							  parkid: $(list[Index]).data("parkid")
						  });
					}, false);
				})(i)
			}
			if(data.recommend.length == 2){
				$(list[list.length-1]).addClass('remove-back');
				$(list[list.length-2]).addClass('remove-back');
			}else if(data.recommend.length>0 && (data.recommend.length/2)%2 ==0){
				$(list[list.length-1]).addClass('remove-back');
				$(list[list.length-2]).addClass('remove-back');
			}else if(data.recommend.length>0 && (data.recommend.length/2)%2 !==0){
				$(list[list.length-1]).addClass('remove-back');
			}
		}else{
			$(".cxd-recommend").hide();
		}
		self.bindEvent();
		$("#sharebtn").unbind("click");
		$("#sharebtn").bind("click",function(){
			pt_jssdk.nativeShare({
				  title: encodeURI(data.name),
				  pic: encodeURI(data.banner),
				  desc: encodeURI(data.subtitle),
				  url: encodeURI(window.location.href.replace("inapp=1","")+"")
			})
		});
		$(".loading").remove();
		$("#main").css("visibility","visible");
	}
}
$(document).ready(() => {
	new PT.Index();
})
