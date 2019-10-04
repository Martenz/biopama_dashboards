/* MAIN SCRIPOT TO LOAD CARDS APPLICATIONS */

jQuery(document).ready(function($) {


    function checkSize(){
        if ($( window ).width()<992){
          if ($('#toolbar-item-administration').length > 0){
            if ($('.main.navbar.navbar-default').length > 0){
              $('.main.navbar.navbar-default').css('top','35px');
              $('#block-mainnavigation .container-fluid').css('float','right');
              //console.log('moving');
            }      
          }
         }else{
              $('.main.navbar.navbar-default').css('top','0px');          
         }      

      if ($( window ).width()<1400){
        $('.toolbar-icons-right').addClass('relativeICons');
       }else{
        $('.toolbar-icons-right').removeClass('relativeICons'); 
       }

    }

  $( window ).resize(function() {
    checkSize();
  });

   checkSize();

  //.. apply odd classes to row_class if width size greater then 991px;
  if ($( window ).width()>992){
    $('.icons-rows:odd').each(function(){

      var body = $(this).find('.card-body')[0].innerHTML;
      var icon = $(this).find('.icons-left-col')[0].innerHTML;

      var htmlrow = '<div class="row icons-rows">\
                      <div class="col-6 text-left-col">\
                        <div class="card border-info">\
                          <div class="card-body">\
                           |||card-body|||\
                          </div>\
                         </div>\
                      </div>\
                      <div class="col-6 icons-right-col">\
                      |||icon|||\
                      </div>\
                    </div>';

      htmlrow = htmlrow.replace('|||card-body|||', body).replace('|||icon|||', icon);

      $(this).html(htmlrow);
    });
  }

  var first_load = true;
  var sequential = 0;

  //hide cards
  // setTimeout(function(){
  //   $('#landing_top_cards').fadeIn(3000);
  // },1000);

  //
  // var bkgd_imgs = [ '/modules/custom/biopama_dashboards/images/bkgd_satellite_01.jpg' ,
  //                  '/modules/custom/biopama_dashboards/images/bkgd_satellite_03.jpg',
  //                  '/modules/custom/biopama_dashboards/images/bkgd_satellite_05.jpg',
  //                  '/modules/custom/biopama_dashboards/images/bkgd_satellite_02.jpg' ];

  var bkgd_imgs = [];
  $('.background-images-list').each(function(){
      bkgd_imgs.push($(this).text());
  });

  //preload images source test
  $.each(bkgd_imgs,function(idx,imgurl){
    //$('#preload-images').append('<img src="'+imgurl+'"/>');
    //$('.masthead-img').css('background-image', 'url("'+bkgd_imgs[idx]+'")' );
  });

  setTimeout(resetHeaderBkgd(), 1000);

  function scrollFunction() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          document.getElementById("myBtn_scrollTop").style.display = "block";
          //$('nav').fadeOut(2000);
          //$(".header-table-wrap").fadeOut(2000);
      } else {
          document.getElementById("myBtn_scrollTop").style.display = "none";
          //$('nav').fadeIn(2000);
      }

      if (document.documentElement.scrollTop == 0 ){
        //resetHeaderBkgd();
        //setTimeout(function(){ $(".header-table-wrap").fadeIn(2000);},1000);
      }
  }



    function resetHeaderBkgd(){
      var idx = Math.floor(Math.round(Math.random() * (bkgd_imgs.length - 1),1));
      //sequential mode, initialized evry refresh of the page
      //idx = sequential % bkgd_imgs.length;
      sequential+=1;

      if (first_load){
          // setTimeout(function(){
          //   $('.masthead-linear').fadeOut(1000);
          //   first_load = false;
          //   $('.masthead-img').css('background-image', 'url("'+bkgd_imgs[idx]+'")' );
          //   setTimeout(function(){    $('.masthead-img').fadeIn(3000);},1500);
          // },1500);

          // setTimeout(function(){
          //   $('.masthead-linear').fadeOut(3000,function(){
          //     first_load = false;
          //     $('.masthead-img').css('background-image', 'url("'+bkgd_imgs[idx]+'")' );
          //     setTimeout(function(){ $('.masthead-img').fadeIn(3000);},200);
          //   });
          // },1000);
          $('.masthead-img').css('background-image', 'url("'+bkgd_imgs[idx]+'")' );
          setTimeout(function(){ $('.masthead-img').fadeIn(6000);},200);

      }else{
            // $('.masthead-img').fadeOut(2000,function(){
            //     $('.masthead-img').css('background-image', 'url("'+bkgd_imgs[idx]+'")' );
            //     $('.masthead-img').fadeIn(4000);
            // });

      }
    }


  // When the user clicks on the button, scroll to the top of the document
  function topFunction() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      resetHeaderBkgd();
  }

  var hover_timeout;


//$( document ).ready(function() {

  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    //alert('navigating with mobile');
    console.log('mobile browsing');
  }

    // When the user scrolls down 20px from the top of the document, show the button
  //resetHeaderBkgd();

  $('div.card-deck .card-body').hover(function(){
    //   $(this).find('p.card-text').slideDown(1500);
    var elem = $(this).find('p.card-text')[0];
    hover_timeout = setTimeout(function(){
        console.log(elem);
        // $($(elem)).slideDown(1500);
        $($(elem)).css('opacity', 0)
        .slideDown(1500)
        .animate(
          { opacity: 1 },
          { queue: false, duration: 1500 }
        );

    },500);
  },function(){
    //   $(this).find('p.card-text').slideUp(1500);
      clearTimeout(hover_timeout);
      // $(this).find('p.card-text').slideUp(1500);
      $(this).find('p.card-text').css('opacity', 1)
        .slideUp(1500)
        .animate(
          { opacity: 0 },
          { queue: false, duration: 1500 }
        );
  });


  $('.dashboard .card').hover(function(){
      $(this).addClass('card-zoomed');
  },function(){
      $(this).removeClass('card-zoomed');
  });

  $('#myBtn_scrollTop').on('click',function(){topFunction();});

  window.onscroll = function() {scrollFunction()};

  //background CARDS
  $('.hidden_background').each(function(){
    var img_url = $(this).html();
    if (img_url != ""){
      $(this).parent().css('background-image','url('+img_url+')');
      $(this).parent().css('background-size','cover');
      //$(this).parent().find('.card-body').css('margin-top','60%');
    }
  });

  if ($('.icons-rows').length < 1 ) {
    $('.title-element-fullwidth').hide();
  }


});
