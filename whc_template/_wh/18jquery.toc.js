/*
 * Copyright (c) 2017-2019 XMLmind Software. All rights reserved.
 *
 * This file is part of the XMLmind Web Help Compiler project.
 * For conditions of distribution and use, see the accompanying LEGAL.txt file.
 */

;(function ($) {
    var methods = {
        init: function (options) { 
            var settings = $.extend({ initiallyCollapsed: false }, options);

            var toc = this.first();
            toc.addClass("toc-toc");
            toc.data("toc", settings);

            var collapsible = methods.getCollapsibleEntries.call(toc);
            if (collapsible.length > 0) {
                var hasSingleRoot = (toc.children("li").length === 1);
                methods.restoreCollapsibleEntries.call(toc, collapsible, 
                                                       hasSingleRoot);

                var clickEndX = NaN;
                var paddingLeft = collapsible.css("padding-left");
                if (paddingLeft.substr(-2) === "px") {
                    clickEndX = 
                      parseInt(paddingLeft.substring(0, paddingLeft.length-2));
                }
                if (isNaN(clickEndX)) {
                    clickEndX = 16;
                }

                collapsible.click(function (event) {
                    var entry = $(this);

                    var x = event.pageX - entry.offset().left;
                    if (x >= 0 && x < clickEndX) {
                        event.stopImmediatePropagation();

                        var contents = entry.children("ul");
                        if (entry.hasClass("toc-collapsed")) {
                            entry.removeClass("toc-collapsed")
                                 .addClass("toc-expanded");
                            contents.show();
                        } else {
                            entry.removeClass("toc-expanded")
                                 .addClass("toc-collapsed");
                            contents.hide();
                        }

                        methods.saveCollapsibleEntries.call(toc, collapsible);
                    }
                });
            }

            return toc;
        },

        expandCollapseAll: function (expand) {
            var toc = this.first();
            var collapsible = methods.getCollapsibleEntries.call(toc);
            collapsible.each(function () { 
                var entry = $(this);

                if (expand && entry.hasClass("toc-collapsed")) {
                    entry.removeClass("toc-collapsed")
                         .addClass("toc-expanded");
                    entry.children("ul").show();
                } else if (!expand && entry.hasClass("toc-expanded")) {
                    entry.removeClass("toc-expanded")
                         .addClass("toc-collapsed");
                    entry.children("ul").hide();
                }
            });

            methods.saveCollapsibleEntries.call(toc, collapsible);

            return toc;
        },

        showEntry: function (entry, scroll) {
            var toc = this.first();

            entry.parents(toc, "li").each(function () {
                var e = $(this);
                if (e.hasClass("toc-collapsed")) {
                    e.removeClass("toc-collapsed").addClass("toc-expanded");
                    e.children("ul").show();
                }
            });

            if (scroll && toc.is(":visible")) {
                var scrollable = methods.getScrollParent.call(toc);
                // entry.offset().top incorrect when some ul parents were
                // collapsed.
                scrollable.scrollTop(entry.offset().top - 
                                     scrollable.offset().top);
            }
            // Otherwise, would not work.

            // Do not save state in this case.
            return toc;
        },

        /*
         * Copied from jquery.scrollparent.js
         * https://github.com/Aaronius/jquery-scrollparent
         * Itself copied from  jQuery UI. Same MIT License as jQuery UI.
         */
        getScrollParent: function() {
            var position = this.css("position");
            var excludeStaticParent = (position === "absolute");
            var scrollParent = this.parents().filter(function() {
                var parent = $(this);
                if (excludeStaticParent && 
                    parent.css("position") === "static") {
                    return false;
                }
                return (/(auto|scroll)/).test(parent.css("overflow") + 
                                              parent.css("overflow-y") + 
                                              parent.css("overflow-x"));
            }).eq(0);
            
            // this[0] returns the DOM element wrapped in this jQuery object.
            return (position === "fixed" || scrollParent.length === 0)? 
                $(this[0].ownerDocument || document) : scrollParent;
        },

        getCollapsibleEntries: function () {
            return $("li", this).filter(function () {
                return $(this).children("ul").length > 0;
            });
        },

        saveCollapsibleEntries: function (collapsible) {
            var settings = this.data("toc");
            if (settings.storageKey) {
                var state = [];
                collapsible.each(function () {
                    state.push($(this).hasClass("toc-collapsed")? 0 : 1);
                });

                window.sessionStorage.setItem(settings.storageKey,
                                              state.join(""));
            }
        },

        restoreCollapsibleEntries: function (collapsible, hasSingleRoot) {
            var fallback = true;

            var settings = this.data("toc");
            if (settings.storageKey) {
                var storedValue = 
                    window.sessionStorage.getItem(settings.storageKey);
                if (storedValue) {
                    var state = storedValue.split("");
                    if (state.length === collapsible.length) {
                        fallback = false;

                        collapsible.each(function (index) {
                            var entry = $(this);

                            var contents = entry.children("ul");
                            if (parseInt(state[index], 10) === 0) {
                                entry.addClass("toc-collapsed");
                                contents.hide();
                            } else {
                                entry.addClass("toc-expanded");
                                contents.show();
                            }
                        });
                    }
                }
            }

            if (fallback) {
                if (settings.initiallyCollapsed) {
                    collapsible.each(function (index) {
                        var entry = $(this);

                        if (hasSingleRoot && index === 0) {
                            entry.addClass("toc-expanded");
                            // All entries are initially visible.
                        } else {
                            entry.addClass("toc-collapsed");
                            entry.children("ul").hide();
                        }
                    });
                } else {
                    collapsible.each(function (index) {
                        $(this).addClass("toc-expanded");
                        // All entries are initially visible.
                    });
                }
            }
        }
    };

    $.fn.toc = function (method) {
        if (methods[method]) {
            return methods[method].apply(
                this, 
                Array.prototype.slice.call(arguments, 1));
        } else if ((typeof method === "object") || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("Method '" + method + "' does not exist in jQuery.toc");
            return this;
        }    
    };
})(jQuery);
