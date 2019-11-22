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

    var searchField = $("#wh-search-field");
    initSearch(searchField);

    initContent();

    $(window).resize(layout);
    layout(/*resizeEvent*/ null);

    restoreSearchState(searchField);

    scrollToFragment();
}

// -------------------------------------
// initNavigation
// -------------------------------------

function initNavigation() {
    $("#wh-do-search").attr("title", msg("Search"));
    $("#wh-search-field").attr("placeholder", msg("Search"));
    $("#wh-cancel-search").attr("title", msg("Stop searching"));

    var selectedPane = 0;
    var storedValue = storageGet("whSelectedPane");
    if (storedValue) {
        selectedPane = parseInt(storedValue);
    }
    selectPane(selectedPane);
}

function selectPane(index) {
    storageSet("whSelectedPane", index);

    // CSS sets #wh-search-pane { display: none; }
    var tocPane = $("#wh-toc-pane");
    var searchPane = $("#wh-search-pane");
    var cancelSearchButton = $("#wh-cancel-search");
    var searchForm = $("#wh-navigation-form");
    if (index === 0) {
        if (searchPane.is(":visible")) {
            searchPane.hide();

            cancelSearchButton.css({ "visibility": "hidden", "opacity": "0" });

            tocPane.show(); 
            processPendingScroll(tocPane);
        }
    } else {
        if (tocPane.is(":visible")) {
            tocPane.hide();

            cancelSearchButton.css({ "visibility": "visible", "opacity": "1" });
            $("#wh-search-field").focus();

            searchPane.show(); 
            processPendingScroll(searchPane);
        }
    }
}

// -------------------------------------
// initTOC
// -------------------------------------

function initTOC() {
    doInitTOC();
}

// -------------------------------------
// initSearch
// -------------------------------------

function initSearch(field) {
    field.attr("autocomplete", "off").attr("spellcheck", "false");

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

    $("#wh-do-search").click(function (event) {
        search(field);
    });
    $("#wh-cancel-search").click(function (event) { 
        cancelSearch(field);
    });
}

function search(field) {
    var pair = startSearch(field);
    if (pair === null) {
        return;
    }

    if (!$("#wh-search-pane").is(":visible")) {
        selectPane(1);
    }

    doSearch(pair[0], pair[1]);
}

function cancelSearch(field) {
    field.val("");
    stopSearch(field);

    if (!$("#wh-toc-pane").is(":visible")) {
        selectPane(0);
    }
}

