/**
 * jQuery FUNCTIONS 2014 ultralysis
 **/
function loadjscssfile(filename, filetype){

    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("data-pace-options",'{ "ajax": true, "document": true }');
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}
var hasPaceLoader = true;
loadjscssfile("/assets/js/ultra/pace.min.js", "js"); //dynamically load "javascript.php" as a JavaScript file
//loadjscssfile("/assets/css/pace.css", "css"); ////dynamically load and add this .css file