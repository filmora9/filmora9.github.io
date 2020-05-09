/**
 * Page download package js
 * @author tjx
 */
(function($)
{
	$.download = 
	{
		request_url : '/servers/public/index.php?c=product&a=getdownloadjumpinfo',
		page : 'product-download.html',
		reg : /\.(exe|dmg|zip|pdf)$/i,
		jump_url : '/download.html',
		mobile_jump_url : '/mobile-download.html',
		jump : function(options)
		{
			$("a").each(function() 
			{
				$.download.click(this, options);
			});
		},
		click : function(obj, options)
		{
			options.time = options.time || 200;
			var download_url = $(obj).attr("href");
			var is_jump = $(obj).attr("is_jump");
			if (((typeof(is_jump) == "undefined") || is_jump == 'yes') && (download_url && download_url.match($.download.reg))) 
			{
				$(obj).on('click', function() 
				{
					var tem_download_url = $(this).attr("href");
					if ((tem_download_url && tem_download_url.match($.download.reg))) 
					{
						if(typeof options.callback_func == 'function')
						{
							options.callback_func(download_url);
						}
					}
					return true;
				});
			}
		},
		isMobile : function()
		{
			var isAndroid = navigator.userAgent.toLowerCase().match(/android/i) == "android";
			var isIphone = navigator.userAgent.toLowerCase().match(/iphone os/i) == "iphone os";
			var isIpad = navigator.userAgent.toLowerCase().match(/ipad/i) == "ipad";
			var isWin = navigator.userAgent.toLowerCase().match(/windows phone/i) == "windows phone";
			
			var is_mobile = false;
			if(isAndroid || isIpad || isIphone || isWin)
			{	
				is_mobile = true;
				var title = $(document).attr("title");
				title = title || "";
				$.cookie.set("before_title", title);
				$.cookie.set("before_url", window.location.href);
			}
			return is_mobile;
		},
		get : function(options)
		{
			if (typeof(options.download_url) == "undefined")
			{
				return '';
			}
			var opts = $.extend({
				async : false
			}, options || {});
			
			opts.post_data.page = opts.post_data.page || this.page;
			$.ajax({
					type	: 'GET',
					url		: this.request_url,
					async 	: opts.async,
					data	: opts.post_data,
					dataType: 'json',
					success: function(data) 
					{
						if(data)
						{
							if(typeof opts.callback_func == 'function')
							{
								opts.callback_func(data);
							}
						}
					}
			});
		}
	};
	
	$.cookie = 
	{
		set : function(name, value)
		{
			var Days = 30;
			var exp = new Date();
			exp.setTime(exp.getTime() + Days*24*60*60*1000);
			document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/;domain="+$.cookie.host();
		},
		get : function(name)
		{
			var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
			if(arr != null) return unescape(arr[2]); return null;
		},
		host : function()
		{
			var host = "null";
			var url = window.location.href;
			var regex = /.*\:\/\/([^\/|:]*).*/;
			var match = url.match(regex);
			if (typeof match != "undefined"
					&& null != match) {
				host = match[1];
			}
			if (typeof host != "undefined"
					&& null != host) {
				var strAry = host.split(".");
				if (strAry.length > 1) {
					host = strAry[strAry.length - 2] + "." + strAry[strAry.length - 1];
				}
			}
			return host;
		}
	}; 
})(jQuery);

$(document).ready(function()
{ 
	var curr_url = window.location.href;
	if(curr_url.indexOf($.download.jump_url) == -1 && curr_url.indexOf($.download.mobile_jump_url) == -1)
	{
		//callback function
		$.download.jump({callback_func : function(download_url)
		{
			_gaq.push(["_trackEvent", download_url, "Download",document.location.host + document.location.pathname]);
			_gaq.push(['_trackPageview', download_url]);
		}});
	}
});