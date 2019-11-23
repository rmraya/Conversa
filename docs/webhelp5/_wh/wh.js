(function($) {
var maxZ = 0;
$.fn.easyDrag = function(params) {
if(params == "kill"){
this.each(function(){ var self = $(this); 
var handle = self.data('handle');
handle.off('mousedown', easyDrag_onMouseDown);
handle.off('touchstart', easyDrag_onTouchStart);
handle.css('cursor', '');
self.removeClass('easydrag_enabled');
}); 
} else if(params == 'killall'){ 
$('.easydrag_enabled').easyDrag('kill'); 
} else {
params = $.extend({
handle: '.handle', 
axis: false, 
container: false, 
start: function(){},
drag: function(){},
stop: function(){},
cursor: 'move', 
ontop: true,
clickable: true
}, params);
this.each(function(){ var self = $(this);
if(!self.hasClass('easydrag_enabled')){ 
if(params.handle == 'this' || self.find(params.handle).length==0){
var handle = self;
} else {
var handle = self.find(params.handle);
}
if(params.cursor != ''){ handle.css('cursor', params.cursor); } 
handle.data(params);
var boulet = self;
boulet.addClass('easydrag_enabled'); 
boulet.data('handle', handle); 
handle.data('boulet', boulet);
if(self.css('z-index')!='auto' && params.ontop){
maxZ = Math.max(maxZ, self.css('z-index'));
};
if(self.css('position') != 'absolute' && self.css('position') != 'fixed'){
if(self.css('left') == 'auto'){ self.css('left', '0'); } 
if(self.css('top') == 'auto'){ self.css('top', '0'); }
self.css('position', 'relative');
}
handle.on('mousedown', easyDrag_onMouseDown);
handle.on('touchstart', easyDrag_onTouchStart);
}
});
}
return this;
};
var self, t, boulet, initItemX, initItemY, initEventX, initEventY, axis, container, refX, refY; 
function easyDrag_onMouseDown(event){ event.preventDefault();
t = Date.now();
self = $(this); 
boulet = self.data('boulet');
initItemX = parseInt(boulet.css('left'));
initItemY = parseInt(boulet.css('top'));
axis = self.data('axis');
container = self.data('container');
initEventX = event.pageX;
initEventY = event.pageY;
if(container.length){
refX = self.offset().left;
refY = self.offset().top;
}
self.data('start').call(boulet);
$(document).on('mousemove', easyDrag_onMouseMove);
$(document).on('click', easyDrag_onMouseUp);
if(self.data('ontop')){ 
maxZ++;
boulet.css('z-index', maxZ);
}
}
function easyDrag_onMouseMove(e){ e.preventDefault();
self.data('drag').call(boulet); 
var nextX = initItemX + e.pageX-initEventX;
var nextY = initItemY + e.pageY-initEventY;
if(!axis || axis=='x'){ boulet.css({'left': nextX+'px'}); }
if(!axis || axis=='y'){ boulet.css({'top': nextY+'px'}); }
easyDrag_contain();
}
function easyDrag_onMouseUp(e){ 
$(document).off('mousemove', easyDrag_onMouseMove);
$(document).off('click', easyDrag_onMouseUp);
self.data('stop').call(boulet); 
var d = Date.now() - t;
if(d>300 || !self.data('clickable')){
e.preventDefault(); 
e.stopPropagation();
} 
}
function easyDrag_onTouchStart(event){ event.preventDefault(); 
t = Date.now();
self = $(this); 
boulet = self.data('boulet');
initItemX = parseInt(boulet.css('left'));
initItemY = parseInt(boulet.css('top'));
axis = self.data('axis');
container = self.data('container');
if(container.length){
refX = self.offset().left;
refY = self.offset().top;
}
var touch = event.originalEvent.changedTouches[0];
initEventX = touch.pageX;
initEventY = touch.pageY;
self.data('start').call(boulet);
$(document).on('touchmove', easyDrag_onTouchMove);
$(document).on('touchend', easyDrag_onTouchEnd);
if(self.data('ontop')){ 
maxZ++;
boulet.css('z-index', maxZ);
}
}
function easyDrag_onTouchMove(e){ e.preventDefault();
self.data('drag').call(boulet); 
var touch = e.originalEvent.changedTouches[0];
var nextX = initItemX + touch.pageX-initEventX;
var nextY = initItemY + touch.pageY-initEventY;
if(!axis || axis=='x'){ boulet.css({'left': nextX+'px'}); }
if(!axis || axis=='y'){ boulet.css({'top': nextY+'px'}); }
easyDrag_contain();
}
function easyDrag_onTouchEnd(e){
$(document).off('touchmove', easyDrag_onTouchMove);
$(document).off('touchend', easyDrag_onTouchEnd);
self.data('stop').call(boulet); 
var d = Date.now() - t;
if(d>300 || !self.data('clickable')){
e.preventDefault(); 
e.stopPropagation();
} 
}
function easyDrag_contain(){
if(container.length){
var cur_offset = boulet.offset();
var container_offset = container.offset();
var limite1 = container_offset.left;
var limite2 = limite1+container.width()-boulet.innerWidth();
limite1 += parseInt(boulet.css('margin-left'));
if(cur_offset.left<limite1){
boulet.offset({left: limite1});
} else if(cur_offset.left>limite2){
boulet.offset({left: limite2});
}
var limite1 = container_offset.top;
var limite2 = limite1+container.height()-boulet.innerHeight();
limite1 += parseInt(boulet.css('margin-top'));
if(cur_offset.top<limite1){
boulet.offset({top: limite1});
} else if(cur_offset.top>limite2){
boulet.offset({top: limite2});
}
}
};
})(jQuery);
jQuery.extend({
highlight: function (node, re, nodeName, className) {
if (node.nodeType === 3) {
var match = node.data.match(re);
if (match) {
var highlight = document.createElement(nodeName || 'span');
highlight.className = className || 'highlight';
var wordNode = node.splitText(match.index);
wordNode.splitText(match[0].length);
var wordClone = wordNode.cloneNode(true);
highlight.appendChild(wordClone);
wordNode.parentNode.replaceChild(highlight, wordNode);
return 1; 
}
} else if ((node.nodeType === 1 && node.childNodes) && 
!/^(script|style|text|tspan|textpath)$|(^svg:)/i.test(node.tagName) && 
!(node.tagName === nodeName.toUpperCase() && node.className === className)) { 
for (var i = 0; i < node.childNodes.length; i++) {
i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
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
var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
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
}
var re = new RegExp(pattern, flag);
return this.each(function () {
jQuery.highlight(this, re, settings.element, settings.className);
});
};
;(function ($) {
var methods = {
init: function (options) { 
var settings = $.extend({ checked: false, ontoggle: null }, 
options);
var toggle = this.first();
toggle.addClass("toggle-toggle");
toggle.removeData("toggleState"); 
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
event.preventDefault();
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
scrollable.scrollTop(entry.offset().top - 
scrollable.offset().top);
}
return toc;
},
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
} else {
entry.addClass("toc-collapsed");
entry.children("ul").hide();
}
});
} else {
collapsible.each(function (index) {
$(this).addClass("toc-expanded");
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
var wh = (function () {
var toc_entries = [
["\n         <span class=\"webhelp-toc-chapter-entry\">Introduction</span>\n      ","conversa-2.html#I_gqobei_",[
["\n            <span class=\"webhelp-toc-section1-entry\">Conversa DITA Publisher</span>\n         ","conversa-3.html#conversa",null]
]],
["\n         <span class=\"webhelp-toc-chapter-entry\">Publishing DITA Maps</span>\n      ","conversa-4.html#I_4j0dli_",[
["\n            <span class=\"webhelp-toc-section1-entry\">Publish DITA Map Dialog</span>\n         ","publish_map.html#task_i3c_hgt_v5",null],
["\n            <span class=\"webhelp-toc-section1-entry\">Useful Tips</span>\n         ","useful_tips.html#Untitled14",null]
]],
["\n         <span class=\"webhelp-toc-chapter-entry\">Conversa Configuration</span>\n      ","conversa-5.html#I_lrpjbj_",[
["\n            <span class=\"webhelp-toc-section1-entry\">Preferences Dialog</span>\n         ","program_settings.html#advanced_configuration",null],
["\n            <span class=\"webhelp-toc-section1-entry\">External Tools</span>\n         ","external_tools.html#Untitled2",null],
["\n            <span class=\"webhelp-toc-section1-entry\">XML Catalog</span>\n         ","xml_catalog.html#concept_lt2_lb4_ts",null],
["\n            <span class=\"webhelp-toc-section1-entry\">XSL Stylesheet Parameters</span>\n         ","xsl_parameters.html#Untitled3",[
["\n               <span class=\"webhelp-toc-section2-entry\">Common Parameters</span>\n            ","common_parameters.html#commonParameters",null],
["\n               <span class=\"webhelp-toc-section2-entry\">XSL-FO Parameters</span>\n            ","fo_parameters.html#foparameters",[
["\n                  <span class=\"webhelp-toc-section3-entry\">Page headers and footers</span>\n               ","pageHeaderFooter.html#pageHeaderFooter",null]
]],
["\n               <span class=\"webhelp-toc-section2-entry\">HTML Parameters</span>\n            ","html_parameters.html#htmlParams",null],
["\n               <span class=\"webhelp-toc-section2-entry\">EPUB Parameters</span>\n            ","epub_parameters.html#Untitled7",null],
["\n               <span class=\"webhelp-toc-section2-entry\">Help Parameters</span>\n            ","help_parameters.html#Untitled9",[
["\n                  <span class=\"webhelp-toc-section3-entry\">Common Help Parameters</span>\n               ","common_help_parameters.html#Untitled10",null],
["\n                  <span class=\"webhelp-toc-section3-entry\">Web Help Parameters</span>\n               ","web_help_parameters.html#Untitled11",null],
["\n                  <span class=\"webhelp-toc-section3-entry\">HTML Help Parameters</span>\n               ","html_help_parameters.html#Untitled12",null],
["\n                  <span class=\"webhelp-toc-section3-entry\">Eclipse Help Parameters</span>\n               ","eclipse_help_parameters.html#eclipseParams",null]
]]
]]
]]];
var toc_initiallyCollapsed = false;
var index_entries = [
{term: "add-index-toc, parameter",
anchor: ["html_parameters.html#htmlParams__I_dd7yv0_",null]},
{term: "add-toc-root, parameter",
anchor: ["common_help_parameters.html#Untitled10__I_f3qmvj_",null]},
{term: "appendix-number-format, parameter",
anchor: ["common_parameters.html#commonParameters__I_vbwojf_",null]},
{term: "base-font-size, parameter",
anchor: ["fo_parameters.html#foparameters__I_4bho23_",null]},
{term: "body-bottom-margin, parameter",
anchor: ["fo_parameters.html#foparameters__I_o7mhxr_",null]},
{term: "body-font-family, parameter",
anchor: ["fo_parameters.html#foparameters__I_p7hmif_",null]},
{term: "body-start-indent, parameter",
anchor: ["fo_parameters.html#foparameters__I_9rtope_",null]},
{term: "body-top-margin, parameter",
anchor: ["fo_parameters.html#foparameters__I_pywaek_",null]},
{term: "{{break}}, page header/footer variable",
anchor: ["pageHeaderFooter.html#pageHeaderFooter__I_8f8uxh_",null]},
{term: "cause-number-format, parameter",
anchor: ["common_parameters.html#commonParameters__I_5ag27g_",null]},
{term: "center, parameter",
anchor: ["common_parameters.html#commonParameters__I_u4yao5_",null]},
{term: "chain-pages, parameter",
anchor: ["html_parameters.html#htmlParams__I_2425e8_",null]},
{term: "chain-topics, parameter",
anchor: ["html_parameters.html#htmlParams__I_pug96y_",null],
seeAlso: ["ignore-navigation-links, parameter"]},
{term: "{{chapter-title}}, page header/footer variable",
anchor: ["pageHeaderFooter.html#pageHeaderFooter__I_r87xa7_",null]},
{term: "choice-bullets, parameter",
anchor: ["fo_parameters.html#foparameters__I_57di76_",null]},
{term: "cover-image, parameter",
anchor: ["epub_parameters.html#Untitled7__I_lc6zwg_",null]},
{term: "css, parameter",
anchor: ["html_parameters.html#htmlParams__I_1n9tei_",null]},
{term: "cssResourceName, parameter",
anchor: ["html_parameters.html#htmlParams__I_40hqux_",null]},
{term: "custom-css, parameter",
anchor: ["html_parameters.html#htmlParams__I_tuabnm_",null]},
{term: "default-table-width, parameter",
anchor: ["html_parameters.html#htmlParams__I_lasbe9_",null]},
{term: "{{document-date}}, page header/footer variable",
anchor: ["pageHeaderFooter.html#pageHeaderFooter__I_3gn10k_",null]},
{term: "{{document-title}}, page header/footer variable",
anchor: ["pageHeaderFooter.html#pageHeaderFooter__I_svi3a4_",null]},
{term: ".docx, filename extension",
anchor: ["common_parameters.html#commonParameters__I_gccskj_",null]},
{term: "EPUB 2, output format",
anchor: ["common_parameters.html#commonParameters__I_8xql5c_",null]},
{term: "epub2-compatible, parameter",
anchor: ["epub_parameters.html#Untitled7__I_cnfl5x_",null]},
{term: "EPUB 3, output format",
anchor: ["common_parameters.html#commonParameters__I_c17ozh_",null,"epub_parameters.html#Untitled7__I_78vw6m_",null,"epub_parameters.html#Untitled7__I_ch4jkt_",null,"epub_parameters.html#Untitled7__I_v7gjl9_",null]},
{term: "epub-identifier, parameter",
anchor: ["epub_parameters.html#Untitled7__I_hp47h2_",null]},
{term: "equation-block-equation-width, parameter",
anchor: ["fo_parameters.html#foparameters__I_r6lurf_",null]},
{term: "equation-block-number-width, parameter",
anchor: ["fo_parameters.html#foparameters__I_lsas9_",null]},
{term: "equation-number-after, parameter",
anchor: ["common_parameters.html#commonParameters__I_sxqknk_",null]},
{term: "equation-number-before, parameter",
anchor: ["common_parameters.html#commonParameters__I_e0jjkj_",null]},
{term: "extended-toc, parameter",
anchor: ["common_parameters.html#commonParameters__I_9zqeqn_",null]},
{term: "external-href-after, parameter",
anchor: ["fo_parameters.html#foparameters__I_9gd54l_",null]},
{term: "external-href-before, parameter",
anchor: ["fo_parameters.html#foparameters__I_yz419f_",null]},
{term: "external-link-icon-height, parameter",
anchor: ["html_parameters.html#htmlParams__I_3xrfwy_",null]},
{term: "external-link-icon-name, parameter",
anchor: ["html_parameters.html#htmlParams__I_ml1o86_",null]},
{term: "external-link-icon-width, parameter",
anchor: ["html_parameters.html#htmlParams__I_20ideg_",null]},
{term: "external-resource-base, parameter",
anchor: ["common_parameters.html#commonParameters__I_np1a3a_",null]},
{term: "footer-center, parameter",
anchor: ["fo_parameters.html#foparameters__I_y05mb9_",null]},
{term: "footer-center-width, parameter",
anchor: ["fo_parameters.html#foparameters__I_x5jzd7_",null]},
{term: "footer-height, parameter",
anchor: ["fo_parameters.html#foparameters__I_oaetdo_",null]},
{term: "footer-left, parameter",
anchor: ["fo_parameters.html#foparameters__I_y8w87a_",null]},
{term: "footer-left-width, parameter",
anchor: ["fo_parameters.html#foparameters__I_pbxvr3_",null]},
{term: "footer-right, parameter",
anchor: ["fo_parameters.html#foparameters__I_apg7nu_",null]},
{term: "footer-right-width, parameter",
anchor: ["fo_parameters.html#foparameters__I_t1k5qx_",null]},
{term: "footer-separator, parameter",
anchor: ["fo_parameters.html#foparameters__I_cm6pou_",null]},
{term: "format-to-type, parameter",
anchor: ["html_parameters.html#htmlParams__I_oeyda6_",null]},
{term: "generate-epub-trigger, parameter",
anchor: ["epub_parameters.html#Untitled7__I_80o822_",null]},
{term: "generator-info, parameter",
anchor: ["html_parameters.html#htmlParams__I_osshfp_",null]},
{term: "header-center, parameter",
anchor: ["fo_parameters.html#foparameters__I_sot9w8_",null]},
{term: "header-center-width, parameter",
anchor: ["fo_parameters.html#foparameters__I_2xztn6_",null]},
{term: "header-height, parameter",
anchor: ["fo_parameters.html#foparameters__I_jm7zw5_",null]},
{term: "header-left, parameter",
anchor: ["fo_parameters.html#foparameters__I_novqig_",null]},
{term: "header-left-width, parameter",
anchor: ["fo_parameters.html#foparameters__I_s54zjb_",null]},
{term: "header-right, parameter",
anchor: ["fo_parameters.html#foparameters__I_e6l1fr_",null]},
{term: "header-right-width, parameter",
anchor: ["fo_parameters.html#foparameters__I_q5t4yj_",null]},
{term: "header-separator, parameter",
anchor: ["fo_parameters.html#foparameters__I_u6ff1a_",null]},
{term: "hhc-basename, parameter",
anchor: ["html_help_parameters.html#Untitled12__I_84n3e7_",null]},
{term: "hhp-template, parameter",
anchor: ["html_help_parameters.html#Untitled12__I_fe3q1s_",null]},
{term: "hhx-basename, parameter",
anchor: ["html_help_parameters.html#Untitled12__I_pe7p3i_",null]},
{term: "highlight-source, parameter",
anchor: ["common_parameters.html#commonParameters__I_udo1d_",null]},
{term: "hyphenate, parameter",
anchor: ["fo_parameters.html#foparameters__I_a7n7k_",null]},
{term: "ignore-navigation-links, parameter",
anchor: ["html_parameters.html#htmlParams__I_74bu1b_",null],
seeAlso: ["chain-topics, parameter"]},
{term: "{{image(URI)}}, page header/footer variable",
anchor: ["pageHeaderFooter.html#pageHeaderFooter__I_a1r1s_",null]},
{term: "imagemap",
anchor: ["fo_parameters.html#foparameters__I_5p2f79_",null]},
{term: "index-column-gap, parameter",
anchor: ["fo_parameters.html#foparameters__I_zhd9ys_",null]},
{term: "index-range-separator, parameter",
anchor: ["common_parameters.html#commonParameters__I_wuo2am_",null]},
{term: "javascripts, parameter",
anchor: ["html_parameters.html#htmlParams__I_x3xoqn_",null]},
{term: "justified, parameter",
anchor: ["fo_parameters.html#foparameters__I_egl5lr_",null]},
{term: "link-auto-text, parameter",
anchor: ["common_parameters.html#commonParameters__I_ef1375_",null]},
{term: "link-bullet, parameter",
anchor: ["fo_parameters.html#foparameters__I_edpf7z_",null]},
{term: "mark-external-links, parameter",
anchor: ["html_parameters.html#htmlParams__I_j8i5or_",null]},
{term: "mark-important-steps, parameter",
anchor: ["common_parameters.html#commonParameters__I_5f141f_",null]},
{term: "MathJax",
anchor: ["html_parameters.html#htmlParams__I_gpdceg_",null,"html_parameters.html#htmlParams__I_kvcg7d_",null]},
{term: "mathjax, parameter",
anchor: ["html_parameters.html#htmlParams__I_56h8sk_",null]},
{term: "mathjax-url, parameter",
anchor: ["html_parameters.html#htmlParams__I_34qmtj_",null]},
{term: "MathML",
anchor: ["html_parameters.html#htmlParams__I_5oujiu_",null,"html_parameters.html#htmlParams__I_ajqysr_",null]},
{term: "menucascade-separator, parameter",
anchor: ["fo_parameters.html#foparameters__I_i2mj57_",null]},
{term: "navigation-icon-height, parameter",
anchor: ["html_parameters.html#htmlParams__I_hvnbk9_",null]},
{term: "navigation-icon-suffix, parameter",
anchor: ["html_parameters.html#htmlParams__I_rqbe1n_",null]},
{term: "navigation-icon-width, parameter",
anchor: ["html_parameters.html#htmlParams__I_83w55h_",null]},
{term: "note-icon-height, parameter",
anchor: ["fo_parameters.html#foparameters__I_mrw8a7_",null]},
{term: "note-icon-list, parameter",
anchor: ["common_parameters.html#commonParameters__I_5f719k_",null]},
{term: "note-icon-suffix, parameter",
anchor: ["fo_parameters.html#foparameters__I_ozmsqe_",null]},
{term: "note-icon-width, parameter",
anchor: ["fo_parameters.html#foparameters__I_2rgm61_",null]},
{term: "number, parameter",
anchor: ["common_parameters.html#commonParameters__I_qfil11_",null]},
{term: "number-separator1, parameter",
anchor: ["common_parameters.html#commonParameters__I_vgbc51_",null]},
{term: "number-separator2, parameter",
anchor: ["common_parameters.html#commonParameters__I_be66sc_",null]},
{term: "number-toc-entries, parameter",
anchor: ["common_help_parameters.html#Untitled10__I_fmd80f_",null]},
{term: ".odt, filename extension",
anchor: ["common_parameters.html#commonParameters__I_vmw6cn_",null]},
{term: "outputclass, attribute",
anchor: ["common_parameters.html#commonParameters__I_l83pnb_",null]},
{term: "page-bottom-margin, parameter",
anchor: ["fo_parameters.html#foparameters__I_fy5361_",null]},
{term: "pagebreak, processing-instruction",
anchor: ["fo_parameters.html#foparameters__I_wsfq61_",null]},
{term: "{{page-count}}, page header/footer variable",
anchor: ["pageHeaderFooter.html#pageHeaderFooter__I_84kh7p_",null]},
{term: "page-height, parameter",
anchor: ["fo_parameters.html#foparameters__I_4ted71_",null]},
{term: "page-inner-margin, parameter",
anchor: ["fo_parameters.html#foparameters__I_3cj4dq_",null]},
{term: "{{page-number}}, page header/footer variable",
anchor: ["pageHeaderFooter.html#pageHeaderFooter__I_5srdcs_",null]},
{term: "page-orientation, parameter",
anchor: ["fo_parameters.html#foparameters__I_rbqup4_",null]},
{term: "page-outer-margin, parameter",
anchor: ["fo_parameters.html#foparameters__I_nzhyda_",null]},
{term: "page-ref-after, parameter",
anchor: ["fo_parameters.html#foparameters__I_aukejl_",null]},
{term: "page-ref-before, parameter",
anchor: ["fo_parameters.html#foparameters__I_psnp97_",null]},
{term: "{{page-sequence}}, page header/footer variable",
anchor: ["pageHeaderFooter.html#pageHeaderFooter__I_9g6yay_",null,"pageHeaderFooter.html#pageHeaderFooter__I_rhl7ng_",null]},
{term: "page-top-margin, parameter",
anchor: ["fo_parameters.html#foparameters__I_dlw3bp_",null]},
{term: "page-width, parameter",
anchor: ["fo_parameters.html#foparameters__I_uwnwmm_",null]},
{term: "paper-type, parameter",
anchor: ["fo_parameters.html#foparameters__I_k5r91u_",null]},
{term: "part-number-format, parameter",
anchor: ["common_parameters.html#commonParameters__I_b3o0jo_",null]},
{term: "pdf-outline, parameter",
anchor: ["fo_parameters.html#foparameters__I_agax37_",null]},
{term: "plugin-id, parameter",
anchor: ["eclipse_help_parameters.html#eclipseParams__I_5qiszo_",null]},
{term: "plugin-index-basename",
anchor: ["eclipse_help_parameters.html#eclipseParams__I_cxshow_",null]},
{term: "plugin-name, parameter",
anchor: ["eclipse_help_parameters.html#eclipseParams__I_6tfy5l_",null]},
{term: "plugin-provider, parameter",
anchor: ["eclipse_help_parameters.html#eclipseParams__I_s4trqk_",null]},
{term: "plugin-toc-basename, parameter",
anchor: ["eclipse_help_parameters.html#eclipseParams__I_dtv4k2_",null]},
{term: "plugin-version, parameter",
anchor: ["eclipse_help_parameters.html#eclipseParams__I_7l932p_",null]},
{term: "Preferences dialog",
anchor: ["program_settings.html#advanced_configuration__I_1msfdh_",null]},
{term: "prepend-chapter-to-section-number, parameter",
anchor: ["common_parameters.html#commonParameters__I_pck5hh_",null]},
{term: "Publish DITA MAP dialog",
anchor: ["publish_map.html#task_i3c_hgt_v5__I_e2v6a_",null]},
{term: "remedy-number-format, parameter",
anchor: ["common_parameters.html#commonParameters__I_tmuqva_",null]},
{term: ".rtf, filename extension",
anchor: ["common_parameters.html#commonParameters__I_fsu6c_",null]},
{term: "screen-resolution, parameter",
anchor: ["html_parameters.html#htmlParams__I_fw2pbe_",null]},
{term: "{{section1-title}}, page header/footer variable",
anchor: ["pageHeaderFooter.html#pageHeaderFooter__I_hk6xc5_",null]},
{term: "show-draft-comments, parameter",
anchor: ["common_parameters.html#commonParameters__I_806ktw_",null]},
{term: "show-external-links, parameter",
anchor: ["fo_parameters.html#foparameters__I_ithlve_",null]},
{term: "show-imagemap-links, parameter",
anchor: ["fo_parameters.html#foparameters__I_1lxz22_",null]},
{term: "show-link-page, parameter",
anchor: ["fo_parameters.html#foparameters__I_64qfo4_",null]},
{term: "show-xref-page, parameter",
anchor: ["fo_parameters.html#foparameters__I_rtlnbr_",null]},
{term: "syntax highlighting",
anchor: ["common_parameters.html#commonParameters__I_7cwacy_",null]},
{term: "title-after, parameter",
anchor: ["common_parameters.html#commonParameters__I_9fhji2_",null]},
{term: "title-color, parameter",
anchor: ["fo_parameters.html#foparameters__I_iuhapu_",null]},
{term: "title-font-family, parameter",
anchor: ["fo_parameters.html#foparameters__I_f2fvfv_",null]},
{term: "title-page, parameter",
anchor: ["common_parameters.html#commonParameters__I_1338w2_",null]},
{term: "title-prefix-separator1, parameter",
anchor: ["common_parameters.html#commonParameters__I_2vxb5u_",null]},
{term: "{{topic-title}}, page header/footer variable",
anchor: ["pageHeaderFooter.html#pageHeaderFooter__I_z7ha0o_",null,"pageHeaderFooter.html#pageHeaderFooter__I_14ie8o_",null]},
{term: "troubleSolution-number-format, parameter",
anchor: ["common_parameters.html#commonParameters__I_qne62h_",null]},
{term: "two-sided, parameter",
anchor: ["fo_parameters.html#foparameters__I_a2o6yu_",null]},
{term: "ul-li-bullets, parameter",
anchor: ["fo_parameters.html#foparameters__I_vt73vk_",null]},
{term: "unordered-step-bullets, parameter",
anchor: ["fo_parameters.html#foparameters__I_gm69lq_",null]},
{term: "use-note-icon, parameter",
anchor: ["common_parameters.html#commonParameters__I_bgsyqo_",null]},
{term: "watermark, parameter",
anchor: ["fo_parameters.html#foparameters__I_wsvx4n_",null]},
{term: "watermark-image, parameter",
anchor: ["common_parameters.html#commonParameters__I_b9t3oe_",null]},
{term: "whc-index-basename, parameter",
anchor: ["web_help_parameters.html#Untitled11__I_snngrv_",null]},
{term: "wh-collapse-toc, parameter",
anchor: ["web_help_parameters.html#Untitled11__I_iis0m_",null]},
{term: "wh---CSS_VAR_NAME, parameter",
anchor: ["web_help_parameters.html#Untitled11__I_87g8qf_",null]},
{term: "whc-toc-basename, parameter",
anchor: ["web_help_parameters.html#Untitled11__I_pt612w_",null]},
{term: "wh-index-numbers, parameter",
anchor: ["web_help_parameters.html#Untitled11__I_dzoosd_",null]},
{term: "wh-inherit-font-and-colors, parameter",
anchor: ["web_help_parameters.html#Untitled11__I_vi4evn_",null]},
{term: "wh-jquery, parameter",
anchor: ["web_help_parameters.html#Untitled11__I_fmv16m_",null]},
{term: "wh-layout, parameter",
anchor: ["web_help_parameters.html#Untitled11__I_gsfj2o_",null]},
{term: "wh-local-jquery, parameter",
anchor: ["web_help_parameters.html#Untitled11__I_d3s1c7_",null]},
{term: "wh-responsive-ui, parameter",
anchor: ["web_help_parameters.html#Untitled11__I_tftrwa_",null]},
{term: "wh-ui-language, parameter",
anchor: ["web_help_parameters.html#Untitled11__I_cqptt0_",null]},
{term: "wh-user-css, parameter",
anchor: ["web_help_parameters.html#Untitled11__I_m0mysi_",null]},
{term: "wh-user-footer, parameter",
anchor: ["web_help_parameters.html#Untitled11__I_pp2qcy_",null]},
{term: "wh-user-header, parameter",
anchor: ["web_help_parameters.html#Untitled11__I_k69790_",null]},
{term: "wh-user-resources, parameter",
anchor: ["web_help_parameters.html#Untitled11__I_dyr0bu_",null]},
{term: "wh-use-stemming, parameter",
anchor: ["web_help_parameters.html#Untitled11__I_5kl96t_",null]},
{term: ".wml, filename extension",
anchor: ["common_parameters.html#commonParameters__I_1uu1vl_",null]},
{term: "XFC, XSL-FO processor",
anchor: ["common_parameters.html#commonParameters__I_dl3y2m_",null,"fo_parameters.html#foparameters__I_rzw6e5_",null]},
{term: "xfc-render-as-table, parameter",
anchor: ["fo_parameters.html#foparameters__I_qu33wr_",null]},
{term: "xhtml-mime-type, parameter",
anchor: ["html_parameters.html#htmlParams__I_icb28k_",null]},
{term: "xref-auto-text, parameter",
anchor: ["common_parameters.html#commonParameters__I_eq1v2f_",null]},
{term: "xsl-resources-directory, parameter",
anchor: ["common_parameters.html#commonParameters__I_7qe3ik_",null]}
];
var messages = [
"Contents",
"Index",
"Search",
"Collapse All",
"Expand All",
"Previous Page",
"Next Page",
"Print Page",
"Toggle search result highlighting",
"No results found for %W%.",
"1 result found for %W%.",
"%N% results found for %W%.",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"See",
"See also" 
];
var messageTranslations = {
"de": [
"Inhalt",
"Index",
"Suchen",
"Alle ausblenden",
"Alle einblenden",
"Vorherige Seite",
"Nächste Seite",
"Print Page",
"Hervorhebung von Suchergebnissen ein-/ausschalten",
"Keine Ergebnisse für %W% gefunden.",
"1 Ergebnis für %W% gefunden.",
"%N% Ergebnisse für %W% gefunden.",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"Siehe",
"Siehe auch"
],
"es": [
"Contenido",
"Índice",
"Buscar",
"Contraer todo",
"Expandir todo",
"Página anterior",
"Página siguiente",
"Print Page",
"Alternar el resaltado de los resultados de la búsqueda",
"No se ha encontrado ningún resultado para %W%.",
"Se ha encontrado un resultado para %W%.",
"Se han encontrado %N% resultados para %W%.",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"Ver",
"Ver también"
],
"fr": [
"Sommaire",
"Index",
"Rechercher",
"Replier Tout",
"Déplier Tout",
"Page Précédente",
"Page Suivante",
"Imprimer Page",
"Basculer la mise en surbrillance",
"Aucun résultat trouvé pour %W%.",
"1 résultat trouvé pour %W%.",
"%N% résultats trouvés pour %W%.",
"Arrêter de rechercher",
"Ouvrir le panneau de navigation",
"Fermer le panneau de navigation",
"terme",
"mot",
"Atteindre",
"Voir",
"Voir aussi"
],
"it": [
"Sommario",
"Indice",
"Ricerca",
"Comprimi tutto",
"Espandi tutto",
"Pagina precedente",
"Pagina successiva",
"Print Page",
"Attiva/Disattiva evidenziazione risultati ricerca",
"Nessun risultato trovato per %W%.",
"1 risultato trovato per %W%.",
"%N% risultati trovati per %W%.",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"Vedere",
"Vedere anche"
],
"ja": [
"目次",
"索引",
"検索",
"すべて折りたたむ",
"すべて展開",
"前のページ",
"次のページ",
"Print Page",
"検索キーワードをハイライト表示",
"%W% の検索結果は見つかりませんでした。",
"%W% の検索結果が 1 件見つかりました。",
"%W% の検索結果が%N% 件見つかりました。%N%",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"参照：",
"その他参照："
],
"pl": [
"Spis treści",
"Indeks",
"Wyszukaj",
"Zwiń wszystko",
"Rozwiń wszystko",
"Poprzednia strona",
"Następna strona",
"Print Page",
"Przełącz wyróżnianie wyników wyszukiwania",
"Brak wyników dla %W%.",
"Znaleziono 1 wynik dla %W%.",
"Znaleziono następującą liczbę wyników dla %W%: %N%",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"Zobacz",
"Zobacz również"
],
"ru": [
"Содержание",
"Указатель",
"Поиск",
"Свернуть все",
"Развернуть все",
"Предыдущая",
"Следующая",
"Print Page",
"Выделение результатов поиска",
"Ничего не найдено по запросу \"%W%\".",
"Найдено результатов по запросу \"%W%\": 1.",
"Найдено результатов по запросу \"%W%\": %N%.",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"См.",
"См. также"
],
"zh-cn": [
"目录",
"索引",
"搜索",
"全部折叠",
"全部展开",
"上一页",
"下一页",
"Print Page",
"切换搜索结果高亮",
"未找到有关 %W% 的结果。",
"找到 1 条有关 %W% 的结果。",
"找到 %N% 条有关 %W% 的结果。",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"See",
"See also"
],
"zh-tw": [
"目錄",
"索引",
"搜尋",
"收合全部",
"展開全部",
"上一頁",
"下一頁",
"Print Page",
"反白顯示切換搜尋結果",
"找不到 %W% 的結果。",
"找到 １ 個 %W% 的結果。",
"找到 %N% 個 %W% 的結果。",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"See",
"See also"
]
};
var preferredUserLanguage = null; 
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
var storageId = "16uhushxj9itd";
function storageSet(key, value) {
window.sessionStorage.setItem(key + storageId, String(value));
}
function storageGet(key) {
return window.sessionStorage.getItem(key + storageId);
}
function storageDelete(key) {
window.sessionStorage.removeItem(key + storageId);
}
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
top += menu.outerHeight( false);
var height = $("#wh-body").height() - top;
var nav = $("#wh-navigation");
nav.css({ "position": "absolute",
"top": top + "px",
"right": "0px",
"z-index": "100",
"width": "66%",
"height": height + "px",
"border-style": "solid",
"display": "flex" }); 
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
var position = parseInt(storageGet("whSeparatorPosition"), 10);
if (!isNaN(position)) {
nav.width(position);
}
}
function initSeparator() {
var navigation = $("#wh-navigation");
var separator = $("#wh-separator");
var content = $("#wh-content");
separator.easyDrag({
axis: "x",
container: $("#wh-body"),
clickable: false,
cursor: "", 
start: function() { 
$(this).data("startDragLeftOffset", $(this).offset().left);
},
stop: function() {
var delta = 
$(this).offset().left - $(this).data("startDragLeftOffset");
if (delta !== 0) {
var availableW = $("#wh-body").width();
var reservedW = 1 + getPad(navigation,  false)/2 +
separator.outerWidth( true) +
getPad(content,  false)/2;
var maxW = availableW - reservedW;
var w = navigation.width() + delta;
if (w < reservedW) {
w = reservedW; 
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
if (vertical) {
return pane.outerHeight( true) - pane.height();
} else {
return pane.outerWidth( true) - pane.width();
}
}
function saveSeparatorPosition(separator, position) {
separator.css("left", "0px");
storageSet("whSeparatorPosition", position.toString());
}
function populateTOC() {
var tocPane = $("#wh-toc-pane");
var list = $("<ul id='wh-toc'></ul>");
tocPane.append(list);
if (typeof toc_entries !== "undefined") {
var count = toc_entries.length;
for (var i = 0; i < count; ++i) {
addTOCEntry(toc_entries[i], list);
}
toc_entries = undefined; 
}
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
if ((typeof toc_initiallyCollapsed !== "undefined") &&
toc_initiallyCollapsed) {
tocOptions.initiallyCollapsed = true;
}
toc.toc(tocOptions);
}
var fieldKeys = {
ENTER: 13,
ESCAPE: 27,
UP: 38,
DOWN: 40
};
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
return (text.indexOf(prefix) === 0);
}
function stringEndsWith(text, suffix) {
return (text.substr(-suffix.length) === suffix);
}
function stopSearch(field) {
$("#wh-search-results").empty();
var pane = $("#wh-search-pane");
pane.scrollTop(0);
var words = pane.removeData("whSearchedWords2");
if (words !== null) {
unhighlightSearchedWords();
}
clearSearchState();
}
function highlightSearchedWords(words) {
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
event.preventDefault();
} 
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
word.search(/^[-+]?\d/) < 0) { 
wh.search_stemmer.setCurrent(word);
wh.search_stemmer.stem();
var stem = wh.search_stemmer.getCurrent();
if (stem != word) {
indices = wh.search_wordMap[stem];
if (indices !== undefined) {
fallback = false;
searchedWords.push(stem);
if (word.indexOf(stem) < 0) {
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
return null;
}
}
var resultIndices = [];
var minHitValue = 10000.0 * wordCount; 
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
function initContent() {
selectTOCEntry(window.location.href);
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
selectable = links.filter(function () {
return (trimFragment(this.href) === url);
});
}
if (selectable.length > 0) {
selectable = selectable.first();
selectable.addClass("wh-toc-selected");
var entry = selectable.parent("li");
$("#wh-toc").toc("showEntry", entry,  false);
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
function layout(resizeEvent) {
var menu = $("#wh-menu");
if (menu.hasClass("wh-icon-close")) {
if (resizeEvent === null) {
closeNavigation();
} else if (window.matchMedia("(max-width: 575.98px)").matches) {
var top = menu.position().top;
top += menu.outerHeight( false);
var height = $("#wh-body").height() - top;
$("#wh-navigation").css("height", height + "px");
} else {
closeNavigation();
}
}
var h = $(window).height();
var pane = $("#wh-header");
if (pane.length > 0 && pane.is(":visible")) {
h -= pane.outerHeight( true);
}
pane = $("#wh-footer");
if (pane.length > 0 && pane.is(":visible")) {
h -= pane.outerHeight( true);
}
var body = $("#wh-body");
body.outerHeight(h,  true);
}
function scrollToFragment() {
var fragment = getFragment(window.location.href);
if (fragment !== null) {
fragment = fragment.replace(/\./g, "\\.");
var anchor = $(fragment);
if (anchor) {
var content = $("#wh-content");
content.scrollTop(anchor.offset().top - content.offset().top + 
content.scrollTop());
}
}
}
function getFragment(href) {
var hash = href.lastIndexOf("#");
if (hash >= 0) {
return href.substring(hash); 
} else {
return null;
}
}
 function initPage() {
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
layout( null);
if (hasIndex) {
restoreIndexTerm(indexField);
}
restoreSearchState(searchField);
scrollToFragment();
}
function initNavigation() {
var indexTab = $("#wh-index-tab");
if ($("#wh-toc-tab > a").css("font-weight") > 
$("#wh-toc-tab").css("font-weight")) { 
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
case 2:
pane = $("#wh-search-pane");
$("#wh-search-field").focus();
break;
}
processPendingScroll(pane);
}
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
function populateIndex() {
var indexPane = $("#wh-index-pane");
var list = $("<ul id='wh-index'></ul>");
indexPane.append(list);
if (typeof index_entries !== "undefined") {
var count = index_entries.length;
for (var i = 0; i < count; ++i) {
addIndexEntry(index_entries[i], list);
}
index_entries = undefined; 
}
}
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
var j = 0;
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
var termSpan = $(this).children("span.wh-index-term");
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
storageDelete("whIndexTerm");
allItems.removeClass("wh-suggested-item");
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
term = indexEntries[i];
item = indexEntries[i+1];
}
break;
}
}
if (item === null) {
for (i = 0; i < entryCount; i += 2) {
if (indexEntries[i].indexOf(prefix) === 0) {
term = indexEntries[i];
item = indexEntries[i+1];
break;
}
}
}
} else {
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
if (indexEntries[i+1] === item) { 
term = indexEntries[i];
break;
}
}
if (term === null) {
storageDelete("whIndexTerm");
} else {
storageSet("whIndexTerm", term);
field.val(term);
allItems.removeClass("wh-suggested-item");
$(item).addClass("wh-suggested-item");
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
}
}
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
return {
initPage: initPage,
}
})();
$(document).ready(function() {
wh.initPage();
$("#wh-body").css({ "visibility": "visible", "opacity": "1" }); 
});
