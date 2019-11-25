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
function hungarianStemmer() {
        var a_0 = [
            new Among ( "cs", -1, -1 ),
            new Among ( "dzs", -1, -1 ),
            new Among ( "gy", -1, -1 ),
            new Among ( "ly", -1, -1 ),
            new Among ( "ny", -1, -1 ),
            new Among ( "sz", -1, -1 ),
            new Among ( "ty", -1, -1 ),
            new Among ( "zs", -1, -1 )
        ];

        var a_1 = [
            new Among ( "\u00E1", -1, 1 ),
            new Among ( "\u00E9", -1, 2 )
        ];

        var a_2 = [
            new Among ( "bb", -1, -1 ),
            new Among ( "cc", -1, -1 ),
            new Among ( "dd", -1, -1 ),
            new Among ( "ff", -1, -1 ),
            new Among ( "gg", -1, -1 ),
            new Among ( "jj", -1, -1 ),
            new Among ( "kk", -1, -1 ),
            new Among ( "ll", -1, -1 ),
            new Among ( "mm", -1, -1 ),
            new Among ( "nn", -1, -1 ),
            new Among ( "pp", -1, -1 ),
            new Among ( "rr", -1, -1 ),
            new Among ( "ccs", -1, -1 ),
            new Among ( "ss", -1, -1 ),
            new Among ( "zzs", -1, -1 ),
            new Among ( "tt", -1, -1 ),
            new Among ( "vv", -1, -1 ),
            new Among ( "ggy", -1, -1 ),
            new Among ( "lly", -1, -1 ),
            new Among ( "nny", -1, -1 ),
            new Among ( "tty", -1, -1 ),
            new Among ( "ssz", -1, -1 ),
            new Among ( "zz", -1, -1 )
        ];

        var a_3 = [
            new Among ( "al", -1, 1 ),
            new Among ( "el", -1, 2 )
        ];

        var a_4 = [
            new Among ( "ba", -1, -1 ),
            new Among ( "ra", -1, -1 ),
            new Among ( "be", -1, -1 ),
            new Among ( "re", -1, -1 ),
            new Among ( "ig", -1, -1 ),
            new Among ( "nak", -1, -1 ),
            new Among ( "nek", -1, -1 ),
            new Among ( "val", -1, -1 ),
            new Among ( "vel", -1, -1 ),
            new Among ( "ul", -1, -1 ),
            new Among ( "n\u00E1l", -1, -1 ),
            new Among ( "n\u00E9l", -1, -1 ),
            new Among ( "b\u00F3l", -1, -1 ),
            new Among ( "r\u00F3l", -1, -1 ),
            new Among ( "t\u00F3l", -1, -1 ),
            new Among ( "b\u00F5l", -1, -1 ),
            new Among ( "r\u00F5l", -1, -1 ),
            new Among ( "t\u00F5l", -1, -1 ),
            new Among ( "\u00FCl", -1, -1 ),
            new Among ( "n", -1, -1 ),
            new Among ( "an", 19, -1 ),
            new Among ( "ban", 20, -1 ),
            new Among ( "en", 19, -1 ),
            new Among ( "ben", 22, -1 ),
            new Among ( "k\u00E9ppen", 22, -1 ),
            new Among ( "on", 19, -1 ),
            new Among ( "\u00F6n", 19, -1 ),
            new Among ( "k\u00E9pp", -1, -1 ),
            new Among ( "kor", -1, -1 ),
            new Among ( "t", -1, -1 ),
            new Among ( "at", 29, -1 ),
            new Among ( "et", 29, -1 ),
            new Among ( "k\u00E9nt", 29, -1 ),
            new Among ( "ank\u00E9nt", 32, -1 ),
            new Among ( "enk\u00E9nt", 32, -1 ),
            new Among ( "onk\u00E9nt", 32, -1 ),
            new Among ( "ot", 29, -1 ),
            new Among ( "\u00E9rt", 29, -1 ),
            new Among ( "\u00F6t", 29, -1 ),
            new Among ( "hez", -1, -1 ),
            new Among ( "hoz", -1, -1 ),
            new Among ( "h\u00F6z", -1, -1 ),
            new Among ( "v\u00E1", -1, -1 ),
            new Among ( "v\u00E9", -1, -1 )
        ];

        var a_5 = [
            new Among ( "\u00E1n", -1, 2 ),
            new Among ( "\u00E9n", -1, 1 ),
            new Among ( "\u00E1nk\u00E9nt", -1, 3 )
        ];

        var a_6 = [
            new Among ( "stul", -1, 2 ),
            new Among ( "astul", 0, 1 ),
            new Among ( "\u00E1stul", 0, 3 ),
            new Among ( "st\u00FCl", -1, 2 ),
            new Among ( "est\u00FCl", 3, 1 ),
            new Among ( "\u00E9st\u00FCl", 3, 4 )
        ];

        var a_7 = [
            new Among ( "\u00E1", -1, 1 ),
            new Among ( "\u00E9", -1, 2 )
        ];

        var a_8 = [
            new Among ( "k", -1, 7 ),
            new Among ( "ak", 0, 4 ),
            new Among ( "ek", 0, 6 ),
            new Among ( "ok", 0, 5 ),
            new Among ( "\u00E1k", 0, 1 ),
            new Among ( "\u00E9k", 0, 2 ),
            new Among ( "\u00F6k", 0, 3 )
        ];

        var a_9 = [
            new Among ( "\u00E9i", -1, 7 ),
            new Among ( "\u00E1\u00E9i", 0, 6 ),
            new Among ( "\u00E9\u00E9i", 0, 5 ),
            new Among ( "\u00E9", -1, 9 ),
            new Among ( "k\u00E9", 3, 4 ),
            new Among ( "ak\u00E9", 4, 1 ),
            new Among ( "ek\u00E9", 4, 1 ),
            new Among ( "ok\u00E9", 4, 1 ),
            new Among ( "\u00E1k\u00E9", 4, 3 ),
            new Among ( "\u00E9k\u00E9", 4, 2 ),
            new Among ( "\u00F6k\u00E9", 4, 1 ),
            new Among ( "\u00E9\u00E9", 3, 8 )
        ];

        var a_10 = [
            new Among ( "a", -1, 18 ),
            new Among ( "ja", 0, 17 ),
            new Among ( "d", -1, 16 ),
            new Among ( "ad", 2, 13 ),
            new Among ( "ed", 2, 13 ),
            new Among ( "od", 2, 13 ),
            new Among ( "\u00E1d", 2, 14 ),
            new Among ( "\u00E9d", 2, 15 ),
            new Among ( "\u00F6d", 2, 13 ),
            new Among ( "e", -1, 18 ),
            new Among ( "je", 9, 17 ),
            new Among ( "nk", -1, 4 ),
            new Among ( "unk", 11, 1 ),
            new Among ( "\u00E1nk", 11, 2 ),
            new Among ( "\u00E9nk", 11, 3 ),
            new Among ( "\u00FCnk", 11, 1 ),
            new Among ( "uk", -1, 8 ),
            new Among ( "juk", 16, 7 ),
            new Among ( "\u00E1juk", 17, 5 ),
            new Among ( "\u00FCk", -1, 8 ),
            new Among ( "j\u00FCk", 19, 7 ),
            new Among ( "\u00E9j\u00FCk", 20, 6 ),
            new Among ( "m", -1, 12 ),
            new Among ( "am", 22, 9 ),
            new Among ( "em", 22, 9 ),
            new Among ( "om", 22, 9 ),
            new Among ( "\u00E1m", 22, 10 ),
            new Among ( "\u00E9m", 22, 11 ),
            new Among ( "o", -1, 18 ),
            new Among ( "\u00E1", -1, 19 ),
            new Among ( "\u00E9", -1, 20 )
        ];

        var a_11 = [
            new Among ( "id", -1, 10 ),
            new Among ( "aid", 0, 9 ),
            new Among ( "jaid", 1, 6 ),
            new Among ( "eid", 0, 9 ),
            new Among ( "jeid", 3, 6 ),
            new Among ( "\u00E1id", 0, 7 ),
            new Among ( "\u00E9id", 0, 8 ),
            new Among ( "i", -1, 15 ),
            new Among ( "ai", 7, 14 ),
            new Among ( "jai", 8, 11 ),
            new Among ( "ei", 7, 14 ),
            new Among ( "jei", 10, 11 ),
            new Among ( "\u00E1i", 7, 12 ),
            new Among ( "\u00E9i", 7, 13 ),
            new Among ( "itek", -1, 24 ),
            new Among ( "eitek", 14, 21 ),
            new Among ( "jeitek", 15, 20 ),
            new Among ( "\u00E9itek", 14, 23 ),
            new Among ( "ik", -1, 29 ),
            new Among ( "aik", 18, 26 ),
            new Among ( "jaik", 19, 25 ),
            new Among ( "eik", 18, 26 ),
            new Among ( "jeik", 21, 25 ),
            new Among ( "\u00E1ik", 18, 27 ),
            new Among ( "\u00E9ik", 18, 28 ),
            new Among ( "ink", -1, 20 ),
            new Among ( "aink", 25, 17 ),
            new Among ( "jaink", 26, 16 ),
            new Among ( "eink", 25, 17 ),
            new Among ( "jeink", 28, 16 ),
            new Among ( "\u00E1ink", 25, 18 ),
            new Among ( "\u00E9ink", 25, 19 ),
            new Among ( "aitok", -1, 21 ),
            new Among ( "jaitok", 32, 20 ),
            new Among ( "\u00E1itok", -1, 22 ),
            new Among ( "im", -1, 5 ),
            new Among ( "aim", 35, 4 ),
            new Among ( "jaim", 36, 1 ),
            new Among ( "eim", 35, 4 ),
            new Among ( "jeim", 38, 1 ),
            new Among ( "\u00E1im", 35, 2 ),
            new Among ( "\u00E9im", 35, 3 )
        ];

        var g_v = [17, 65, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 17, 52, 14 ];

        var I_p1;

        var sbp = new SnowballProgram();

        function r_mark_regions() {
            var v_1;
            var v_2;
            var v_3;
            I_p1 = sbp.limit;
            lab0: do {
                v_1 = sbp.cursor;
                lab1: do {
                    if (!(sbp.in_grouping(g_v, 97, 252)))
                    {
                        break lab1;
                    }
                    golab2: while(true)
                    {
                        v_2 = sbp.cursor;
                        lab3: do {
                            if (!(sbp.out_grouping(g_v, 97, 252)))
                            {
                                break lab3;
                            }
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
                    lab4: do {
                        v_3 = sbp.cursor;
                        lab5: do {
                            if (sbp.find_among(a_0, 8) == 0)
                            {
                                break lab5;
                            }
                            break lab4;
                        } while (false);
                        sbp.cursor = v_3;
                        if (sbp.cursor >= sbp.limit)
                        {
                            break lab1;
                        }
                        sbp.cursor++;
                    } while (false);
                    I_p1 = sbp.cursor;
                    break lab0;
                } while (false);
                sbp.cursor = v_1;
                if (!(sbp.out_grouping(g_v, 97, 252)))
                {
                    return false;
                }
                golab6: while(true)
                {
                    lab7: do {
                        if (!(sbp.in_grouping(g_v, 97, 252)))
                        {
                            break lab7;
                        }
                        break golab6;
                    } while (false);
                    if (sbp.cursor >= sbp.limit)
                    {
                        return false;
                    }
                    sbp.cursor++;
                }
                I_p1 = sbp.cursor;
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

        function r_v_ending() {
            var among_var;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_1, 2);
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
                    sbp.slice_from("a");
                    break;
                case 2:
                    sbp.slice_from("e");
                    break;
            }
            return true;
        }

        function r_double() {
            var v_1;
            v_1 = sbp.limit - sbp.cursor;
            if (sbp.find_among_b(a_2, 23) == 0)
            {
                return false;
            }
            sbp.cursor = sbp.limit - v_1;
            return true;
        }

        function r_undouble() {
            if (sbp.cursor <= sbp.limit_backward)
            {
                return false;
            }
            sbp.cursor--;
            sbp.ket = sbp.cursor;
            {
                var c = sbp.cursor - 1;
                if (sbp.limit_backward > c || c > sbp.limit)
                {
                    return false;
                }
                sbp.cursor = c;
            }
            sbp.bra = sbp.cursor;
            sbp.slice_del();
            return true;
        }

        function r_instrum() {
            var among_var;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_3, 2);
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
                    if (!r_double())
                    {
                        return false;
                    }
                    break;
                case 2:
                    if (!r_double())
                    {
                        return false;
                    }
                    break;
            }
            sbp.slice_del();
            if (!r_undouble())
            {
                return false;
            }
            return true;
        }

        function r_case() {
            sbp.ket = sbp.cursor;
            if (sbp.find_among_b(a_4, 44) == 0)
            {
                return false;
            }
            sbp.bra = sbp.cursor;
            if (!r_R1())
            {
                return false;
            }
            sbp.slice_del();
            if (!r_v_ending())
            {
                return false;
            }
            return true;
        }

        function r_case_special() {
            var among_var;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_5, 3);
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
                    sbp.slice_from("e");
                    break;
                case 2:
                    sbp.slice_from("a");
                    break;
                case 3:
                    sbp.slice_from("a");
                    break;
            }
            return true;
        }

        function r_case_other() {
            var among_var;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_6, 6);
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
                    sbp.slice_del();
                    break;
                case 2:
                    sbp.slice_del();
                    break;
                case 3:
                    sbp.slice_from("a");
                    break;
                case 4:
                    sbp.slice_from("e");
                    break;
            }
            return true;
        }

        function r_factive() {
            var among_var;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_7, 2);
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
                    if (!r_double())
                    {
                        return false;
                    }
                    break;
                case 2:
                    if (!r_double())
                    {
                        return false;
                    }
                    break;
            }
            sbp.slice_del();
            if (!r_undouble())
            {
                return false;
            }
            return true;
        }

        function r_plural() {
            var among_var;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_8, 7);
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
                    sbp.slice_from("a");
                    break;
                case 2:
                    sbp.slice_from("e");
                    break;
                case 3:
                    sbp.slice_del();
                    break;
                case 4:
                    sbp.slice_del();
                    break;
                case 5:
                    sbp.slice_del();
                    break;
                case 6:
                    sbp.slice_del();
                    break;
                case 7:
                    sbp.slice_del();
                    break;
            }
            return true;
        }

        function r_owned() {
            var among_var;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_9, 12);
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
                    sbp.slice_del();
                    break;
                case 2:
                    sbp.slice_from("e");
                    break;
                case 3:
                    sbp.slice_from("a");
                    break;
                case 4:
                    sbp.slice_del();
                    break;
                case 5:
                    sbp.slice_from("e");
                    break;
                case 6:
                    sbp.slice_from("a");
                    break;
                case 7:
                    sbp.slice_del();
                    break;
                case 8:
                    sbp.slice_from("e");
                    break;
                case 9:
                    sbp.slice_del();
                    break;
            }
            return true;
        }

        function r_sing_owner() {
            var among_var;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_10, 31);
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
                    sbp.slice_del();
                    break;
                case 2:
                    sbp.slice_from("a");
                    break;
                case 3:
                    sbp.slice_from("e");
                    break;
                case 4:
                    sbp.slice_del();
                    break;
                case 5:
                    sbp.slice_from("a");
                    break;
                case 6:
                    sbp.slice_from("e");
                    break;
                case 7:
                    sbp.slice_del();
                    break;
                case 8:
                    sbp.slice_del();
                    break;
                case 9:
                    sbp.slice_del();
                    break;
                case 10:
                    sbp.slice_from("a");
                    break;
                case 11:
                    sbp.slice_from("e");
                    break;
                case 12:
                    sbp.slice_del();
                    break;
                case 13:
                    sbp.slice_del();
                    break;
                case 14:
                    sbp.slice_from("a");
                    break;
                case 15:
                    sbp.slice_from("e");
                    break;
                case 16:
                    sbp.slice_del();
                    break;
                case 17:
                    sbp.slice_del();
                    break;
                case 18:
                    sbp.slice_del();
                    break;
                case 19:
                    sbp.slice_from("a");
                    break;
                case 20:
                    sbp.slice_from("e");
                    break;
            }
            return true;
        }

        function r_plur_owner() {
            var among_var;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_11, 42);
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
                    sbp.slice_del();
                    break;
                case 2:
                    sbp.slice_from("a");
                    break;
                case 3:
                    sbp.slice_from("e");
                    break;
                case 4:
                    sbp.slice_del();
                    break;
                case 5:
                    sbp.slice_del();
                    break;
                case 6:
                    sbp.slice_del();
                    break;
                case 7:
                    sbp.slice_from("a");
                    break;
                case 8:
                    sbp.slice_from("e");
                    break;
                case 9:
                    sbp.slice_del();
                    break;
                case 10:
                    sbp.slice_del();
                    break;
                case 11:
                    sbp.slice_del();
                    break;
                case 12:
                    sbp.slice_from("a");
                    break;
                case 13:
                    sbp.slice_from("e");
                    break;
                case 14:
                    sbp.slice_del();
                    break;
                case 15:
                    sbp.slice_del();
                    break;
                case 16:
                    sbp.slice_del();
                    break;
                case 17:
                    sbp.slice_del();
                    break;
                case 18:
                    sbp.slice_from("a");
                    break;
                case 19:
                    sbp.slice_from("e");
                    break;
                case 20:
                    sbp.slice_del();
                    break;
                case 21:
                    sbp.slice_del();
                    break;
                case 22:
                    sbp.slice_from("a");
                    break;
                case 23:
                    sbp.slice_from("e");
                    break;
                case 24:
                    sbp.slice_del();
                    break;
                case 25:
                    sbp.slice_del();
                    break;
                case 26:
                    sbp.slice_del();
                    break;
                case 27:
                    sbp.slice_from("a");
                    break;
                case 28:
                    sbp.slice_from("e");
                    break;
                case 29:
                    sbp.slice_del();
                    break;
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
            v_1 = sbp.cursor;
            lab0: do {
                if (!r_mark_regions())
                {
                    break lab0;
                }
            } while (false);
            sbp.cursor = v_1;
            sbp.limit_backward = sbp.cursor; sbp.cursor = sbp.limit;
            v_2 = sbp.limit - sbp.cursor;
            lab1: do {
                if (!r_instrum())
                {
                    break lab1;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_2;
            v_3 = sbp.limit - sbp.cursor;
            lab2: do {
                if (!r_case())
                {
                    break lab2;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_3;
            v_4 = sbp.limit - sbp.cursor;
            lab3: do {
                if (!r_case_special())
                {
                    break lab3;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_4;
            v_5 = sbp.limit - sbp.cursor;
            lab4: do {
                if (!r_case_other())
                {
                    break lab4;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_5;
            v_6 = sbp.limit - sbp.cursor;
            lab5: do {
                if (!r_factive())
                {
                    break lab5;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_6;
            v_7 = sbp.limit - sbp.cursor;
            lab6: do {
                if (!r_owned())
                {
                    break lab6;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_7;
            v_8 = sbp.limit - sbp.cursor;
            lab7: do {
                if (!r_sing_owner())
                {
                    break lab7;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_8;
            v_9 = sbp.limit - sbp.cursor;
            lab8: do {
                if (!r_plur_owner())
                {
                    break lab8;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_9;
            v_10 = sbp.limit - sbp.cursor;
            lab9: do {
                if (!r_plural())
                {
                    break lab9;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_10;
            sbp.cursor = sbp.limit_backward;
            return true;
        }

        this.setCurrent = function(word) {
                sbp.setCurrent(word);
        };

        this.getCurrent = function() {
                return sbp.getCurrent();
        };
}

return new hungarianStemmer();
}