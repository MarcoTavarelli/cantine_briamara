$(document).ready(function () {

    $(window).scroll(function (event) {

        var scroll = $(window).scrollTop();
        var sectionHeight = $(this).innerHeight();
        var sectionHalf_height = sectionHeight/2;
        var sectionHalf_heightHalf = sectionHalf_height/2;

        //////////////////////
        // 1.0 - Animazioni on scroll
        // funzione che agisce su tutte le section e se trova una classe 
        // fa scattare l'animazione di quella determinata classe quando la pagina scrolla 
        //di un ammontare pari top offset della sezione - metà della sua altezza ( in modo che si attivi un pelo prima)
        $( "section" ).each(function() {

            if ( scroll >= $(this).offset().top - (sectionHalf_heightHalf + sectionHalf_height) && !$(this).hasClass('first_animate') ){
                //alert(sectionHeight + ' , ' + sectionHalf_heightHalf);
                // animazione fadeInLeft
                $(this).find('.bounce-l').removeClass('fadeOut') && $(this).find('.bounce-l').addClass('fadeInLeft');
                // animazione fadeIn
                $(this).find('.fade-in').removeClass('fadeOut') && $(this).find('.fade-in').addClass('fadeIn');
                // animazione fadeInUp
                $(this).find('.fade-in-up').removeClass('fadeOut') && $(this).find('.fade-in-up').addClass('fadeInUp');
                // animazione pulse
                $(this).find('.pulse_effect').removeClass('fadeOut') && $(this).find('.pulse_effect').addClass('pulse');
            }
            else if ( scroll < $(this).offset().top + sectionHalf_height ){
                //quando si scrolla indietro si si ri nascondo gli elementi
                // per poter ri fare l'animazione con un nuovo scroll in basso
                $(this).find('.animated').addClass('fadeOut');
            }
            else if ($(this).hasClass('first_animate')) {
                // per fare in modo che venga animata la prima sezione senza bug
                $(this).find('.animated').removeClass('fadeOut');
            }

        });
        //////////////////////

        //////////////////////      
        // 2.0 - sticky portfolio filtro
        $( "section" ).each(function() {
            var portfolio_top = $(this).offset().top;
            var portfolio_h = $(this).height();
            var portfolio_offset = portfolio_top + portfolio_h;
            var nav_h = $('#main_nav').height();

            if (scroll < portfolio_top && $(this).hasClass('portfolio_section')) {
            // alert('portfolio_top: ' + portfolio_top );
                $('.portfolio_filter').removeClass('fixed-top');
                $('.portfolio_filter').css('top' , 0);
                $('.portfolio_filter').removeClass('sticky_filter');
            }
            else if (scroll > portfolio_h && $(this).hasClass('portfolio_section')){
            //alert( 'portfolio_offset: ' + portfolio_offset );
                $('.portfolio_filter').addClass('fixed-top');
                $('.portfolio_filter').css('top' , nav_h);
                $('.portfolio_filter').addClass('sticky_filter');
            }

            if (scroll > portfolio_offset && $(this).hasClass('portfolio_section')){
                $('.portfolio_filter').removeClass('fixed-top');
                $('.portfolio_filter').css('top' , 0);
                $('.portfolio_filter').removeClass('sticky_filter');
            }
        });// each section fine
        //////////////////////

    });// scroll function fine
    
    //////////////////////  
    // 1.1 - Animazioni on scroll
    // per evitare che faccia due fade la prima volta che si scrolla
    $('.animated').addClass('fadeOut');
    // 1.2 - Animazioni on scroll
    // per fare in modo che venga animata la prima sezione senza bug
    $('.first_animated').find('.animated').removeClass('fadeOut');
    //////////////////////
    
    ////////////////////// 
    // 2.0 - open view page
    // click sul link => a seconda del parametro name del link 
    //l'ovelay carica una vista piuttosto che un altra (che ha il nome del name passato)
    $(".spin_openView").click(function () {
        var url = $(this).attr("data-url");
        var name = $(this).attr("data-name");
        // alert(name);
        $('.overlay_section').attr('id' , url);
        var pageId = '#' + url;
        // alert(pageId);
        $('#navigation_bar').attr('data-name' , name);
        $(pageId).find('#navigation_bar').load('../components/breadcrumbs/breadcrumbs.html');
        $(pageId + ' .main_wrapper').load('../pages/'+ url + '.html');
        $('body').css('overflow','hidden');
        $(pageId).fadeIn();
    });
    //////////////////////

});// document ready fine

////////////////////// 
//2.1 - open view page
// chiude la vista con il name passato
$(".overlay_section").on("click", "button", function (event) {
    // var myparent = $(this).parent().attr('id');
    var url = $('.overlay_section').attr("id");
    var pageId = '#' + url;
    //alert(pageId);
    if ($(this).attr('data-name') == 'closeOverlay') {
        $(pageId).find('#navigation_bar').empty();
        $(pageId + ' .main_wrapper').empty();
        $('body').css('overflow','scroll');
        $(pageId).fadeOut();
    }
});
//////////////////////

////////////////////// 
    // 3.0 - Parallax on mouse move
    // effetto di parallasse quando si muove il cursore sulla sezione
    $(".parallaxMouseMove_container").mousemove(function(e) {
        parallaxIt(e, ".container", -100);
        parallaxIt(e, ".parallaxMouseMove_item", -30);
      });
      
      function parallaxIt(e, target, movement) {
        var $this = $(".parallaxMouseMove_container");
        var relX = e.pageX - $this.offset().left;
        var relY = e.pageY - $this.offset().top;
      
        TweenMax.to(target, 1, {
          x: (relX - $this.width() / 2) / $this.width() * movement,
          y: (relY - $this.height() / 2) / $this.height() * movement
        });
      }
    ////////////////////// 


//////////////////////
// 4.0 - Anchor Smooth Scroll
// smooth scrool dei link che mandano alle ancore interne alla pagina
$('.smooth_scroll[href^="#"]').on('click',function (e) {
    e.preventDefault();

    var target = this.hash;
    var $target = $(target);

    $('html, body').stop().animate({
        'scrollTop': $target.offset().top
    }, 900, 'swing', function () {
        window.location.hash = target;
    });
});
//////////////////////

//////////////////////
// 5.0 - Image Hover
// decostruisco la path e la ricostruisco con la path dell'hover corrispondente
$('.mouseHover_img').each(function(){
    var src = $(this).find('img').attr('src');
    var splitSrc = $(this).find('img').attr('src').split("/");
    var imagesDir =(splitSrc[1]);
    var pageDir =(splitSrc[2]);
    var sectionDir =(splitSrc[3]);
    var fileName =(splitSrc[4]);

    $(this).hover(
        function() {
            //alert(fileName);
            $(this).find('img').attr('src' , '../' + imagesDir + '/' + pageDir + '/' + sectionDir + '/' + 'hover_' + fileName );
        }, function() {
            $(this).find('img').attr('src' , src);
        }
    )
});
//////////////////////
