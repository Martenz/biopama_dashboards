// JS PAME tools

jQuery(document).ready(function($) {
//==============================================

 console.log('tools js lib loaded.');

 $('.assessment-tools-more').on('click',function(){
   $(this).closest('.card').find('.assessment-tools-details').fadeToggle('slow');
 });

// add blank target to href links in more text
$('.h-card-pame .assessment-tools-details a').not('a[download]').each(function(){
  $(this).attr('target','_blank');
})
//==============================================
});
