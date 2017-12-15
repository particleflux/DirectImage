// ==UserScript==
// @name         DirectImage
// @namespace    http://particleflux.codes/
// @version      1.0.0
// @description  Directly open images for image hosting sites
// @author       particleflux
// @match        http*://suckmypic.net/*
// @exclude      http*://suckmypic.net/*.html
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    if (window.location.href.lastIndexOf(window.location.hostname) + window.location.hostname.length + 1 === window.location.href.length) {
        console.warn("Website main page, bailing");
        return;
    }
    if (document.images.length === 1 && document.images[0].src === window.location.href) {
        console.warn("Image directly opened, bailing");
        return;
    }

    var host = window.location.hostname.indexOf('www.') !== -1
        ? window.location.hostname.substr(4)
        : window.location.hostname;

    function q(selector) {
        return document.querySelector(selector);
    }

    const hostActions = {
        'suckmypic.net': '#theImage'
    };

    function extractImage(host) {
        var img = null;

        if (hostActions.hasOwnProperty(host)) {
            // TODO add callback functions for complex pages
            if (typeof hostActions[host] === 'string') {
                img = q(hostActions[host]);
            }
        } else {
            console.warn('unhandled domain');
        }

        return img;
    }

    function render(host) {
        var img = extractImage(host);
        if (img && img.src) {
            window.stop();
            document.location.href = img.src;
        }
    }

    render(host);
})();
