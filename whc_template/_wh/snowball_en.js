/*!
 * Snowball JavaScript Library v0.4
 * http://snowball.tartarus.org/
 * https://github.com/mazko/jssnowball
 *
 * Copyright Nov 25 2012, Oleg Mazko
 * http://www.opensource.org/licenses/bsd-license.html
 */

function Snowball() {

/* Among.js --------------------------------------------------------------- */

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

/* SnowballProgram.js ----------------------------------------------------- */

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

			/* Potentially bug of ANSI C stemmers, presents here for porting compliance */

			return current ? encodeURIComponent(current).match(/%..|./g).length + 1 : 1;
		}
	};
}

/* ------------------------------------------------------------------------- */
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