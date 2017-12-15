// ==UserScript==
// @name         DirectImage
// @namespace    http://particleflux.codes/
// @version      1.0.0
// @description  Directly open images for image hosting sites
// @author       particleflux
// @match        http*://suckmypic.net/*
// @exclude      http*://suckmypic.net/*.html
// @match		 http://*.pix.ac/image/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    var loc = window.location;
    if (loc.href.lastIndexOf(loc.hostname) + loc.hostname.length + 1 === loc.href.length) {
        console.warn("Website main page, bailing");
        return;
    }
    if (document.images.length === 1 && document.images[0].src === loc.href) {
        console.warn("Image directly opened, bailing");
        return;
    }

    var host = loc.hostname.indexOf('www.') !== -1
        ? loc.hostname.substr(4)
        : loc.hostname;

    function q(selector) {
        return document.querySelector(selector);
    }

    var imageExtractors = {
        'ogImage': function() {
            var metaTag = q('meta[property="og:image"], [name="og:image"]');
            if (metaTag) {
                metaTag.src = metaTag.content
            }
            return metaTag;
        }
    };

    /**
     * Actions per host
     *
     * Could be a simple string -> selector which is queried against the document
     * and needs to match an image
     *
     * Otherwise should be an array with the first element being the name of an
     * extractor callback in `imageExtractors`, and the remaining elements being
     * passed as arguments
     */
    var hostActions = {
        'suckmypic.net': '#theImage',
        'pix.ac': ['ogImage']
    };

    function extractImage(host) {
        var img = null;

        if (hostActions.hasOwnProperty(host)) {
            // this is a shortcut for direct selectors
            if (typeof hostActions[host] === 'string') {
                img = q(hostActions[host]);
            } else {
                var params = hostActions[host];
                var extractor = params.shift();
                img = imageExtractors[extractor].apply(this, params)
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

            document.head.innerHTML = '<style>img { position: absolute; top: 0; right: 0; bottom: 0; left: 0; -webkit-user-select: none; background-position: 0px 0px, 10px 10px; background-size: 20px 20px;background-image:linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%),linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);}</style>';
            document.body.style.margin = '0px';
            document.body.style.background = "#0e0e0e";
            document.body.innerHTML = '';
            var imgElement = document.createElement('img');
            imgElement.src = img.src;
            imgElement.style.margin = 'auto';
            document.body.appendChild(imgElement);

            // make configurable direct opening
            // document.location.href = img.src;
        }
    }

    render(host);
})();
