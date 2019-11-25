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
function germanStemmer() {
        var a_0 = [
            new Among ( "", -1, 6 ),
            new Among ( "U", 0, 2 ),
            new Among ( "Y", 0, 1 ),
            new Among ( "\u00E4", 0, 3 ),
            new Among ( "\u00F6", 0, 4 ),
            new Among ( "\u00FC", 0, 5 )
        ];

        var a_1 = [
            new Among ( "e", -1, 2 ),
            new Among ( "em", -1, 1 ),
            new Among ( "en", -1, 2 ),
            new Among ( "ern", -1, 1 ),
            new Among ( "er", -1, 1 ),
            new Among ( "s", -1, 3 ),
            new Among ( "es", 5, 2 )
        ];

        var a_2 = [
            new Among ( "en", -1, 1 ),
            new Among ( "er", -1, 1 ),
            new Among ( "st", -1, 2 ),
            new Among ( "est", 2, 1 )
        ];

        var a_3 = [
            new Among ( "ig", -1, 1 ),
            new Among ( "lich", -1, 1 )
        ];

        var a_4 = [
            new Among ( "end", -1, 1 ),
            new Among ( "ig", -1, 2 ),
            new Among ( "ung", -1, 1 ),
            new Among ( "lich", -1, 3 ),
            new Among ( "isch", -1, 2 ),
            new Among ( "ik", -1, 2 ),
            new Among ( "heit", -1, 3 ),
            new Among ( "keit", -1, 4 )
        ];

        var g_v = [17, 65, 16, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 32, 8 ];

        var g_s_ending = [117, 30, 5 ];

        var g_st_ending = [117, 30, 4 ];

        var I_x;
        var I_p2;
        var I_p1;

        var sbp = new SnowballProgram();

        function r_prelude() {
            var v_1;
            var v_2;
            var v_3;
            var v_4;
            var v_5;
            var v_6;
            v_1 = sbp.cursor;
            replab0: while(true)
            {
                v_2 = sbp.cursor;
                lab1: do {
                    lab2: do {
                        v_3 = sbp.cursor;
                        lab3: do {
                            sbp.bra = sbp.cursor;
                            if (!(sbp.eq_s(1, "\u00DF")))
                            {
                                break lab3;
                            }
                            sbp.ket = sbp.cursor;
                            sbp.slice_from("ss");
                            break lab2;
                        } while (false);
                        sbp.cursor = v_3;
                        if (sbp.cursor >= sbp.limit)
                        {
                            break lab1;
                        }
                        sbp.cursor++;
                    } while (false);
                    continue replab0;
                } while (false);
                sbp.cursor = v_2;
                break replab0;
            }
            sbp.cursor = v_1;
            replab4: while(true)
            {
                v_4 = sbp.cursor;
                lab5: do {
                    golab6: while(true)
                    {
                        v_5 = sbp.cursor;
                        lab7: do {
                            if (!(sbp.in_grouping(g_v, 97, 252)))
                            {
                                break lab7;
                            }
                            sbp.bra = sbp.cursor;
                            lab8: do {
                                v_6 = sbp.cursor;
                                lab9: do {
                                    if (!(sbp.eq_s(1, "u")))
                                    {
                                        break lab9;
                                    }
                                    sbp.ket = sbp.cursor;
                                    if (!(sbp.in_grouping(g_v, 97, 252)))
                                    {
                                        break lab9;
                                    }
                                    sbp.slice_from("U");
                                    break lab8;
                                } while (false);
                                sbp.cursor = v_6;
                                if (!(sbp.eq_s(1, "y")))
                                {
                                    break lab7;
                                }
                                sbp.ket = sbp.cursor;
                                if (!(sbp.in_grouping(g_v, 97, 252)))
                                {
                                    break lab7;
                                }
                                sbp.slice_from("Y");
                            } while (false);
                            sbp.cursor = v_5;
                            break golab6;
                        } while (false);
                        sbp.cursor = v_5;
                        if (sbp.cursor >= sbp.limit)
                        {
                            break lab5;
                        }
                        sbp.cursor++;
                    }
                    continue replab4;
                } while (false);
                sbp.cursor = v_4;
                break replab4;
            }
            return true;
        }

        function r_mark_regions() {
            var v_1;
            I_p1 = sbp.limit;
            I_p2 = sbp.limit;
            v_1 = sbp.cursor;
            {
                var c = sbp.cursor + 3;
                if (0 > c || c > sbp.limit)
                {
                    return false;
                }
                sbp.cursor = c;
            }
            I_x = sbp.cursor;
            sbp.cursor = v_1;
            golab0: while(true)
            {
                lab1: do {
                    if (!(sbp.in_grouping(g_v, 97, 252)))
                    {
                        break lab1;
                    }
                    break golab0;
                } while (false);
                if (sbp.cursor >= sbp.limit)
                {
                    return false;
                }
                sbp.cursor++;
            }
            golab2: while(true)
            {
                lab3: do {
                    if (!(sbp.out_grouping(g_v, 97, 252)))
                    {
                        break lab3;
                    }
                    break golab2;
                } while (false);
                if (sbp.cursor >= sbp.limit)
                {
                    return false;
                }
                sbp.cursor++;
            }
            I_p1 = sbp.cursor;
            lab4: do {
                if (!(I_p1 < I_x))
                {
                    break lab4;
                }
                I_p1 = I_x;
            } while (false);
            golab5: while(true)
            {
                lab6: do {
                    if (!(sbp.in_grouping(g_v, 97, 252)))
                    {
                        break lab6;
                    }
                    break golab5;
                } while (false);
                if (sbp.cursor >= sbp.limit)
                {
                    return false;
                }
                sbp.cursor++;
            }
            golab7: while(true)
            {
                lab8: do {
                    if (!(sbp.out_grouping(g_v, 97, 252)))
                    {
                        break lab8;
                    }
                    break golab7;
                } while (false);
                if (sbp.cursor >= sbp.limit)
                {
                    return false;
                }
                sbp.cursor++;
            }
            I_p2 = sbp.cursor;
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
                    among_var = sbp.find_among(a_0, 6);
                    if (among_var == 0)
                    {
                        break lab1;
                    }
                    sbp.ket = sbp.cursor;
                    switch(among_var) {
                        case 0:
                            break lab1;
                        case 1:
                            sbp.slice_from("y");
                            break;
                        case 2:
                            sbp.slice_from("u");
                            break;
                        case 3:
                            sbp.slice_from("a");
                            break;
                        case 4:
                            sbp.slice_from("o");
                            break;
                        case 5:
                            sbp.slice_from("u");
                            break;
                        case 6:
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
            v_1 = sbp.limit - sbp.cursor;
            lab0: do {
                sbp.ket = sbp.cursor;
                among_var = sbp.find_among_b(a_1, 7);
                if (among_var == 0)
                {
                    break lab0;
                }
                sbp.bra = sbp.cursor;
                if (!r_R1())
                {
                    break lab0;
                }
                switch(among_var) {
                    case 0:
                        break lab0;
                    case 1:
                        sbp.slice_del();
                        break;
                    case 2:
                        sbp.slice_del();
                        v_2 = sbp.limit - sbp.cursor;
                        lab1: do {
                            sbp.ket = sbp.cursor;
                            if (!(sbp.eq_s_b(1, "s")))
                            {
                                sbp.cursor = sbp.limit - v_2;
                                break lab1;
                            }
                            sbp.bra = sbp.cursor;
                            if (!(sbp.eq_s_b(3, "nis")))
                            {
                                sbp.cursor = sbp.limit - v_2;
                                break lab1;
                            }
                            sbp.slice_del();
                        } while (false);
                        break;
                    case 3:
                        if (!(sbp.in_grouping_b(g_s_ending, 98, 116)))
                        {
                            break lab0;
                        }
                        sbp.slice_del();
                        break;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_1;
            v_3 = sbp.limit - sbp.cursor;
            lab2: do {
                sbp.ket = sbp.cursor;
                among_var = sbp.find_among_b(a_2, 4);
                if (among_var == 0)
                {
                    break lab2;
                }
                sbp.bra = sbp.cursor;
                if (!r_R1())
                {
                    break lab2;
                }
                switch(among_var) {
                    case 0:
                        break lab2;
                    case 1:
                        sbp.slice_del();
                        break;
                    case 2:
                        if (!(sbp.in_grouping_b(g_st_ending, 98, 116)))
                        {
                            break lab2;
                        }
                        {
                            var c = sbp.cursor - 3;
                            if (sbp.limit_backward > c || c > sbp.limit)
                            {
                                break lab2;
                            }
                            sbp.cursor = c;
                        }
                        sbp.slice_del();
                        break;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_3;
            v_4 = sbp.limit - sbp.cursor;
            lab3: do {
                sbp.ket = sbp.cursor;
                among_var = sbp.find_among_b(a_4, 8);
                if (among_var == 0)
                {
                    break lab3;
                }
                sbp.bra = sbp.cursor;
                if (!r_R2())
                {
                    break lab3;
                }
                switch(among_var) {
                    case 0:
                        break lab3;
                    case 1:
                        sbp.slice_del();
                        v_5 = sbp.limit - sbp.cursor;
                        lab4: do {
                            sbp.ket = sbp.cursor;
                            if (!(sbp.eq_s_b(2, "ig")))
                            {
                                sbp.cursor = sbp.limit - v_5;
                                break lab4;
                            }
                            sbp.bra = sbp.cursor;
                            {
                                v_6 = sbp.limit - sbp.cursor;
                                lab5: do {
                                    if (!(sbp.eq_s_b(1, "e")))
                                    {
                                        break lab5;
                                    }
                                    sbp.cursor = sbp.limit - v_5;
                                    break lab4;
                                } while (false);
                                sbp.cursor = sbp.limit - v_6;
                            }
                            if (!r_R2())
                            {
                                sbp.cursor = sbp.limit - v_5;
                                break lab4;
                            }
                            sbp.slice_del();
                        } while (false);
                        break;
                    case 2:
                        {
                            v_7 = sbp.limit - sbp.cursor;
                            lab6: do {
                                if (!(sbp.eq_s_b(1, "e")))
                                {
                                    break lab6;
                                }
                                break lab3;
                            } while (false);
                            sbp.cursor = sbp.limit - v_7;
                        }
                        sbp.slice_del();
                        break;
                    case 3:
                        sbp.slice_del();
                        v_8 = sbp.limit - sbp.cursor;
                        lab7: do {
                            sbp.ket = sbp.cursor;
                            lab8: do {
                                v_9 = sbp.limit - sbp.cursor;
                                lab9: do {
                                    if (!(sbp.eq_s_b(2, "er")))
                                    {
                                        break lab9;
                                    }
                                    break lab8;
                                } while (false);
                                sbp.cursor = sbp.limit - v_9;
                                if (!(sbp.eq_s_b(2, "en")))
                                {
                                    sbp.cursor = sbp.limit - v_8;
                                    break lab7;
                                }
                            } while (false);
                            sbp.bra = sbp.cursor;
                            if (!r_R1())
                            {
                                sbp.cursor = sbp.limit - v_8;
                                break lab7;
                            }
                            sbp.slice_del();
                        } while (false);
                        break;
                    case 4:
                        sbp.slice_del();
                        v_10 = sbp.limit - sbp.cursor;
                        lab10: do {
                            sbp.ket = sbp.cursor;
                            among_var = sbp.find_among_b(a_3, 2);
                            if (among_var == 0)
                            {
                                sbp.cursor = sbp.limit - v_10;
                                break lab10;
                            }
                            sbp.bra = sbp.cursor;
                            if (!r_R2())
                            {
                                sbp.cursor = sbp.limit - v_10;
                                break lab10;
                            }
                            switch(among_var) {
                                case 0:
                                    sbp.cursor = sbp.limit - v_10;
                                    break lab10;
                                case 1:
                                    sbp.slice_del();
                                    break;
                            }
                        } while (false);
                        break;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_4;
            return true;
        }

        this.stem = function() {
            var v_1;
            var v_2;
            var v_3;
            var v_4;
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
                if (!r_standard_suffix())
                {
                    break lab2;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_3;
            sbp.cursor = sbp.limit_backward;
            v_4 = sbp.cursor;
            lab3: do {
                if (!r_postlude())
                {
                    break lab3;
                }
            } while (false);
            sbp.cursor = v_4;
            return true;
        }

        this.setCurrent = function(word) {
                sbp.setCurrent(word);
        };

        this.getCurrent = function() {
                return sbp.getCurrent();
        };
}

return new germanStemmer();
}