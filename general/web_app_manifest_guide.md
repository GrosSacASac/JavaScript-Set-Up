# Web Manifest Guide


## About


manifest.webmanifest is a special file that contains meta-data about a web app. It is a requirement to make a web app "installable" on a home-screen. It enhances <meta> tags already in HTML.
> When members like the name or icons is missing from the manifest, user agents can search in a manifest's owner `[HTML]` document for things like icons and the application name.

## How

To add a manifest to an HTML document, create a file named `manifest.webmanifest`.

[Example Manifest](https://www.w3.org/TR/appmanifest/#x1-1-example-manifests)

Then add this line in the head of the html

`<link rel="manifest" href="manifest.webmanifest">`

### display


https://www.w3.org/TR/appmanifest/#display-member


```
    "fullscreen",
    "standalone",
    "minimal-ui",
    "browser"
```


### orientation


https://www.w3.org/TR/screen-orientation/#orientationlocktype-enum


```
    "any",
    "natural",
    "landscape",
    "portrait",
    "portrait-primary",
    "portrait-secondary",
    "landscape-primary",
    "landscape-secondary"
```

### start_url


To use the same as the html document that has the manifest link use an empty string.






## Content Type

> The media type for a manifest is `application/manifest+json`.

The file extension is `.webmanifest`



## Links

https://www.w3.org/TR/appmanifest/#idl-index

https://www.w3.org/TR/appmanifest

https://developers.google.com/web/fundamentals/app-install-banners/

