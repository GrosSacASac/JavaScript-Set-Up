# DOM Style Guide
  

## The Document Object Model, the good parts


* [Node.appendChild(child)](https://developer.mozilla.org/en-US/docs/DOM/Node.appendChild) to insert or move an element
* [Node.insertBefore(childNode, insertBeforeThisNode)](https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore) to insert or move an element
* [Node.remove()](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove) to remove an element
* [element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
* [element.classList.remove("class-name")](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
* [element.classList.add("class-name")](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
* [Events](https://developer.mozilla.org/en-US/docs/Web/Events)

## creation of DOM Object

    always use document.createElement
        * works for all the DOM elements
        * dynamic
        
    never use new Audio(), new Option(), new Image etc
        * adds more globals to remember
        * limited elements have this syntax sugar support
        * sometimes saves a few characters --> Use a minifier
    
