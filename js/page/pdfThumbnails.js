/**
 * Find all img elements with data-pdf-thumbnail-file attribute,
 * then load pdf file given in the attribute,
 * then use pdf.js to draw the first page on a canvas, 
 * then convert it to base64,
 * then set it as the img src.
 */
var createPDFThumbnails = function(){

    if (typeof pdfjsLib === 'undefined') {
        throw Error("pdf.js is not loaded. Please include it before pdfThumbnails.js.");
    }
    //pdfjsLib.disableWorker = true;
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    // select all img elements with data-pdf-thumbnail-file attribute
    var nodesArray = Array.prototype.slice.call(document.querySelectorAll('img[data-pdf-thumbnail-file]'));

    nodesArray.forEach(function(element) {
        var filePath = element.getAttribute('data-pdf-thumbnail-file').trim();
        var imgWidth = element.getAttribute('data-pdf-thumbnail-width');
        var imgHeight = element.getAttribute('data-pdf-thumbnail-height');

        pdfjsLib.getDocument(filePath).promise.then(function (pdf) {
            pdf.getPage(1).then(makeThumb).then(function (canvas) {
                element.src = canvas.toDataURL();
            });
        }).catch(function() {
            console.log("pdfThumbnails error: could not find or open document " + filePath + ". Not a pdf ?");
        });
        
        
    });
    
    function makeThumb(page) {
        // draw page to fit into 96x96 canvas
        var vp = page.getViewport({ scale: 1, });
        var canvas = document.createElement("canvas");
        var scalesize = 1;
        canvas.width = vp.width * scalesize;
        canvas.height = vp.height * scalesize;
        var scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);
        //console.log(vp.width, vp.height, scale);
        return page.render({ canvasContext: canvas.getContext("2d"), viewport: page.getViewport({ scale: scale }) }).promise.then(function () {
            return canvas; 
        });
    }
};

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    createPDFThumbnails();
} else {
    document.addEventListener("DOMContentLoaded", createPDFThumbnails);
}
