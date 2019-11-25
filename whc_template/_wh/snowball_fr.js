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
function frenchStemmer() {
        var a_0 = [
            new Among ( "col", -1, -1 ),
            new Among ( "par", -1, -1 ),
            new Among ( "tap", -1, -1 )
        ];

        var a_1 = [
            new Among ( "", -1, 4 ),
            new Among ( "I", 0, 1 ),
            new Among ( "U", 0, 2 ),
            new Among ( "Y", 0, 3 )
        ];

        var a_2 = [
            new Among ( "iqU", -1, 3 ),
            new Among ( "abl", -1, 3 ),
            new Among ( "I\u00E8r", -1, 4 ),
            new Among ( "i\u00E8r", -1, 4 ),
            new Among ( "eus", -1, 2 ),
            new Among ( "iv", -1, 1 )
        ];

        var a_3 = [
            new Among ( "ic", -1, 2 ),
            new Among ( "abil", -1, 1 ),
            new Among ( "iv", -1, 3 )
        ];

        var a_4 = [
            new Among ( "iqUe", -1, 1 ),
            new Among ( "atrice", -1, 2 ),
            new Among ( "ance", -1, 1 ),
            new Among ( "ence", -1, 5 ),
            new Among ( "logie", -1, 3 ),
            new Among ( "able", -1, 1 ),
            new Among ( "isme", -1, 1 ),
            new Among ( "euse", -1, 11 ),
            new Among ( "iste", -1, 1 ),
            new Among ( "ive", -1, 8 ),
            new Among ( "if", -1, 8 ),
            new Among ( "usion", -1, 4 ),
            new Among ( "ation", -1, 2 ),
            new Among ( "ution", -1, 4 ),
            new Among ( "ateur", -1, 2 ),
            new Among ( "iqUes", -1, 1 ),
            new Among ( "atrices", -1, 2 ),
            new Among ( "ances", -1, 1 ),
            new Among ( "ences", -1, 5 ),
            new Among ( "logies", -1, 3 ),
            new Among ( "ables", -1, 1 ),
            new Among ( "ismes", -1, 1 ),
            new Among ( "euses", -1, 11 ),
            new Among ( "istes", -1, 1 ),
            new Among ( "ives", -1, 8 ),
            new Among ( "ifs", -1, 8 ),
            new Among ( "usions", -1, 4 ),
            new Among ( "ations", -1, 2 ),
            new Among ( "utions", -1, 4 ),
            new Among ( "ateurs", -1, 2 ),
            new Among ( "ments", -1, 15 ),
            new Among ( "ements", 30, 6 ),
            new Among ( "issements", 31, 12 ),
            new Among ( "it\u00E9s", -1, 7 ),
            new Among ( "ment", -1, 15 ),
            new Among ( "ement", 34, 6 ),
            new Among ( "issement", 35, 12 ),
            new Among ( "amment", 34, 13 ),
            new Among ( "emment", 34, 14 ),
            new Among ( "aux", -1, 10 ),
            new Among ( "eaux", 39, 9 ),
            new Among ( "eux", -1, 1 ),
            new Among ( "it\u00E9", -1, 7 )
        ];

        var a_5 = [
            new Among ( "ira", -1, 1 ),
            new Among ( "ie", -1, 1 ),
            new Among ( "isse", -1, 1 ),
            new Among ( "issante", -1, 1 ),
            new Among ( "i", -1, 1 ),
            new Among ( "irai", 4, 1 ),
            new Among ( "ir", -1, 1 ),
            new Among ( "iras", -1, 1 ),
            new Among ( "ies", -1, 1 ),
            new Among ( "\u00EEmes", -1, 1 ),
            new Among ( "isses", -1, 1 ),
            new Among ( "issantes", -1, 1 ),
            new Among ( "\u00EEtes", -1, 1 ),
            new Among ( "is", -1, 1 ),
            new Among ( "irais", 13, 1 ),
            new Among ( "issais", 13, 1 ),
            new Among ( "irions", -1, 1 ),
            new Among ( "issions", -1, 1 ),
            new Among ( "irons", -1, 1 ),
            new Among ( "issons", -1, 1 ),
            new Among ( "issants", -1, 1 ),
            new Among ( "it", -1, 1 ),
            new Among ( "irait", 21, 1 ),
            new Among ( "issait", 21, 1 ),
            new Among ( "issant", -1, 1 ),
            new Among ( "iraIent", -1, 1 ),
            new Among ( "issaIent", -1, 1 ),
            new Among ( "irent", -1, 1 ),
            new Among ( "issent", -1, 1 ),
            new Among ( "iront", -1, 1 ),
            new Among ( "\u00EEt", -1, 1 ),
            new Among ( "iriez", -1, 1 ),
            new Among ( "issiez", -1, 1 ),
            new Among ( "irez", -1, 1 ),
            new Among ( "issez", -1, 1 )
        ];

        var a_6 = [
            new Among ( "a", -1, 3 ),
            new Among ( "era", 0, 2 ),
            new Among ( "asse", -1, 3 ),
            new Among ( "ante", -1, 3 ),
            new Among ( "\u00E9e", -1, 2 ),
            new Among ( "ai", -1, 3 ),
            new Among ( "erai", 5, 2 ),
            new Among ( "er", -1, 2 ),
            new Among ( "as", -1, 3 ),
            new Among ( "eras", 8, 2 ),
            new Among ( "\u00E2mes", -1, 3 ),
            new Among ( "asses", -1, 3 ),
            new Among ( "antes", -1, 3 ),
            new Among ( "\u00E2tes", -1, 3 ),
            new Among ( "\u00E9es", -1, 2 ),
            new Among ( "ais", -1, 3 ),
            new Among ( "erais", 15, 2 ),
            new Among ( "ions", -1, 1 ),
            new Among ( "erions", 17, 2 ),
            new Among ( "assions", 17, 3 ),
            new Among ( "erons", -1, 2 ),
            new Among ( "ants", -1, 3 ),
            new Among ( "\u00E9s", -1, 2 ),
            new Among ( "ait", -1, 3 ),
            new Among ( "erait", 23, 2 ),
            new Among ( "ant", -1, 3 ),
            new Among ( "aIent", -1, 3 ),
            new Among ( "eraIent", 26, 2 ),
            new Among ( "\u00E8rent", -1, 2 ),
            new Among ( "assent", -1, 3 ),
            new Among ( "eront", -1, 2 ),
            new Among ( "\u00E2t", -1, 3 ),
            new Among ( "ez", -1, 2 ),
            new Among ( "iez", 32, 2 ),
            new Among ( "eriez", 33, 2 ),
            new Among ( "assiez", 33, 3 ),
            new Among ( "erez", 32, 2 ),
            new Among ( "\u00E9", -1, 2 )
        ];

        var a_7 = [
            new Among ( "e", -1, 3 ),
            new Among ( "I\u00E8re", 0, 2 ),
            new Among ( "i\u00E8re", 0, 2 ),
            new Among ( "ion", -1, 1 ),
            new Among ( "Ier", -1, 2 ),
            new Among ( "ier", -1, 2 ),
            new Among ( "\u00EB", -1, 4 )
        ];

        var a_8 = [
            new Among ( "ell", -1, -1 ),
            new Among ( "eill", -1, -1 ),
            new Among ( "enn", -1, -1 ),
            new Among ( "onn", -1, -1 ),
            new Among ( "ett", -1, -1 )
        ];

        var g_v = [17, 65, 16, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 130, 103, 8, 5 ];

        var g_keep_with_s = [1, 65, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128 ];

        var I_p2;
        var I_p1;
        var I_pV;

        var sbp = new SnowballProgram();

        function r_prelude() {
            var v_1;
            var v_2;
            var v_3;
            var v_4;
            replab0: while(true)
            {
                v_1 = sbp.cursor;
                lab1: do {
                    golab2: while(true)
                    {
                        v_2 = sbp.cursor;
                        lab3: do {
                            lab4: do {
                                v_3 = sbp.cursor;
                                lab5: do {
                                    if (!(sbp.in_grouping(g_v, 97, 251)))
                                    {
                                        break lab5;
                                    }
                                    sbp.bra = sbp.cursor;
                                    lab6: do {
                                        v_4 = sbp.cursor;
                                        lab7: do {
                                            if (!(sbp.eq_s(1, "u")))
                                            {
                                                break lab7;
                                            }
                                            sbp.ket = sbp.cursor;
                                            if (!(sbp.in_grouping(g_v, 97, 251)))
                                            {
                                                break lab7;
                                            }
                                            sbp.slice_from("U");
                                            break lab6;
                                        } while (false);
                                        sbp.cursor = v_4;
                                        lab8: do {
                                            if (!(sbp.eq_s(1, "i")))
                                            {
                                                break lab8;
                                            }
                                            sbp.ket = sbp.cursor;
                                            if (!(sbp.in_grouping(g_v, 97, 251)))
                                            {
                                                break lab8;
                                            }
                                            sbp.slice_from("I");
                                            break lab6;
                                        } while (false);
                                        sbp.cursor = v_4;
                                        if (!(sbp.eq_s(1, "y")))
                                        {
                                            break lab5;
                                        }
                                        sbp.ket = sbp.cursor;
                                        sbp.slice_from("Y");
                                    } while (false);
                                    break lab4;
                                } while (false);
                                sbp.cursor = v_3;
                                lab9: do {
                                    sbp.bra = sbp.cursor;
                                    if (!(sbp.eq_s(1, "y")))
                                    {
                                        break lab9;
                                    }
                                    sbp.ket = sbp.cursor;
                                    if (!(sbp.in_grouping(g_v, 97, 251)))
                                    {
                                        break lab9;
                                    }
                                    sbp.slice_from("Y");
                                    break lab4;
                                } while (false);
                                sbp.cursor = v_3;
                                if (!(sbp.eq_s(1, "q")))
                                {
                                    break lab3;
                                }
                                sbp.bra = sbp.cursor;
                                if (!(sbp.eq_s(1, "u")))
                                {
                                    break lab3;
                                }
                                sbp.ket = sbp.cursor;
                                sbp.slice_from("U");
                            } while (false);
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
                    continue replab0;
                } while (false);
                sbp.cursor = v_1;
                break replab0;
            }
            return true;
        }

        function r_mark_regions() {
            var v_1;
            var v_2;
            var v_4;
            I_pV = sbp.limit;
            I_p1 = sbp.limit;
            I_p2 = sbp.limit;
            v_1 = sbp.cursor;
            lab0: do {
                lab1: do {
                    v_2 = sbp.cursor;
                    lab2: do {
                        if (!(sbp.in_grouping(g_v, 97, 251)))
                        {
                            break lab2;
                        }
                        if (!(sbp.in_grouping(g_v, 97, 251)))
                        {
                            break lab2;
                        }
                        if (sbp.cursor >= sbp.limit)
                        {
                            break lab2;
                        }
                        sbp.cursor++;
                        break lab1;
                    } while (false);
                    sbp.cursor = v_2;
                    lab3: do {
                        if (sbp.find_among(a_0, 3) == 0)
                        {
                            break lab3;
                        }
                        break lab1;
                    } while (false);
                    sbp.cursor = v_2;
                    if (sbp.cursor >= sbp.limit)
                    {
                        break lab0;
                    }
                    sbp.cursor++;
                    golab4: while(true)
                    {
                        lab5: do {
                            if (!(sbp.in_grouping(g_v, 97, 251)))
                            {
                                break lab5;
                            }
                            break golab4;
                        } while (false);
                        if (sbp.cursor >= sbp.limit)
                        {
                            break lab0;
                        }
                        sbp.cursor++;
                    }
                } while (false);
                I_pV = sbp.cursor;
            } while (false);
            sbp.cursor = v_1;
            v_4 = sbp.cursor;
            lab6: do {
                golab7: while(true)
                {
                    lab8: do {
                        if (!(sbp.in_grouping(g_v, 97, 251)))
                        {
                            break lab8;
                        }
                        break golab7;
                    } while (false);
                    if (sbp.cursor >= sbp.limit)
                    {
                        break lab6;
                    }
                    sbp.cursor++;
                }
                golab9: while(true)
                {
                    lab10: do {
                        if (!(sbp.out_grouping(g_v, 97, 251)))
                        {
                            break lab10;
                        }
                        break golab9;
                    } while (false);
                    if (sbp.cursor >= sbp.limit)
                    {
                        break lab6;
                    }
                    sbp.cursor++;
                }
                I_p1 = sbp.cursor;
                golab11: while(true)
                {
                    lab12: do {
                        if (!(sbp.in_grouping(g_v, 97, 251)))
                        {
                            break lab12;
                        }
                        break golab11;
                    } while (false);
                    if (sbp.cursor >= sbp.limit)
                    {
                        break lab6;
                    }
                    sbp.cursor++;
                }
                golab13: while(true)
                {
                    lab14: do {
                        if (!(sbp.out_grouping(g_v, 97, 251)))
                        {
                            break lab14;
                        }
                        break golab13;
                    } while (false);
                    if (sbp.cursor >= sbp.limit)
                    {
                        break lab6;
                    }
                    sbp.cursor++;
                }
                I_p2 = sbp.cursor;
            } while (false);
            sbp.cursor = v_4;
            return true;
        }

        function r_postlude() {
            var among_var;
            var v_1;
            replab0: while(true)
            {
                v_1 = sbp.cursor;
                lab1: do {
                    sbp.bra = sbp.cursor;
                    among_var = sbp.find_among(a_1, 4);
                    if (among_var == 0)
                    {
                        break lab1;
                    }
                    sbp.ket = sbp.cursor;
                    switch(among_var) {
                        case 0:
                            break lab1;
                        case 1:
                            sbp.slice_from("i");
                            break;
                        case 2:
                            sbp.slice_from("u");
                            break;
                        case 3:
                            sbp.slice_from("y");
                            break;
                        case 4:
                            if (sbp.cursor >= sbp.limit)
                            {
                                break lab1;
                            }
                            sbp.cursor++;
                            break;
                    }
                    continue replab0;
                } while (false);
                sbp.cursor = v_1;
                break replab0;
            }
            return true;
        }

        function r_RV() {
            if (!(I_pV <= sbp.cursor))
            {
                return false;
            }
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

        function r_standard_suffix() {
            var among_var;
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
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_4, 43);
            if (among_var == 0)
            {
                return false;
            }
            sbp.bra = sbp.cursor;
            switch(among_var) {
                case 0:
                    return false;
                case 1:
                    if (!r_R2())
                    {
                        return false;
                    }
                    sbp.slice_del();
                    break;
                case 2:
                    if (!r_R2())
                    {
                        return false;
                    }
                    sbp.slice_del();
                    v_1 = sbp.limit - sbp.cursor;
                    lab0: do {
                        sbp.ket = sbp.cursor;
                        if (!(sbp.eq_s_b(2, "ic")))
                        {
                            sbp.cursor = sbp.limit - v_1;
                            break lab0;
                        }
                        sbp.bra = sbp.cursor;
                        lab1: do {
                            v_2 = sbp.limit - sbp.cursor;
                            lab2: do {
                                if (!r_R2())
                                {
                                    break lab2;
                                }
                                sbp.slice_del();
                                break lab1;
                            } while (false);
                            sbp.cursor = sbp.limit - v_2;
                            sbp.slice_from("iqU");
                        } while (false);
                    } while (false);
                    break;
                case 3:
                    if (!r_R2())
                    {
                        return false;
                    }
                    sbp.slice_from("log");
                    break;
                case 4:
                    if (!r_R2())
                    {
                        return false;
                    }
                    sbp.slice_from("u");
                    break;
                case 5:
                    if (!r_R2())
                    {
                        return false;
                    }
                    sbp.slice_from("ent");
                    break;
                case 6:
                    if (!r_RV())
                    {
                        return false;
                    }
                    sbp.slice_del();
                    v_3 = sbp.limit - sbp.cursor;
                    lab3: do {
                        sbp.ket = sbp.cursor;
                        among_var = sbp.find_among_b(a_2, 6);
                        if (among_var == 0)
                        {
                            sbp.cursor = sbp.limit - v_3;
                            break lab3;
                        }
                        sbp.bra = sbp.cursor;
                        switch(among_var) {
                            case 0:
                                sbp.cursor = sbp.limit - v_3;
                                break lab3;
                            case 1:
                                if (!r_R2())
                                {
                                    sbp.cursor = sbp.limit - v_3;
                                    break lab3;
                                }
                                sbp.slice_del();
                                sbp.ket = sbp.cursor;
                                if (!(sbp.eq_s_b(2, "at")))
                                {
                                    sbp.cursor = sbp.limit - v_3;
                                    break lab3;
                                }
                                sbp.bra = sbp.cursor;
                                if (!r_R2())
                                {
                                    sbp.cursor = sbp.limit - v_3;
                                    break lab3;
                                }
                                sbp.slice_del();
                                break;
                            case 2:
                                lab4: do {
                                    v_4 = sbp.limit - sbp.cursor;
                                    lab5: do {
                                        if (!r_R2())
                                        {
                                            break lab5;
                                        }
                                        sbp.slice_del();
                                        break lab4;
                                    } while (false);
                                    sbp.cursor = sbp.limit - v_4;
                                    if (!r_R1())
                                    {
                                        sbp.cursor = sbp.limit - v_3;
                                        break lab3;
                                    }
                                    sbp.slice_from("eux");
                                } while (false);
                                break;
                            case 3:
                                if (!r_R2())
                                {
                                    sbp.cursor = sbp.limit - v_3;
                                    break lab3;
                                }
                                sbp.slice_del();
                                break;
                            case 4:
                                if (!r_RV())
                                {
                                    sbp.cursor = sbp.limit - v_3;
                                    break lab3;
                                }
                                sbp.slice_from("i");
                                break;
                        }
                    } while (false);
                    break;
                case 7:
                    if (!r_R2())
                    {
                        return false;
                    }
                    sbp.slice_del();
                    v_5 = sbp.limit - sbp.cursor;
                    lab6: do {
                        sbp.ket = sbp.cursor;
                        among_var = sbp.find_among_b(a_3, 3);
                        if (among_var == 0)
                        {
                            sbp.cursor = sbp.limit - v_5;
                            break lab6;
                        }
                        sbp.bra = sbp.cursor;
                        switch(among_var) {
                            case 0:
                                sbp.cursor = sbp.limit - v_5;
                                break lab6;
                            case 1:
                                lab7: do {
                                    v_6 = sbp.limit - sbp.cursor;
                                    lab8: do {
                                        if (!r_R2())
                                        {
                                            break lab8;
                                        }
                                        sbp.slice_del();
                                        break lab7;
                                    } while (false);
                                    sbp.cursor = sbp.limit - v_6;
                                    sbp.slice_from("abl");
                                } while (false);
                                break;
                            case 2:
                                lab9: do {
                                    v_7 = sbp.limit - sbp.cursor;
                                    lab10: do {
                                        if (!r_R2())
                                        {
                                            break lab10;
                                        }
                                        sbp.slice_del();
                                        break lab9;
                                    } while (false);
                                    sbp.cursor = sbp.limit - v_7;
                                    sbp.slice_from("iqU");
                                } while (false);
                                break;
                            case 3:
                                if (!r_R2())
                                {
                                    sbp.cursor = sbp.limit - v_5;
                                    break lab6;
                                }
                                sbp.slice_del();
                                break;
                        }
                    } while (false);
                    break;
                case 8:
                    if (!r_R2())
                    {
                        return false;
                    }
                    sbp.slice_del();
                    v_8 = sbp.limit - sbp.cursor;
                    lab11: do {
                        sbp.ket = sbp.cursor;
                        if (!(sbp.eq_s_b(2, "at")))
                        {
                            sbp.cursor = sbp.limit - v_8;
                            break lab11;
                        }
                        sbp.bra = sbp.cursor;
                        if (!r_R2())
                        {
                            sbp.cursor = sbp.limit - v_8;
                            break lab11;
                        }
                        sbp.slice_del();
                        sbp.ket = sbp.cursor;
                        if (!(sbp.eq_s_b(2, "ic")))
                        {
                            sbp.cursor = sbp.limit - v_8;
                            break lab11;
                        }
                        sbp.bra = sbp.cursor;
                        lab12: do {
                            v_9 = sbp.limit - sbp.cursor;
                            lab13: do {
                                if (!r_R2())
                                {
                                    break lab13;
                                }
                                sbp.slice_del();
                                break lab12;
                            } while (false);
                            sbp.cursor = sbp.limit - v_9;
                            sbp.slice_from("iqU");
                        } while (false);
                    } while (false);
                    break;
                case 9:
                    sbp.slice_from("eau");
                    break;
                case 10:
                    if (!r_R1())
                    {
                        return false;
                    }
                    sbp.slice_from("al");
                    break;
                case 11:
                    lab14: do {
                        v_10 = sbp.limit - sbp.cursor;
                        lab15: do {
                            if (!r_R2())
                            {
                                break lab15;
                            }
                            sbp.slice_del();
                            break lab14;
                        } while (false);
                        sbp.cursor = sbp.limit - v_10;
                        if (!r_R1())
                        {
                            return false;
                        }
                        sbp.slice_from("eux");
                    } while (false);
                    break;
                case 12:
                    if (!r_R1())
                    {
                        return false;
                    }
                    if (!(sbp.out_grouping_b(g_v, 97, 251)))
                    {
                        return false;
                    }
                    sbp.slice_del();
                    break;
                case 13:
                    if (!r_RV())
                    {
                        return false;
                    }
                    sbp.slice_from("ant");
                    return false;
                    break;
                case 14:
                    if (!r_RV())
                    {
                        return false;
                    }
                    sbp.slice_from("ent");
                    return false;
                    break;
                case 15:
                    v_11 = sbp.limit - sbp.cursor;
                    if (!(sbp.in_grouping_b(g_v, 97, 251)))
                    {
                        return false;
                    }
                    if (!r_RV())
                    {
                        return false;
                    }
                    sbp.cursor = sbp.limit - v_11;
                    sbp.slice_del();
                    return false;
                    break;
            }
            return true;
        }

        function r_i_verb_suffix() {
            var among_var;
            var v_1;
            var v_2;
            v_1 = sbp.limit - sbp.cursor;
            if (sbp.cursor < I_pV)
            {
                return false;
            }
            sbp.cursor = I_pV;
            v_2 = sbp.limit_backward;
            sbp.limit_backward = sbp.cursor;
            sbp.cursor = sbp.limit - v_1;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_5, 35);
            if (among_var == 0)
            {
                sbp.limit_backward = v_2;
                return false;
            }
            sbp.bra = sbp.cursor;
            switch(among_var) {
                case 0:
                    sbp.limit_backward = v_2;
                    return false;
                case 1:
                    if (!(sbp.out_grouping_b(g_v, 97, 251)))
                    {
                        sbp.limit_backward = v_2;
                        return false;
                    }
                    sbp.slice_del();
                    break;
            }
            sbp.limit_backward = v_2;
            return true;
        }

        function r_verb_suffix() {
            var among_var;
            var v_1;
            var v_2;
            var v_3;
            v_1 = sbp.limit - sbp.cursor;
            if (sbp.cursor < I_pV)
            {
                return false;
            }
            sbp.cursor = I_pV;
            v_2 = sbp.limit_backward;
            sbp.limit_backward = sbp.cursor;
            sbp.cursor = sbp.limit - v_1;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_6, 38);
            if (among_var == 0)
            {
                sbp.limit_backward = v_2;
                return false;
            }
            sbp.bra = sbp.cursor;
            switch(among_var) {
                case 0:
                    sbp.limit_backward = v_2;
                    return false;
                case 1:
                    if (!r_R2())
                    {
                        sbp.limit_backward = v_2;
                        return false;
                    }
                    sbp.slice_del();
                    break;
                case 2:
                    sbp.slice_del();
                    break;
                case 3:
                    sbp.slice_del();
                    v_3 = sbp.limit - sbp.cursor;
                    lab0: do {
                        sbp.ket = sbp.cursor;
                        if (!(sbp.eq_s_b(1, "e")))
                        {
                            sbp.cursor = sbp.limit - v_3;
                            break lab0;
                        }
                        sbp.bra = sbp.cursor;
                        sbp.slice_del();
                    } while (false);
                    break;
            }
            sbp.limit_backward = v_2;
            return true;
        }

        function r_residual_suffix() {
            var among_var;
            var v_1;
            var v_2;
            var v_3;
            var v_4;
            var v_5;
            v_1 = sbp.limit - sbp.cursor;
            lab0: do {
                sbp.ket = sbp.cursor;
                if (!(sbp.eq_s_b(1, "s")))
                {
                    sbp.cursor = sbp.limit - v_1;
                    break lab0;
                }
                sbp.bra = sbp.cursor;
                v_2 = sbp.limit - sbp.cursor;
                if (!(sbp.out_grouping_b(g_keep_with_s, 97, 232)))
                {
                    sbp.cursor = sbp.limit - v_1;
                    break lab0;
                }
                sbp.cursor = sbp.limit - v_2;
                sbp.slice_del();
            } while (false);
            v_3 = sbp.limit - sbp.cursor;
            if (sbp.cursor < I_pV)
            {
                return false;
            }
            sbp.cursor = I_pV;
            v_4 = sbp.limit_backward;
            sbp.limit_backward = sbp.cursor;
            sbp.cursor = sbp.limit - v_3;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_7, 7);
            if (among_var == 0)
            {
                sbp.limit_backward = v_4;
                return false;
            }
            sbp.bra = sbp.cursor;
            switch(among_var) {
                case 0:
                    sbp.limit_backward = v_4;
                    return false;
                case 1:
                    if (!r_R2())
                    {
                        sbp.limit_backward = v_4;
                        return false;
                    }
                    lab1: do {
                        v_5 = sbp.limit - sbp.cursor;
                        lab2: do {
                            if (!(sbp.eq_s_b(1, "s")))
                            {
                                break lab2;
                            }
                            break lab1;
                        } while (false);
                        sbp.cursor = sbp.limit - v_5;
                        if (!(sbp.eq_s_b(1, "t")))
                        {
                            sbp.limit_backward = v_4;
                            return false;
                        }
                    } while (false);
                    sbp.slice_del();
                    break;
                case 2:
                    sbp.slice_from("i");
                    break;
                case 3:
                    sbp.slice_del();
                    break;
                case 4:
                    if (!(sbp.eq_s_b(2, "gu")))
                    {
                        sbp.limit_backward = v_4;
                        return false;
                    }
                    sbp.slice_del();
                    break;
            }
            sbp.limit_backward = v_4;
            return true;
        }

        function r_un_double() {
            var v_1;
            v_1 = sbp.limit - sbp.cursor;
            if (sbp.find_among_b(a_8, 5) == 0)
            {
                return false;
            }
            sbp.cursor = sbp.limit - v_1;
            sbp.ket = sbp.cursor;
            if (sbp.cursor <= sbp.limit_backward)
            {
                return false;
            }
            sbp.cursor--;
            sbp.bra = sbp.cursor;
            sbp.slice_del();
            return true;
        }

        function r_un_accent() {
            var v_3;
            {
                var v_1 = 1;
                replab0: while(true)
                {
                    lab1: do {
                        if (!(sbp.out_grouping_b(g_v, 97, 251)))
                        {
                            break lab1;
                        }
                        v_1--;
                        continue replab0;
                    } while (false);
                    break replab0;
                }
                if (v_1 > 0)
                {
                    return false;
                }
            }
            sbp.ket = sbp.cursor;
            lab2: do {
                v_3 = sbp.limit - sbp.cursor;
                lab3: do {
                    if (!(sbp.eq_s_b(1, "\u00E9")))
                    {
                        break lab3;
                    }
                    break lab2;
                } while (false);
                sbp.cursor = sbp.limit - v_3;
                if (!(sbp.eq_s_b(1, "\u00E8")))
                {
                    return false;
                }
            } while (false);
            sbp.bra = sbp.cursor;
            sbp.slice_from("e");
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
            v_1 = sbp.cursor;
            lab0: do {
                if (!r_prelude())
                {
                    break lab0;
                }
            } while (false);
            sbp.cursor = v_1;
            v_2 = sbp.cursor;
            lab1: do {
                if (!r_mark_regions())
                {
                    break lab1;
                }
            } while (false);
            sbp.cursor = v_2;
            sbp.limit_backward = sbp.cursor; sbp.cursor = sbp.limit;
            v_3 = sbp.limit - sbp.cursor;
            lab2: do {
                lab3: do {
                    v_4 = sbp.limit - sbp.cursor;
                    lab4: do {
                        v_5 = sbp.limit - sbp.cursor;
                        lab5: do {
                            v_6 = sbp.limit - sbp.cursor;
                            lab6: do {
                                if (!r_standard_suffix())
                                {
                                    break lab6;
                                }
                                break lab5;
                            } while (false);
                            sbp.cursor = sbp.limit - v_6;
                            lab7: do {
                                if (!r_i_verb_suffix())
                                {
                                    break lab7;
                                }
                                break lab5;
                            } while (false);
                            sbp.cursor = sbp.limit - v_6;
                            if (!r_verb_suffix())
                            {
                                break lab4;
                            }
                        } while (false);
                        sbp.cursor = sbp.limit - v_5;
                        v_7 = sbp.limit - sbp.cursor;
                        lab8: do {
                            sbp.ket = sbp.cursor;
                            lab9: do {
                                v_8 = sbp.limit - sbp.cursor;
                                lab10: do {
                                    if (!(sbp.eq_s_b(1, "Y")))
                                    {
                                        break lab10;
                                    }
                                    sbp.bra = sbp.cursor;
                                    sbp.slice_from("i");
                                    break lab9;
                                } while (false);
                                sbp.cursor = sbp.limit - v_8;
                                if (!(sbp.eq_s_b(1, "\u00E7")))
                                {
                                    sbp.cursor = sbp.limit - v_7;
                                    break lab8;
                                }
                                sbp.bra = sbp.cursor;
                                sbp.slice_from("c");
                            } while (false);
                        } while (false);
                        break lab3;
                    } while (false);
                    sbp.cursor = sbp.limit - v_4;
                    if (!r_residual_suffix())
                    {
                        break lab2;
                    }
                } while (false);
            } while (false);
            sbp.cursor = sbp.limit - v_3;
            v_9 = sbp.limit - sbp.cursor;
            lab11: do {
                if (!r_un_double())
                {
                    break lab11;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_9;
            v_10 = sbp.limit - sbp.cursor;
            lab12: do {
                if (!r_un_accent())
                {
                    break lab12;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_10;
            sbp.cursor = sbp.limit_backward;
            v_11 = sbp.cursor;
            lab13: do {
                if (!r_postlude())
                {
                    break lab13;
                }
            } while (false);
            sbp.cursor = v_11;
            return true;
        }

        this.setCurrent = function(word) {
                sbp.setCurrent(word);
        };

        this.getCurrent = function() {
                return sbp.getCurrent();
        };
}

return new frenchStemmer();
}