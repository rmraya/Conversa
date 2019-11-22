/*
 * Copyright (c) 2019 XMLmind Software. All rights reserved.
 *
 * This file is part of the XMLmind Web Help Compiler project.
 * For conditions of distribution and use, see the accompanying LEGAL.txt file.
 */

/*
  Tabs have a particular set of markup that must be used in order for them to
  work properly:

  - The tabs themselves must be in either an ordered (<ol>) or unordered
    (<ul>) list.

  - Each tab "title" must be inside of a list item (<li>) and wrapped by an
    anchor (<a>) with an href attribute
 
  - Each tab panel may be any valid element but it must have an id which
    corresponds to the hash in the anchor of the associated tab.
*/

;(function ($) {
    var methods = {
        init: function (options) { 
            var settings = $.extend({ selected: 0, onselect: null }, 
                                    options);

            var tabs = this.first();
            tabs.addClass("tabs-tabs");

            tabs.children("li").each(function (itemIndex) {
                $(this).addClass("tabs-tab");

                var links = $(this).children("a[href]");
                $(this).add(links).click(function (event) {
                    // Do not follow link.
                    event.preventDefault();
                    // Do not let both the item and the link handle the click.
                    event.stopImmediatePropagation();

                    methods.select.call(tabs, itemIndex);
                });
            });

            if (typeof settings.onselect === "function") {
                tabs.data("onSelectTab", settings.onselect);
            }

            methods.select.call(tabs, settings.selected);

            return tabs;
        },

        select: function (index) { 
            var tabs = this.first();

            if (typeof index === "number") {
                var items = tabs.children("li");
                if (index < 0) {
                    index = 0;
                } else if (index >= items.length) {
                    index = items.length - 1;
                }

                tabs.removeData("selectedTab");
                var selected = false;

                items.each(function (itemIndex) {
                    var panel = methods.getPanel.call(tabs, $(this));
                    if (itemIndex === index) {
                        $(this).addClass("tabs-selected");
                        panel.show();
                        selected = true;
                    } else {
                        $(this).removeClass("tabs-selected");
                        panel.hide();
                    }
                });

                if (selected) {
                    tabs.data("selectedTab", index);
                    if (tabs.data("onSelectTab")) {
                        tabs.data("onSelectTab").call(tabs, index);
                    }
                }

                return tabs;
            } else {
                return tabs.data("selectedTab");
            }
        },

        getPanel: function (item) {
            var href = item.children("a[href]").first().attr("href");
            if (href && href.indexOf("#") === 0) {
                // Use href as a selector.
                return $(href);
            } else {
                return $();
            }
        },
    };

    $.fn.tabs = function (method) {
        if (methods[method]) {
            return methods[method].apply(
                this, 
                Array.prototype.slice.call(arguments, 1));
        } else if ((typeof method === "object") || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("Method '" + method + "' does not exist in jQuery.tabs");
            return this;
        }    
    };
})(jQuery);
