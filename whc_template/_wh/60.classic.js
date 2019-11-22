/*
 * Copyright (c) 2019 XMLmind Software. All rights reserved.
 *
 * This file is part of the XMLmind Web Help Compiler project.
 * For conditions of distribution and use, see the accompanying LEGAL.txt file.
 */

// -------------------------------------
// initPage
// -------------------------------------

/*public*/ function initPage() {
    initMenu();
    initSeparator();

    initNavigation();

    initTOC();

    var hasIndex = ($("#wh-index-container").length === 1);
    var indexField = null;
    if (hasIndex) {
        indexField = $("#wh-index-field");
        initIndex(indexField);
    }

    var searchField = $("#wh-search-field");
    initSearch(searchField);

    initContent();

    $(window).resize(layout);
    layout(/*resizeEvent*/ null);

    if (hasIndex) {
        restoreIndexTerm(indexField);
    }
    restoreSearchState(searchField);

    scrollToFragment();
}

// -------------------------------------
// initNavigation
// -------------------------------------

function initNavigation() {
    var indexTab = $("#wh-index-tab");
    if ($("#wh-toc-tab > a").css("font-weight") > 
            $("#wh-toc-tab").css("font-weight")) { // e.g. 700 > 400
        // Handy trick: set "--tab-icon-font-weight" to "bold" to have 
        // text besides the icon.
        $("#wh-toc-tab > a").text(msg("Contents"));
        if (indexTab.length === 1) {
            $("#wh-index-tab > a").text(msg("Index"));
        }
        $("#wh-search-tab > a").text(msg("Search"));
    } else {
        $("#wh-toc-tab").attr("title", msg("Contents"));
        if (indexTab.length === 1) {
            indexTab.attr("title", msg("Index"));
        }
        $("#wh-search-tab").attr("title", msg("Search"));
    }

    var index = 0;
    var tabsState = storageGet("whTabsState");
    if (tabsState) {
        index = parseInt(tabsState);
    }
    $("#wh-tabs").tabs({ selected: index, onselect: tabSelected });
}

function tabSelected(index) {
    var index = $("#wh-tabs").tabs("select");
    storageSet("whTabsState", index);

    var pane;
    switch (index) {
    case 0:
        pane = $("#wh-toc-pane");
        break;
    case 1:
        pane = $("#wh-index-pane");
        if (pane.length === 1) {
            $("#wh-index-field").focus();
            break;
        }
        // FALLTHROUGH
    case 2:
        pane = $("#wh-search-pane");
        $("#wh-search-field").focus();
        break;
    }

    processPendingScroll(pane);
}

// -------------------------------------
// initTOC
// -------------------------------------

function initTOC() {
    doInitTOC();

    initTOCButtons();
}

function initTOCButtons() {
    var toc = $("#wh-toc");

    var button = $("#wh-toc-collapse-all");
    button.attr("title", msg("Collapse All"))
          .click(function (event) { 
              event.preventDefault();
              toc.toc("expandCollapseAll", false); 
          });

    button = $("#wh-toc-expand-all");
    button.attr("title", msg("Expand All"))
          .click(function (event) { 
              event.preventDefault();
              toc.toc("expandCollapseAll", true); 
          });

    button = $("#wh-toc-previous");
    button.attr("title", msg("Previous Page"))
          .click(function (event) { 
              goTo(true);
          });

    button = $("#wh-toc-next");
    button.attr("title", msg("Next Page"))
          .click(function (event) { 
              goTo(false);
          });

    button = $("#wh-toc-print");
    button.attr("title", msg("Print Page"))
          .click(function (event) { 
              print();
          });
}

function goTo(previous) {
    var anchors = $("#wh-toc a[href]");
    var currentPage = trimFragment(window.location.href);
    var currentAnchor = anchors.filter(function (index) {
        return (trimFragment(this.href) === currentPage);
    });

    var target = null;

    if (currentAnchor.length > 0) {
        if (previous) {
            currentAnchor = currentAnchor.first();
        } else {
            currentAnchor = currentAnchor.last();
        }

        var index = anchors.index(currentAnchor);
        if (index >= 0) {
            if (previous) {
                --index;
            } else {
                ++index;
            }
            if (index >= 0 && index < anchors.length) {
                target = anchors.get(index);
            }
        }
    } else if (anchors.length > 0) {
        if (previous) {
            target = anchors.last().get(0);
        } else {
            target = anchors.first().get(0);
        }
    }

    if (target !== null) {
        window.location.href = trimFragment(target.href);
    }
}

function print() {
    var anchors = $("#wh-toc a[href]");
    var currentPage = trimFragment(window.location.href);
    var currentAnchor = anchors.filter(function (index) {
        return (trimFragment(this.href) === currentPage);
    });

    if (currentAnchor.length > 0) {
        currentAnchor = currentAnchor.first();
        var currenTitle = currentAnchor.text();

        var popup = 
            window.open("", "whPrint", 
                        "left=0,top=0,height=400,width=600" +
                        ",resizable=yes,scrollbars=yes,status=yes");
        if (popup) {
            // IE11 does not support the variant not using Document.write.
            var doc = popup.document;
            doc.open();

            doc.write("<html><head><title>");
            doc.write(escapeHTML(currenTitle));
            doc.write("</title>");

            doc.write("<base href=\"");
            doc.write(currentPage);
            doc.write("\">");

            $("head > link[rel='stylesheet'][href], head > style").each(
                function (index) {
                    // Do not copy _wh/wh.css.
                    if (!$(this).is("link") ||
                        $(this).attr("href").indexOf("_wh/wh.css") < 0) {
                        var div = $("<div></div>").append($(this).clone());
                        doc.write(div.html());
                    }
                });

            doc.write("</head><body>");
            doc.write($("#wh-content").html());
            doc.write("</body></html>");

            doc.close();
            popup.setTimeout(function() { popup.print(); popup.close(); }, 250);
        }
    }
}

// -------------------------------------
// initIndex
// -------------------------------------

function populateIndex() {
    var indexPane = $("#wh-index-pane");
    var list = $("<ul id='wh-index'></ul>");
    indexPane.append(list);

    // index_entries automatically generated by whc.
    if (typeof index_entries !== "undefined") {
        var count = index_entries.length;
        for (var i = 0; i < count; ++i) {
            addIndexEntry(index_entries[i], list);
        }

        index_entries = undefined; // Help GC.
    }
    // index_entries undefined: probably just testing a layout.
}

/*
 * index -> [ entry+ ]
 * entry -> { term:escaped_XHTML, see|(anchor? see_also? sub_entries?) }
 * see -> see:[ escaped_XHTML+ ]
 * anchor -> anchor:[ (escaped_quoted_URI, (escaped_quoted_URI|null))+ ]
 * see_also -> seeAlso:[ escaped_XHTML+ ]
 * sub_entries -> entry:[ entry+ ]
 */

function addIndexEntry(entry, list) {
    var item = $("<li class='wh-index-entry'></li>");
    list.append(item);

    var term = $("<span class='wh-index-term'></span>");
    term.html(entry.term);
    item.append(term);

    var i;
    var terms = entry.see;
    if (terms !== undefined) {
        var seeList = $("<ul class='wh-index-entries'></ul>");
        item.append(seeList);
        addSee("see", terms, seeList);
    } else {
        var hrefs = entry.anchor;
        if (hrefs !== undefined) {
            var j  = 0;

            var hrefCount = hrefs.length;
            for (i = 0; i < hrefCount; i += 2) {
                var href = hrefs[i];
                var href2 = hrefs[i+1];

                item.append("\n");

                var link = $("<a class='wh-index-anchor'></a>");
                link.attr("href", href);
                ++j;
                link.text("[" + j + "]");
                item.append(link);

                if (href2 !== null) {
                    item.append("&#8212;");

                    var link2 = $("<a class='wh-index-anchor'></a>");
                    link2.attr("href", href2);
                    ++j;
                    link2.text("[" + j + "]");
                    item.append(link2);
                }
            }
        }

        var entries = entry.entry;
        terms = entry.seeAlso;
        if (entries !== undefined || terms !== undefined) {
            var subList = $("<ul class='wh-index-entries'></ul>");
            item.append(subList);

            if (entries !== undefined) {
                var entryCount = entries.length;
                for (i = 0; i < entryCount; ++i) {
                    addIndexEntry(entries[i], subList);
                }
            }

            if (terms !== undefined) {
                addSee("see-also", terms, subList);
            }
        }
    }
}

function addSee(refType, terms, list) {
    var termCount = terms.length;
    for (var i = 0; i < termCount; ++i) {
        var term = terms[i];

        var item = $("<li></li>");
        item.addClass("wh-index-" + refType);
        item.html("\n" + term);
        list.append(item);

        var see = $("<span class='wh-index-ref-type'></span>");
        see.text((refType === "see")? msg("See") : msg("See also"));
        see.prependTo(item);
    }
}

function initIndex(field) {
    populateIndex();
    $("#wh-index > li:odd").addClass("wh-odd-item");

    field.attr("autocomplete", "off").attr("spellcheck", "false")
         .attr("placeholder", msg("term"));

    var allItems = $("#wh-index li");
    field.keyup(function (event) {
        switch (event.which) {
        case fieldKeys.ENTER:
            goSuggestedIndexEntry(field, allItems);
            break;
        case fieldKeys.ESCAPE:
            cancelSuggestIndexEntry(field, allItems);
            break;
        case fieldKeys.UP:
            autocompleteIndexEntry(field, allItems, true);
            break;
        case fieldKeys.DOWN:
            autocompleteIndexEntry(field, allItems, false);
            break;
        default:
            suggestIndexEntry(field, allItems);
        }
    });

    $("#wh-go-page").attr("title", msg("Go"))
                    .click(function (event) {
        goSuggestedIndexEntry(field, allItems);
    });

    $("#wh-index a.wh-index-anchor").click(function (event) {
        selectIndexEntry(this, field, allItems);
    });
}

var indexEntries = null;

function suggestIndexEntry(field, allItems) {
    cancelSuggestIndexItem(field, allItems);

    var prefix = normalizeTerm(field.val());
    if (prefix.length > 0) {
        if (indexEntries === null) {
            initIndexEntries();
        }
        var entryCount = indexEntries.length;
        for (var i = 0; i < entryCount; i += 2) {
            if (indexEntries[i].indexOf(prefix) === 0) {
                suggestIndexItem(indexEntries[i+1]);
                break;
            }
        }
    }
}

function normalizeTerm(term) {
    if (term.length > 0) {
        term = term.replace(/^\s+|\s+$/g, "")
                   .replace(/\s{2,}/g, " ")
                   .toLowerCase();
    }
    return term;
}

function initIndexEntries() {
    indexEntries = [];
    collectIndexEntries($("#wh-index > li"), null, indexEntries);
}

function collectIndexEntries(items, parentTerm, list) {
    items.each(function () {
        var termSpan =  $(this).children("span.wh-index-term");
        if (termSpan.length === 1) {
            var term = normalizeTerm(termSpan.text());
            if (parentTerm !== null) {
                term = parentTerm + " " + term;
            }
            list.push(term);
            list.push(this);

            var subItems = $(this).children("ul.wh-index-entries")
                                  .children("li.wh-index-entry");
            if (subItems.length > 0) {
                collectIndexEntries(subItems, term, list);
            }
        }
    });
}

function suggestIndexItem(item) {
    var suggest = $(item);
    suggest.addClass("wh-suggested-item");

    // #wh-index-pane is the scrollable here.
    var pane = $("#wh-index-pane");
    if (pane.is(":visible")) {
        pane.removeData("whPendingScroll");
        pane.scrollTop(suggest.offset().top - pane.offset().top);
    } else {
        pane.data("whPendingScroll", { container: pane, component: suggest });
    }
}

function cancelSuggestIndexEntry(field, allItems) {
    field.val("");
    cancelSuggestIndexItem(field, allItems);
}

function cancelSuggestIndexItem(field, allItems) {
    // Forget last selected index term, if any.
    storageDelete("whIndexTerm");

    allItems.removeClass("wh-suggested-item");
    // #wh-index-pane is the scrollable here.
    var pane = $("#wh-index-pane");
    pane.scrollTop(0);
    pane.removeData("whPendingScroll");
}

function goSuggestedIndexEntry(field, allItems) {
    var item = allItems.filter(".wh-suggested-item");
    if (item.length === 1) {
        var anchors = item.children("a.wh-index-anchor");
        if (anchors.length > 0) {
            var anchor = anchors.get(0);
            selectIndexEntry(anchor, field, allItems);

            window.location.href = anchor.href;
        }
    }
}

function autocompleteIndexEntry(field, allItems, previous) {
    cancelSuggestIndexItem(field, allItems);

    var term = null;
    var item = null;

    if (indexEntries === null) {
        initIndexEntries();
    }

    var prefix = normalizeTerm(field.val());
    if (prefix.length > 0) {
        // Does the field already contains a term?
        // If this is the case, select previous or next term.

        var entryCount = indexEntries.length;
        var i;
        for (i = 0; i < entryCount; i += 2) {
            if (indexEntries[i] === prefix) {
                var index;
                if (previous) {
                    index = i - 2;
                } else {
                    index = i + 2;
                }
                if (index >= 0 && index+1 < entryCount) {
                    term = indexEntries[index];
                    item = indexEntries[index+1];
                } else {
                    // Reached beginning or reached end.
                    term = indexEntries[i];
                    item = indexEntries[i+1];
                }
                break;
            }
        }

        if (item === null) {
            // May be the field contains just a term prefix.
            // If this is the case, first autocomplete it.

            for (i = 0; i < entryCount; i += 2) {
                if (indexEntries[i].indexOf(prefix) === 0) {
                    term = indexEntries[i];
                    item = indexEntries[i+1];
                    break;
                }
            }
        }
    } else {
        // Use very first item.
        term = indexEntries[0];
        item = indexEntries[1];
    }

    if (item !== null) {
        field.val(term);
        suggestIndexItem(item);
    }
}

function selectIndexEntry(anchor, field, allItems) {
    var term = null;

    var item = $(anchor).parent().get(0);

    if (indexEntries === null) {
        initIndexEntries();
    }
    var entryCount = indexEntries.length;
    for (var i = 0; i < entryCount; i += 2) {
        if (indexEntries[i+1] === item) { // Same li elements.
            term = indexEntries[i];
            break;
        }
    }

    if (term === null) {
        // Should not happen.
        storageDelete("whIndexTerm");
    } else {
        // Remember selected index term.
        storageSet("whIndexTerm", term);

        field.val(term);
        allItems.removeClass("wh-suggested-item");
        $(item).addClass("wh-suggested-item");
        // Do not scroll #wh-index-pane.

        // In all cases, follow the link normally to show the index term.
    }
}

function restoreIndexTerm(field) {
    var term = storageGet("whIndexTerm");
    if (term) {
        field.val(term);

        if (indexEntries === null) {
            initIndexEntries();
        }
        var entryCount = indexEntries.length;
        for (var i = 0; i < entryCount; i += 2) {
            if (indexEntries[i] === term) {
                suggestIndexItem(indexEntries[i+1]);
                break;
            }
        }

        // And do not forget current index term.
    }
}

// -------------------------------------
// initSearch
// -------------------------------------

function initSearch(field) {
    field.attr("autocomplete", "off").attr("spellcheck", "false")
         .attr("placeholder", msg("word"));

    field.keyup(function (event) {
        switch (event.which) {
        case fieldKeys.ENTER:
            search(field);
            break;
        case fieldKeys.ESCAPE:
            cancelSearch(field);
            break;
        }
    });

    $("#wh-do-search").attr("title", msg("Search"))
                      .click(function (event) {
        search(field);
    });

    $("#wh-cancel-search").attr("title", msg("Stop searching"))
                          .click(function (event) { 
        cancelSearch(field);
    });

    var toggle = $("#wh-search-highlight");
    toggle.attr("title", msg("Toggle search result highlighting"));
    toggle.toggle({ checked: storageGet("whHighlightOff")? false : true,
                    ontoggle: toggleHighlight });

}

function toggleHighlight(checked) {
    if (checked) {
        storageDelete("whHighlightOff");
    } else {
        storageSet("whHighlightOff", "1");
    }

    var words = $("#wh-search-pane").data("whSearchedWords2");
    if (words !== undefined) {
        if (checked) {
            highlightSearchedWords(words);
        } else {
            unhighlightSearchedWords();
        }
    }
}

function search(field) {
    var pair = startSearch(field);
    if (pair === null) {
        return;
    }

    doSearch(pair[0], pair[1]);
}

function cancelSearch(field) {
    field.val("");
    stopSearch(field);
}

