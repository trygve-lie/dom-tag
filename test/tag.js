/* jshint node: true, strict: true */
/* global describe: true, it: true, before: true */

"use strict";

var jsdom           = require('jsdom'),
    mocha           = require('mocha'),
    assert          = require('chai').assert,
    expect          = require('chai').expect,
    should          = require('chai').should(),
    Tag             = require('../lib/tag.js');

var document        = jsdom.jsdom("<html><body></body></html>"),
    tag             = new Tag(document),
    tags = [
        'a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio',
        'b', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button',
        'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'command',
        'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em',
        'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frame',
        'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header',
        'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd',
        'keygen', 'label', 'legend', 'li', 'link', 'map', 'mark', 'meta',
        'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option',
        'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby',
        'samp', 'script', 'section', 'select', 'small', 'source', 'span',
        'split', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody',
        'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr',
        'track', 'tt', 'ul', 'var', 'video', 'wbr'
];



describe('tag()', function(){

    describe('require module', function(){

        it('should return a Object', function(){
            expect(tag).to.be.a('object');
        });

    });

});



describe('tag.elements() - function creation', function(){

    describe('element functions are created according to element list', function(){

        it('should have all elements in list as Functions', function(){
            tags.forEach(function(el){
                expect(tag[el]).to.be.a('function');
            });
        });

    });

    describe('element not in element list', function(){
        
        it('should not have the Function', function(){
            should.not.exist(tag.foobar);
        });

    });

});



describe('tag.elements() - DOM construction', function(){
    
    describe('render single open tag', function(){

        it('should render an open tag', function(){
            var result  = '<br>',
                node    = tag.br();
            assert.equal(result, node.outerHTML);
        });

    });

    describe('render single closed tag', function(){

        it('should render a closed tag', function(){
            var result  = '<div></div>',
                node    = tag.div();
            assert.equal(result, node.outerHTML);
        });

    });

    describe('render nested tags', function(){

        it('should render DOM tree', function(){
            var result  = '<section><h1></h1><div><p></p><p></p></div><div></div></section>',
                node    = tag.section(
                                tag.h1(),
                                tag.div(
                                    tag.p(),
                                    tag.p()
                                ),
                                tag.div()
                            );
            assert.equal(result, node.outerHTML);
        });

    });

    describe('construction is done in a function', function(){

        it('should render DOM tree', function(){
            var result = '<section><h1></h1><div><p></p><p></p></div><div></div></section>';
            
            function fragment() {
                return tag.div(
                            tag.p(),
                            tag.p()
                        );
            }

            var node = tag.section(
                            tag.h1(),
                            fragment(),
                            tag.div()
                        );
            assert.equal(result, node.outerHTML);
        });

    });

});



describe('tag.elements() - Text node construction', function(){

    describe('render single text node', function(){

        it('should render single text node', function(){
            var result  = '<p>foo</p>',
                node    = tag.p('foo');
            assert.equal(result, node.outerHTML);
        });

    });

    describe('render multiple text nodes', function(){

        it('should render multiple text nodes', function(){
            var result  = '<p>foobar</p>',
                node    = tag.p('foo', 'bar');
            assert.equal(result, node.outerHTML);
        });

    });

    describe('render text nodes with unescaped HTML', function(){

        it('should escape the HTML into HTML entities', function(){
            var result  = '<p>foo&lt;b&gt;bar&lt;/b&gt;xyz</p>',
                node    = tag.p('foo<b>bar</b>xyz');
            assert.equal(result, node.outerHTML);
        });

    });

    describe('render text nodes with escaped HTML', function(){

        it('should escape amperands', function(){
            var result  = '<p>foo&amp;lt;b&amp;gt;bar&amp;lt;/b&amp;gt;xyz</p>',
                node    = tag.p('foo&lt;b&gt;bar&lt;/b&gt;xyz');
            assert.equal(result, node.outerHTML);
        });

    });

    describe('render mixed text nodes and open tag element', function(){

        it('should render mixed text nodes and open tag element', function(){
            var result  = '<p>foo<br>bar</p>',
                node    = tag.p('foo', tag.br(), 'bar');
            assert.equal(result, node.outerHTML);
        });

    });

    describe('render mixed text nodes and closed tag element', function(){

        it('should render mixed text nodes and closed tag element', function(){
            var result  = '<p>foo<i>xyz</i>bar</p>',
                node    = tag.p('foo', tag.i('xyz'), 'bar');
            assert.equal(result, node.outerHTML);
        });

    });

});



describe('tag.elements() - Attributes', function(){

    describe('provide an attribute object with a "id" property', function(){

        it('should return an element with a "id" attribute', function(){
            var result  = '<div id="foo"></div>',
                node    = tag.div({id:'foo'});
            assert.equal(result, node.outerHTML);
        });

    });

    describe('provide an attribute object with a "id" and "for" property', function(){

        it('should return an element with a "id" and "for" attribute', function(){
            var result  = '<div id="foo" for="foo"></div>',
                node    = tag.div({id:'foo', for:'foo'});
            assert.equal(result, node.outerHTML);
        });

    });

    describe('provide an attribute object with a illegal property', function(){

        it('should return an element with no attributes', function(){
            var result  = '<div></div>',
                node    = tag.div({bar:'foo'});
            assert.equal(result, node.outerHTML);
        });

    });

});



describe('tag.elements() - "class" attribute', function(){

    describe('provide an attribute object with a "class" property', function(){

        it('should return an element with a "class" attribute', function(){
            var result  = '<div class="foo"></div>',
                node    = tag.div({class:'foo'});
            assert.equal(result, node.outerHTML);
        });

    });

    describe('provide an attribute object with a "cl" property', function(){

        it('should return an element with a "class" attribute', function(){
            var result  = '<div class="foo"></div>',
                node    = tag.div({cl:'foo'});
            assert.equal(result, node.outerHTML);
        });

    });

    describe('provide an attribute object with a "cls" property', function(){

        it('should return an element with a "class" attribute', function(){
            var result  = '<div class="foo"></div>',
                node    = tag.div({cls:'foo'});
            assert.equal(result, node.outerHTML);
        });

    });

});



describe('tag.elements() - "innerHTML" attribute', function(){

    describe('object with a "innerHTML" property', function(){

        it('should return an element where the value are child nodes of the element', function(){
            var result  = '<div>foo<b>bar</b>xyz</div>',
                node    = tag.div({innerHTML:'foo<b>bar</b>xyz'});
            assert.equal(result, node.outerHTML);
        });

    });

    describe('object with a "ih" property', function(){

        it('should return an element where the value are child nodes of the element', function(){
            var result  = '<div>foo<b>bar</b>xyz</div>',
                node    = tag.div({ih:'foo<b>bar</b>xyz'});
            assert.equal(result, node.outerHTML);
        });

    });

});



describe('tag.elements() - "style" attribute', function(){

    describe('object with single attribute', function(){

        it('should return "display:block"', function(){
            var result  = '<div style="display:block"></div>',
                node    = tag.div({style:{display:'block'}});
            assert.equal(result, node.outerHTML);
        });

    });

    describe('object with multiple attributes', function(){

        it('should return "display:block;color:orange"', function(){
            var result  = '<div style="display:block;color:orange"></div>',
                node    = tag.div({style:{display:'block', color:'orange'}});
            assert.equal(result, node.outerHTML);
        });

    });

    describe('object with camelCase attribute', function(){

        it('should return "background-color:orange"', function(){
            var result  = '<div style="background-color:orange"></div>',
                node    = tag.div({style:{backgroundColor:'orange'}});
            assert.equal(result, node.outerHTML);
        });

    });

});



describe('tag.elements() - "data" attribute', function(){

    describe('object with single attribute', function(){

        it('should return "data-foo=bar"', function(){
            var result  = '<div data-foo="bar"></div>',
                node    = tag.div({data:{foo:'bar'}});
            assert.equal(result, node.outerHTML);
        });

    });

    describe('object with multiple attributes', function(){

        it('should return "data-foo=bar data-bar=foo"', function(){
            var result  = '<div data-foo="bar" data-bar="foo"></div>',
                node    = tag.div({data:{foo:'bar', bar:'foo'}});
            assert.equal(result, node.outerHTML);
        });

    });

    describe('object with camelCase attribute', function(){

        it('should return "data-foo-bar=xyz"', function(){
            var result  = '<div data-foo-bar="xyz"></div>',
                node    = tag.div({data:{fooBar:'xyz'}});
            assert.equal(result, node.outerHTML);
        });

    });

});



describe('tag.elements() - other attribute', function(){

    describe('set whitelisted attribute', function(){

        it('should set attribute', function(){
            var result  = '<div tabindex="1"></div>',
                node    = tag.div({tabindex:1});
            assert.equal(result, node.outerHTML);
        });

    });

    describe('set non whitelisted attribute', function(){

        it('should set attribute', function(){
            var result  = '<div></div>',
                node    = tag.div({onclick:'alert("foo")'});
            assert.equal(result, node.outerHTML);
        });

    });

});