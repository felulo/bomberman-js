/**************************************************************
 * CARREGA IMAGENS
 **************************************************************/ 
 function loadImages(_images , _callback){
	$.preload(_images , {
	    init: function(loaded, total) {$("#indicator").html("Loaded: "+loaded+"/"+total);},
	    loaded: function(img, loaded, total) {$("#indicator").html("Loaded: "+loaded+"/"+total);},
	    loaded_all: function(_imgs , loaded, total) { $("#indicator").html("Loaded: "+loaded+"/"+total+". Done!");
	        
	        _callback(_imgs);
	    }
	}); 
}

(function($) {
	var imgList = [];				
	$.extend({
		preload: function(imgArr, option) {
			var setting = $.extend({
				init: function(loaded, total) {},
				loaded: function(img, loaded, total) {},
				loaded_all: function(loaded, total) {}
			}, option);
			imgList = [];
			var total = imgArr.length;
			var loaded = 0;					
			setting.init(0, total);
			for(var i in imgArr) {
				if (typeof imgArr[i] !== 'function') {
					var name = imgArr[i].substr(imgArr[i].lastIndexOf('/') + 1, imgArr[i].length - 5);
					var obj = {};

					obj[name] = $("<img />")
						.attr("src", imgArr[i])
						.css({width:"100%" , height:"auto"})
						.load(function() {
							loaded++;
							setting.loaded(this, loaded, total);
							if(loaded == total) {
								setting.loaded_all(imgList,loaded, total);
							}
						})[0]

					imgList.push(obj);
				}
			}					
		}
	});
})(jQuery);	