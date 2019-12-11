// Resources JS

console.log('Resources JS .. TODO')

mdocs = ['docx','doc','docb'];
mexcel = ['xlsx','xls','xlm'];

jQuery(document).ready(function($) {

	$('.resources-doc-thumb').each(function(){
		
		var fpath = $(this).html();
		var ext = fpath.substr(fpath.lastIndexOf('.') + 1);
		//alert(ext);
		
		var html_code = '';
		if (ext.toLowerCase() == 'pdf'){
			//$(this).html( '<img data-pdf-thumbnail-file="'+fpath+'" src="pdf.png" data-pdf-thumbnail-height="150">' );
			html_code = '<a href="'+fpath+'" target="_blank"><i class="far fa-file-pdf"></i>' + '<img class="resources-thumb-img" data-pdf-thumbnail-file="'+fpath+'"></a>'; 			
		}else if( mexcel.indexOf( ext.toLowerCase() ) > -1 ){
			html_code = '<a href="'+fpath+'" download><i class="far fa-file-excel"></i></a>'; 						
		}else if( mdocs.indexOf( ext.toLowerCase() ) > -1 ){
			html_code = '<a href="'+fpath+'" download><i class="far fa-file-word"></i></a>'; 						
		}else{
			html_code = '<a href="'+fpath+'" download><i class="far fa-file-alt"></i></a>'; 						
		}
		
		$(this).html( html_code );
		createPDFThumbnails();
		$(this).fadeIn(1500);
		
	});
	
});