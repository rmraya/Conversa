/*
 * jQuery Highlight plugin
 * 
 * http://bartaz.github.com/sandbox.js/jquery.highlight.html
 * 
 * Based on highlight v3 by Johann Burkard
 * http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
 *
 * Code a little bit refactored and cleaned (in my humble opinion).
 * Most important changes:
 *  - has an option to highlight only entire words (wordsOnly - false by default),
 *  - has an option to be case sensitive (caseSensitive - false by default)
 *  - highlight element tag and class names can be specified in options
 *
 * Usage:
 *   // wrap every occurrance of text 'lorem' in content
 *   // with <span class='highlight'> (default options)
 *   $('#content').highlight('lorem');
 *
 *   // search for and highlight more terms at once
 *   // so you can save some time on traversing DOM
 *   $('#content').highlight(['lorem', 'ipsum']);
 *   $('#content').highlight('lorem ipsum');
 *
 *   // search only for entire word 'lorem'
 *   $('#content').highlight('lorem', { wordsOnly: true });
 *
 *   // don't ignore case during search of term 'lorem'
 *   $('#content').highlight('lorem', { caseSensitive: true });
 *
 *   // wrap every occurrance of term 'ipsum' in content
 *   // with <em class='important'>
 *   $('#content').highlight('ipsum', { element: 'em', className: 'important' });
 *
 *   // remove default highlight
 *   $('#content').unhighlight();
 *
 *   // remove custom highlight
 *   $('#content').unhighlight({ element: 'em', className: 'important' });
 *
 *
 * Copyright (c) 2009 Bartek Szopka
 *
 * Licensed under MIT license.
 *
 * XMLmind Software changes:
 * - Comment about how to fix option wordsOnly.
 * - Added option highlightWord.
 */

jQuery.extend({
    highlight: function (node, re, hwRE1, hwRE2, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var matchIndex = match.index;
                var matchLength = match[0].length;

                if (hwRE1 !== null) {
                    var text = match.input;
                    var matchHead = text.substring(0, matchIndex).match(hwRE1);
                    if (matchHead !== null) {
                        matchIndex -= matchHead[1].length;
                    }
                    var matchTail =
                        text.substring(matchIndex + matchLength).match(hwRE2);
                    if (matchTail !== null) {
                        matchLength += matchTail[1].length;
                    }
                }
                
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(matchIndex);
                wordNode.splitText(matchLength);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/^(script|style|text|tspan|textpath)$|(^svg:)/i.test(node.tagName) && // ignore script and style nodes and also text elements found in embedded SVG.
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, hwRE1, hwRE2, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function (options) {
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function (words, options) {
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false, highlightWord: false  };
    jQuery.extend(settings, options);
    
    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i){
      return word != '';
    });
    words = jQuery.map(words, function(word, i) {
      return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";

        /* What's above only works in an English text. Why that?
           \b is short for (?:(?<!\w)(?=\w)|(?<=\w)(?!\w))
           \w is short for [a-zA-Z_0-9]

           An "internationalized version" of this would be:

        var wordBoundary = "(?:(?<![\\p{L}\\p{N}_-])(?=[\\p{L}\\p{N}_-])|(?<=[\\p{L}\\p{N}_-])(?![\\p{L}\\p{N}_-]))";
        pattern =  wordBoundary + pattern + wordBoundary;
        flag += "u";
        */
    }
    var re = new RegExp(pattern, flag);

    var hwRE1 = null;
    var hwRE2 = null;
    if (settings.highlightWord) {
        try {
            // These Unicode patterns are not supported by IE11.      
            hwRE1 = new RegExp("([\\p{L}\\p{N}_-]+)$", "u");
            hwRE2 = new RegExp("^([\\p{L}\\p{N}_-]+)", "u");
        } catch (ignored) {}
    }

    return this.each(function () {
        jQuery.highlight(this, re, hwRE1, hwRE2, settings.element, settings.className);
    });
};

