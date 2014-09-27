/* jshint node: true, strict: true */
/* global describe: true, it: true, before: true */

"use strict";

var mocha           = require('mocha'),
    assert          = require('chai').assert,
    jsdom           = require('jsdom'),
    utils           = require('../lib/utils.js');



describe('utils.camelCaseToSpinalCase()', function(){

    describe('foo', function(){

        it('should return "foo"', function(){
            assert.equal('foo', utils.camelCaseToSpinalCase('foo'));
        });

    });

    describe('foobarxyz', function(){

        it('should return "foobarxyz"', function(){
            assert.equal('foobarxyz', utils.camelCaseToSpinalCase('foobarxyz'));
        });

    });

    describe('fooBarXyz', function(){

        it('should return "foo-bar-xyz"', function(){
            assert.equal('foo-bar-xyz', utils.camelCaseToSpinalCase('fooBarXyz'));
        });

    });

    describe('fooBar Xyz', function(){

        it('should return "foo-bar-xyz"', function(){
            assert.equal('foo-bar-xyz', utils.camelCaseToSpinalCase('fooBar Xyz'));
        });

    });

});



describe('utils.isHTMLElement()', function(){

    describe('"foo"', function(){

        it('should return "false"', function(){
            assert.isFalse(utils.isHTMLElement('foo'));
        });

    });

    describe('{}', function(){

        it('should return "false"', function(){
            assert.isFalse(utils.isHTMLElement({}));
        });

    });

    describe('window', function(){

        it('should return "false"', function(done){
            jsdom.env('<p id="foo"><p>', function(error, window){
                assert.isFalse(utils.isHTMLElement(window));
                done();
            });
        });

    });

    describe('HTMLElement', function(){

        it('should return "true"', function(done){
            jsdom.env('<p id="foo"><p>', function(error, window){
                assert.isTrue(utils.isHTMLElement(window.document.getElementById('foo')));
                done();
            });
        });

    });

});



describe('utils.buildKeyValueString()', function(){

    describe('{style:{}}', function(){

        it('should return ""', function(){
            assert.equal('', utils.buildKeyValueString({style:{}}, 'style'));
        });

    });

    describe('{style:{color:"red"}}', function(){

        it('should return "color:red"', function(){
            assert.equal('color:red', utils.buildKeyValueString({style:{color:'red'}}, 'style'));
        });

    });

    describe('{style:{backgroundColor:"red"}}', function(){

        it('should return "background-color:red"', function(){
            assert.equal('background-color:red', utils.buildKeyValueString({style:{backgroundColor:'red'}}, 'style'));
        });

    });

    describe('{style:{color:"red", display:"block"}}', function(){

        it('should return "color:red;display:block"', function(){
            assert.equal('color:red;display:block', utils.buildKeyValueString({style:{color:"red", display:"block"}}, 'style'));
        });

    });

});



describe('utils.setDataAttribute()', function(){

    describe('{data:{}}', function(){

        it('should return "<p id="foo"></p>"', function(done){
            jsdom.env('<p id="foo"><p>', function(error, window){
                var result  = '<p id="foo"></p>',
                    el      = utils.setDataAttribute(window.document.getElementById('foo'), {data:{}}, 'data');
                assert.equal(result, el.outerHTML);
                done();
            });
        });

    });

    describe('{data:{foo:"bar"}}', function(){

        it('should return "<p id="foo" data-foo="bar"></p>"', function(done){
            jsdom.env('<p id="foo"><p>', function(error, window){
                var result  = '<p id="foo" data-foo="bar"></p>',
                    el      = utils.setDataAttribute(window.document.getElementById('foo'), {data:{foo:'bar'}}, 'data');
                assert.equal(result, el.outerHTML);
                done();
            });
        });

    });

    describe('{data:{fooXyz:"bar"}}', function(){

        it('should return "<p id="foo" data-foo-xyz="bar"></p>"', function(done){
            jsdom.env('<p id="foo"><p>', function(error, window){
                var result  = '<p id="foo" data-foo-xyz="bar"></p>',
                    el      = utils.setDataAttribute(window.document.getElementById('foo'), {data:{fooXyz:'bar'}}, 'data');
                assert.equal(result, el.outerHTML);
                done();
            });
        });

    });

    describe('{data:{foo:"bar", bar:"foo"}}', function(){

        it('should return "<p id="foo" data-foo="bar" data-bar="foo"></p>"', function(done){
            jsdom.env('<p id="foo"><p>', function(error, window){
                var result  = '<p id="foo" data-foo="bar" data-bar="foo"></p>',
                    el      = utils.setDataAttribute(window.document.getElementById('foo'), {data:{foo:'bar',bar:'foo'}}, 'data');
                assert.equal(result, el.outerHTML);
                done();
            });
        });

    });

});