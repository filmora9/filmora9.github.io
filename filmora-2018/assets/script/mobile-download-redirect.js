 /****************************************************
     *  project: filmora website 2018 main pages         *
     *  description: mobile download redirect            *
     *  author: mazq@wondershare.cn  zl                  *
     *  update: 20200113
     *  update description: add web redirect*
     ****************************************************/
    /* global $ ga */
    $(function () {console.log("ready")
        // $(document).find(".sys-win a").addClass("win-jump")
        // $(document).find(".sys-mac a").addClass("mac-jump")
        // $(document).find(".sys-win").addClass("win-jump")
        // $(document).find(".sys-mac").addClass("mac-jump")
        $('body').on('click', 'a', function (e) {
            var link,that

            // mobile detect
            if (navigator.userAgent.match(/IEMobile|BlackBerry|Android|iPod|iPhone|iPad/i) && $(this).attr('href')) {
                // if (document.documentElement.clientWidth < 800 && $(this).attr('href')) {
                var link = $(this).attr('href').toLowerCase().replace(/_/g, '-').replace(/-/g, '')
                var path = {
                    check: true,
                    product: 'none',
                    pool: [{
                        type: 'product',
                        check: false,
                        pool: [ 'filmora-pro', 'filmora-scrn', 'filmora-go', 'filmora-biz','filmora-9', 'filmora']
                    }, {
                        type: 'base',
                        check: false,
                        pool: ['download.wondershare.com/', 'effects.wondershare.com/download/',]
                    }, {
                        type: 'format',
                        check: false,
                        pool: ['.exe', '.dmg', '.zip', '.pkg',]
                    }]
                }
                // path detect
                path.pool.forEach(function (t1) {
                    t1.pool.forEach(function (t2) {
                        if (!t1.check && link.indexOf(t1.type === 'product' ? t2.replace(/-/g, '') : t2) > -1) {
                            t1.check = true
                            if (t1.type === 'product') path.product = t2
                        }
                    })
                    if (path.check && !t1.check) path.check = false
                })
                if (path.check) {
                    e.stopPropagation()
                    e.preventDefault()
                    // if (path.product === path.pool[0].pool[path.pool[0].pool.length - 1]) path.product = path.pool[0].pool[0]
                    // stackoverflow.com/questions/28765806/
                    // if(typeof ga != 'undefined'){
                    //  ga(ga.getAll()[0].get('name') + '.send', 'event', $(this)[0].pathname, 'Download', window.location.pathname)
                    // }


                    if(link.indexOf("filmora9biz")>-1){
                        path.product = "filmora-biz"
                    }

                    window.location.href = (path.product !== "filmora-9" && path.product !== "filmora") ? 'https://filmora.wondershare.com/filmora-mobile-download-all.html?product=' + path.product : 'https://effects.wondershare.com/activity/mobile-activity.html?type=filmora_down'
                }
            } else {
                console.log('not mobile!')
                try {
                    link = $(this).attr('href').toLowerCase().replace(/_/g, '-').replace(/-/g, '')
                    that = $(this)
                    jumpPage(link,that)
                }catch (e) {
                    console.log(e)
                }

                function jumpPage(link,that) {
                    if(link.indexOf("html")<0){
                        // if( that.hasClass("win-jump")){
                        if(link.indexOf("exe")>0){
                            if(link.indexOf("filmorapro")>0){
                                window.open("https://filmora.wondershare.com/download-filmorapro-windows.html")
                            }else if(link.indexOf("filmorascrn")>0){
                                window.open("https://filmora.wondershare.com/download-filmorascrn-windows.html")
                            }else if(link.indexOf("filmora")>0 && link.indexOf("filmorapro")<0 && link.indexOf("filmorascrn")<0){
                                window.open("https://filmora.wondershare.com/download-filmora9-win.html")
                            }else if(link.indexOf("filmorafull")>0){
                                window.open("https://filmora.wondershare.com/download-filmora9-win.html")
                            }

                            // }else if(that.hasClass("mac-jump")){
                        }else if(link.indexOf("zip")>0 || link.indexOf("pkg")>0 || link.indexOf("dmg")>0){
                            if(link.indexOf("filmorapro")>0){
                                window.open("https://filmora.wondershare.com/download-filmorapro-mac.html")
                            }else if(link.indexOf("filmorascrn")>0){
                                window.open("https://filmora.wondershare.com/download-filmorascrn-mac.html")
                            }else if(link.indexOf("filmora")>0 && link.indexOf("filmorapro")<0 && link.indexOf("filmorascrn")<0){
                                window.open("https://filmora.wondershare.com/download-filmora9-mac.html")
                            }else if(link.indexOf("filmorafull")>0 && $(this).hasClass("sys-mac")){
                                window.open("https://filmora.wondershare.com/download-filmora9-mac.html")
                            }
                        }
                    }
                }

            }
        })
    })