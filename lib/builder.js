/* jshint node: true, strict: true */
/* global window: true */

"use strict";


var is      = require('../../is'),
    utils   = require('./utils.js'),

    whiteListAttributes = [
        'accept', 'accept-charset', 'accesskey', 'action', 'align', 'alt', 'async',
        'autocomplete', 'autofocus', 'autoplay', 'autosave', 'bgcolor', 'border',
        'buffered', 'challenge', 'charset', 'checked', 'cite', 'code', 'codebase', 
        'color', 'cols', 'colspan', 'content', 'contenteditable', 'contextmenu', 
        'controls', 'coords', 'datetime', 'default', 'defer', 'dir', 'dirname', 
        'disabled', 'download', 'draggable', 'dropzone', 'enctype', 'for', 'form', 
        'formaction', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 
        'http-equiv', 'icon', 'id', 'ismap', 'itemprop', 'keytype', 'kind', 'label', 
        'lang', 'language', 'list', 'loop', 'low', 'manifest', 'max', 'maxlength', 
        'media', 'method', 'min', 'multiple', 'name', 'novalidate', 'open', 'optimum', 
        'pattern', 'ping', 'placeholder', 'poster', 'preload', 'pubdate', 'radiogroup', 
        'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 
        'spellcheck', 'scope', 'scoped', 'seamless', 'selected', 'shape', 'size', 
        'sizes', 'span', 'src', 'srcdoc', 'srclang', 'start', 'step', 'summary', 
        'tabindex', 'target', 'title', 'type', 'usemap', 'value', 'width', 'wrap'
];



module.exports = function(tag, doc){

    return function build(){

        doc = utils.getDocument(doc);

        var args    = Array.prototype.slice.call(arguments),
            element = doc.createElement(tag);

        if (!args[0]) {
            return element;
        }

        args.forEach(function(arg){

            if (is.obj(arg) && !utils.isHTMLElement(arg)) {

                Object.keys(arg).forEach(function(attribute){
                    if (attribute === 'class' || attribute === 'cl' || attribute === 'cls') {
                        element.setAttribute('class', arg[attribute]);

                    } else if (attribute === 'innerHTML' || attribute === 'ih') {
                        element.innerHTML = arg[attribute];

                    } else if (attribute === 'style') {
                        element.setAttribute('style', utils.buildKeyValueString(arg, attribute));

                    } else if (attribute === 'data') {
                        utils.setDataAttribute(element, arg, attribute);

                    } else if (whiteListAttributes.indexOf(attribute) !== -1) {
                        element.setAttribute(attribute, arg[attribute]);

                    }
                });

            }

            // If the argument is a string, it should be appended as text node
            else if(is.str(arg)){
                element.appendChild(doc.createTextNode(arg));
            }

            // Else if the argument is not an object we assume it is htmlElement
            else if(arg && utils.isHTMLElement(arg)){
                element.appendChild(arg);
            }

        });

        return element;

    };

};
