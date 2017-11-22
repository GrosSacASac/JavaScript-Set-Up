# Use svg to create and use icons

# Why

Svg icons are scalable icons. Alternative techniques such as using a font for displaying icons have some downside such as: delayed rendering (1 more http request), more difficult to split, limited runtime animation possibilities, can be blocked by add ons for performance reasons etc.
 
 

## Step 1

Define all the icons using svg and svg-symbol at the top of the html body. Hide the container svg. Works with `<svg>`, `<pattern>` , `<g>`, `<symbol>`

```
<style>
    /* hidden is not supported on svg yet */
    svg[hidden] {
        display: none;
    }
</style>

<svg id="svg-icons" hidden>
    <defs>
        <!-- Using svg xmlns is not required inside (inherited) -->
        <svg viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd" id="school-icon">
            <path d="M23 24h-22v-2h1v-7h-2l3-9h5.429l2.571-2.203v-3.797h5l-1 1.491 1 1.509h-4l3.571 3h5.429l3 9h-2v7h1v2zm-12-5h-1v4h1v-4zm3 0h-1v4h1v-4zm6-4h-16v7h4v-5h8v5h4v-7zm-15 4h2v2h-2v-2zm14 0v2h-2v-2h2zm-14-3h2v2h-2v-2zm12 0h2v2h-2v-2zm.905-8l-1.297 1.513-4.608-3.949-4.608 3.949-1.297-1.513h-1.653l-1.667 5h18.45l-1.667-5h-1.653zm-5.905-.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5zm0 1.5h-.763v1.8h1.763v-.8h-1v-1z"/>
        </svg>
        <!-- Using symbol-->
        <symbol viewBox="0 0 24 24" id="iconmonstr">
            <path d="M16.5 2.75c-.965 0-1.75.785-1.75 1.75s.785 1.75 1.75 1.75 1.75-.785 1.75-1.75-.785-1.75-1.75-1.75zm0-2.75c2.481 0 4.5 2.019 4.5 4.5s-2.019 4.5-4.5 4.5-4.5-2.019-4.5-4.5 2.019-4.5 4.5-4.5zm-5.5 17.01s2.539 3.087 4.022 4.944c1.163 1.454 2.025 2.046 3.462 2.046 1.411 0 2.516-1.065 2.516-2.309 0-.539-.183-1.111-.594-1.646-1.52-1.973-2.406-3.035-2.406-3.035h-7zm-3.136-.01h-2.864c-.551 0-1-.449-1-1s.449-1 1-1h13.279c.893 0 1.4.248 1.963.958.96 1.211 2.505 3.163 2.562 3.251.736-.87 1.196-1.98 1.196-3.209 0-2.761-2.239-5-5-5h-14c-2.761 0-5 2.239-5 5s2.239 5 5 5h6.141c-1.144-1.405-3.277-4-3.277-4zm.05-12.5l2.086 2.086-1.414 1.414-2.086-2.086-2.086 2.086-1.414-1.414 2.086-2.086-2.086-2.086 1.414-1.414 2.086 2.086 2.086-2.086 1.414 1.414-2.086 2.086z"/>
        </symbol>
    </defs>
</svg>
```

## Step 2

Use the icons inside the content.

```
<p>
    Another house: 
    <sv width="24" height="24" role="img" alt="house">
        <use xlink:href="#school-icon"></use>
    </svg>. It is reusing the same icon with <code>svg &lt;use&gt;</code>
</p>

<p>Icons from
    <a href="https://iconmonstr.com/">
        <svg width="24" height="24" role="decoration">
            <use xlink:href="#iconmonstr"></use>
        </svg>
        iconmonstr
    </a>
</p>
```

## Step 3

Use classes and css to fine tune the details.


## Notes

You can use preserveAspectRatio="xMinYMin meet" on the svg that is using use. Sometimes useful.

HTML5 in-line svg do not require xmlns="http://www.w3.org/2000/svg".

[Help to reuse the svg icons across pages, caching or service-worker](https://css-tricks.com/svg-sprites-use-better-icon-fonts/#article-header-id-6). 

Provide labels for accessibility reasons as needed. Or use <desc> in svg icons

Svg icons compared to png icons may have a greater CPU cost. This is not something to worry about.

There are other techniques to use svg icons, such as svg as background image, this works with sprites too (background-position).


## Example

svg_icons_pattern_example.html


## Support

Works with IE9 and above I think. Todo: prove it.


## Tools

Todo, are there tools to automate build html files, importing svgs from external files, webpack maybe ?