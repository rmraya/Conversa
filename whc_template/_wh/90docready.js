/*
 * Copyright (c) 2019 XMLmind Software. All rights reserved.
 *
 * This file is part of the XMLmind Web Help Compiler project.
 * For conditions of distribution and use, see the accompanying LEGAL.txt file.
 */

// ---------------------------------------------------------------------------
// jQuery document ready
// ---------------------------------------------------------------------------

$(document).ready(function() {
    // CSS sets #wh-body { visibility: hidden; opacity: 0; }
    // to prevent layout flickering (FOUC) during initPage/layout.

    wh.initPage();

    $("#wh-body").css({ "visibility": "visible", "opacity": "1" }); 
});

