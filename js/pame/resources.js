// Resources JS

console.log('Resources JS .. TODO')

mdocs = ['docx','doc','docb'];
mexcel = ['xlsx','xls','xlm'];

(function ($, Drupal) {
	Drupal.behaviors.pameviews = {
		attach: function (context, settings) {

    //Drupal.attachBehaviors($(".view-pame-resources").get(0));
    //Drupal.attachBehaviors($(".view-pame-management").get(0));

	$('.resources-doc-thumb').once('updated-view').each(function(){
		
		var fpath = $(this).html();
		var ext = fpath.substr(fpath.lastIndexOf('.') + 1).replace(/\s/g,'');
		console.log(ext);
		
		var html_code = '';
		if (ext.toLowerCase() == 'pdf'){
			//$(this).html( '<img data-pdf-thumbnail-file="'+fpath+'" src="pdf.png" data-pdf-thumbnail-height="150">' );
			html_code = '<a href="'+fpath+'" target="_blank"><i class="far fa-file-pdf"></i>' + '<img class="resources-thumb-img" data-pdf-thumbnail-file="'+fpath+'"> .pdf</a>'; 			
		}else if( mexcel.indexOf( ext.toLowerCase() ) > -1 ){
			html_code = '<a href="'+fpath+'" download><i class="far fa-file-excel"></i> .xlsx</a>'; 						
		}else if( mdocs.indexOf( ext.toLowerCase() ) > -1 ){
			html_code = '<a href="'+fpath+'" download><i class="far fa-file-word"></i> .docx</a>'; 						
		}else{
			html_code = '<a href="'+fpath+'" download><i class="far fa-file-alt"></i> .other</a>'; 						
		}
		
		$(this).html( html_code );
		createPDFThumbnails();
		$(this).fadeIn(1500);
		
	});
		}
	};
})(jQuery, Drupal);