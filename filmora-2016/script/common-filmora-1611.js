// JavaScript Document

/****************************************************
*  project: scaffolding template for filmora        *
*  description: breakpoint/container 1016px/1000px  *
*  author: mazq@wondershare.cn                      *
*  update: 170818                                   *
****************************************************/

/********** instant execute **********/
/** local storage **/
var isStorage = typeof(Storage) !== void(0);

/** system/platform **/
//detect
var isAndroid = navigator.userAgent.toLowerCase().match(/android/i) == "android";
var isIphone = navigator.userAgent.toLowerCase().match(/iphone os/i) == "iphone os";
var isIpad = navigator.userAgent.toLowerCase().match(/ipad/i) == "ipad";
var isWinPhone = navigator.userAgent.toLowerCase().match(/windows phone/i) == "windows phone";
var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
//auto switch
if($('#body').data('sys') === 'auto'){
	var s = isMac ? 'mac' : 'win';
	$('[data-sys="auto"]').attr('data-sys', s);
	$('.platform .pfm-' + s).addClass('active');
}
//manual switch
$('body').on('click', '.platform .pfm', function(){
	var p = $(this).closest('.platform').find('.pfm');
	p.removeClass('active');
	if($(this).hasClass('pfm-mac')){
		$('[data-sys="win"]').attr('data-sys', 'mac');
		p.filter('.pfm-mac').addClass('active');
	} else {
		$('[data-sys="mac"]').attr('data-sys', 'win');
		p.filter('.pfm-win').addClass('active');
	}
});

/** animation **/
jQuery.fn.anime = function(type){
	return this.each(function(){
		var el = $(this);
		switch(type){
			case 'reappear':
				el.addClass('anime-reappear');
				setTimeout(function(){
					el.removeClass('anime-reappear');
				}, 1000);
				break;
			default:
				switch(el.data('anime')){
					case 'parallax':
						$(window).on('scroll', function(){
							var scsp = 1/8;				//scroll speed
							var ofst = $(document).scrollTop() - (el.offset().top - (bHeight - el.height())/2);
							var ofbs = -50;				//offset base
							var ofcl = ofbs + 100 * ofst * scsp / el.height();
							var limt = 25;				//limit
							if(ofcl > ofbs + limt){		//max
								ofcl = ofbs + limt;
							}
							if(ofcl < ofbs - limt){		//min
								ofcl = ofbs - limt
							}
							el.find('.parallax-bg').css('transform', 'translate(0, ' + ofcl + '%)');
						});
						break;
					case 'entrance':
						$(window).on('scroll', function(){
							var buff = 200;
							var dely = 200;
							var scrl = $(document).scrollTop() + bHeight - el.offset().top + buff;
							if(scrl >= 0){
								setTimeout(function(){
									el.find('.anime-list .anime-item').each(function(ind){
										var item = $(this);
										setTimeout(function(){
											item.removeClass('unload');
										}, dely * ind);
									});
								}, 1000);
							}
						});
						break;
					default:
				}
		}
	});
};
$('section[data-anime="entrance"]').anime();
$('section[data-anime="parallax"]').anime();

/** video control **/
//remove background video
if(isMobile){
	$('.back video').remove();
}

//pause video when it is out of view
$(window).on('load', function() {
	setTimeout(function() {
		if($('video').length > 0){
			$('video').each(function(index, el) {
				var vd = $(this);
				var vt = vd.offset().top;
				if(vt > bHeight) {
					vd[0].pause();
				}
				$(window).on('scroll', function() {
					var st = $(document).scrollTop();
					
					if(vd.closest('.parallax-bg').length > 0){
						vt = vd.closest('.back').offset().top;
					}
					st > vt - bHeight && st < vt + bHeight ? vd[0].play() : vd[0].pause();
				});
			});
		}
	}, 3000);
});

/** notice **/
//call notice
var noticeCall = function(label){
	var ind = $('#shoulder .notice').length;
	$('#shoulder').append('<div class="notice transition shrink"><div class="container"><div class="notice-box"><i class="fm fm-close notice-close"></i><div class="notice-content">' + label + '</div></div></div></div>');
	var crt = $('#shoulder .notice:eq(' + ind + ')');
	setTimeout(function(){
		crt.addClass('active');
		noticeBack();
	}, 50);
	setTimeout(function(){
		crt.removeClass('active');
		noticeBack();
	}, 5050);
	return ind;
};
//close notice
$('#shoulder').on('click', '.notice', function() {
	$(this).removeClass('active');
	noticeBack();
});
//notice button
$('body').on('click', '[data-toggle="notice"]', function(){
	noticeCall($(this).data('label'));
});
//notice curtain/background
var noticeBack = function(){
	$('#shoulder').toggleClass('has-notice', $('#shoulder .notice.active').length > 0);
};

/** login **/
//toggle modal
function showLogin(type){
	$('.modal-login').modal('show');
	$('.modal-login .switch-form[data-switch="' + type + '"]').click();
}
//form switch
$('#login').on('click', '.switch-form', function() {
	$(this).siblings().removeClass('active');
	$(this).addClass('active');
	$(this).closest('.modal').find('form').removeClass('active');
	$(this).closest('.modal').find('form[data-form=' + $(this).data('switch') + ']').addClass('active');
});
//toggle advance
$('#login').on('click', '.toggle-advance', function() {
	$(this).find('i').toggleClass('fm-toggle fm-toggle-up');
	$(this).closest('.modal').find('.hide-advance').toggleClass('active');
});


/********** document ready **********/
$(function(){
	'use strict';

	/** header **/
	//toggle dropdown
	$('#header').on('click', '.menu-dropdown', function(e){
		e.stopPropagation();
		$(this).siblings().removeClass('active');
		$(this).toggleClass('active');
	});
	$('#header').on('click', '.menu-dropdown .menu-title a', function(e){
		e.preventDefault();
	});

	//search input
	$('#header').on('submit', '.header-search', function(e){
		e.stopPropagation();
		if(isMobile || isTablet){
			if($('#header').find('.header-search input').val() === ''){
				e.preventDefault();
			}
		} else {
			if($('#header .header-dropdown').hasClass('search-on')){
				if($('#header').find('.header-search input').val() === ''){
					e.preventDefault();
					reset.header.search();
				}
			} else {
				e.preventDefault();
				$('#header').find('.header-search').anime('reappear');
				$('#header').find('.header-search input').val('');
				$('#header').find('.header-dropdown').addClass('search-on');
				setTimeout(function(){
					$('#header').find('.header-search input').focus();
					$('#header').find('.header-search .search-off').removeClass('hidden');
				}, 600);
			}
		}
	});
	$('#header').on('click', '.header-search', function(e){
		e.stopPropagation();
	});
	$('#header').on('click', '.search-off', function(){
		reset.header.search();
	});

	//toggle mobile menu
	$('#header').on('click', '.icon-burger', function(e){
		e.stopPropagation();
		$('#header').toggleClass('active');
		if($('#header').hasClass('active')){
			if(!isMobile){
				$('#header').find('.header-search input').focus();
			}
		}
	});


	/** ui reset **/
	//resets
	var reset = {
		header : {
			mobile : function(){
				$('#header').removeClass('active');
			},
			dropdown : function(){
				$('#header').find('.menu-dropdown').removeClass('active');
			},
			search : function(){
				if($('#header').find('.header-dropdown').hasClass('search-on')){
					$('#header').find('.header-search').anime('reappear');
					setTimeout(function(){
						$('#header').find('.header-search .search-off').addClass('hidden');
					}, 600);
					$('#header').find('.header-dropdown').removeClass('search-on');
				}
			}
		},
		float : {
			flag : function(){
				if($(document).scrollTop() === 0){
					$('#float-nav').removeClass('flag-on');
				}
			}
		},
		footer : {
			language : function(){
				$('#footer .flags').removeClass('active');
			}
		}
	};

	$(window).on('scroll', function(e){
		reset.header.mobile();
		reset.header.dropdown();
		reset.header.search();
		reset.float.flag();
		reset.footer.language();
	});
	$('body').on('click', function(){
		reset.header.dropdown();
		reset.header.mobile();
		reset.header.search();
		reset.footer.language();
	});


	/** float navigaion **/
	$(window).on('scroll', function(){
		$('#float-nav').toggleClass('active', $(document).scrollTop() > 0);
	});


	/** footer **/
	//national flag switch
	$('#footer').on('click', '.flag.flag-cover', function(e){
		e.preventDefault();
		e.stopPropagation();
		$(this).closest('.flags').addClass('active');
	});

	//mobile toggle
	$('#footer').on('click', '.links .title', function(){
		$(this).closest('.footer-block').toggleClass('active');
		$(this).closest('.col').siblings().find('.footer-block').removeClass('active');
	});

	//subscribe email
	$('#footer').on('submit', 'form.mail', function(e){
		e.preventDefault()
		e.stopPropagation();
		$.ajax({
			type	: 'POST',
			//url     : 'dummy/submit.json',
			url		: '/newsletter-sub/subscribe/action/newsletter.php?m=subscribe',
			data	: $(this).serialize(),
			dataType: 'json',
			success: function(data) 
			{
				$('form.mail', '#footer')[0].reset();
				noticeCall('Thanks for subscribing!');
			}
		});
	});

	//goto top
	$(window).on('scroll', function(){
		$('.goto-top').toggleClass('transparent', $(document).scrollTop() <= bHeight);
	});
	$('#footer').on('click', '.goto-top', function(){
		gotoTop();
	});

	/** image lightbox **/
	if($('.img-lightbox').length > 0 && $('#modal-lightbox').length > 0 ){
		//append slides
		$('.img-lightbox').each(function(ind) {
			$(this).attr('data-lightbox-index', ind);
			var il = $(this).attr('src');
			if($(this).prop('tagName') !== 'IMG'){
				il = $(this).css('backgroundImage');
				il = il.substring(5, il.length - 2) || '';
			}		
			if(il && il !== ''){
				$('#modal-lightbox .swiper-lightbox .swiper-wrapper').append('\
					<li class="swiper-slide">\
						<div class="image">\
							<img src="' + il + '" alt="' + ind + '">\
						</div>\
					</li>\
				');
			}
		});

		//initalize swiper
		var lb = new Swiper ($('#modal-lightbox').find('.swiper-container'), {
			centeredSlides: true,
			slidesPerView: 1,
			loop: true,
	  		spaceBetween: 0,
			paginationClickable: true,
			pagination: '#modal-lightbox .swiper-pagination',
			paginationElement : 'li'
		});

		//open modal
		var li = 0;
		$('body').on('click', '[data-target="#modal-lightbox"]', function(){
			li = parseInt($(this).attr('data-lightbox-index')) || 0;
		});
		$('body').on('shown.bs.modal', '#modal-lightbox', function(){
			lb.update();
			lb.slideTo(li + 1);
		});
	}

	/** youtube player **/
	//load cover
	$('.yt-player.yt-auto').each(function(){
		$(this).find('.yt-cover').css('background-image', 'url("https://i.ytimg.com/vi/' + $(this).data('youtube') + '/hqdefault.jpg")');
	});

	//open modal
	$('body').on('click', '[data-target="#modal-youtube"]', function(){
		var ytId = $(this).data('youtube');
		var ytPa = $(this).data('youtube-para');
		if(ytId && ytId !== ''){
			$('#modal-youtube iframe').attr('src', 'https://www.youtube.com/embed/' + ytId + '?version=3&' + (ytPa ? ytPa : 'autoplay=1'));
		}
	});

	//close modal
	$('body').on('hide.bs.modal', '#modal-youtube', function(){
		$(this).find('iframe').attr('src', '');
	});

	//play video
	$('body').on('click', '.yt-player .yt-cover', function(){
		var yt = $(this).closest('.yt-player');
		var ytPa = yt.data('youtube-para');
		if(yt.data('toggle') !== 'modal'){
			yt.find('.yt-iframe').attr('src', 'https://www.youtube.com/embed/' + yt.data('youtube') + '?version=3&' + (ytPa ? ytPa : 'autoplay=1'));
			yt.addClass('active');
		}
	});

	/** swiper slides **/
	$('[data-toggle="swiper"]').each(function(){
		var sl = $(this).find('.swiper-slide').length;
    	//initalize swiper
		var sw = new Swiper ($(this).find('.swiper-container'), {
			keyboardControl: true,
			paginationClickable: true,
	        centeredSlides: $(this).data('swiper-multi') ? false : true,
	        slidesPerView: 'auto',
			loop: true,
			loopedSlides: sl,
	        spaceBetween: 0,
	        effect: $(this).data('swiper-effect') || 'slide',
			pagination: $(this).data('swiper-id') ? '[data-swiper-id="' + $(this).data('swiper-id') + '"] .swiper-pagination' : '.swiper-pagination',
			paginationElement : 'li',
			prevButton: $(this).data('swiper-id') ? '[data-swiper-id="' + $(this).data('swiper-id') + '"] .swiper-ctrl-prev' : '.swiper-ctrl-prev',
			nextButton: $(this).data('swiper-id') ? '[data-swiper-id="' + $(this).data('swiper-id') + '"] .swiper-ctrl-next' : '.swiper-ctrl-next',
			autoplay: $(this).data('swiper-auto') ? 5000 : null
		});
	    //index select
	    $(this).find('.swiper-index li').on('click', function(){
	    	sw.slideTo($(this).data('index'));
	    });
	});

	/** form **/
	//type file
	$('body').on('change', 'input[type=file]', function(){
		$(this).closest('.input-group').find('input[type="text"]').val($(this)[0].files[0].name);
	});

	/** tooltip **/
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip();	
	},1000);

	/** toogle class **/
	$('body').on('click', '[data-toggle-class]', function() {
		$($(this).data('toggle-target')).toggleClass($(this).data('toggle-class'));
	});

	/** seasonal **/
	//not show on current/close all
	if(!isStorage || (isStorage && !localStorage.getItem("seasonal"))){
		setTimeout(function(){
			$('.seasonal').each(function(){
				if($(this).data('nav') !== $('#body').data('nav')){
					$('.seasonal').addClass('active');
				}
			});
		}, 500);
	}

	//close all
	if(isStorage) {
		$('body').on('click', '.seasonal-close', function(){
			if($(this).data('close') === 'all'){
				localStorage.setItem('seasonal', $(this).closest('.seasonal').data('nav'));
			}
		});
	};


	//fb track

    $("a[data-fbq='checkout']").on('click',function () {
        fbq('track', 'checkout', {download_url: window.location.href});
    })
    $("a[data-fbq='add-to-cart']").on('click',function () {
        fbq('track', 'addToCart', {download_url: window.location.href});
    })
});