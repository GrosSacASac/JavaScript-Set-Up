# DOM Style Guide

## creation of DOM Object

    always use document.createElement
        * works for all the DOM elements
        * dynamic
        
    never use new Audio(), new Option(), new Image etc
        * adds more globals to remember
        * limited elements have this syntax sugar support
        * sometimes saves a few characters --> Use a minifier
    
