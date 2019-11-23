function Snowball() {
function Among(s, substring_i, result, method) {
if ((!s && s != "") || (!substring_i && (substring_i != 0)) || !result)
throw ("Bad Among initialisation: s:" + s + ", substring_i: "
+ substring_i + ", result: " + result);
this.s_size = s.length;
this.s = (function() {
var sLength = s.length, charArr = new Array(sLength);
for (var i = 0; i < sLength; i++)
charArr[i] = s.charCodeAt(i);
return charArr;})();
this.substring_i = substring_i;
this.result = result;
this.method = method;
}
function SnowballProgram() {
var current;
return {
bra : 0,
ket : 0,
limit : 0,
cursor : 0,
limit_backward : 0,
setCurrent : function(word) {
current = word;
this.cursor = 0;
this.limit = word.length;
this.limit_backward = 0;
this.bra = this.cursor;
this.ket = this.limit;
},
getCurrent : function() {
var result = current;
current = null;
return result;
},
in_grouping : function(s, min, max) {
if (this.cursor >= this.limit) return false;
var ch = current.charCodeAt(this.cursor);
if (ch > max || ch < min) return false;
ch -= min;
if ((s[ch >> 3] & (0X1 << (ch & 0X7))) == 0) return false;
this.cursor++;
return true;
},
in_grouping_b : function(s, min, max) {
if (this.cursor <= this.limit_backward) return false;
var ch = current.charCodeAt(this.cursor - 1);
if (ch > max || ch < min) return false;
ch -= min;
if ((s[ch >> 3] & (0X1 << (ch & 0X7))) == 0) return false;
this.cursor--;
return true;
},
out_grouping : function(s, min, max) {
if (this.cursor >= this.limit) return false;
var ch = current.charCodeAt(this.cursor);
if (ch > max || ch < min) {
this.cursor++;
return true;
}
ch -= min;
if ((s[ch >> 3] & (0X1 << (ch & 0X7))) == 0) {
this.cursor ++;
return true;
}
return false;
},
out_grouping_b : function(s, min, max) {
if (this.cursor <= this.limit_backward) return false;
var ch = current.charCodeAt(this.cursor - 1);
if (ch > max || ch < min) {
this.cursor--;
return true;
}
ch -= min;
if ((s[ch >> 3] & (0X1 << (ch & 0X7))) == 0) {
this.cursor--;
return true;
}
return false;
},
eq_s : function(s_size, s) {
if (this.limit - this.cursor < s_size) return false;
var i;
for (i = 0; i != s_size; i++) {
if (current.charCodeAt(this.cursor + i) != s.charCodeAt(i)) return false;
}
this.cursor += s_size;
return true;
},
eq_s_b : function(s_size, s) {
if (this.cursor - this.limit_backward < s_size) return false;
var i;
for (i = 0; i != s_size; i++) {
if (current.charCodeAt(this.cursor - s_size + i) != s.charCodeAt(i)) return false;
}
this.cursor -= s_size;
return true;
},
eq_v_b : function(s) {
return this.eq_s_b(s.length, s);
},
find_among : function(v, v_size) {
var i = 0, j = v_size, c = this.cursor, l = this.limit, common_i = 0, common_j = 0, first_key_inspected = false;
while (true) {
var k = i + ((j - i) >> 1), diff = 0, common = common_i < common_j
? common_i
: common_j, w = v[k];
for (var i2 = common; i2 < w.s_size; i2++) {
if (c + common == l) {
diff = -1;
break;
}
diff = current.charCodeAt(c + common) - w.s[i2];
if (diff)
break;
common++;
}
if (diff < 0) {
j = k;
common_j = common;
} else {
i = k;
common_i = common;
}
if (j - i <= 1) {
if (i > 0 || j == i || first_key_inspected)
break;
first_key_inspected = true;
}
}
while (true) {
var w = v[i];
if (common_i >= w.s_size) {
this.cursor = c + w.s_size;
if (!w.method)
return w.result;
var res = w.method();
this.cursor = c + w.s_size;
if (res)
return w.result;
}
i = w.substring_i;
if (i < 0)
return 0;
}
},
find_among_b : function(v, v_size) {
var i = 0, j = v_size, c = this.cursor, lb = this.limit_backward, common_i = 0, common_j = 0, first_key_inspected = false;
while (true) {
var k = i + ((j - i) >> 1), diff = 0, common = common_i < common_j
? common_i
: common_j, w = v[k];
for (var i2 = w.s_size - 1 - common; i2 >= 0; i2--) {
if (c - common == lb) {
diff = -1;
break;
}
diff = current.charCodeAt(c - 1 - common) - w.s[i2];
if (diff)
break;
common++;
}
if (diff < 0) {
j = k;
common_j = common;
} else {
i = k;
common_i = common;
}
if (j - i <= 1) {
if (i > 0 || j == i || first_key_inspected)
break;
first_key_inspected = true;
}
}
while (true) {
var w = v[i];
if (common_i >= w.s_size) {
this.cursor = c - w.s_size;
if (!w.method)
return w.result;
var res = w.method();
this.cursor = c - w.s_size;
if (res)
return w.result;
}
i = w.substring_i;
if (i < 0)
return 0;
}
},
replace_s : function(c_bra, c_ket, s) {
var adjustment = s.length - (c_ket - c_bra), left = current
.substring(0, c_bra), right = current.substring(c_ket);
current = left + s + right;
this.limit += adjustment;
if (this.cursor >= c_ket)
this.cursor += adjustment;
else if (this.cursor > c_bra)
this.cursor = c_bra;
return adjustment;
},
slice_check : function() {
if (this.bra < 0 ||
this.bra > this.ket ||
this.ket > this.limit ||
this.limit > current.length)
{
throw ("faulty slice operation");
}
},
slice_from : function(s) {
this.slice_check();
this.replace_s(this.bra, this.ket, s);
},
slice_del : function() {
this.slice_from("");
},
insert : function(c_bra, c_ket, s) {
var adjustment = this.replace_s(c_bra, c_ket, s);
if (c_bra <= this.bra) this.bra += adjustment;
if (c_bra <= this.ket) this.ket += adjustment;
},
slice_to : function() {
this.slice_check();
return current.substring(this.bra, this.ket);
},
get_size_of_p : function() {
return current ? encodeURIComponent(current).match(/%..|./g).length + 1 : 1;
}
};
}
function englishStemmer() {
var a_0 = [
new Among ( "arsen", -1, -1 ),
new Among ( "commun", -1, -1 ),
new Among ( "gener", -1, -1 )
];
var a_1 = [
new Among ( "'", -1, 1 ),
new Among ( "'s'", 0, 1 ),
new Among ( "'s", -1, 1 )
];
var a_2 = [
new Among ( "ied", -1, 2 ),
new Among ( "s", -1, 3 ),
new Among ( "ies", 1, 2 ),
new Among ( "sses", 1, 1 ),
new Among ( "ss", 1, -1 ),
new Among ( "us", 1, -1 )
];
var a_3 = [
new Among ( "", -1, 3 ),
new Among ( "bb", 0, 2 ),
new Among ( "dd", 0, 2 ),
new Among ( "ff", 0, 2 ),
new Among ( "gg", 0, 2 ),
new Among ( "bl", 0, 1 ),
new Among ( "mm", 0, 2 ),
new Among ( "nn", 0, 2 ),
new Among ( "pp", 0, 2 ),
new Among ( "rr", 0, 2 ),
new Among ( "at", 0, 1 ),
new Among ( "tt", 0, 2 ),
new Among ( "iz", 0, 1 )
];
var a_4 = [
new Among ( "ed", -1, 2 ),
new Among ( "eed", 0, 1 ),
new Among ( "ing", -1, 2 ),
new Among ( "edly", -1, 2 ),
new Among ( "eedly", 3, 1 ),
new Among ( "ingly", -1, 2 )
];
var a_5 = [
new Among ( "anci", -1, 3 ),
new Among ( "enci", -1, 2 ),
new Among ( "ogi", -1, 13 ),
new Among ( "li", -1, 16 ),
new Among ( "bli", 3, 12 ),
new Among ( "abli", 4, 4 ),
new Among ( "alli", 3, 8 ),
new Among ( "fulli", 3, 14 ),
new Among ( "lessli", 3, 15 ),
new Among ( "ousli", 3, 10 ),
new Among ( "entli", 3, 5 ),
new Among ( "aliti", -1, 8 ),
new Among ( "biliti", -1, 12 ),
new Among ( "iviti", -1, 11 ),
new Among ( "tional", -1, 1 ),
new Among ( "ational", 14, 7 ),
new Among ( "alism", -1, 8 ),
new Among ( "ation", -1, 7 ),
new Among ( "ization", 17, 6 ),
new Among ( "izer", -1, 6 ),
new Among ( "ator", -1, 7 ),
new Among ( "iveness", -1, 11 ),
new Among ( "fulness", -1, 9 ),
new Among ( "ousness", -1, 10 )
];
var a_6 = [
new Among ( "icate", -1, 4 ),
new Among ( "ative", -1, 6 ),
new Among ( "alize", -1, 3 ),
new Among ( "iciti", -1, 4 ),
new Among ( "ical", -1, 4 ),
new Among ( "tional", -1, 1 ),
new Among ( "ational", 5, 2 ),
new Among ( "ful", -1, 5 ),
new Among ( "ness", -1, 5 )
];
var a_7 = [
new Among ( "ic", -1, 1 ),
new Among ( "ance", -1, 1 ),
new Among ( "ence", -1, 1 ),
new Among ( "able", -1, 1 ),
new Among ( "ible", -1, 1 ),
new Among ( "ate", -1, 1 ),
new Among ( "ive", -1, 1 ),
new Among ( "ize", -1, 1 ),
new Among ( "iti", -1, 1 ),
new Among ( "al", -1, 1 ),
new Among ( "ism", -1, 1 ),
new Among ( "ion", -1, 2 ),
new Among ( "er", -1, 1 ),
new Among ( "ous", -1, 1 ),
new Among ( "ant", -1, 1 ),
new Among ( "ent", -1, 1 ),
new Among ( "ment", 15, 1 ),
new Among ( "ement", 16, 1 )
];
var a_8 = [
new Among ( "e", -1, 1 ),
new Among ( "l", -1, 2 )
];
var a_9 = [
new Among ( "succeed", -1, -1 ),
new Among ( "proceed", -1, -1 ),
new Among ( "exceed", -1, -1 ),
new Among ( "canning", -1, -1 ),
new Among ( "inning", -1, -1 ),
new Among ( "earring", -1, -1 ),
new Among ( "herring", -1, -1 ),
new Among ( "outing", -1, -1 )
];
var a_10 = [
new Among ( "andes", -1, -1 ),
new Among ( "atlas", -1, -1 ),
new Among ( "bias", -1, -1 ),
new Among ( "cosmos", -1, -1 ),
new Among ( "dying", -1, 3 ),
new Among ( "early", -1, 9 ),
new Among ( "gently", -1, 7 ),
new Among ( "howe", -1, -1 ),
new Among ( "idly", -1, 6 ),
new Among ( "lying", -1, 4 ),
new Among ( "news", -1, -1 ),
new Among ( "only", -1, 10 ),
new Among ( "singly", -1, 11 ),
new Among ( "skies", -1, 2 ),
new Among ( "skis", -1, 1 ),
new Among ( "sky", -1, -1 ),
new Among ( "tying", -1, 5 ),
new Among ( "ugly", -1, 8 )
];
var g_v = [17, 65, 16, 1 ];
var g_v_WXY = [1, 17, 65, 208, 1 ];
var g_valid_LI = [55, 141, 2 ];
var B_Y_found;
var I_p2;
var I_p1;
var sbp = new SnowballProgram();
function r_prelude() {
var v_1;
var v_2;
var v_3;
var v_4;
var v_5;
B_Y_found = false;
v_1 = sbp.cursor;
lab0: do {
sbp.bra = sbp.cursor;
if (!(sbp.eq_s(1, "'")))
{
break lab0;
}
sbp.ket = sbp.cursor;
sbp.slice_del();
} while (false);
sbp.cursor = v_1;
v_2 = sbp.cursor;
lab1: do {
sbp.bra = sbp.cursor;
if (!(sbp.eq_s(1, "y")))
{
break lab1;
}
sbp.ket = sbp.cursor;
sbp.slice_from("Y");
B_Y_found = true;
} while (false);
sbp.cursor = v_2;
v_3 = sbp.cursor;
lab2: do {
replab3: while(true)
{
v_4 = sbp.cursor;
lab4: do {
golab5: while(true)
{
v_5 = sbp.cursor;
lab6: do {
if (!(sbp.in_grouping(g_v, 97, 121)))
{
break lab6;
}
sbp.bra = sbp.cursor;
if (!(sbp.eq_s(1, "y")))
{
break lab6;
}
sbp.ket = sbp.cursor;
sbp.cursor = v_5;
break golab5;
} while (false);
sbp.cursor = v_5;
if (sbp.cursor >= sbp.limit)
{
break lab4;
}
sbp.cursor++;
}
sbp.slice_from("Y");
B_Y_found = true;
continue replab3;
} while (false);
sbp.cursor = v_4;
break replab3;
}
} while (false);
sbp.cursor = v_3;
return true;
}
function r_mark_regions() {
var v_1;
var v_2;
I_p1 = sbp.limit;
I_p2 = sbp.limit;
v_1 = sbp.cursor;
lab0: do {
lab1: do {
v_2 = sbp.cursor;
lab2: do {
if (sbp.find_among(a_0, 3) == 0)
{
break lab2;
}
break lab1;
} while (false);
sbp.cursor = v_2;
golab3: while(true)
{
lab4: do {
if (!(sbp.in_grouping(g_v, 97, 121)))
{
break lab4;
}
break golab3;
} while (false);
if (sbp.cursor >= sbp.limit)
{
break lab0;
}
sbp.cursor++;
}
golab5: while(true)
{
lab6: do {
if (!(sbp.out_grouping(g_v, 97, 121)))
{
break lab6;
}
break golab5;
} while (false);
if (sbp.cursor >= sbp.limit)
{
break lab0;
}
sbp.cursor++;
}
} while (false);
I_p1 = sbp.cursor;
golab7: while(true)
{
lab8: do {
if (!(sbp.in_grouping(g_v, 97, 121)))
{
break lab8;
}
break golab7;
} while (false);
if (sbp.cursor >= sbp.limit)
{
break lab0;
}
sbp.cursor++;
}
golab9: while(true)
{
lab10: do {
if (!(sbp.out_grouping(g_v, 97, 121)))
{
break lab10;
}
break golab9;
} while (false);
if (sbp.cursor >= sbp.limit)
{
break lab0;
}
sbp.cursor++;
}
I_p2 = sbp.cursor;
} while (false);
sbp.cursor = v_1;
return true;
}
function r_shortv() {
var v_1;
lab0: do {
v_1 = sbp.limit - sbp.cursor;
lab1: do {
if (!(sbp.out_grouping_b(g_v_WXY, 89, 121)))
{
break lab1;
}
if (!(sbp.in_grouping_b(g_v, 97, 121)))
{
break lab1;
}
if (!(sbp.out_grouping_b(g_v, 97, 121)))
{
break lab1;
}
break lab0;
} while (false);
sbp.cursor = sbp.limit - v_1;
if (!(sbp.out_grouping_b(g_v, 97, 121)))
{
return false;
}
if (!(sbp.in_grouping_b(g_v, 97, 121)))
{
return false;
}
if (sbp.cursor > sbp.limit_backward)
{
return false;
}
} while (false);
return true;
}
function r_R1() {
if (!(I_p1 <= sbp.cursor))
{
return false;
}
return true;
}
function r_R2() {
if (!(I_p2 <= sbp.cursor))
{
return false;
}
return true;
}
function r_Step_1a() {
var among_var;
var v_1;
var v_2;
v_1 = sbp.limit - sbp.cursor;
lab0: do {
sbp.ket = sbp.cursor;
among_var = sbp.find_among_b(a_1, 3);
if (among_var == 0)
{
sbp.cursor = sbp.limit - v_1;
break lab0;
}
sbp.bra = sbp.cursor;
switch(among_var) {
case 0:
sbp.cursor = sbp.limit - v_1;
break lab0;
case 1:
sbp.slice_del();
break;
}
} while (false);
sbp.ket = sbp.cursor;
among_var = sbp.find_among_b(a_2, 6);
if (among_var == 0)
{
return false;
}
sbp.bra = sbp.cursor;
switch(among_var) {
case 0:
return false;
case 1:
sbp.slice_from("ss");
break;
case 2:
lab1: do {
v_2 = sbp.limit - sbp.cursor;
lab2: do {
{
var c = sbp.cursor - 2;
if (sbp.limit_backward > c || c > sbp.limit)
{
break lab2;
}
sbp.cursor = c;
}
sbp.slice_from("i");
break lab1;
} while (false);
sbp.cursor = sbp.limit - v_2;
sbp.slice_from("ie");
} while (false);
break;
case 3:
if (sbp.cursor <= sbp.limit_backward)
{
return false;
}
sbp.cursor--;
golab3: while(true)
{
lab4: do {
if (!(sbp.in_grouping_b(g_v, 97, 121)))
{
break lab4;
}
break golab3;
} while (false);
if (sbp.cursor <= sbp.limit_backward)
{
return false;
}
sbp.cursor--;
}
sbp.slice_del();
break;
}
return true;
}
function r_Step_1b() {
var among_var;
var v_1;
var v_3;
var v_4;
sbp.ket = sbp.cursor;
among_var = sbp.find_among_b(a_4, 6);
if (among_var == 0)
{
return false;
}
sbp.bra = sbp.cursor;
switch(among_var) {
case 0:
return false;
case 1:
if (!r_R1())
{
return false;
}
sbp.slice_from("ee");
break;
case 2:
v_1 = sbp.limit - sbp.cursor;
golab0: while(true)
{
lab1: do {
if (!(sbp.in_grouping_b(g_v, 97, 121)))
{
break lab1;
}
break golab0;
} while (false);
if (sbp.cursor <= sbp.limit_backward)
{
return false;
}
sbp.cursor--;
}
sbp.cursor = sbp.limit - v_1;
sbp.slice_del();
v_3 = sbp.limit - sbp.cursor;
among_var = sbp.find_among_b(a_3, 13);
if (among_var == 0)
{
return false;
}
sbp.cursor = sbp.limit - v_3;
switch(among_var) {
case 0:
return false;
case 1:
{
var c = sbp.cursor;
sbp.insert(sbp.cursor, sbp.cursor, "e");
sbp.cursor = c;
}
break;
case 2:
sbp.ket = sbp.cursor;
if (sbp.cursor <= sbp.limit_backward)
{
return false;
}
sbp.cursor--;
sbp.bra = sbp.cursor;
sbp.slice_del();
break;
case 3:
if (sbp.cursor != I_p1)
{
return false;
}
v_4 = sbp.limit - sbp.cursor;
if (!r_shortv())
{
return false;
}
sbp.cursor = sbp.limit - v_4;
{
var c = sbp.cursor;
sbp.insert(sbp.cursor, sbp.cursor, "e");
sbp.cursor = c;
}
break;
}
break;
}
return true;
}
function r_Step_1c() {
var v_1;
var v_2;
sbp.ket = sbp.cursor;
lab0: do {
v_1 = sbp.limit - sbp.cursor;
lab1: do {
if (!(sbp.eq_s_b(1, "y")))
{
break lab1;
}
break lab0;
} while (false);
sbp.cursor = sbp.limit - v_1;
if (!(sbp.eq_s_b(1, "Y")))
{
return false;
}
} while (false);
sbp.bra = sbp.cursor;
if (!(sbp.out_grouping_b(g_v, 97, 121)))
{
return false;
}
{
v_2 = sbp.limit - sbp.cursor;
lab2: do {
if (sbp.cursor > sbp.limit_backward)
{
break lab2;
}
return false;
} while (false);
sbp.cursor = sbp.limit - v_2;
}
sbp.slice_from("i");
return true;
}
function r_Step_2() {
var among_var;
sbp.ket = sbp.cursor;
among_var = sbp.find_among_b(a_5, 24);
if (among_var == 0)
{
return false;
}
sbp.bra = sbp.cursor;
if (!r_R1())
{
return false;
}
switch(among_var) {
case 0:
return false;
case 1:
sbp.slice_from("tion");
break;
case 2:
sbp.slice_from("ence");
break;
case 3:
sbp.slice_from("ance");
break;
case 4:
sbp.slice_from("able");
break;
case 5:
sbp.slice_from("ent");
break;
case 6:
sbp.slice_from("ize");
break;
case 7:
sbp.slice_from("ate");
break;
case 8:
sbp.slice_from("al");
break;
case 9:
sbp.slice_from("ful");
break;
case 10:
sbp.slice_from("ous");
break;
case 11:
sbp.slice_from("ive");
break;
case 12:
sbp.slice_from("ble");
break;
case 13:
if (!(sbp.eq_s_b(1, "l")))
{
return false;
}
sbp.slice_from("og");
break;
case 14:
sbp.slice_from("ful");
break;
case 15:
sbp.slice_from("less");
break;
case 16:
if (!(sbp.in_grouping_b(g_valid_LI, 99, 116)))
{
return false;
}
sbp.slice_del();
break;
}
return true;
}
function r_Step_3() {
var among_var;
sbp.ket = sbp.cursor;
among_var = sbp.find_among_b(a_6, 9);
if (among_var == 0)
{
return false;
}
sbp.bra = sbp.cursor;
if (!r_R1())
{
return false;
}
switch(among_var) {
case 0:
return false;
case 1:
sbp.slice_from("tion");
break;
case 2:
sbp.slice_from("ate");
break;
case 3:
sbp.slice_from("al");
break;
case 4:
sbp.slice_from("ic");
break;
case 5:
sbp.slice_del();
break;
case 6:
if (!r_R2())
{
return false;
}
sbp.slice_del();
break;
}
return true;
}
function r_Step_4() {
var among_var;
var v_1;
sbp.ket = sbp.cursor;
among_var = sbp.find_among_b(a_7, 18);
if (among_var == 0)
{
return false;
}
sbp.bra = sbp.cursor;
if (!r_R2())
{
return false;
}
switch(among_var) {
case 0:
return false;
case 1:
sbp.slice_del();
break;
case 2:
lab0: do {
v_1 = sbp.limit - sbp.cursor;
lab1: do {
if (!(sbp.eq_s_b(1, "s")))
{
break lab1;
}
break lab0;
} while (false);
sbp.cursor = sbp.limit - v_1;
if (!(sbp.eq_s_b(1, "t")))
{
return false;
}
} while (false);
sbp.slice_del();
break;
}
return true;
}
function r_Step_5() {
var among_var;
var v_1;
var v_2;
sbp.ket = sbp.cursor;
among_var = sbp.find_among_b(a_8, 2);
if (among_var == 0)
{
return false;
}
sbp.bra = sbp.cursor;
switch(among_var) {
case 0:
return false;
case 1:
lab0: do {
v_1 = sbp.limit - sbp.cursor;
lab1: do {
if (!r_R2())
{
break lab1;
}
break lab0;
} while (false);
sbp.cursor = sbp.limit - v_1;
if (!r_R1())
{
return false;
}
{
v_2 = sbp.limit - sbp.cursor;
lab2: do {
if (!r_shortv())
{
break lab2;
}
return false;
} while (false);
sbp.cursor = sbp.limit - v_2;
}
} while (false);
sbp.slice_del();
break;
case 2:
if (!r_R2())
{
return false;
}
if (!(sbp.eq_s_b(1, "l")))
{
return false;
}
sbp.slice_del();
break;
}
return true;
}
function r_exception2() {
sbp.ket = sbp.cursor;
if (sbp.find_among_b(a_9, 8) == 0)
{
return false;
}
sbp.bra = sbp.cursor;
if (sbp.cursor > sbp.limit_backward)
{
return false;
}
return true;
}
function r_exception1() {
var among_var;
sbp.bra = sbp.cursor;
among_var = sbp.find_among(a_10, 18);
if (among_var == 0)
{
return false;
}
sbp.ket = sbp.cursor;
if (sbp.cursor < sbp.limit)
{
return false;
}
switch(among_var) {
case 0:
return false;
case 1:
sbp.slice_from("ski");
break;
case 2:
sbp.slice_from("sky");
break;
case 3:
sbp.slice_from("die");
break;
case 4:
sbp.slice_from("lie");
break;
case 5:
sbp.slice_from("tie");
break;
case 6:
sbp.slice_from("idl");
break;
case 7:
sbp.slice_from("gentl");
break;
case 8:
sbp.slice_from("ugli");
break;
case 9:
sbp.slice_from("earli");
break;
case 10:
sbp.slice_from("onli");
break;
case 11:
sbp.slice_from("singl");
break;
}
return true;
}
function r_postlude() {
var v_1;
var v_2;
if (!(B_Y_found))
{
return false;
}
replab0: while(true)
{
v_1 = sbp.cursor;
lab1: do {
golab2: while(true)
{
v_2 = sbp.cursor;
lab3: do {
sbp.bra = sbp.cursor;
if (!(sbp.eq_s(1, "Y")))
{
break lab3;
}
sbp.ket = sbp.cursor;
sbp.cursor = v_2;
break golab2;
} while (false);
sbp.cursor = v_2;
if (sbp.cursor >= sbp.limit)
{
break lab1;
}
sbp.cursor++;
}
sbp.slice_from("y");
continue replab0;
} while (false);
sbp.cursor = v_1;
break replab0;
}
return true;
}
this.stem = function() {
var v_1;
var v_2;
var v_3;
var v_4;
var v_5;
var v_6;
var v_7;
var v_8;
var v_9;
var v_10;
var v_11;
var v_12;
var v_13;
lab0: do {
v_1 = sbp.cursor;
lab1: do {
if (!r_exception1())
{
break lab1;
}
break lab0;
} while (false);
sbp.cursor = v_1;
lab2: do {
{
v_2 = sbp.cursor;
lab3: do {
{
var c = sbp.cursor + 3;
if (0 > c || c > sbp.limit)
{
break lab3;
}
sbp.cursor = c;
}
break lab2;
} while (false);
sbp.cursor = v_2;
}
break lab0;
} while (false);
sbp.cursor = v_1;
v_3 = sbp.cursor;
lab4: do {
if (!r_prelude())
{
break lab4;
}
} while (false);
sbp.cursor = v_3;
v_4 = sbp.cursor;
lab5: do {
if (!r_mark_regions())
{
break lab5;
}
} while (false);
sbp.cursor = v_4;
sbp.limit_backward = sbp.cursor; sbp.cursor = sbp.limit;
v_5 = sbp.limit - sbp.cursor;
lab6: do {
if (!r_Step_1a())
{
break lab6;
}
} while (false);
sbp.cursor = sbp.limit - v_5;
lab7: do {
v_6 = sbp.limit - sbp.cursor;
lab8: do {
if (!r_exception2())
{
break lab8;
}
break lab7;
} while (false);
sbp.cursor = sbp.limit - v_6;
v_7 = sbp.limit - sbp.cursor;
lab9: do {
if (!r_Step_1b())
{
break lab9;
}
} while (false);
sbp.cursor = sbp.limit - v_7;
v_8 = sbp.limit - sbp.cursor;
lab10: do {
if (!r_Step_1c())
{
break lab10;
}
} while (false);
sbp.cursor = sbp.limit - v_8;
v_9 = sbp.limit - sbp.cursor;
lab11: do {
if (!r_Step_2())
{
break lab11;
}
} while (false);
sbp.cursor = sbp.limit - v_9;
v_10 = sbp.limit - sbp.cursor;
lab12: do {
if (!r_Step_3())
{
break lab12;
}
} while (false);
sbp.cursor = sbp.limit - v_10;
v_11 = sbp.limit - sbp.cursor;
lab13: do {
if (!r_Step_4())
{
break lab13;
}
} while (false);
sbp.cursor = sbp.limit - v_11;
v_12 = sbp.limit - sbp.cursor;
lab14: do {
if (!r_Step_5())
{
break lab14;
}
} while (false);
sbp.cursor = sbp.limit - v_12;
} while (false);
sbp.cursor = sbp.limit_backward;
v_13 = sbp.cursor;
lab15: do {
if (!r_postlude())
{
break lab15;
}
} while (false);
sbp.cursor = v_13;
} while (false);
return true;
}
this.setCurrent = function(word) {
sbp.setCurrent(word);
};
this.getCurrent = function() {
return sbp.getCurrent();
};
}
return new englishStemmer();
}
wh.search_stemmer = Snowball();
wh.search_baseNameList = [
 "conversa.html",
 "conversa-2.html",
 "conversa-3.html",
 "conversa-4.html",
 "publish_map.html",
 "useful_tips.html",
 "conversa-5.html",
 "program_settings.html",
 "external_tools.html",
 "xml_catalog.html",
 "xsl_parameters.html",
 "common_parameters.html",
 "fo_parameters.html",
 "pageHeaderFooter.html",
 "html_parameters.html",
 "epub_parameters.html",
 "help_parameters.html",
 "common_help_parameters.html",
 "web_help_parameters.html",
 "html_help_parameters.html",
 "eclipse_help_parameters.html",
 "conversa-6.html"
];
wh.search_titleList = [
 "Conversa User Guide",
 "Introduction",
 "Conversa DITA Publisher",
 "Publishing DITA Maps",
 "Publish DITA Map Dialog",
 "Useful Tips",
 "Conversa Configuration",
 "Preferences Dialog",
 "External Tools",
 "XML Catalog",
 "XSL Stylesheet Parameters",
 "Common Parameters",
 "XSL-FO Parameters",
 "Page headers and footers",
 "HTML Parameters",
 "EPUB Parameters",
 "Help Parameters",
 "Common Help Parameters",
 "Web Help Parameters",
 "HTML Help Parameters",
 "Eclipse Help Parameters",
 "Index"
];
wh.search_wordMap= {
"custom-css": [14],
"german": [18],
"don\'t": [[14,15]],
"html5": [14],
"path_to": [18],
"part-number-format": [11],
"your": [[2,10],[5,14,15]],
"without": [14],
"link-auto-text": [11],
"these": [13,[14,18],19],
"dutch": [18],
"describ": [[11,13]],
"mathemat": [14],
"xml": [14,9,[13,18],[10,11,12]],
"poor": [12],
"rag": [12],
"wh_resourc": [18],
"sometim": [18],
"serv": [14],
"appendix": [13,11,12],
"thus": [[11,12]],
"footer-cent": [13,12],
"add-toc-root": [17],
"cdn": [18,14],
"click": [4,9],
"version": [[10,14,20]],
"befor": [11,[5,12]],
"folder": [4],
"size": [12,5,[15,18]],
"base.css": [14],
"left": [12,13],
"guess": [13],
"wh-layout": [18],
"styleheet": [11],
"retriev": [18],
"object": [11],
"hhc.ex": [8],
"chapter": [11,13,12,10],
"note.svg": [12],
"wh-user-css": [18],
"turn": [11],
"manual": [18,14],
"result": [4],
"header-center-width": [[12,13]],
"same": [18,[12,14,20]],
"page_layout": [13],
"appendic": [13,12],
"jpeg": [15],
"after": [12,11,[4,5,18]],
"hand": [11],
"language-python": [11],
"descend": [11],
"webhelp": [14],
"learn": [13],
"choice-bullet": [12],
"the": [13,12,18,11,14,4,8,20,9,15,5,[10,19],17,[2,16],7],
"invok": [12],
"screen-resolut": [14],
"wh-user-head": [18],
"imag": [15,13,18,[11,14]],
"wrap": [11],
"facet": [13],
"booklist": [[12,13]],
"basenam": [[19,20],18,14],
"reader": [15],
"mathjax-url": [14],
"contribut": [20],
"acm": [20],
"specif": [12,[11,13,15,18,19,20]],
"act": [11],
"wh-ui-languag": [18],
"exceed": [15],
"sampl": [18,11],
"http-equiv": [14],
"tip": [[5,11,12,13,18]],
"remedi": [11],
"implement": [[14,18]],
"export": [[5,10]],
"add": [9,[11,14],[5,12,17]],
"area": [12],
"res": [11,14],
"x2192": [12],
"initi": [18],
"need": [[11,14],[18,19],[9,12,13,15]],
"amend": [13],
"chm": [2],
"equival": [[12,13]],
"often": [18],
"reduc": [18],
"check": [4],
"list": [12,11,14,[15,18,19,20]],
"apropri": [8],
"respect": [11],
"rfc": [18],
"v5.3": [11],
"child_dis": [14],
"referenc": [[11,12],18],
"add-index-toc": [14],
"resolut": [14],
"success": [4],
"altern": [[12,13]],
"http": [14,12,18],
"renderx": [[2,8,12]],
"wh-responsive-ui": [18],
"child": [11,[12,13,14]],
"formatt": [[2,8,12]],
"fortun": [14],
"famili": [12],
"consequ": [18],
"xsl": [5,10,11,[8,12],[2,16]],
"language-ini": [11],
"determin": [18],
"softwar": [14],
"scope": [[11,14]],
"language-tcl": [11],
"title-prefix-separator1": [11],
"root": [18,[12,14]],
"page-height": [12],
"combin": [14],
"end": [11,14],
"bullet": [12],
"modifi": [13],
"xsl-resources-directori": [14,11],
"index-column-gap": [12],
"otherwis": [[12,18],11],
"label": [11,18],
"portrait": [12],
"howev": [13],
"maxprogram": [0],
"special": [11,14],
"better": [13,14],
"with": [13,[2,11],[9,10,12,14,15,19]],
"pdf": [2,[5,8,12],[11,13]],
"togeth": [14],
"there": [14,[13,18],[12,19]],
"footer-right-width": [13,12],
"syntax": [11],
"directori": [11,18,14,[12,13,15,19]],
"empti": [[13,14],[11,12]],
"copyright": [0],
"catalog": [9],
"properti": [18],
"desir": [4],
"page-width": [12],
"number": [11,12,[13,17],18],
"variabl": [13,18,19],
"identifi": [[15,20]],
"specifi": [12,18,[11,14],13,15,[17,19]],
"block": [12,11],
"narrow": [14],
"per": [[12,14]],
"flow": [11],
"ahf": [12],
"order": [[11,13,14]],
"e.g": [18,[12,14]],
"troubleshoot": [11],
"similar": [11],
"format-to-typ": [14],
"integ": [12,[13,14]],
"script": [14,15],
"fr-ca": [18],
"system": [[4,8],[9,16]],
"even": [13,12,4],
"test_page_sid": [13],
"proport": [12,13],
"larger": [12,13],
"other": [13,[12,14,18],[8,11,17]],
"against": [13,[11,19]],
"save": [[4,5,10]],
"index-column-count": [12],
"toc": [13,[11,17],[12,18]],
"restrict": [[11,14,17]],
"matter": [13,12],
"local": [13,12],
"valid": [18],
"interfac": [2],
"top": [[13,14]],
"assum": [[11,18]],
"locat": [8,[4,9,18]],
"have": [11,13,14,12,20],
"show-draft-com": [11],
"product": [[2,13]],
"hyphen": [12],
"goliv": [13],
"notic": [13,[18,19]],
"charact": [12],
"ignore-navigation-link": [14],
"navigation-background-color": [18],
"fo2rtf": [8],
"exampl": [18,11,12,13,[14,20]],
"xxx": [14],
"instal": [11,2],
"tabloid": [12],
"almost": [11],
"arrow": [12],
"pleas": [11],
"screen": [[14,18]],
"first_dis": [14],
"correspond": [[13,14],8,[5,12,18]],
"whenev": [18],
"etc": [11,[12,13],18,[14,19]],
"whether": [12,18,14,[11,13]],
"xyz": [14],
"page-sequ": [13],
"stock": [18],
"all": [11,12,14,13,10,[4,18],17],
"border": [12],
"new": [14],
"read": [13],
"below": [12,[11,13,18]],
"next_dis": [14],
"rememb": [13,[11,18]],
"tool": [8,18],
"absolut": [18,11],
"translat": [14],
"uniqu": [[15,20]],
"unit": [14,12],
"alreadi": [11],
"therefor": [13,[14,18]],
"bodi": [18,12,[11,13]],
"basic": [[13,18]],
"wh-navig": [18],
"c10": [12],
"indent": [12],
"footer": [12,13,18,14],
"pseudo-paramet": [18],
"simplet": [[11,14]],
"shorthand": [18],
"respons": [18],
"navigation-icon-height": [14],
"resolv": [11,[13,19]],
"and": [12,11,14,18,13,9,17,15,[2,5],[10,16]],
"distanc": [12],
"command-lin": [18],
"lang": [13,18],
"ani": [[12,13],18,[10,14,19]],
"render": [12,14,11],
"jqueri": [18],
"accord": [13],
"external-href-befor": [12],
"italian": [18],
"dedic": [13],
"qualifi": [20],
"horizont": [12,11],
"prepend-chapter-to-section-numb": [11],
"first_disabled.svg": [14],
"xslt": [11,12,8,18,19],
"remedy-number-format": [11],
"css": [14,18,11],
"distrib": [14],
"ship": [[2,10]],
"a-z": [14],
"java": [14,11],
"language-m2": [11],
"english": [18],
"mistak": [10],
"let": [13,11,18],
"menucascade-separ": [12],
"element": [11,12,14,[13,18]],
"apo": [20],
"morpholog": [18],
"want": [4,13,[2,8,10,11,14]],
"onclick": [15],
"png": [18,[12,14,15]],
"footer-separ": [12],
"processor": [12,8],
"note-icon-height": [12],
"each": [18,13,5],
"javascript": [14,[15,18]],
"input": [18],
"letter": [12],
"chain-top": [14],
"troublesolution-number-format": [11],
"must": [18,15,[8,11,12,13,14,20]],
"footer-height": [12],
"whc_index.xml": [18],
"a10": [12],
"appl": [7],
"document": [13,18,[11,12],15,[4,9,14,17,20]],
"recommend": [[14,18]],
"two": [[12,18]],
"anyway": [11],
"footer-left": [13,12],
"default": [12,14,11,18,20,15,19,[8,10,17],[2,4,5,7,9,13]],
"found": [18,14,13],
"are": [11,12,18,14,13,15,17,[2,4,19]],
"where": [[4,18]],
"anoth": [18],
"graphic": [2],
"resourc": [11,18,14,12],
"latest": [14],
"nncommon.css": [18],
"rtf": [[11,12],[2,13],[5,8]],
"black": [12],
"nest": [12],
"suppress": [13],
"high-level": [14],
"last_dis": [14],
"important.png": [11],
"fulli": [20],
"docx": [12,2,[5,8,11]],
"call": [18],
"such": [11,[13,14,18],[12,19]],
"txt": [14],
"googl": [18],
"classic": [18],
"contentsfil": [19],
"plugin": [5,20],
"opendocu": [11],
"principl": [18,[12,14]],
"thing": [18],
"won\'t": [13],
"locktitl": [11],
"hand-written": [11],
"conditional_valu": [13],
"microsoft": [[2,8]],
"align": [12],
"either": [18],
"whc-index-basenam": [18],
"navigation-width": [18],
"has": [13,[11,14],[18,20]],
"those": [18,[5,11]],
"ditac_install_dir": [[12,18]],
"pdf-outlin": [[5,12]],
"recurs": [18],
"given": [12,11],
"actual": [[11,17]],
"doubl": [12],
"pre": [11],
"last": [[11,13,14]],
"examin": [4],
"adapt": [18],
"mark-important-step": [11],
"develop": [14],
"bookmark": [5,12],
"attent": [11],
"equation-block": [12],
"test_page_sequ": [13],
"name": [13,[4,14],[11,12,20],18],
"low-level": [14],
"header_footer.css": [18],
"page": [12,13,11,18,14,15],
"doctyp": [11],
"page-count": [13],
"wh-inherit-font-and-color": [18],
"next": [[8,14]],
"hhx-basenam": [19],
"import": [11,[5,10,18,20]],
"string": [12,11,14,[13,20],[15,18]],
"color": [12,18],
"becaus": [11,13],
"show": [10],
"button": [4,10,8,9,[5,18]],
"nor": [14],
"comput": [12],
"not": [[11,13],14,[12,15,18],17],
"central": [12],
"info.xyz": [14],
"back-of-the-book": [14],
"introduct": [12,1],
"now": [13,[11,18]],
"footer.html": [18],
"precis": [13],
"enabl": [12],
"basic.css": [11],
"yes": [12,14,18,11,17,15,5],
"header_footer_fil": [18],
"center": [11,[2,13]],
"start": [18,[4,11]],
"subfold": [4],
"yet": [15],
"way": [13,12],
"pair": [14],
"xhtml": [14,11,18,15],
"target": [14,[11,12]],
"equal": [12,13,11],
"finnish": [18],
"what": [13,14],
"refer": [18,[10,11,13]],
"chang": [12,[7,9,14]],
"equat": [11,12],
"header-height": [12],
"short": [11],
"window": [14,8,[2,7,10]],
"time": [[5,10]],
"toc.hhc": [19],
"title-pag": [11],
"footer-right": [13,12],
"xhtml-base": [[11,14]],
"pagebreak": [12],
"page_sequ": [13],
"compris": [11],
"program": [[4,8]],
"when": [11,[13,14,18],12,[4,15]],
"sequenc": [13],
"enter": [8,4],
"prioriti": [14],
"specialize.html": [14],
"case": [13,11],
"applic": [14,9],
"give": [[11,13],18],
"item": [12],
"multipl": [11,[2,4,5]],
"watermark": [12,11],
"header-cent": [13,12],
"russian": [18],
"xsl-region-bodi": [11],
"navigation-color": [18],
"collaps": [18],
"explicit": [11,18],
"consid": [13],
"reset": [10],
"everyth": [13],
"style": [14],
"février": [13],
"engin": [8,14],
"tabl": [11,13,12,[14,20],[9,15,18,19]],
"equation-number-befor": [11],
"widget": [20],
"log": [4],
"generator-info": [14],
"direct": [[12,13]],
"compil": [18,8],
"note-icon-list": [11],
"epub-identifi": [15],
"unknown": [14],
"caus": [12,14],
"web": [18,14,[2,17],[10,16]],
"title-aft": [11],
"chapter-titl": [12,13],
"pane": [18],
"plugin-nam": [20],
"document-d": [13],
"ledger": [12],
"more": [12,18,[13,14]],
"display": [12,[11,14]],
"equation-numb": [11,12],
"paper-typ": [12,5],
"width": [12,13,14,18],
"en-us": [18],
"whitespac": [11,12,14],
"section": [11,13,12,5],
"uuid": [15],
"simpli": [13],
"test_page_layout": [13],
"choice-label": [12],
"index.hhx": [19],
"draft-com": [11],
"few": [14],
"bear": [17],
"titl": [11,13,12,[17,20]],
"suppos": [[11,13]],
"orient": [12],
"workshop": [2],
"kind": [12,[11,18]],
"equation-block-equation-width": [12],
"format": [11,14,4,2,12,[5,8,9,13,17]],
"chapter-on": [11],
"artwork": [13],
"done": [[11,13]],
"both": [14,[11,12]],
"most": [[9,11]],
"formal": [11],
"twice": [13],
"turkish": [18],
"effect": [[12,17]],
"topic": [11,13,12,[14,17]],
"ul-li-bullet": [12],
"header-right-width": [[12,13]],
"option": [[11,16],[4,5,10,12,18]],
"mml_chtml": [14],
"request": [4],
"wordprocessingml": [[11,12]],
"trademarklist": [13],
"procedur": [4],
"page-bottom-margin": [12],
"pars": [13],
"part": [12,13,11],
"generat": [[11,13],14,12,18,15,[2,8],17,4,[19,20]],
"their": [11,[18,19]],
"insert": [[12,18],13],
"remark": [18],
"point": [11,[12,14]],
"language-java": [11],
"highlight": [11],
"general": [[11,18]],
"browser": [18,14],
"messag": [18],
"facil": [18],
"process": [[4,11,18]],
"footer-center-width": [[12,13]],
"resp": [11],
"attribut": [11,12,14,13,[15,18]],
"bookmeta": [13],
"also": [13,[2,11,12,14,15,18]],
"xref-auto-text": [11],
"generate-epub-trigg": [15],
"differ": [18,13],
"a0": [12],
"wh-user-foot": [18],
"linguist": [18],
"a1": [12],
"a2": [12],
"a3": [12],
"a4": [12,5],
"a5": [12],
"wh-local-jqueri": [18],
"a6": [12],
"mean": [13,[11,18],[12,14]],
"a7": [12],
"a8": [12],
"neither": [14],
"a9": [12],
"front": [13,12],
"user": [18,11,[0,2,9,10,15,20]],
"wh-header": [18],
"note.png": [11],
"parent": [14],
"been": [[11,14,18]],
"extens": [14],
"fig": [11],
"ident": [12],
"mime": [14],
"addit": [12,9],
"subdirectori": [20],
"xsl-fo": [12,11,8,[2,5]],
"b0": [12],
"b1": [12],
"rightward": [12],
"b2": [12],
"path": [[8,18]],
"b3": [12],
"prefac": [13],
"b4": [12],
"b5": [12],
"built-in": [8],
"b6": [12],
"fix": [14],
"b7": [12],
"plugin-toc-basenam": [20],
"b8": [12],
"b9": [12],
"rang": [11],
"pseudo": [17],
"you": [14,4,[2,11,13],[8,10,18],15],
"eclips": [14,[5,17,20],[2,16]],
"posit": [[12,14]],
"page_sid": [13],
"ad": [[14,18],11,[5,9]],
"sure": [11],
"pass": [18,[10,12,14]],
"navigation-font-s": [18],
"ancestor": [11],
"automat": [11,13,4],
"percentag": [14],
"an": [11,12,[14,18],13,15,[2,10,19,20]],
"subsect": [11],
"c0": [12],
"c1": [12],
"c2": [12],
"extend": [11],
"c3": [12],
"c4": [12],
"as": [[11,13],18,[12,14],15,[9,19,20]],
"c5": [12],
"slim.min.j": [18],
"at": [[10,11],[5,12,13,14]],
"c6": [12],
"configur": [[2,5,6,8,10,14,16]],
"c7": [12],
"c8": [12],
"nativ": [14],
"c9": [12],
"wh-footer": [18],
"mathjax": [14],
"descript": [[11,12,14,15,17,18,19,20]],
"number-separator2": [11],
"attribute-set": [12],
"number-separator1": [11],
"schema": [9],
"organ": [20],
"be": [18,13,12,11,14,15,9,[2,4,7,8,17,19]],
"scheme": [18],
"icon": [14,12,11,18],
"dead": [12],
"header-right": [13,12],
"how": [[11,13,14]],
"see": [12,11,14,[13,18]],
"search": [18],
"nntheme.css": [18],
"by": [12,11,18,14,13,[4,15,17],[2,5,9]],
"epub": [15,14,[11,17],2],
"wml": [12],
"two-sid": [12,13],
"term": [11],
"panel": [4],
"form—gener": [18],
"set": [[5,10],[7,18],[11,12,14]],
"contain": [12,11,13,18,[14,19],15,[5,17,20]],
"show-link-pag": [12],
"column": [13,12],
"language-javascript": [11],
"cssresourcenam": [14],
"right": [12,13,[2,4]],
"freeli": [2],
"figur": [11],
"es-ar": [18],
"navtitl": [11],
"inch": [14],
"apach": [8,2,12],
"config": [14],
"did": [11],
"font": [12,18],
"dd": [13],
"de": [18],
"external-link-icon-width": [14],
"featur": [11],
"offic": [[11,12]],
"topicmeta": [13],
"xfc-render-as-t": [12],
"extern": [8,[11,12,14],2],
"forc": [12],
"do": [[11,14]],
"ditac-xsl": [12],
"div": [18,11],
"mathjax.j": [14],
"whc_toc.xml": [18],
"header-left": [13,12],
"legal": [12],
"mark-external-link": [14],
"which": [11,12,18,14,13,19,[15,20]],
"brows": [[4,8]],
"signific": [13],
"test": [13],
"en": [[12,18],[11,13]],
"body-start-ind": [12],
"collection-typ": [14],
"es": [18],
"never": [11],
"ditav": [4],
"adjust": [10],
"compat": [15],
"some": [11],
"indic": [[4,8]],
"blank": [14,12],
"rather": [11],
"fop": [8,[2,12]],
"for": [12,11,13,18,14,5,17,[2,4,8,9,10,15,16,19]],
"fo": [12,11],
"back": [13,12],
"divis": [13],
"compani": [20],
"fr": [13],
"content": [13,12,[11,18],[14,19,20]],
"load": [14,[5,10,11]],
"manual-fop.pdf": [12],
"xhtml-mime-typ": [14],
"just": [[2,11,12]],
"pixel": [[14,15]],
"over": [14],
"spanish": [18],
"someth": [11,[13,14]],
"custom": [11,[10,14,18],[2,12]],
"length": [12,14],
"tablelist": [13],
"font-famili": [12],
"language-perl": [11],
"condit": [[12,13],4],
"print": [12],
"form": [[11,18]],
"publish": [4,2,[3,5]],
"interpret": [18],
"inherit": [18],
"xmlmind": [18,[2,12],8,[11,14]],
"www.xmlmind.com": [14],
"inflect": [18],
"note-icon-suffix": [12,14],
"restor": [10],
"relat": [18,11,14,15,[12,13]],
"customcss": [14],
"append": [12],
"index-range-separ": [11],
"explain": [[13,14]],
"select": [4,9,[7,13],[8,10,16,18]],
"easili": [2],
"convert": [14,12,[2,8,13],11,[4,18]],
"ignor": [12,[11,14],17],
"attempt": [14],
"norwegian": [18],
"output": [[11,12],4,[2,14],5],
"veri": [14,12],
"text": [11,12,14,4,8,[13,19]],
"https": [18,14],
"id": [18,20],
"if": [11,14,13,12,4,15,17,[2,8,10,18]],
"french": [18],
"ii": [11],
"creat": [11,[13,14]],
"java-lik": [20],
"xref": [11,12,14],
"header-left-width": [[12,13]],
"in": [18,11,14,12,4,13,8,5,[7,9,10],2,[15,16,19]],
"plugin-provid": [20],
"made": [[10,11,15]],
"whc-toc-basenam": [18],
"index": [13,12,18,[11,14,19,20]],
"is": [13,18,14,11,12,[2,15],[5,8,17],4],
"mathml": [14],
"it": [13,11,18,12,[2,15],[4,8,9,14]],
"vertic": [12],
"odd": [13,12],
"dtds": [9],
"troublesolut": [11],
"plugin-vers": [20],
"toc.xml": [20],
"singl": [12],
"doc": [14],
"doe": [11,15],
"page-outer-margin": [12],
"begin": [14],
"odt": [[2,12],[5,8,11]],
"viewer": [4],
"paragraph": [12],
"charset": [14],
"server": [18],
"ditac": [[11,14],[15,18],[2,12]],
"valu": [12,11,14,18,13,20,15,17,19,10],
"paramet": [12,18,14,11,[5,10],13,[17,19,20],15,16],
"dot": [14],
"new_window.png": [14],
"js": [18],
"menucascad": [12],
"hungarian": [18],
"landscap": [12],
"overrid": [18],
"mac": [[7,8]],
"deriv": [18],
"fo-bas": [11],
"file": [18,11,4,14,[8,19],2,15,[9,20],[10,12,13]],
"dpi": [14],
"map": [4,13,[3,8,11,14,18]],
"side": [[12,13,18]],
"html-base": [14],
"may": [12,[13,14,18],11],
"break": [13,12],
"case-insensit": [12],
"within": [13],
"external-link-icon-nam": [14],
"trigger": [15],
"menu": [7,4],
"section1": [13,12],
"uri": [18,11,13,15],
"cause-number-format": [11],
"url": [14,11,[18,19],12,20,15],
"off": [11],
"urn": [15],
"relev": [[9,12]],
"li": [12],
"auto": [14,11],
"use": [18,12,[11,13],14,8,[2,5],4,10,[15,17]],
"extended-toc": [11],
"main": [18,13,12],
"suffix": [[12,14]],
"second": [11,13],
"that": [11,13,14,18,12,17,19,[2,4,5,8,15,20]],
"download": [2,[14,18]],
"conveni": [12],
"than": [12,[11,13,14],[8,18]],
"limit": [12],
"use-note-icon": [11],
"dita": [4,[2,14],13,12,[3,8,18]],
"mm": [13],
"entri": [9,17],
"page-top-margin": [12],
"substep": [11],
"external-link-icon-height": [14],
"author": [[11,20]],
"utf": [[14,19]],
"difficult": [13],
"header.html": [18],
"compiledfil": [19],
"guarante": [13],
"task": [4],
"background": [12],
"updat": [9],
"header": [12,13,18,14],
"navigation-icon-width": [14],
"produc": [14],
"no": [12,11,[14,18],15,[13,17],20,19],
"belong": [13],
"code": [18,15],
"show-xref-pag": [12],
"one-sid": [[12,13]],
"box": [4,8,2],
"hhp-templat": [19],
"head": [14],
"dialog": [7,[4,5,9],[8,10,16]],
"transform": [8],
"total": [13],
"execut": [8],
"hous": [[2,8,12]],
"of": [12,13,11,18,14,20,5,[4,19],[8,10,15],[2,16,17]],
"possibl": [18,[11,12,14]],
"body-font-famili": [12],
"dynam": [15],
"make": [11],
"on": [[11,12,18],[7,13],[4,5]],
"suffic": [13],
"page-inner-margin": [12],
"or": [12,13,18,14,11,8,4,2,[7,9,10,15,20]],
"os": [[7,8]],
"note-icon-width": [12],
"src": [[11,14,18]],
"abov": [[11,12,18]],
"control": [5],
"encod": [19],
"glossarylist": [13],
"non-typ": [13],
"chain-pag": [14],
"conform": [18],
"underlin": [12],
"first.svg": [14],
"b10": [12],
"metadata": [11],
"inform": [[4,5,14,18]],
"depend": [12,5],
"outputclass": [11],
"about": [[4,13,18]],
"bookmap": [11,13],
"px": [14,12],
"yyyi": [13],
"danger": [11],
"backmatt": [11,12],
"topic-titl": [13],
"cover": [15],
"reflect": [[4,9]],
"plugin-id": [20],
"show-imagemap-link": [12],
"parent_dis": [14],
"wh-jqueri": [18],
"drawn": [12],
"they": [18,14],
"height": [[12,14]],
"previous_dis": [14],
"them": [18],
"then": [[12,13],11,[14,18]],
"bibliolist": [13],
"accept": [15],
"node": [11],
"includ": [[11,13],9],
"meta": [14],
"declar": [15],
"base-font-s": [12],
"except": [[12,14]],
"libreoffic": [12],
"template.hhp": [19],
"equation-number-aft": [11],
"fact": [[12,13,14]],
"access": [[16,18]],
"end-us": [18,[12,14,19]],
"wh-use-stem": [18],
"languag": [18,13],
"global": [15],
"workaround": [12],
"draftintro": [13],
"current": [13,18,11,[5,10,15]],
"language-c": [11],
"unless": [12,14,[11,17]],
"navigation-icon-suffix": [14],
"free": [2],
"so": [18],
"caution": [11],
"mix": [13],
"fo_indent.xsl": [12],
"plug-in": [20,14],
"intern": [12],
"onc": [10],
"svg": [[12,14,15]],
"one": [12,[13,18],5],
"store": [[4,18]],
"highlight-sourc": [11],
"appear": [[4,9,10]],
"body-bottom-margin": [12],
"hierarch": [11],
"remov": [9,11],
"watermark-imag": [[11,12]],
"to": [14,11,18,12,13,[4,8],10,[2,15],[5,9],[7,17,19],[16,20]],
"open": [14,4,7,[10,11,12]],
"typic": [[18,20],[14,15]],
"but": [13,[11,12,14],[2,18]],
"number-toc-entri": [17],
"number-lik": [18],
"prepend": [11],
"project": [[2,19]],
"express": [13],
"zero": [[12,14]],
"language-cpp": [11],
"backmattersect": [13],
"sever": [[12,13]],
"ul": [12],
"variant": [14],
"page-ref-befor": [12],
"up": [13],
"written": [18],
"appendix-number-format": [11],
"romanian": [18],
"conversa": [2,8,[0,6,7,10,11]],
"title-color": [12],
"this": [11,12,18,13,14,10,15,[4,19]],
"important.svg": [12],
"look": [18],
"repres": [12,11],
"substitut": [[13,19]],
"opt": [11],
"hint": [11],
"external-href-aft": [12],
"guid": [10,[0,20]],
"know": [14],
"language-php": [11],
"cdn.mathjax.org": [14],
"support": [12,18,[2,9,13,14,15,17]],
"allow": [11,12,14,18,[15,17],13],
"processing-instruct": [12],
"defer": [14],
"ul-li-label": [12],
"commerci": [2],
"rule": [12],
"proper": [13],
"wh-user-resourc": [18],
"we": [13],
"body-top-margin": [12],
"wh": [18],
"common": [17,[11,14]],
"flush": [12],
"appli": [[11,15],[12,13,14,18]],
"linux": [[7,8]],
"page-orient": [12],
"document-titl": [13,12],
"choic": [12],
"normal": [11],
"imagemap": [12],
"wide": [13],
"previous": [14],
"equation-block-number-width": [12],
"bookabstract": [13],
"footer-left-width": [[12,13]],
"caution.svg": [12],
"layout": [18,13],
"critdat": [13],
"step": [12,[4,11]],
"default-table-width": [14],
"mark": [[14,18]],
"base": [11,18],
"stem": [18],
"antenna": [[2,8,12]],
"intermedi": [12],
"sourc": [12],
"justifi": [12],
"defaulttop": [19],
"none": [11,14],
"type": [14,11,[4,12],9],
"theori": [15],
"test.java": [11],
"problem": [14],
"css_var_nam": [18],
"frontmatt": [11,12],
"filenam": [18],
"logo200x100": [18],
"href": [11,14,12],
"linktext": [11],
"flow-nam": [11],
"between": [[12,13]],
"stylesheet": [14,[11,12],18,10,17,19,[5,15,20]],
"xep": [12,[2,8]],
"work": [18,[11,13],[2,14,15]],
"unordered-step-bullet": [12],
"var": [18],
"show-external-link": [12],
"come": [13],
"exist": [11],
"fail": [11],
"itself": [18],
"xfc": [12],
"index.xml": [20],
"word": [18,12],
"wh-index-numb": [18],
"introduction.dita": [12],
"link-bullet": [12],
"flag": [14],
"postscript": [[2,12]],
"cover-imag": [15],
"fastpath": [11],
"unordered-step-label": [12],
"copi": [[11,18],14],
"requir": [11,8,[2,14]],
"our": [13],
"out": [2],
"equation-figur": [11],
"get": [18],
"simplest": [13],
"wh-collapse-toc": [18],
"danish": [18],
"language-delphi": [11],
"page-ref-aft": [12],
"logo.svg": [13],
"navigation-font-famili": [18],
"alway": [11],
"header-separ": [12],
"toolbar": [4],
"help": [18,14,[2,17],[16,19],8,[5,11,20],10],
"expect": [14,[11,12,13]],
"comma": [12],
"www.oasis-open.org": [12],
"epub2": [15],
"cannot": [18],
"language-csharp": [11],
"revis": [13],
"first": [13,11,[12,14]],
"com.acme.widget.userguid": [20],
"date": [13],
"prefer": [7,[5,14],[8,9,10,16,18]],
"corp": [20],
"firefox": [14],
"own": [18],
"abbrevlist": [13],
"separ": [12,11,13,[10,14]],
"content-typ": [14],
"space": [12],
"tab": [5,[8,9,10,16,18]],
"output_directori": [18],
"plain": [14,19],
"simpl": [[15,18]],
"plugin-index-basenam": [20],
"should": [12,18,[11,14],[17,19]],
"indexlist": [13],
"from": [2,18,[4,11],[8,12],[9,13]],
"html": [14,2,19,11,18,[8,16,17]],
"oasi": [12],
"external-resource-bas": [11],
"portugues": [18],
"swedish": [18],
"like": [11,18,[13,14]],
"bottom": [14],
"onli": [12,[13,15],[5,11,14,18]],
"sans-serif": [12],
"templat": [18,19],
"title-font-famili": [12],
"whc_templat": [18],
"impli": [12,11],
"language-rubi": [11],
"openoffic": [12],
"navig": [14,18],
"dash": [12,11],
"note": [11,12,14,[13,18]],
"colophon": [13],
"img": [18],
"x2022": [12],
"noth": [11],
"line": [13],
"link": [12,14,11],
"hhc-basenam": [19],
"acme.com": [14],
"can": [2,[5,7,8,9,10,14,18]],
"public": [4,[10,13]],
"paper": [5,12],
"code.jquery.com": [18],
"cat": [11],
"februari": [13],
"provid": [2],
"steps-unord": [12],
"prose": [14],
"will": [12,9,[11,13,18]],
"match": [13],
"x2013": [[11,12]],
"follow": [18,[11,12,13],[4,8,14,15,19,20]],
"instead": [14],
"page-numb": [12,13],
"async": [14],
"figurelist": [13],
"fo2rtf.bat": [8],
"topicref": [14,11,13],
"serif": [12],
"last.svg": [14],
"dimens": [14],
"perman": [15]
};
