# `<picture>`

## Use case

Provide the user-agent many image options, letting it decide the one that fits best.

An example where a high resolution image will be downloaded (and used) on wide enough devices.
 
```
<picture class="">
    <source srcset="image-high-resolution.jpg" media="(min-width: 992px)">
    <img class="" src="image-low-resolution.jpg" alt="">
</picture>
```

## Fallback

In case the element is not supported the <img> inside will always be used.
