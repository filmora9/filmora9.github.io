$(function($){
    $.FMcookie = function(name, value, options) {
        if (typeof value != 'undefined') { // name and value given, set cookie
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            // CAUTION: Needed to parenthesize options.path and options.domain
            // in the following expressions, otherwise they evaluate to undefined
            // in the packed version for some reason...
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else { // only name given, get cookie
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    };
    var  isLogin=false;
    var  token=$.FMcookie('auth_token');
    var getuserInfo=function(data,callback){
        var url='//effects.wondershare.com/de/api/user/profile?jsonp=1';
        $.ajax({
            url:url,
            type:'get',
            data:data,
            dataType:'jsonp',
            beforeSend:function(){
    
            },
            success:function(data,textStatus,resObj){
                if(data.code === 0){
                    if(callback && typeof callback === 'function'){
                        callback(data.data)
                    }
                    $('.user-bar').removeClass('is-guest');
                    $('.user-bar .action-txt').addClass('hidden');
                    $('.user-bar .menu-icon').removeClass('hidden');
                    $('.user-panel').find('.user-avatar').attr('src',data.data.avatar)
                    $('.user-name .text-email').text(data.data.email);
                    $('.user-name .text-name').text(data.data.nickname);
                }else if(data.code === 10003){
                    /*判断地址栏需不需要弹出登录注册框*/
                    if(window.location.href.indexOf('popLogin') > -1){
                        loginShow('login');
                    }else if(window.location.href.indexOf('popRegister') > -1){
                        loginShow('register');
                    }
                }else{
                    console.log('获取用户信息失败')
                }
            },
            error:function(){
    
            },
            complete:function(){
                clickFlag=true;
                $('.user-bar .action-txt').attr('data-click',0);
            }
        })
    }
    if(token){
        var data={
            force_update:0
        }
        getuserInfo(data,function(){
            isLogin=true;           
            
        });
    }
      
    var loginShow=function(flag){
        $("#login").empty();
    
        if(typeof flag =='undefined'){
            //网页端
            flag='login';
        }
        $("#login").append("<iframe id='iframe-login' width='100%'' height='100%' frameborder='0' src='//effects.wondershare.com/de/login.html?from_product=1#"+flag+"'></iframe>");
    };
    
    var loginRemove=function(){
    
        var norefres=true;//登陆成功后是否需要刷新页面
        var dialogParam='';//如果是 login register 登陆登出后url地址需要刷新
    
        //判断是否需要重置url地址
        if(window.location.href.indexOf('popLogin') > -1){
                dialogParam='login'
        }else if(window.location.href.indexOf('popRegister') > -1){
                dialogParam='register'
        }else if(window.location.href.indexOf('popReset') > -1){
                 dialogParam='reset'
        }
    
        window.addEventListener('message', function(messageEvent) {
            if(messageEvent.data=='loginRemove'){
                $("#login").empty();
            }
            if(messageEvent.data.name=='loginSuccess'||messageEvent.data.name=='registerSuccess'||messageEvent.data.name=='resetSuccess'){
                $("#login").empty();
                setTimeout(function(){
                    if(norefres){
                        getuserInfo([]);
                    }else{
                        if(dialogParam){
                            window.location.href=window.config.site_domain;
                        }else{
                            window.parent.location.reload();
                        }
                    }
                },1000)
    
            }
        }, false);
    };
    loginRemove();  

    $('body').on('click', '.user-bar .menu', function(e) {
        e.stopPropagation()
        var pn = $('.panel');
        var pc = '[data-panel="' + $(this).data('menu') + '"]';
        pn.filter(':not(' + pc + ')').removeClass('active');
        if($(this).attr('data-click') === '1'){
            return false;
        }
        if($(this).closest('.user-bar').hasClass('is-guest')){
            loginShow()
            return false;
        }else{
            pn.filter(pc).toggleClass('active');
        }
    });    
    
    $(window).on('scroll', function(){
       $('.user-panel .panel').removeClass('active');
    });

    $('body').on('click', function(){
        $('.user-panel .panel').removeClass('active');
    }); 
    
    $('.logout>a').attr('href','//effects.wondershare.com/de/user/login-out.html?redirect='+window.location.href); 

    var third_url={
        'google_login_url':'https://account.wondershare.com/google/connect?brand=filmora&platform=web&callback=sync&web=filmora.wondershare.com/de&redirect=https://effects.wondershare.com/de/synch-login.html?redirect='+window.location.href,
        'facebook_login_url':'https://account.wondershare.com/facebook/connect?brand=filmora&platform=web&callback=sync&web=filmora.wondershare.com/de&redirect=https://effects.wondershare.com/de/synch-login.html?redirect='+window.location.href,
        'twitter_login_url':'https://account.wondershare.com/twitter/connect?brand=filmora&platform=web&callback=sync&web=filmora.wondershare.com/de&redirect=https://effects.wondershare.com/de/synch-login.html?redirect='+window.location.href
    }

    window.addEventListener('message', function(messageEvent) {
            if(messageEvent.data.name == 'third-facebook'){
                window.location.href=third_url['facebook_login_url']
            }
            if(messageEvent.data.name == 'third-twitter'){
                window.location.href=third_url['twitter_login_url']
            }
            if(messageEvent.data.name == 'third-google'){
                window.location.href=third_url['google_login_url']
            }
    }, false);
});
    

    
    