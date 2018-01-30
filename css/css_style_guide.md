# CSS Stlye Guide

## Semantics first

Want to make text look big ? Think about the reason first, maybe it is a title and `<h1-6>` should be used. Maybe it is an important word, use `<strong>`. Once the correct semantic is used, you may have a selector ready.

## Sub-categorize CSS

1. Company CSS (brand, colors, logo, typography)
2. Site CSS (colors, visual design)
3. Site Category CSS (Consistent visual for a site category (news, weather))
4. Page Specific CSS (used only on 1 page)

By putting the most common CSS in company wide css, you get visual consistency for free, and best code reuse. Alternatively with SASS or LESS, one could declare site-wide variables and import those where required. 

* 1 Component, 1 CSS

Can be further extended on individual site categories or pages.

## Selectors

Should be as short as possible. Use the element selector only when it makes sense (e.g for site wide styles) . Use descendant, and child selector when the associated markup also follows this hierarchy


## Key-Value Pairs

Put the most important ones first

0. Content
1. Positioning and layout
2. Margin, Border, Padding, Width, Height
3. Font
4. Colors

## Media Queries