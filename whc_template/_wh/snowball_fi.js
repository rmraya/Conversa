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
function finnishStemmer() {
        var a_0 = [
            new Among ( "pa", -1, 1 ),
            new Among ( "sti", -1, 2 ),
            new Among ( "kaan", -1, 1 ),
            new Among ( "han", -1, 1 ),
            new Among ( "kin", -1, 1 ),
            new Among ( "h\u00E4n", -1, 1 ),
            new Among ( "k\u00E4\u00E4n", -1, 1 ),
            new Among ( "ko", -1, 1 ),
            new Among ( "p\u00E4", -1, 1 ),
            new Among ( "k\u00F6", -1, 1 )
        ];

        var a_1 = [
            new Among ( "lla", -1, -1 ),
            new Among ( "na", -1, -1 ),
            new Among ( "ssa", -1, -1 ),
            new Among ( "ta", -1, -1 ),
            new Among ( "lta", 3, -1 ),
            new Among ( "sta", 3, -1 )
        ];

        var a_2 = [
            new Among ( "ll\u00E4", -1, -1 ),
            new Among ( "n\u00E4", -1, -1 ),
            new Among ( "ss\u00E4", -1, -1 ),
            new Among ( "t\u00E4", -1, -1 ),
            new Among ( "lt\u00E4", 3, -1 ),
            new Among ( "st\u00E4", 3, -1 )
        ];

        var a_3 = [
            new Among ( "lle", -1, -1 ),
            new Among ( "ine", -1, -1 )
        ];

        var a_4 = [
            new Among ( "nsa", -1, 3 ),
            new Among ( "mme", -1, 3 ),
            new Among ( "nne", -1, 3 ),
            new Among ( "ni", -1, 2 ),
            new Among ( "si", -1, 1 ),
            new Among ( "an", -1, 4 ),
            new Among ( "en", -1, 6 ),
            new Among ( "\u00E4n", -1, 5 ),
            new Among ( "ns\u00E4", -1, 3 )
        ];

        var a_5 = [
            new Among ( "aa", -1, -1 ),
            new Among ( "ee", -1, -1 ),
            new Among ( "ii", -1, -1 ),
            new Among ( "oo", -1, -1 ),
            new Among ( "uu", -1, -1 ),
            new Among ( "\u00E4\u00E4", -1, -1 ),
            new Among ( "\u00F6\u00F6", -1, -1 )
        ];

        var a_6 = [
            new Among ( "a", -1, 8 ),
            new Among ( "lla", 0, -1 ),
            new Among ( "na", 0, -1 ),
            new Among ( "ssa", 0, -1 ),
            new Among ( "ta", 0, -1 ),
            new Among ( "lta", 4, -1 ),
            new Among ( "sta", 4, -1 ),
            new Among ( "tta", 4, 9 ),
            new Among ( "lle", -1, -1 ),
            new Among ( "ine", -1, -1 ),
            new Among ( "ksi", -1, -1 ),
            new Among ( "n", -1, 7 ),
            new Among ( "han", 11, 1 ),
            new Among ( "den", 11, -1, r_VI ),
            new Among ( "seen", 11, -1, r_LONG ),
            new Among ( "hen", 11, 2 ),
            new Among ( "tten", 11, -1, r_VI ),
            new Among ( "hin", 11, 3 ),
            new Among ( "siin", 11, -1, r_VI ),
            new Among ( "hon", 11, 4 ),
            new Among ( "h\u00E4n", 11, 5 ),
            new Among ( "h\u00F6n", 11, 6 ),
            new Among ( "\u00E4", -1, 8 ),
            new Among ( "ll\u00E4", 22, -1 ),
            new Among ( "n\u00E4", 22, -1 ),
            new Among ( "ss\u00E4", 22, -1 ),
            new Among ( "t\u00E4", 22, -1 ),
            new Among ( "lt\u00E4", 26, -1 ),
            new Among ( "st\u00E4", 26, -1 ),
            new Among ( "tt\u00E4", 26, 9 )
        ];

        var a_7 = [
            new Among ( "eja", -1, -1 ),
            new Among ( "mma", -1, 1 ),
            new Among ( "imma", 1, -1 ),
            new Among ( "mpa", -1, 1 ),
            new Among ( "impa", 3, -1 ),
            new Among ( "mmi", -1, 1 ),
            new Among ( "immi", 5, -1 ),
            new Among ( "mpi", -1, 1 ),
            new Among ( "impi", 7, -1 ),
            new Among ( "ej\u00E4", -1, -1 ),
            new Among ( "mm\u00E4", -1, 1 ),
            new Among ( "imm\u00E4", 10, -1 ),
            new Among ( "mp\u00E4", -1, 1 ),
            new Among ( "imp\u00E4", 12, -1 )
        ];

        var a_8 = [
            new Among ( "i", -1, -1 ),
            new Among ( "j", -1, -1 )
        ];

        var a_9 = [
            new Among ( "mma", -1, 1 ),
            new Among ( "imma", 0, -1 )
        ];

        var g_AEI = [17, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8 ];

        var g_V1 = [17, 65, 16, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 32 ];

        var g_V2 = [17, 65, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 32 ];

        var g_particle_end = [17, 97, 24, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 32 ];

        var B_ending_removed;
        var S_x = "";
        var I_p2;
        var I_p1;

        var sbp = new SnowballProgram();

        function r_mark_regions() {
            var v_1;
            var v_3;
            I_p1 = sbp.limit;
            I_p2 = sbp.limit;
            golab0: while(true)
            {
                v_1 = sbp.cursor;
                lab1: do {
                    if (!(sbp.in_grouping(g_V1, 97, 246)))
                    {
                        break lab1;
                    }
                    sbp.cursor = v_1;
                    break golab0;
                } while (false);
                sbp.cursor = v_1;
                if (sbp.cursor >= sbp.limit)
                {
                    return false;
                }
                sbp.cursor++;
            }
            golab2: while(true)
            {
                lab3: do {
                    if (!(sbp.out_grouping(g_V1, 97, 246)))
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
            golab4: while(true)
            {
                v_3 = sbp.cursor;
                lab5: do {
                    if (!(sbp.in_grouping(g_V1, 97, 246)))
                    {
                        break lab5;
                    }
                    sbp.cursor = v_3;
                    break golab4;
                } while (false);
                sbp.cursor = v_3;
                if (sbp.cursor >= sbp.limit)
                {
                    return false;
                }
                sbp.cursor++;
            }
            golab6: while(true)
            {
                lab7: do {
                    if (!(sbp.out_grouping(g_V1, 97, 246)))
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
            I_p2 = sbp.cursor;
            return true;
        }

        function r_R2() {
            if (!(I_p2 <= sbp.cursor))
            {
                return false;
            }
            return true;
        }

        function r_particle_etc() {
            var among_var;
            var v_1;
            var v_2;
            v_1 = sbp.limit - sbp.cursor;
            if (sbp.cursor < I_p1)
            {
                return false;
            }
            sbp.cursor = I_p1;
            v_2 = sbp.limit_backward;
            sbp.limit_backward = sbp.cursor;
            sbp.cursor = sbp.limit - v_1;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_0, 10);
            if (among_var == 0)
            {
                sbp.limit_backward = v_2;
                return false;
            }
            sbp.bra = sbp.cursor;
            sbp.limit_backward = v_2;
            switch(among_var) {
                case 0:
                    return false;
                case 1:
                    if (!(sbp.in_grouping_b(g_particle_end, 97, 246)))
                    {
                        return false;
                    }
                    break;
                case 2:
                    if (!r_R2())
                    {
                        return false;
                    }
                    break;
            }
            sbp.slice_del();
            return true;
        }

        function r_possessive() {
            var among_var;
            var v_1;
            var v_2;
            var v_3;
            v_1 = sbp.limit - sbp.cursor;
            if (sbp.cursor < I_p1)
            {
                return false;
            }
            sbp.cursor = I_p1;
            v_2 = sbp.limit_backward;
            sbp.limit_backward = sbp.cursor;
            sbp.cursor = sbp.limit - v_1;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_4, 9);
            if (among_var == 0)
            {
                sbp.limit_backward = v_2;
                return false;
            }
            sbp.bra = sbp.cursor;
            sbp.limit_backward = v_2;
            switch(among_var) {
                case 0:
                    return false;
                case 1:
                    {
                        v_3 = sbp.limit - sbp.cursor;
                        lab0: do {
                            if (!(sbp.eq_s_b(1, "k")))
                            {
                                break lab0;
                            }
                            return false;
                        } while (false);
                        sbp.cursor = sbp.limit - v_3;
                    }
                    sbp.slice_del();
                    break;
                case 2:
                    sbp.slice_del();
                    sbp.ket = sbp.cursor;
                    if (!(sbp.eq_s_b(3, "kse")))
                    {
                        return false;
                    }
                    sbp.bra = sbp.cursor;
                    sbp.slice_from("ksi");
                    break;
                case 3:
                    sbp.slice_del();
                    break;
                case 4:
                    if (sbp.find_among_b(a_1, 6) == 0)
                    {
                        return false;
                    }
                    sbp.slice_del();
                    break;
                case 5:
                    if (sbp.find_among_b(a_2, 6) == 0)
                    {
                        return false;
                    }
                    sbp.slice_del();
                    break;
                case 6:
                    if (sbp.find_among_b(a_3, 2) == 0)
                    {
                        return false;
                    }
                    sbp.slice_del();
                    break;
            }
            return true;
        }

        function r_LONG() {
            if (sbp.find_among_b(a_5, 7) == 0)
            {
                return false;
            }
            return true;
        }

        function r_VI() {
            if (!(sbp.eq_s_b(1, "i")))
            {
                return false;
            }
            if (!(sbp.in_grouping_b(g_V2, 97, 246)))
            {
                return false;
            }
            return true;
        }

        function r_case_ending() {
            var among_var;
            var v_1;
            var v_2;
            var v_3;
            var v_4;
            var v_5;
            v_1 = sbp.limit - sbp.cursor;
            if (sbp.cursor < I_p1)
            {
                return false;
            }
            sbp.cursor = I_p1;
            v_2 = sbp.limit_backward;
            sbp.limit_backward = sbp.cursor;
            sbp.cursor = sbp.limit - v_1;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_6, 30);
            if (among_var == 0)
            {
                sbp.limit_backward = v_2;
                return false;
            }
            sbp.bra = sbp.cursor;
            sbp.limit_backward = v_2;
            switch(among_var) {
                case 0:
                    return false;
                case 1:
                    if (!(sbp.eq_s_b(1, "a")))
                    {
                        return false;
                    }
                    break;
                case 2:
                    if (!(sbp.eq_s_b(1, "e")))
                    {
                        return false;
                    }
                    break;
                case 3:
                    if (!(sbp.eq_s_b(1, "i")))
                    {
                        return false;
                    }
                    break;
                case 4:
                    if (!(sbp.eq_s_b(1, "o")))
                    {
                        return false;
                    }
                    break;
                case 5:
                    if (!(sbp.eq_s_b(1, "\u00E4")))
                    {
                        return false;
                    }
                    break;
                case 6:
                    if (!(sbp.eq_s_b(1, "\u00F6")))
                    {
                        return false;
                    }
                    break;
                case 7:
                    v_3 = sbp.limit - sbp.cursor;
                    lab0: do {
                        v_4 = sbp.limit - sbp.cursor;
                        lab1: do {
                            v_5 = sbp.limit - sbp.cursor;
                            lab2: do {
                                if (!r_LONG())
                                {
                                    break lab2;
                                }
                                break lab1;
                            } while (false);
                            sbp.cursor = sbp.limit - v_5;
                            if (!(sbp.eq_s_b(2, "ie")))
                            {
                                sbp.cursor = sbp.limit - v_3;
                                break lab0;
                            }
                        } while (false);
                        sbp.cursor = sbp.limit - v_4;
                        if (sbp.cursor <= sbp.limit_backward)
                        {
                            sbp.cursor = sbp.limit - v_3;
                            break lab0;
                        }
                        sbp.cursor--;
                        sbp.bra = sbp.cursor;
                    } while (false);
                    break;
                case 8:
                    if (!(sbp.in_grouping_b(g_V1, 97, 246)))
                    {
                        return false;
                    }
                    if (!(sbp.out_grouping_b(g_V1, 97, 246)))
                    {
                        return false;
                    }
                    break;
                case 9:
                    if (!(sbp.eq_s_b(1, "e")))
                    {
                        return false;
                    }
                    break;
            }
            sbp.slice_del();
            B_ending_removed = true;
            return true;
        }

        function r_other_endings() {
            var among_var;
            var v_1;
            var v_2;
            var v_3;
            v_1 = sbp.limit - sbp.cursor;
            if (sbp.cursor < I_p2)
            {
                return false;
            }
            sbp.cursor = I_p2;
            v_2 = sbp.limit_backward;
            sbp.limit_backward = sbp.cursor;
            sbp.cursor = sbp.limit - v_1;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_7, 14);
            if (among_var == 0)
            {
                sbp.limit_backward = v_2;
                return false;
            }
            sbp.bra = sbp.cursor;
            sbp.limit_backward = v_2;
            switch(among_var) {
                case 0:
                    return false;
                case 1:
                    {
                        v_3 = sbp.limit - sbp.cursor;
                        lab0: do {
                            if (!(sbp.eq_s_b(2, "po")))
                            {
                                break lab0;
                            }
                            return false;
                        } while (false);
                        sbp.cursor = sbp.limit - v_3;
                    }
                    break;
            }
            sbp.slice_del();
            return true;
        }

        function r_i_plural() {
            var v_1;
            var v_2;
            v_1 = sbp.limit - sbp.cursor;
            if (sbp.cursor < I_p1)
            {
                return false;
            }
            sbp.cursor = I_p1;
            v_2 = sbp.limit_backward;
            sbp.limit_backward = sbp.cursor;
            sbp.cursor = sbp.limit - v_1;
            sbp.ket = sbp.cursor;
            if (sbp.find_among_b(a_8, 2) == 0)
            {
                sbp.limit_backward = v_2;
                return false;
            }
            sbp.bra = sbp.cursor;
            sbp.limit_backward = v_2;
            sbp.slice_del();
            return true;
        }

        function r_t_plural() {
            var among_var;
            var v_1;
            var v_2;
            var v_3;
            var v_4;
            var v_5;
            var v_6;
            v_1 = sbp.limit - sbp.cursor;
            if (sbp.cursor < I_p1)
            {
                return false;
            }
            sbp.cursor = I_p1;
            v_2 = sbp.limit_backward;
            sbp.limit_backward = sbp.cursor;
            sbp.cursor = sbp.limit - v_1;
            sbp.ket = sbp.cursor;
            if (!(sbp.eq_s_b(1, "t")))
            {
                sbp.limit_backward = v_2;
                return false;
            }
            sbp.bra = sbp.cursor;
            v_3 = sbp.limit - sbp.cursor;
            if (!(sbp.in_grouping_b(g_V1, 97, 246)))
            {
                sbp.limit_backward = v_2;
                return false;
            }
            sbp.cursor = sbp.limit - v_3;
            sbp.slice_del();
            sbp.limit_backward = v_2;
            v_4 = sbp.limit - sbp.cursor;
            if (sbp.cursor < I_p2)
            {
                return false;
            }
            sbp.cursor = I_p2;
            v_5 = sbp.limit_backward;
            sbp.limit_backward = sbp.cursor;
            sbp.cursor = sbp.limit - v_4;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_9, 2);
            if (among_var == 0)
            {
                sbp.limit_backward = v_5;
                return false;
            }
            sbp.bra = sbp.cursor;
            sbp.limit_backward = v_5;
            switch(among_var) {
                case 0:
                    return false;
                case 1:
                    {
                        v_6 = sbp.limit - sbp.cursor;
                        lab0: do {
                            if (!(sbp.eq_s_b(2, "po")))
                            {
                                break lab0;
                            }
                            return false;
                        } while (false);
                        sbp.cursor = sbp.limit - v_6;
                    }
                    break;
            }
            sbp.slice_del();
            return true;
        }

        function r_tidy() {
            var v_1;
            var v_2;
            var v_3;
            var v_4;
            var v_5;
            var v_6;
            var v_7;
            var v_8;
            var v_9;
            v_1 = sbp.limit - sbp.cursor;
            if (sbp.cursor < I_p1)
            {
                return false;
            }
            sbp.cursor = I_p1;
            v_2 = sbp.limit_backward;
            sbp.limit_backward = sbp.cursor;
            sbp.cursor = sbp.limit - v_1;
            v_3 = sbp.limit - sbp.cursor;
            lab0: do {
                v_4 = sbp.limit - sbp.cursor;
                if (!r_LONG())
                {
                    break lab0;
                }
                sbp.cursor = sbp.limit - v_4;
                sbp.ket = sbp.cursor;
                if (sbp.cursor <= sbp.limit_backward)
                {
                    break lab0;
                }
                sbp.cursor--;
                sbp.bra = sbp.cursor;
                sbp.slice_del();
            } while (false);
            sbp.cursor = sbp.limit - v_3;
            v_5 = sbp.limit - sbp.cursor;
            lab1: do {
                sbp.ket = sbp.cursor;
                if (!(sbp.in_grouping_b(g_AEI, 97, 228)))
                {
                    break lab1;
                }
                sbp.bra = sbp.cursor;
                if (!(sbp.out_grouping_b(g_V1, 97, 246)))
                {
                    break lab1;
                }
                sbp.slice_del();
            } while (false);
            sbp.cursor = sbp.limit - v_5;
            v_6 = sbp.limit - sbp.cursor;
            lab2: do {
                sbp.ket = sbp.cursor;
                if (!(sbp.eq_s_b(1, "j")))
                {
                    break lab2;
                }
                sbp.bra = sbp.cursor;
                lab3: do {
                    v_7 = sbp.limit - sbp.cursor;
                    lab4: do {
                        if (!(sbp.eq_s_b(1, "o")))
                        {
                            break lab4;
                        }
                        break lab3;
                    } while (false);
                    sbp.cursor = sbp.limit - v_7;
                    if (!(sbp.eq_s_b(1, "u")))
                    {
                        break lab2;
                    }
                } while (false);
                sbp.slice_del();
            } while (false);
            sbp.cursor = sbp.limit - v_6;
            v_8 = sbp.limit - sbp.cursor;
            lab5: do {
                sbp.ket = sbp.cursor;
                if (!(sbp.eq_s_b(1, "o")))
                {
                    break lab5;
                }
                sbp.bra = sbp.cursor;
                if (!(sbp.eq_s_b(1, "j")))
                {
                    break lab5;
                }
                sbp.slice_del();
            } while (false);
            sbp.cursor = sbp.limit - v_8;
            sbp.limit_backward = v_2;
            golab6: while(true)
            {
                v_9 = sbp.limit - sbp.cursor;
                lab7: do {
                    if (!(sbp.out_grouping_b(g_V1, 97, 246)))
                    {
                        break lab7;
                    }
                    sbp.cursor = sbp.limit - v_9;
                    break golab6;
                } while (false);
                sbp.cursor = sbp.limit - v_9;
                if (sbp.cursor <= sbp.limit_backward)
                {
                    return false;
                }
                sbp.cursor--;
            }
            sbp.ket = sbp.cursor;
            if (sbp.cursor <= sbp.limit_backward)
            {
                return false;
            }
            sbp.cursor--;
            sbp.bra = sbp.cursor;
            S_x = sbp.slice_to(S_x);
            if (!(sbp.eq_v_b(S_x)))
            {
                return false;
            }
            sbp.slice_del();
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
            v_1 = sbp.cursor;
            lab0: do {
                if (!r_mark_regions())
                {
                    break lab0;
                }
            } while (false);
            sbp.cursor = v_1;
            B_ending_removed = false;
            sbp.limit_backward = sbp.cursor; sbp.cursor = sbp.limit;
            v_2 = sbp.limit - sbp.cursor;
            lab1: do {
                if (!r_particle_etc())
                {
                    break lab1;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_2;
            v_3 = sbp.limit - sbp.cursor;
            lab2: do {
                if (!r_possessive())
                {
                    break lab2;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_3;
            v_4 = sbp.limit - sbp.cursor;
            lab3: do {
                if (!r_case_ending())
                {
                    break lab3;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_4;
            v_5 = sbp.limit - sbp.cursor;
            lab4: do {
                if (!r_other_endings())
                {
                    break lab4;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_5;
            lab5: do {
                v_6 = sbp.limit - sbp.cursor;
                lab6: do {
                    if (!(B_ending_removed))
                    {
                        break lab6;
                    }
                    v_7 = sbp.limit - sbp.cursor;
                    lab7: do {
                        if (!r_i_plural())
                        {
                            break lab7;
                        }
                    } while (false);
                    sbp.cursor = sbp.limit - v_7;
                    break lab5;
                } while (false);
                sbp.cursor = sbp.limit - v_6;
                v_8 = sbp.limit - sbp.cursor;
                lab8: do {
                    if (!r_t_plural())
                    {
                        break lab8;
                    }
                } while (false);
                sbp.cursor = sbp.limit - v_8;
            } while (false);
            v_9 = sbp.limit - sbp.cursor;
            lab9: do {
                if (!r_tidy())
                {
                    break lab9;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_9;
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

return new finnishStemmer();
}