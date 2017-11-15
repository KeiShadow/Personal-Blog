$(document).ready(function () {
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

   
    $(".scroll").click(function(event){		
        event.preventDefault();
        $('html,body').animate({scrollTop:$(this.hash).offset().top -60},1000);
    });
    $(".big-btn").click(function(event){
        event.preventDefault();
        $('html,body').animate({scrollTop:$(this.hash).offset().top -115},1000);
    });
});
