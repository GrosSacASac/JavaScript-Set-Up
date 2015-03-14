##Libraries


###dom99 and js99

DOM99 will walk the DOM and do an action if an element has an attribute like
   `<tag data-99="_directive_" > bla bla </tag>`
   
the directive can do 3 things :

* do as the value of an element is always the same as a js variable and vice-versa(not implemented yet)
* add an event listener to that element
* pre load resources for a later use (not implemented yet)

that's it, dom99 does nothing more.


####Alternatives, and why they are worse


#####HTML : 

    `<tag onclick="jsFunc()" > bla bla </tag>`

When you debug your JavaScript, you want to look in your js files. This can make you lose time. To remove the eventListener later on you will have to use JavaScript anyway, so you might already start using DOM-0. The event object is not accessible here, so you are very limited anyway. You may have to use `this` to interact with event target. The good part is that you can assemble you graphical user interface like bricks by moving around and copying those html blocks.


#####DOM-0 :

    <span id="clickme"> Water is life </span>
    <script>
        var element = document.getElementById('clickme');
        element.onclick = function(event) {
            ...
        };
    </script>
    
For every element in your page you are going to use heavy stuff , select and assign an event listener. What happens if you want to change your id for some reason, think about `<a href="#x2"></a>` that also use ids. Same for class name. These are html attributes that are used for other stuff (styling, linking) and therefore might be changed to satisfy these other uses better, thus breaking your code. To remove an event listener you must assign a do-nothing function. It's not so easy to add another event listener for the same event.


#####DOM-2 :

    <p id="clickme">Drink more water it is good for your health</p>
    <script>
        var element = document.getElementById('clickme');
        element.addEventListener('click', function() {
            ...
        }, false);
    </script>
    
DOM-2 is already a lot better but still inherits problems from DOM-0. You are still using ids (or classes) to identify the element. Every time you want to add a dynamic element you have to reuse that heavy syntax.

#####DOM-99


The dom99 takes the powerful good parts of the HTML and the DOM-2 way without their bad counterparts. To build your graphical user interface, all you have to do is write 

    <p data-99="click-explode">This is a water-bomb</p>
    <input data-99="blur-isGoodPassword" type="password" max="64">
    <p data-99="click-explode">This is another water-bomb</p>
    
The above example is expressive, powerful, scalable, simple. And now comes the best part: js99.js when executed returns an object like this

    return Object.freeze({
        "explode": explode, //explode is a function
        "isGoodPassword": isGoodPassword
    });
    
You write the event listener functions before the return, all in one place. Reuse other event listener functions effectively that way. The object returned by js99 is then used by dom99. Here's a figure that shows how components are coupled together:

HTML Document <--> dom99 <--> js99 <--> JavaScript files


###operators

to do ...

