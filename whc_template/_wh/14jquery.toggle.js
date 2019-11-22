/*
 * Copyright (c) 2019 XMLmind Software. All rights reserved.
 *
 * This file is part of the XMLmind Web Help Compiler project.
 * For conditions of distribution and use, see the accompanying LEGAL.txt file.
 */
;(function ($) {
    var methods = {
        init: function (options) { 
            var settings = $.extend({ checked: false, ontoggle: null }, 
                                    options);

            var toggle = this.first();
            toggle.addClass("toggle-toggle");
            toggle.removeData("toggleState"); // Initially, no state at all.

            toggle.click(function (event) {
                event.preventDefault();

                methods.check.call(toggle, "toggle");
            });

            if (typeof settings.ontoggle === "function") {
                toggle.data("onChangeState", settings.ontoggle);
            }

            methods.check.call(toggle, settings.checked);

            return toggle;
        },

        check: function (checked) { 
            var toggle = this.first();

            var isChecked = toggle.data("toggleState");
            if (checked === "toggle") {
                if (typeof isChecked === "boolean") {
                    checked = !isChecked;
                } else {
                    checked = false;
                }
            }

            if (typeof checked === "boolean") {
                var toggle = this.first();

                if ((typeof isChecked === "undefined") ||
                    checked !== isChecked) {
                    if (checked) {
                        toggle.addClass("toggle-checked");
                    } else {
                        toggle.removeClass("toggle-checked");
                    }

                    toggle.data("toggleState", checked);
                    if (toggle.data("onChangeState")) {
                        toggle.data("onChangeState").call(toggle, checked);
                    }
                }

                return toggle;
            } else {
                return isChecked;
            }
        },
    };

    $.fn.toggle = function (method) {
        if (methods[method]) {
            return methods[method].apply(
                this, 
                Array.prototype.slice.call(arguments, 1));
        } else if ((typeof method === "object") || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("Method '" + method + "' does not exist in jQuery.toggle");
            return this;
        }    
    };
})(jQuery);
