/**
 * Created by Admin on 2016/7/27.
 */
window.$ = HTMLElement.prototype.$ = function(selector){
    var r = (this === window ? document : this).querySelectorAll(selector);
    return r.length === 0 ? null : r.length === 1 ? r[0] : r;
}
HTMLElement.prototype.hasClass = function(className){
    if(this === window){
        throw new Error('this must be elem!');
    }else if(this.classList){
        return this.classList.contains(className);
    }else{
        return new RegExp('(^|)' + className + '( |$)', 'gi').test(this.className);
    }
}
var img = [{'index':0,"src":"Images/carousel_1.jpg"},
    {'index':1,"src":"Images/carousel_2.jpg"},
    {'index':2,"src":"Images/carousel_3.jpg"},
    {'index':3,"src":"Images/carousel_4.jpg"}
];
var carousel = {
    LIWIDTH : 786,
    distance : 0,   //保存本次移动的总距离
    DURATION : 1000,    //保存本次移动的总时间
    STEPS : 100,    //本次移动的总步数
    step : 0 , //步长，每一次移动的距离，distance/STEPS
    INTERVAL : 0 , //步频，每一次移动的时间，DURATION/STEPS
    moved : 0 , //用来控制动画的停止
    timer : null,
    WAIT : 3000,
    canAuto : true,
    init:function(){
        var me = this;
        this.INTERVAL = this.DURATION / this.STEPS;
        this.updateView();
        //点击数字时，调用动画
        $("#carouselItms").addEventListener('mouseover',function(e){
            //判断是否为LI，并且当前LI没有active样式属性
            if(e.target.nodeName === 'LI' && !e.target.hasAttributes('active')){
                var starti = img[0].index + 1;
                var endi = e.target.innerHTML;
                me.move(endi - starti);
            }
        });
        $("#carousel").addEventListener('mouseover',function(){
            this.canAuto = false;
        });
        $("#carousel").addEventListener('mouseout',function(){
            this.canAuto = true;
        });
        this.autoPlay();
    },
    updateView:function(){
        var imgList = $('#carousel'), imgItems = $("#carouselItms");
        var len = img.length;
        imgList.style.width = this.LIWIDTH * len + 'px';
        for(var i = 0 , strImg = '', strItms = '' ; i < len ; i++){
            strImg += '<li><a href="#"><img src= "' + img[i].src + '" alt=""></a></li>';
            strItms += '<li>'+ ( i + 1 ) +'</li>';
        }
        imgList.innerHTML = strImg;
        imgItems.innerHTML = strItms;
        imgItems.$('li')[img[0].index].className = 'active';
    },
    move:function(n){
        if(this.timer){
            clearTimeout(this.timer);
            this.timer = null;
            this.moved = 0;
            $("#carousel").style.left = '';
        }
        this.distance = this.LIWIDTH * n;
        this.step = this.distance / this.STEPS;
        if(n < 0 ){ //提前整理好数组
            var dels = img.splice(img.length+n,-n);
            [].unshift.apply(img,dels);
            $("#carousel").style.left = this.LIWIDTH * n + 'px';
            this.updateView();
        }
        this.timer = setTimeout(this.moveStep.bind(this,n),this.INTERVAL);

    },
    moveStep:function(n){
        var left = parseFloat(getComputedStyle($("#carousel")).left);
        $("#carousel").style.left = left - this.step + 'px';
        this.moved++;
        if(this.moved < this.STEPS){
            this.timer = setTimeout(this.moveStep.bind(this,n),this.INTERVAL);
        }else{
            clearTimeout(this.timer);
            this.timer = null;
            this.moved = 0;
            if(n > 0){//将数组进行调整
                var dels = img.splice(0,n);
                [].push.apply(img,dels);
                this.updateView();
            }
            $("#carousel").style.left = '';
            this.autoPlay();
        }
    },
    autoPlay:function(){
        var me = this;
        this.timer = setTimeout(function(){
            if(me.canAuto){
                me.move(1);
            }else{
                me.autoPlay();
            }
        },this.WAIT);
    }

};
var TabSwitch = function(){
    this.distance = 0;  //保存本次移动的总距离
    this.DURATION = 500;    //保存本次移动的总时间
    this.STEPS = 100;    //本次移动的总步数
    this.step = 0 ; //步长，每一次移动的距离，distance/STEPS
    this.INTERVAL = 0 ; //步频，每一次移动的时间，DURATION/STEPS
    this.moved = 0 ; //用来控制动画的停止
    this.timer = null;
    this.arr = [];
};
TabSwitch.prototype = {
    init:function(){
        var me = this;
        $("#wrap-box").style.height = getComputedStyle($("#wrap-box")).height;
        var items = $("#wrapItems > li");
        for(var i =0, len = items.length; i < len ; i++){
            this.arr[i] = i;
        }
        $("#wrapItems").addEventListener("click",function(e){
            if(e.target.nodeName === 'LI' && !e.target.hasClass("active")){
                this.$('li[class="active"]').removeAttribute("class");
                e.target.className = "active";
                for(var i = 0 , n= 0, len = me.arr.length ; i < len ; i++){
                    if(me.arr[i] == e.target.dataset.toggle.slice(-1)){
                        n = i ;
                    }
                }
                console.log("n="+n);
                var src = e.target.dataset.toggle.slice(0,-1);
                for(i = 0 ; i < n ; i++ ){
                    me.distance += parseFloat(getComputedStyle($(src+me.arr[i])).height);
                    console.log("distance="+me.distance);
                }
                me.move(n , src);

            }
        });
    },
    move:function(n , src){
        this.INTERVAL = this.DURATION / this.STEPS ;
        this.step = this.distance / this.STEPS ;
        if(this.timer){
            clearTimeout(this.timer);
            this.timer = null;
            this.moved = 0;
            this.distance = 0;
            $("#wrap").style.top = '';
        }
        this.timer = setTimeout(this.moveStep.bind(this,n , src),this.INTERVAL);
    },
    moveStep:function(n , src){
        var top = parseFloat(getComputedStyle($("#wrap")).top);
        $("#wrap").style.top = top - this.step + "px";
        this.moved++;
        if(this.moved < this.STEPS){
            this.timer = setTimeout(this.moveStep.bind(this,n , src),this.INTERVAL);
        }else{
            clearTimeout(this.timer);
            this.timer = null;
            this.moved = 0;
            this.distance = 0;
            $("#wrap").style.top = '';
            var del = this.arr.splice(0,n);
            this.arr = this.arr.concat(del);
            console.log(this.arr);
            for(var i = 0, len = del.length ; i < len ; i++){
                var t = $(src + del[i]);
                $("#wrap").appendChild(t);
            }
        }
    },
}
window.addEventListener('load',function(){
    carousel.init();
    var tab = new TabSwitch();
    tab.init();
});