##Libraries


###dom99 and js99

DOM99 will walk the DOM and do an action if an element has an attribute like
   `<tag data-99-_type_="_directive_" > bla bla </tag>`
   
the directive can do 3 things :

* data-99-var :  data binding between DOM element and js variable
* data-99-node : pre-selecting a node for later
* data-99-bind : add an event listener to that element, that listener can access nodes previously selected as well as compute with live values from data-99-var

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

    <main data-99-bind="keyup-calculate">
        <label for="a">Try it</label><br>
        <input data-99-var="a" id="a" type="number">
        <span> X </span>
        <input data-99-var="b" type="number">
        <span> = </span>
        <span data-99-var="result"></span>
        
        <br><br>
        
        <span data-99-var="result"></span>
        <span> = </span>
        <input data-99-var="b" type="number">
        <span> X </span>
        <input data-99-var="a" type="number">
    </main>
        
The above example is expressive, powerful, scalable, simple. [Try-it](http://rawgit.com/GrosSacASac/JavaScript-Set-Up/master/index.html). It uses `data-99-var` and `data-99-bind`. The first input always has the same value as the last, because they share the same variable "a". The `main` element  makes sure that whenever there is a `keyup` event the calculate function is called. 

######calculate(event)

    const calculate = function (event) {
        _vars_["result"] = parseInt(_vars_["a"], 10) * parseInt(_vars_["b"], 10);
    };   
    
And now comes the best part: js99.js. 
    
All event listener functions in one place in js99 . Reuse other event listener functions effectively that way. The object returned by js99 is then used by dom99. Here's a figure that shows how components are coupled together:

HTML Document <--> dom99 <--> js99 <--> Pure JavaScript

You can execute all dom99 directives at once with `DOM99.linkJsAndDom();` once all your scripts are ready. You can also run it with newly generated elements with `DOM99.linkJsAndDom(startNode);`.


###operators

to do ...

