$(document).ready(function () {

$(document).click(function (event) {
    var clickover = $(event.target);
    var _opened = $(".navbar-collapse").hasClass("show");
    if (_opened === true && !clickover.hasClass("navbar-toggler")) {
        $(".navbar-toggler").click();
    }
});
    $('#whatever').hoverGrid();

    var $item = $('.carousel .carousel-item'); 
    var $wHeight = $(window).height();
    $item.eq(0).addClass('active');
    $item.height($wHeight); 
    $item.addClass('full-screen');
    
    $('.carousel img').each(function() {
      var $src = $(this).attr('src');
      $(this).parent().css({
        'background-image' : 'url(' + $src + ')', 
      });
      $(this).remove();
    });
    
    $(window).on('resize', function (){
      $wHeight = $(window).height();
      $item.height($wHeight);
    });
    
    $('.carousel').carousel({
      interval: 6000,
      pause: "false"
    });


});

jQuery(document).ready(function($) {


    jQuery('.post').addClass("hidden").viewportChecker({
        classToAdd: 'visible my-animation animated fadeIn',
        offset: 100
       });
       jQuery('.post2').addClass("hidden").viewportChecker({
        classToAdd: 'visible my-animation animated fadeInLeft',
        offset: 100
       });

       jQuery('.post3').addClass("hidden").viewportChecker({
        classToAdd: 'visible my-animation animated fadeInRight',
        offset: 100
       });
    
       $(".scroll").click(function(event){		
        event.preventDefault();
        $('html,body').animate({scrollTop:$(this.hash).offset().top -60},1000);
        $(this.hash).addClass("active");
        
    });
    $(".big-btn").click(function(event){
        event.preventDefault();
        $('html,body').animate({scrollTop:$(this.hash).offset().top -115},1000);
    });
});
