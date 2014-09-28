/* jshint node: true, strict: true */
/* global window: true */

/** @module utils */

"use strict";



/**
  * Parse camelCaseString into spinal-case-string
  * @param {String} value Camel case String
  * @returns {String} 
  */

module.exports.camelCaseToSpinalCase = function(value) {
    return value.match(/[A-Z]?[a-z]+/g).join('-').toLowerCase();
};



/** 
  * Check if a value is a HTMLElement 
  * @param {*} value Any type of value
  * @returns {Boolean}
  */

module.exports.isHTMLElement = function(value) {
    return value.nodeType === 1;
};



/** 
  * Check if a value is an Object 
  * @param {*} value Any type of value
  * @returns {Boolean}
  */

module.exports.isObj = function(value) {
    return value instanceof Object;
};



/** 
  * Check if a value is a String 
  * @param {*} value Any type of value
  * @returns {Boolean}
  */

module.exports.isStr = function(value) {
    return typeof value === 'string';
};



/**
  * Build a key:value; string out of the key / values
  * in a Object.
  * @param {Object} obj Object holding key / value pairs
  * @param {String} key Which key in the Object to pick 
  * key / value pairs from
  * @returns {String} 
  */

module.exports.buildKeyValueString = function(obj, key){
    return Object.keys(obj[key]).map(function(value){
        return this.camelCaseToSpinalCase(value) + ':' + obj[key][value];
    }.bind(this)).join(';');
};



/**
  * Build data-* attributes out of the key / values
  * in a Object.
  * @param {HTMLElement} element Element to apply the data-* 
  * attributes to
  * @param {Object} obj Object holding key / value pairs
  * @param {String} key Which key in the Object to pick 
  * key / value pairs from
  * @returns {HTMLElement} 
  */

module.exports.setDataAttribute = function(element, obj, key){
    Object.keys(obj[key]).forEach(function(value){
        element.setAttribute('data-' + this.camelCaseToSpinalCase(value), obj[key][value]);
    }.bind(this));

    return element;
};



/**
  * Provide a HTML document based on which environment
  * one operate in. This function is mainly used to wrangle
  * that one want to run the js code in different
  * environments and not all provide a HTML document.
  *
  * This function will first look for "window.document".
  * If pressent, it will be returned as the HTML document.
  * If "window.document" is not pressent, it will check
  * if a HTML document was provided (ex by JSDom) as a 
  * method attribute. If provided it will be returned.
  * If no HTML document was provided, it will look for 
  * a "document" variable on the node.js specific
  * "GLOBAL" object.
  *
  * @param {HTMLDocument} doc A HTML Document
  * @returns {HTMLDocument}
  */

module.exports.getDocument = function(doc) {
    
    // In browser
    if(typeof window !== 'undefined') {
        return window.document;
    }

    // Document is manually provided
    if(doc) {
        return doc;
    }

    // In node.js
    if (GLOBAL) {
        return GLOBAL.document;
    }

    // No clue where we are
    return null;
};
