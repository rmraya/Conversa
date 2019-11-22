/*
 * Copyright (c) 2019 XMLmind Software. All rights reserved.
 *
 * This file is part of the XMLmind Web Help Compiler project.
 * For conditions of distribution and use, see the accompanying LEGAL.txt file.
 */

// -------------------------------------
// Localization
// -------------------------------------

var preferredUserLanguage = null; //SET BY WHC

function getUserLanguage(lang) {
    if (lang === null) {
        lang = window.navigator.userLanguage || window.navigator.language;
    }
    if (lang) {
        lang = lang.toLowerCase();
        if (lang.length > 5) {
            lang = lang.substring(0, 5);
        }
        if (lang.indexOf("_") >= 0) {
            lang = lang.replace(/_/g, "-");
        }

        if (lang in messageTranslations) {
            return lang;
        } else {
            var pos = lang.indexOf("-");
            if (pos > 0) {
                lang = lang.substring(0, pos);
            }
            if (lang in messageTranslations) {
                return lang;
            } else {
                return null;
            }
        }
    } else {
        return null;
    }
}
var userLanguage = getUserLanguage(preferredUserLanguage);

function msg(message) {
    if (userLanguage !== null) {
        var translation = messageTranslations[userLanguage];
        if (translation !== undefined) {
            var index = -1;

            var count = messages.length;
            for (var i = 0; i < count; ++i) {
                if (messages[i] === message) {
                    index = i;
                    break;
                }
            }

            if (index >= 0) {
                message = translation[index];
            }
        }
    }

    return message;
}

// -------------------------------------
// Storage
// -------------------------------------

var storageId = "WEB_HELP_UID"; //SET BY WHC

function storageSet(key, value) {
    window.sessionStorage.setItem(key + storageId, String(value));
}

function storageGet(key) {
    return window.sessionStorage.getItem(key + storageId);
}

function storageDelete(key) {
    window.sessionStorage.removeItem(key + storageId);
}

// -------------------------------------
// initMenu
// -------------------------------------

function initMenu() {
    var menu = $("#wh-menu");
    menu.attr("title", msg("Open navigation pane"));
    menu.click(function () {
        if (menu.hasClass("wh-icon-menu")) {
            openNavigation();
        } else {
            closeNavigation();
        }
    });
}

function openNavigation() {
    var menu = $("#wh-menu");
    menu.removeClass("wh-icon-menu").addClass("wh-icon-close");
    menu.attr("title", msg("Close navigation pane"));

    var glass = $('<div id="wh-body-glass"></div>');
    glass.css({ "position": "absolute",
                "top": "0px",
                "left": "0px",
                "z-index": "50",
                "width": "100%",
                "height": "100%",
                "background-color": "#808080",
                "opacity": "0.5" });
    $("body").append(glass);
    glass.click(closeNavigation);

    var top = menu.position().top;
    top += menu.outerHeight(/*margins*/ false);
    var height = $("#wh-body").height() - top;

    var nav = $("#wh-navigation");
    nav.css({ "position": "absolute",
              "top": top + "px",
              "right": "0px",
              "z-index": "100",
              "width": "66%",
              "height": height + "px",
              "border-style": "solid",
              "display": "flex" }); // flex for "classic" and "simple" layouts.
}

function closeNavigation() {
    var menu = $("#wh-menu");
    menu.removeClass("wh-icon-close").addClass("wh-icon-menu");
    menu.attr("title", msg("Open navigation pane"));

    $("#wh-body-glass").remove();
    
    var nav = $("#wh-navigation");
    nav.css({ "position": "",
              "top": "",
              "right": "",
              "z-index": "",
              "width": "",
              "height": "",
              "border-style": "",
              "display": "" });

    // Restore user-specified width.
    var position = parseInt(storageGet("whSeparatorPosition"), 10);
    if (!isNaN(position)) {
        nav.width(position);
    }
}

// -------------------------------------
// initSeparator
// -------------------------------------

function initSeparator() {
    var navigation = $("#wh-navigation");
    var separator = $("#wh-separator");
    var content = $("#wh-content");

    // Leverages the jQuery easyDrag  plugin.
    separator.easyDrag({
        axis: "x",
        container: $("#wh-body"),
        clickable: false,
        cursor: "", // CSS specified.

        start: function() { 
            $(this).data("startDragLeftOffset", $(this).offset().left);
        },

        stop: function() {
            var delta = 
                $(this).offset().left - $(this).data("startDragLeftOffset");
            if (delta !== 0) {
                var availableW = $("#wh-body").width();
                
                var reservedW = 1 + getPad(navigation, /*vert*/ false)/2 +
                    separator.outerWidth(/*margins*/ true) +
                    getPad(content, /*vert*/ false)/2;

                var maxW = availableW - reservedW;

                var w = navigation.width() + delta;
                if (w < reservedW) {
                    w = reservedW; // Like for the right side.
                } else if (w > maxW) {
                    w = maxW;
                }
                saveSeparatorPosition(separator, w);
                navigation.width(w);
            }
        }
    });

    var position = parseInt(storageGet("whSeparatorPosition"), 10);
    if (isNaN(position)) {
        position = navigation.width();
    }
    saveSeparatorPosition(separator, position);
    navigation.width(position);
}

function getPad(pane, vertical) {
    // width() & height() are the content width & content height.
    // No borders, no padding here.

    if (vertical) {
        return pane.outerHeight(/*margins*/ true) - pane.height();
    } else {
        return pane.outerWidth(/*margins*/ true) - pane.width();
    }
}

function saveSeparatorPosition(separator, position) {
    // Required by the jQuery easyDrag  plugin.
    separator.css("left", "0px");

    storageSet("whSeparatorPosition", position.toString());
}

// -------------------------------------
// doInitTOC
// -------------------------------------

function populateTOC() {
    var tocPane = $("#wh-toc-pane");
    var list = $("<ul id='wh-toc'></ul>");
    tocPane.append(list);

    // toc_entries automatically generated by whc.
    if (typeof toc_entries !== "undefined") {
        var count = toc_entries.length;
        for (var i = 0; i < count; ++i) {
            addTOCEntry(toc_entries[i], list);
        }

        toc_entries = undefined; // Help GC.
    }
    // toc_entries undefined: probably just testing a layout.
}

function addTOCEntry(entry, list) {
    var text = entry[0];
    var href = entry[1];
    var children = entry[2];
    var count = (children !== null)? children.length : 0;

    var item = $("<li></li>");
    list.append(item);

    if (href !== null) {
        var link = $("<a></a>");
        link.attr("href", href);
        link.html(text);

        item.append(link);
    } else {
        item.html(text);
    }

    if (count > 0) {
        var sublist = $("<ul></ul>");
        item.append(sublist);

        for (var i = 0; i < count; ++i) {
            addTOCEntry(children[i], sublist);
        }
    }
}

function doInitTOC() {
    populateTOC();

    var toc = $("#wh-toc");
    var tocOptions = { storageKey: ("whTOCState" + storageId) };
    // toc_initiallyCollapsed automatically generated by whc.
    if ((typeof toc_initiallyCollapsed !== "undefined") &&
        toc_initiallyCollapsed) {
        tocOptions.initiallyCollapsed = true;
    }
    // toc_initiallyCollapsed undefined: probably just testing a layout.
    toc.toc(tocOptions);
}

// -------------------------------------
// initIndex
// -------------------------------------

var fieldKeys = {
    ENTER:  13,
    ESCAPE: 27,
    UP:     38,
    DOWN:   40
};

// -------------------------------------
// initSearch
// -------------------------------------

function startSearch(field) {
    stopSearch(field);

    var query = $.trim(field.val());
    if (query.length === 0) {
        field.val("");
        return null;
    }

    var words = splitWords(query);
    if (words === null) {
        field.val("");
        return null;
    }

    return [query, words];
}

function splitWords(query) {
    var split = query.split(/\s+/);
    var words = [];

    for (var i = 0; i < split.length; ++i) {
        var segment = split[i];

        if (stringStartsWith(segment, '"') || stringStartsWith(segment, "'")) {
            segment = segment.substring(1);
        }
        if (stringEndsWith(segment, '"') || stringEndsWith(segment, "'")) {
            segment = segment.substring(0, segment.length-1);
        }
        // Do not filter out words here.
        if (segment.length > 0) {
            words.push(segment.toLowerCase());
        }
    }

    if (words.length === 0) {
        words = null;
    }

    return words;
}

function stringStartsWith(text, prefix) {
    // String.startsWith not implemented by IE11.
    return (text.indexOf(prefix) === 0);
}

function stringEndsWith(text, suffix) {
    // String.endsWith not implemented by IE11.
    return (text.substr(-suffix.length) === suffix);
}

function stopSearch(field) {
    $("#wh-search-results").empty();
    // #wh-search-pane is the scrollable here.
    var pane = $("#wh-search-pane");
    pane.scrollTop(0);

    var words = pane.removeData("whSearchedWords2");
    if (words !== null) {
        unhighlightSearchedWords();
    }

    clearSearchState();
}

function highlightSearchedWords(words) {
    // Option wordsOnly:true does not seem to work for languages other than
    // English.
    $("#wh-content").highlight(words, 
                               { caseSensitive: false, 
                                 className: "wh-highlighted" });
}

function unhighlightSearchedWords() {
    $("#wh-content").unhighlight({ className: "wh-highlighted" });
}

function doSearch(query, words) {
    var searchResults = $("#wh-search-results");

    var searchedWords = [];
    var resultIndices = findWords(words, searchedWords);
    displaySearchResults(query, words, searchedWords, 
                         resultIndices, searchResults);

    saveSearchState(query, words, searchedWords, resultIndices);
}

function displaySearchResults(query, words, searchedWords, 
                              resultIndices, searchResults) {
    searchResults.empty();

    if (resultIndices === null || resultIndices.length === 0) {
        searchResults.append(searchResultHeader(0, words));
        return;
    }

    searchResults.append(searchResultHeader(resultIndices.length, words));
    searchResults.append(searchResultList(resultIndices));

    var resultLinks = $("#wh-search-result-list a");
    highlightSearchedWordsImmediately(searchedWords, resultLinks);

    var currentPage = trimFragment(window.location.href);
    resultLinks.click(function (event) {
        if (this.href === currentPage) {
            // Do nothing at all.
            event.preventDefault();
        } 
        // Otherwise, follow link normally.
    });
}

function findWords(words, searchedWords) {
    var pageCount = wh.search_baseNameList.length;
    var hits = new Array(pageCount);
    var i, j, k;

    for (i = 0; i < pageCount; ++i) {
        hits[i] = 0;
    }

    var wordCount = words.length;
    for (i = 0; i < wordCount; ++i) {
        var indices;
        var fallback = true;

        var word = words[i];
        if (wh.search_stemmer !== null && 
            word.search(/^[-+]?\d/) < 0) { // Not number-like.
            wh.search_stemmer.setCurrent(word);
            wh.search_stemmer.stem();
            var stem = wh.search_stemmer.getCurrent();
            //console.log(">>> word='"+ word + "' stem=" + stem + "' <<<");

            if (stem != word) {
                indices = wh.search_wordMap[stem];
                if (indices !== undefined) {
                    fallback = false;

                    searchedWords.push(stem);
                    if (word.indexOf(stem) < 0) {
                        // Examples: 
                        // word=victory, stem=victori.
                        // word=victories, stem=victori.
                        // (reprimand) word=rebuking, stem=rebuk.
                        // word=rebuked, stem=rebuk.
                        searchedWords.push(word);
                    }
                }
            }
        }

        if (fallback) {
            indices = wh.search_wordMap[word];
            searchedWords.push(word);
        }

        if (indices !== undefined) {
            var hitPageCount = 0;

            var indexCount = indices.length;
            for (j = 0; j < indexCount; ++j) {
                var index = indices[j];

                if ($.isArray(index)) {
                    hitPageCount += index.length;
                } else {
                    ++hitPageCount;
                }
            }

            // A formula for hits[pageIndex]
            //
            // +10000 when pageIndex contains the searched word.
            // +EXTRA between ]0,100], hence: *100.0
            //
            // EXTRA depends on:
            //
            // * The number of pages containing the searched word.
            //   More pages means smaller EXTRA, hence:
            //   *((pageCount - hitPageCount + 1)/pageCount)
            //
            // * The rank of the pageIndex within the list of pages
            //   contining searched word, hence:
            //   *((indexCount - j)/indexCount)
            //
            // When a word is contained in a single page, EXTRA=100.

            var unit = 100.0 * ((pageCount - hitPageCount + 1)/pageCount);

            for (j = 0; j < indexCount; ++j) {
                var index = indices[j];

                if ($.isArray(index)) {
                    var hitIncr = 
                        10000.0 + (((indexCount - j)/indexCount) * unit);

                    for (k = 0; k < index.length; ++k) {
                        hits[index[k]] += hitIncr;
                    }
                } else {
                    hits[index] += 
                        10000.0 + (((indexCount - j)/indexCount) * unit);
                }
            }
        } else {
            // Give up if any of the searched words is not found. AND
            // semantics 1/2.
            return null;
        }
    }

    var resultIndices = [];
    var minHitValue = 10000.0 * wordCount; // AND semantics 2/2.
    for (i = 0; i < pageCount; ++i) {
        if (hits[i] > minHitValue) {
            resultIndices.push(i);
        }
    }

    if (resultIndices.length === 0) {
        resultIndices = null;
    } else if (resultIndices.length > 1) {
        function comparePageIndices(i, j) {
            var delta = hits[j] - hits[i];
            if (delta !== 0) {
                return delta;
            } else {
                return (i - j);
            }
        };

        resultIndices.sort(comparePageIndices);
    }

    return resultIndices;
}

function searchResultHeader(resultCount, words) {
    var header = $("<div id='wh-search-result-header'></div>");

    var message;
    switch (resultCount) {
    case 0:
        message = msg("No results found for %W%.");
        break;
    case 1:
        message = msg("1 result found for %W%.");
        break;
    default:
        message = 
          msg("%N% results found for %W%.").replace(new RegExp("%N%", "g"),
                                                    resultCount.toString());
    }
    message = escapeHTML(message);

    var spans = "";
    for (var i = 0; i < words.length; ++i) {
        if (i > 0) {
            spans += " ";
        }
        spans += "<span class='wh-highlighted'>";
        spans += escapeHTML(words[i]);
        spans += "</span>";
    }

    header.html(message.replace(new RegExp("%W%", "g"), spans));

    return header;
}

function escapeHTML(text) {
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;");
}

function searchResultList(resultIndices) {
    var list = $("<ul id='wh-search-result-list'></ul>");

    var resultCount = resultIndices.length;
    for (var i = 0; i < resultCount; ++i) {
        var index = resultIndices[i];

        var item = $("<li class='wh-search-result-item'></li>");
        if ((i % 2) === 1) {
            item.addClass("wh-odd-item");
        }
        list.append(item);

        var link = $("<a></a>");
        link.attr("href", wh.search_baseNameList[index]);
        link.html(wh.search_titleList[index]);
        item.append(link);
    }

    return list;
}

function highlightSearchedWordsImmediately(searchedWords, resultLinks) {
    var currentPage = trimFragment(window.location.href);

    var resultLink = resultLinks.filter(function () {
        return this.href === currentPage;
    });

    if (resultLink.length === 1) {
        $("#wh-search-pane").data("whSearchedWords2", searchedWords);

        // Toggle present only in the classic layout.
        var highlightToggle = $("#wh-search-highlight");
        if (highlightToggle.length === 0 || highlightToggle.toggle("check")) {
            highlightSearchedWords(searchedWords);
        }
    }
}

function saveSearchState(query, words, searchedWords, resultIndices) {
    storageSet("whSearchQuery", query);
    storageSet("whSearchedWords", words.join(" "));
    storageSet("whSearchedWords2", searchedWords.join(" "));
    storageSet("whSearchResults", 
               ((resultIndices === null || resultIndices.length === 0)? 
                "" : resultIndices.join(",")));
}

function clearSearchState() {
    storageDelete("whSearchQuery");
    storageDelete("whSearchedWords");
    storageDelete("whSearchedWords2");
    storageDelete("whSearchResults");
}

function restoreSearchState(field) {
    var query = storageGet("whSearchQuery");
    if (query) {
        var words = storageGet("whSearchedWords");
        var searchedWords = storageGet("whSearchedWords2");
        var list = storageGet("whSearchResults");

        // Do not clear search state.

        if (query.length > 0 && 
            words !== undefined && 
            searchedWords !== undefined && 
            list !== undefined) {
            words = words.split(" ");
            if (words.length > 0) {
                searchedWords = searchedWords.split(" ");
                if (searchedWords.length > 0) {
                    var resultIndices = [];

                    if (list.length > 0) {
                        var items = list.split(",");
                        var count = items.length;
                        for (var i = 0; i < count; ++i) {
                            var index = parseInt(items[i], 10);
                            if (index >= 0) {
                                resultIndices.push(index);
                            } else {
                                // Give up.
                                return;
                            }
                        }
                    }

                    field.val(query);
                    displaySearchResults(query, words, searchedWords,
                                        resultIndices, $("#wh-search-results"));
                }
            }
        }
    }
}

// -------------------------------------
// initContent
// -------------------------------------

function initContent() {
    selectTOCEntry(window.location.href);

    // Clicking on some links does not cause this page to be reloaded
    // and hence this document ready handler to be invoked.

    $("#wh-toc a[href], #wh-content a[href]").click(function () {
        if (trimFragment(this.href) === trimFragment(window.location.href)) {
            selectTOCEntry(this.href);
        }
    });
}

function trimFragment(href) {
    var hash = href.lastIndexOf("#");
    if (hash >= 0) {
        return href.substring(0, hash);
    } else {
        return href;
    }
}

function selectTOCEntry(url) {
    var links = $("#wh-toc a");
    links.removeClass("wh-toc-selected");

    var selectable = links.filter(function () {
        // url possibly ends with a fragment.
        // this.href is fully resolved and possibly ends with a fragment.
        return (this.href === url);
    });

    var hash;
    if (selectable.length === 0 && (hash = url.lastIndexOf("#")) >= 0) {
        url = url.substring(0, hash);

        selectable = links.filter(function () {
            return (this.href === url);
        });
    }

    if (selectable.length === 0) {
        // From here, url is guaranteed not to have a fragment.
        selectable = links.filter(function () {
            return (trimFragment(this.href) === url);
        });
    }

    if (selectable.length > 0) {
        selectable = selectable.first();
        selectable.addClass("wh-toc-selected");

        var entry = selectable.parent("li");
        $("#wh-toc").toc("showEntry", entry, /*scroll*/ false);
        
        // #wh-toc-pane is the scrollable here.
        var pane = $("#wh-toc-pane");
        if (pane.is(":visible")) {
            pane.removeData("whPendingScroll");
            pane.scrollTop(entry.offset().top - pane.offset().top);
        } else {
            pane.data("whPendingScroll", { container: pane, component: entry });
        }
    }
}

function processPendingScroll(pane) {
    var scroll = pane.data("whPendingScroll");
    if (scroll !== undefined) {
        pane.removeData("whPendingScroll");
        scroll.container.scrollTop(scroll.component.offset().top - 
                                   scroll.container.offset().top);
    }
}

// -------------------------------------
// initPage
// -------------------------------------

function layout(resizeEvent) {
    var menu = $("#wh-menu");
    if (menu.hasClass("wh-icon-close")) {
        // The following code is needed because otherwise, on Android, 
        // focus() in Index or Search field ==> the soft keyboard is 
        // displayed ==> the window is resized ==> 
        // the navigation pane is closed. Hence unusable navigation pane!

        if (resizeEvent === null) {
            closeNavigation();
        } else if (window.matchMedia("(max-width: 575.98px)").matches) {
            // See media queries in responsive.css.

            // Do not close navigation pane. 
            // Just adjust its height like done in openNavigation().

            var top = menu.position().top;
            top += menu.outerHeight(/*margins*/ false);
            var height = $("#wh-body").height() - top;

            $("#wh-navigation").css("height", height + "px");
        } else {
            closeNavigation();
        }
    }

    // ---

    var h = $(window).height();
    var pane = $("#wh-header");
    if (pane.length > 0 && pane.is(":visible")) {
        h -= pane.outerHeight(/*margins*/ true);
    }
    pane = $("#wh-footer");
    if (pane.length > 0 && pane.is(":visible")) {
        h -= pane.outerHeight(/*margins*/ true);
    }

    var body = $("#wh-body");
    body.outerHeight(h, /*margins*/ true);
}

function scrollToFragment() {
    /* As of jQuery v3, document.ready may be invoked after the Web browser
       reaches window.location.href. layout may have changed the correct
       scroll position, so restore it now. */
    var fragment = getFragment(window.location.href);
    if (fragment !== null) {
        // Convert fragment to selector for use in $(selector) below.
        // Note that an ID may contain a dot like in #foo.bar 
        // (element having a "foo" ID and a "bar" class!).
        fragment = fragment.replace(/\./g, "\\.");

        var anchor = $(fragment);
        if (anchor) {
            //  #wh-content is the scrollable here.
            var content = $("#wh-content");
            content.scrollTop(anchor.offset().top - content.offset().top + 
                              content.scrollTop());
            /* Normally content.scrollTop is always 0. */
        }
    }
}

function getFragment(href) {
    var hash = href.lastIndexOf("#");
    if (hash >= 0) {
        return href.substring(hash); /*starts with '#'.*/
    } else {
        return null;
    }
}
