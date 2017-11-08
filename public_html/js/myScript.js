$(document).ready(function () {
    $('#whatever').hoverGrid();
});

jQuery(document).ready(function($) {
    $(".scroll").click(function(event){		
        event.preventDefault();
        $('html,body').animate({scrollTop:$(this.hash).offset().top -60},1000);
    });
});
