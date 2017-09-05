import PT_utils from './pt_util.es6.js';
PT_utils.namespace('PT.Invitation');

PT.Invitation = function() {
	this.init();
}
PT.Invitation.prototype = {
	init: function() {
		var self = this;
		var uid = PT_utils.getUrlParameter("uid");
		$("#receive").click(function(){
			if(self.validTel()){
				self.getInvitation(uid);
			}
		})
		$("#inform").click(function(){
//			PT_utils.openApp();
			location.href = 'http://store.putao.com/toys/putaoleyuan';
		})
	},
	validTel: function(){
		var self = this;
		var tel = $("input[type=tel]");
		var flag = true;
		if(null == tel.val() || "" == tel.val() ||
			tel.val().length == 0) {
			flag = false;
			layer.open({
		      content: "请输入手机号",
		      time: 2,
		      skin: 'msg'
		    });
		}else if(!PT_utils.isphone(tel.val())) {
			flag = false;
			layer.open({
		      content: "手机号格式错误",
		      time: 2,
		      skin: 'msg'
		    });
		}
		return flag;
	},
	getInvitation: function(uid){
		var self = this;
		var secretkey = "171c150f681e1051fb38244467a7693c";
		var invitee_phone = $("input[type=tel]").val();
		var time = new Date().getTime();
		var str="invitee_phone="+invitee_phone+"&inviter_uid="+uid+"&time="+time;
		var sign = md5(str+secretkey);
		var datajson = {
			invitee_phone: invitee_phone,
			inviter_uid: uid,
			sign: sign,
			time: time
		}
		var loading = null;
		$.ajax({
			url:  bookStatic.url+'v1.2.2/bind/invitation',
			type: 'post',
			dataType: "json",
			beforeSend: function() {
	            loading = layer.open({
				    type: 2,
				    shadeClose: false,
				    content: '礼包飞来中'
				  });
	        },
	        complete: function() {
	            layer.close(loading);
	        },
			data: datajson,
			cache: false,
			async: true,
			success: function(data) {
				if(data.http_code == 640){//已经领取过了
					layer.open({
					    content: '该手机号已经领取过礼包罗，赶快去葡萄乐园app使用吧！',
					    btn: "我知道了",
					    shadeClose: false,
					    yes: function(index){
					    	  $("input[type=tel]").val("");
					    	  $("#iv_one").hide();
					    	  $("#iv_two").show();
					    	  layer.close(index);
					    }
					 });
				}else if(data.http_code == 639){//是老用户
					layer.open({
					    content: '您是老用户，不可领取礼包哦，赶快去葡萄乐园app看看最新的活动吧！',
					    btn: "我知道了",
					    shadeClose: false,
					    yes: function(index){
					    	  $("input[type=tel]").val("");
					    	  $("#iv_one").show();
				    		  $("#iv_two").hide();
					    	  layer.close(index);
					    }
					});
				}else if(data.http_code == 633){//未注册用户
					$("#iv_one").hide();
				    	$("#iv_two").show();
				}else if(data.http_code == 200){//未注册用户
					$("#iv_one").hide();
				    	$("#iv_two").show();
				}else{
					$("#iv_one").show();
				    	$("#iv_two").hide();
					layer.open({
				      content: data.msg,
				      time: 2,
				      skin: 'msg'
				    });
				    $("input[type=tel]").val("");
				}
			},
			error: function(data) {
			}
		});
	}
}
$(document).ready(() => {
	new PT.Invitation();
})
