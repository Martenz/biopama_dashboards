// JS PAME tools

jQuery(document).ready(function($) {
//==============================================

 console.log('tools js lib loaded.');

 $('.assessment-tools-more').on('click',function(){
   $(this).closest('.card').find('.assessment-tools-details').fadeToggle('slow');
 });


//==============================================
});
