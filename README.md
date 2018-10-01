# dom-tag

[![Dependencies](https://img.shields.io/david/trygve-lie/dom-tag.svg?style=flat-square)](https://david-dm.org/trygve-lie/dom-tag)[![Build Status](http://img.shields.io/travis/trygve-lie/dom-tag/master.svg?style=flat-square)](https://travis-ci.org/trygve-lie/dom-tag) [![Greenkeeper badge](https://badges.greenkeeper.io/trygve-lie/dom-tag.svg)](https://greenkeeper.io/)

Templating library. In its purest form dom-tag are just a set of convenience methods
wrapping basic DOM manipulation making it simpler to do plain DOM construction.



## Installation

```bash
$ npm install dom-tag
````



## Tests

```bash
$ npm test
````

Tests are written in [mocha](http://visionmedia.github.io/mocha/) and run
in node.js with the help of [jsdom](https://github.com/tmpvar/jsdom).



## Compatibility

dom-tag does use the following ES5 features:

  * .forEach()
  * .keys()
  * .bind()
  * .map()

If you want use dom-tag in a run time [not providing these features](http://kangax.github.io/compat-table/es5/), 
they should be provided as a shim.



## Basic usage

Example on building a simple UL list:

```js
var tag = require('dom-tag');

var ul = tag.ul({id:'list'},
            tag.li('a'),
            tag.li('b'),
            tag.li('c')
       );
```

This will create the following HTML:

```html
<ul id="list">
    <li>a</li>
    <li>b</li>
    <li>c</li>
</ul>
```



## API

dom-tag exposes a set of methods which is equal to all known [HTML5 elements](https://developer.mozilla.org/en/docs/Web/Guide/HTML/HTML5/HTML5_element_list).
When executing one of these methods it will return a HTML Element of the same type 
as the method name. Iow; to create a `<div>` element one call the `tag.div()` method.

So, methods on dom-tag goes like this:

  * `.html()`
  * `.head()`
  * `.h1()`
  * `.h2()`
  * `.h3()`
  * `.div()`
  * `.section()`
  * `.article()`
  * `.p()`
  * `.form()`
  * etc....


### Whitelisting

dom-tag uses a whitelist approach when it comes to which HTML5 elements and attributes
one can create. 

If one try to use a method which does not correspond to the HTML5 Element whitelist
an `Error` will be thrown. Attributes not corresponding to the HTML Element attribute
whitelist will be silently ignored.


### Arguments

Each method can take a unlimited number of function agruments. This is the core key
to build nested DOM structures with dom-tag. 

If a method is passed in as a argument to another method the generated HTML
Element will be appended to the generated HTML Element from the method it was passed
into.

Iow; when passing the `.li()` method as an argument to the `.ul()` like this

```js
tag.ul(
    tag.li()
);
```

a DOM structure like this will be built:

```html
<ul>
    <li></li>
</ul>
```

By adding more arguments to the `.ul()` method:

```js
tag.ul(
    tag.li(),
    tag.li(),
    tag.li()
);
```

we add more siblings to the DOM structure:

```html
<ul>
    <li></li>
    <li></li>
    <li></li>
</ul>
```

By passing methods as arguments to the `.li()` methods again:

```js
tag.ul(
    tag.li(
        tag.b()
    ),
    tag.li(),
    tag.li()
);
```

we are able to build a deeper DOM structure:

```html
<ul>
    <li>
        <b></b>
    </li>
    <li></li>
    <li></li>
</ul>
```

There is 3 types of arguments which can be passed to a dom-tag method:

1. A `function`. Mostly another method but also any `function` which returns 
   a DOM node / structure.
2. A `Object` where the keys correspond to a set of legal HTML5 Element attributes.
3. A `String`.


### Attribute object

Attributes on the final HTML Element is set by pasing a `Object` where the keys
correspong to a set of legal [HTML5 Element attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)
to the method.

To set an `id` attribute on a HTML Element one simply do like this:

```js
tag.div({id:'foo'});
```

which will render:

```html
<div id="foo"></div>
```

Multiple attributes is set by adding multiple key/values in the attribute object:

```js
tag.img({src:'http://img.site.com/bar.webp', alt:'bar pict'});
```

which will render:

```html
<img src="http://img.site.com/bar.webp" alt="bar pict">
```


#### class attribute

`class` is probably the attribute one set the most. One can use `cl` as a shorthand
key for the `class` attribute. It will render the same as using `class`.

Iow, `{cl:'foo'}` is equal to `{class:'foo'}`.


#### style attribute

`style` is set by providing a `Object` with style key/value pairs to the key. 

Do note that keys which should end up as "-" separated should be written as 
camelCase. dom-tag will convert it when constructing the attribute.

```js
tag.div({style:{
  backgroundColor : '#000',
  color : '#fff'
}});
```

will render:

```html
<div style="background-color : #000; color : #fff;"></div>
```


#### data-* attributes

`data-*` attributes is set by providing a `Object` with data key/value pairs to 
the key. 

Do note that keys which should end up as "-" separated should be written as 
camelCase. dom-tag will convert it when constructing the attribute.

```js
tag.div({data:{
  foo : 'bar',
  fooBar : 'xyz'
}});
```

will render:

```html
<div data-foo="bar" data-foo-bar="xyz"></div>
```


#### onEvent attributes

None of the `onEvent` attributes like `onClick`, `onFocus` etc is supported due 
to security reasons. Events should be applied to DOM Elements by `.addEventListener()`.

Wrong and will be ignored:

```js
tag.button(onclick: function(ev){alert('hello')}, 'Click me');
```

Correct:

```js
var button = tag.button('Click me');
document.querySelectorAll('body')[0].appendChild(button);

button.addEventListener('click', function(ev){
  alert('hello');
});
```


### Text

If a `String` is passed as a value it will be output as a `textNode`.

```js
tag.p('Foo bar');
```

will render:

```html
<p>Foo bar</p>
```


#### Markup in Strings

dom-tag is based on constructing DOM nodes. Due to security reasons dom-tag 
does not use `innerHTML` or provide a HTML parser. If HTML is passed on as 
a `String` to dom-tag, the output will be escaped.

```js
tag.p('Foo <b>bar</b> xyz');
```

will render:

```html
<p>Foo &lt;b&gt;bar&lt;/b&gt; xyz</p>
```



## TIPS

When writing tempates with dom-tag its a good thing to remember that in 
reality one are doing plain DOM manipulation and that all JS and DOM APIs 
are available and can be used. This is great power.

But, with great power comes great responsibility. You are responsible of 
keeping you code clean. 

Always try to separate logic from rendering the markup. A good thing is to 
try to just pass on an `Object` which contains the values one would like to 
put into the markup.

In many cases its also worth keeping in mind that any `function` which returns
a DOM element can be pased on to any method in dom-tag. By doing so, its easy 
to extract logic out of the DOM construction.

Bad:

```js
tag.p((obj.attendees === 0) ? 'None' : obj.attendees.toString());
```

Good:

```js
function attendees(obj) {
  return (obj.attendees === 0) ? 'None' : obj.attendees.toString();
}

tag.p(attendees(obj));
```



## Environments

dom-tags main target is the browser.

Though; with the help of [jsdom](https://github.com/tmpvar/jsdom) or
[window.document](https://github.com/trygve-lie/window.document) dom-tag 
can run in node.js.


### jsdom

[jsdom](https://github.com/tmpvar/jsdom) is a full DOM implementation. 
Using this in production to provide a DOM will probably not fly well due. 
to the overhead of being a full DOM implementation.
Though, for unittesting jsdom is a very good solution.

Example of using dom-tag with jsdom in node.js:

```js
var jsdom = require('jsdom'),
    Tag   = require('dom-tag');

// set up a document and tell dom-tag about it
var doc = jsdom.jsdom("<html><body></body></html>", jsdom.level(3, "core")),
    tag = new Tag(doc);

// build DOM structures with dom-tag
var html = tag.div({cl:'hello'}, 'world');

// dump a string of the DOM structure
console.log(html.outerHTML);
```


### window.document

[window.document](https://github.com/trygve-lie/window.document) is a thin
shim that fake just the DOM methods needed for constructing DOM trees 
server side. window.document does not build a full DOM. Instead it does
build HTML fragments by concatinating strings. This makes it much more
light weight than jsdom which again makes it suitable for rendering
markup in a production server.

Example of using dom-tag with window.document in node.js:

```js
var Doc = require('window.document'),
    Tag = require('dom-tag');

// set up a document and tell dom-tag about it
var tag = new Tag(new Document());

// build DOM structures with dom-tag
var html = tag.div({cl:'hello'}, 'world');

// dump a string of the DOM structure
console.log(html.outerHTML);
```



## License 

The MIT License (MIT)

Copyright (c) 2014 - Trygve Lie - post@trygve-lie.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
