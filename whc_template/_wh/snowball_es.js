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
function spanishStemmer() {
        var a_0 = [
            new Among ( "", -1, 6 ),
            new Among ( "\u00E1", 0, 1 ),
            new Among ( "\u00E9", 0, 2 ),
            new Among ( "\u00ED", 0, 3 ),
            new Among ( "\u00F3", 0, 4 ),
            new Among ( "\u00FA", 0, 5 )
        ];

        var a_1 = [
            new Among ( "la", -1, -1 ),
            new Among ( "sela", 0, -1 ),
            new Among ( "le", -1, -1 ),
            new Among ( "me", -1, -1 ),
            new Among ( "se", -1, -1 ),
            new Among ( "lo", -1, -1 ),
            new Among ( "selo", 5, -1 ),
            new Among ( "las", -1, -1 ),
            new Among ( "selas", 7, -1 ),
            new Among ( "les", -1, -1 ),
            new Among ( "los", -1, -1 ),
            new Among ( "selos", 10, -1 ),
            new Among ( "nos", -1, -1 )
        ];

        var a_2 = [
            new Among ( "ando", -1, 6 ),
            new Among ( "iendo", -1, 6 ),
            new Among ( "yendo", -1, 7 ),
            new Among ( "\u00E1ndo", -1, 2 ),
            new Among ( "i\u00E9ndo", -1, 1 ),
            new Among ( "ar", -1, 6 ),
            new Among ( "er", -1, 6 ),
            new Among ( "ir", -1, 6 ),
            new Among ( "\u00E1r", -1, 3 ),
            new Among ( "\u00E9r", -1, 4 ),
            new Among ( "\u00EDr", -1, 5 )
        ];

        var a_3 = [
            new Among ( "ic", -1, -1 ),
            new Among ( "ad", -1, -1 ),
            new Among ( "os", -1, -1 ),
            new Among ( "iv", -1, 1 )
        ];

        var a_4 = [
            new Among ( "able", -1, 1 ),
            new Among ( "ible", -1, 1 ),
            new Among ( "ante", -1, 1 )
        ];

        var a_5 = [
            new Among ( "ic", -1, 1 ),
            new Among ( "abil", -1, 1 ),
            new Among ( "iv", -1, 1 )
        ];

        var a_6 = [
            new Among ( "ica", -1, 1 ),
            new Among ( "ancia", -1, 2 ),
            new Among ( "encia", -1, 5 ),
            new Among ( "adora", -1, 2 ),
            new Among ( "osa", -1, 1 ),
            new Among ( "ista", -1, 1 ),
            new Among ( "iva", -1, 9 ),
            new Among ( "anza", -1, 1 ),
            new Among ( "log\u00EDa", -1, 3 ),
            new Among ( "idad", -1, 8 ),
            new Among ( "able", -1, 1 ),
            new Among ( "ible", -1, 1 ),
            new Among ( "ante", -1, 2 ),
            new Among ( "mente", -1, 7 ),
            new Among ( "amente", 13, 6 ),
            new Among ( "aci\u00F3n", -1, 2 ),
            new Among ( "uci\u00F3n", -1, 4 ),
            new Among ( "ico", -1, 1 ),
            new Among ( "ismo", -1, 1 ),
            new Among ( "oso", -1, 1 ),
            new Among ( "amiento", -1, 1 ),
            new Among ( "imiento", -1, 1 ),
            new Among ( "ivo", -1, 9 ),
            new Among ( "ador", -1, 2 ),
            new Among ( "icas", -1, 1 ),
            new Among ( "ancias", -1, 2 ),
            new Among ( "encias", -1, 5 ),
            new Among ( "adoras", -1, 2 ),
            new Among ( "osas", -1, 1 ),
            new Among ( "istas", -1, 1 ),
            new Among ( "ivas", -1, 9 ),
            new Among ( "anzas", -1, 1 ),
            new Among ( "log\u00EDas", -1, 3 ),
            new Among ( "idades", -1, 8 ),
            new Among ( "ables", -1, 1 ),
            new Among ( "ibles", -1, 1 ),
            new Among ( "aciones", -1, 2 ),
            new Among ( "uciones", -1, 4 ),
            new Among ( "adores", -1, 2 ),
            new Among ( "antes", -1, 2 ),
            new Among ( "icos", -1, 1 ),
            new Among ( "ismos", -1, 1 ),
            new Among ( "osos", -1, 1 ),
            new Among ( "amientos", -1, 1 ),
            new Among ( "imientos", -1, 1 ),
            new Among ( "ivos", -1, 9 )
        ];

        var a_7 = [
            new Among ( "ya", -1, 1 ),
            new Among ( "ye", -1, 1 ),
            new Among ( "yan", -1, 1 ),
            new Among ( "yen", -1, 1 ),
            new Among ( "yeron", -1, 1 ),
            new Among ( "yendo", -1, 1 ),
            new Among ( "yo", -1, 1 ),
            new Among ( "yas", -1, 1 ),
            new Among ( "yes", -1, 1 ),
            new Among ( "yais", -1, 1 ),
            new Among ( "yamos", -1, 1 ),
            new Among ( "y\u00F3", -1, 1 )
        ];

        var a_8 = [
            new Among ( "aba", -1, 2 ),
            new Among ( "ada", -1, 2 ),
            new Among ( "ida", -1, 2 ),
            new Among ( "ara", -1, 2 ),
            new Among ( "iera", -1, 2 ),
            new Among ( "\u00EDa", -1, 2 ),
            new Among ( "ar\u00EDa", 5, 2 ),
            new Among ( "er\u00EDa", 5, 2 ),
            new Among ( "ir\u00EDa", 5, 2 ),
            new Among ( "ad", -1, 2 ),
            new Among ( "ed", -1, 2 ),
            new Among ( "id", -1, 2 ),
            new Among ( "ase", -1, 2 ),
            new Among ( "iese", -1, 2 ),
            new Among ( "aste", -1, 2 ),
            new Among ( "iste", -1, 2 ),
            new Among ( "an", -1, 2 ),
            new Among ( "aban", 16, 2 ),
            new Among ( "aran", 16, 2 ),
            new Among ( "ieran", 16, 2 ),
            new Among ( "\u00EDan", 16, 2 ),
            new Among ( "ar\u00EDan", 20, 2 ),
            new Among ( "er\u00EDan", 20, 2 ),
            new Among ( "ir\u00EDan", 20, 2 ),
            new Among ( "en", -1, 1 ),
            new Among ( "asen", 24, 2 ),
            new Among ( "iesen", 24, 2 ),
            new Among ( "aron", -1, 2 ),
            new Among ( "ieron", -1, 2 ),
            new Among ( "ar\u00E1n", -1, 2 ),
            new Among ( "er\u00E1n", -1, 2 ),
            new Among ( "ir\u00E1n", -1, 2 ),
            new Among ( "ado", -1, 2 ),
            new Among ( "ido", -1, 2 ),
            new Among ( "ando", -1, 2 ),
            new Among ( "iendo", -1, 2 ),
            new Among ( "ar", -1, 2 ),
            new Among ( "er", -1, 2 ),
            new Among ( "ir", -1, 2 ),
            new Among ( "as", -1, 2 ),
            new Among ( "abas", 39, 2 ),
            new Among ( "adas", 39, 2 ),
            new Among ( "idas", 39, 2 ),
            new Among ( "aras", 39, 2 ),
            new Among ( "ieras", 39, 2 ),
            new Among ( "\u00EDas", 39, 2 ),
            new Among ( "ar\u00EDas", 45, 2 ),
            new Among ( "er\u00EDas", 45, 2 ),
            new Among ( "ir\u00EDas", 45, 2 ),
            new Among ( "es", -1, 1 ),
            new Among ( "ases", 49, 2 ),
            new Among ( "ieses", 49, 2 ),
            new Among ( "abais", -1, 2 ),
            new Among ( "arais", -1, 2 ),
            new Among ( "ierais", -1, 2 ),
            new Among ( "\u00EDais", -1, 2 ),
            new Among ( "ar\u00EDais", 55, 2 ),
            new Among ( "er\u00EDais", 55, 2 ),
            new Among ( "ir\u00EDais", 55, 2 ),
            new Among ( "aseis", -1, 2 ),
            new Among ( "ieseis", -1, 2 ),
            new Among ( "asteis", -1, 2 ),
            new Among ( "isteis", -1, 2 ),
            new Among ( "\u00E1is", -1, 2 ),
            new Among ( "\u00E9is", -1, 1 ),
            new Among ( "ar\u00E9is", 64, 2 ),
            new Among ( "er\u00E9is", 64, 2 ),
            new Among ( "ir\u00E9is", 64, 2 ),
            new Among ( "ados", -1, 2 ),
            new Among ( "idos", -1, 2 ),
            new Among ( "amos", -1, 2 ),
            new Among ( "\u00E1bamos", 70, 2 ),
            new Among ( "\u00E1ramos", 70, 2 ),
            new Among ( "i\u00E9ramos", 70, 2 ),
            new Among ( "\u00EDamos", 70, 2 ),
            new Among ( "ar\u00EDamos", 74, 2 ),
            new Among ( "er\u00EDamos", 74, 2 ),
            new Among ( "ir\u00EDamos", 74, 2 ),
            new Among ( "emos", -1, 1 ),
            new Among ( "aremos", 78, 2 ),
            new Among ( "eremos", 78, 2 ),
            new Among ( "iremos", 78, 2 ),
            new Among ( "\u00E1semos", 78, 2 ),
            new Among ( "i\u00E9semos", 78, 2 ),
            new Among ( "imos", -1, 2 ),
            new Among ( "ar\u00E1s", -1, 2 ),
            new Among ( "er\u00E1s", -1, 2 ),
            new Among ( "ir\u00E1s", -1, 2 ),
            new Among ( "\u00EDs", -1, 2 ),
            new Among ( "ar\u00E1", -1, 2 ),
            new Among ( "er\u00E1", -1, 2 ),
            new Among ( "ir\u00E1", -1, 2 ),
            new Among ( "ar\u00E9", -1, 2 ),
            new Among ( "er\u00E9", -1, 2 ),
            new Among ( "ir\u00E9", -1, 2 ),
            new Among ( "i\u00F3", -1, 2 )
        ];

        var a_9 = [
            new Among ( "a", -1, 1 ),
            new Among ( "e", -1, 2 ),
            new Among ( "o", -1, 1 ),
            new Among ( "os", -1, 1 ),
            new Among ( "\u00E1", -1, 1 ),
            new Among ( "\u00E9", -1, 2 ),
            new Among ( "\u00ED", -1, 1 ),
            new Among ( "\u00F3", -1, 1 )
        ];

        var g_v = [17, 65, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 17, 4, 10 ];

        var I_p2;
        var I_p1;
        var I_pV;

        var sbp = new SnowballProgram();

        function r_mark_regions() {
            var v_1;
            var v_2;
            var v_3;
            var v_6;
            var v_8;
            I_pV = sbp.limit;
            I_p1 = sbp.limit;
            I_p2 = sbp.limit;
            v_1 = sbp.cursor;
            lab0: do {
                lab1: do {
                    v_2 = sbp.cursor;
                    lab2: do {
                        if (!(sbp.in_grouping(g_v, 97, 252)))
                        {
                            break lab2;
                        }
                        lab3: do {
                            v_3 = sbp.cursor;
                            lab4: do {
                                if (!(sbp.out_grouping(g_v, 97, 252)))
                                {
                                    break lab4;
                                }
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
                                        break lab4;
                                    }
                                    sbp.cursor++;
                                }
                                break lab3;
                            } while (false);
                            sbp.cursor = v_3;
                            if (!(sbp.in_grouping(g_v, 97, 252)))
                            {
                                break lab2;
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
                                    break lab2;
                                }
                                sbp.cursor++;
                            }
                        } while (false);
                        break lab1;
                    } while (false);
                    sbp.cursor = v_2;
                    if (!(sbp.out_grouping(g_v, 97, 252)))
                    {
                        break lab0;
                    }
                    lab9: do {
                        v_6 = sbp.cursor;
                        lab10: do {
                            if (!(sbp.out_grouping(g_v, 97, 252)))
                            {
                                break lab10;
                            }
                            golab11: while(true)
                            {
                                lab12: do {
                                    if (!(sbp.in_grouping(g_v, 97, 252)))
                                    {
                                        break lab12;
                                    }
                                    break golab11;
                                } while (false);
                                if (sbp.cursor >= sbp.limit)
                                {
                                    break lab10;
                                }
                                sbp.cursor++;
                            }
                            break lab9;
                        } while (false);
                        sbp.cursor = v_6;
                        if (!(sbp.in_grouping(g_v, 97, 252)))
                        {
                            break lab0;
                        }
                        if (sbp.cursor >= sbp.limit)
                        {
                            break lab0;
                        }
                        sbp.cursor++;
                    } while (false);
                } while (false);
                I_pV = sbp.cursor;
            } while (false);
            sbp.cursor = v_1;
            v_8 = sbp.cursor;
            lab13: do {
                golab14: while(true)
                {
                    lab15: do {
                        if (!(sbp.in_grouping(g_v, 97, 252)))
                        {
                            break lab15;
                        }
                        break golab14;
                    } while (false);
                    if (sbp.cursor >= sbp.limit)
                    {
                        break lab13;
                    }
                    sbp.cursor++;
                }
                golab16: while(true)
                {
                    lab17: do {
                        if (!(sbp.out_grouping(g_v, 97, 252)))
                        {
                            break lab17;
                        }
                        break golab16;
                    } while (false);
                    if (sbp.cursor >= sbp.limit)
                    {
                        break lab13;
                    }
                    sbp.cursor++;
                }
                I_p1 = sbp.cursor;
                golab18: while(true)
                {
                    lab19: do {
                        if (!(sbp.in_grouping(g_v, 97, 252)))
                        {
                            break lab19;
                        }
                        break golab18;
                    } while (false);
                    if (sbp.cursor >= sbp.limit)
                    {
                        break lab13;
                    }
                    sbp.cursor++;
                }
                golab20: while(true)
                {
                    lab21: do {
                        if (!(sbp.out_grouping(g_v, 97, 252)))
                        {
                            break lab21;
                        }
                        break golab20;
                    } while (false);
                    if (sbp.cursor >= sbp.limit)
                    {
                        break lab13;
                    }
                    sbp.cursor++;
                }
                I_p2 = sbp.cursor;
            } while (false);
            sbp.cursor = v_8;
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
                            sbp.slice_from("a");
                            break;
                        case 2:
                            sbp.slice_from("e");
                            break;
                        case 3:
                            sbp.slice_from("i");
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

        function r_attached_pronoun() {
            var among_var;
            sbp.ket = sbp.cursor;
            if (sbp.find_among_b(a_1, 13) == 0)
            {
                return false;
            }
            sbp.bra = sbp.cursor;
            among_var = sbp.find_among_b(a_2, 11);
            if (among_var == 0)
            {
                return false;
            }
            if (!r_RV())
            {
                return false;
            }
            switch(among_var) {
                case 0:
                    return false;
                case 1:
                    sbp.bra = sbp.cursor;
                    sbp.slice_from("iendo");
                    break;
                case 2:
                    sbp.bra = sbp.cursor;
                    sbp.slice_from("ando");
                    break;
                case 3:
                    sbp.bra = sbp.cursor;
                    sbp.slice_from("ar");
                    break;
                case 4:
                    sbp.bra = sbp.cursor;
                    sbp.slice_from("er");
                    break;
                case 5:
                    sbp.bra = sbp.cursor;
                    sbp.slice_from("ir");
                    break;
                case 6:
                    sbp.slice_del();
                    break;
                case 7:
                    if (!(sbp.eq_s_b(1, "u")))
                    {
                        return false;
                    }
                    sbp.slice_del();
                    break;
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
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_6, 46);
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
                        if (!r_R2())
                        {
                            sbp.cursor = sbp.limit - v_1;
                            break lab0;
                        }
                        sbp.slice_del();
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
                    sbp.slice_from("ente");
                    break;
                case 6:
                    if (!r_R1())
                    {
                        return false;
                    }
                    sbp.slice_del();
                    v_2 = sbp.limit - sbp.cursor;
                    lab1: do {
                        sbp.ket = sbp.cursor;
                        among_var = sbp.find_among_b(a_3, 4);
                        if (among_var == 0)
                        {
                            sbp.cursor = sbp.limit - v_2;
                            break lab1;
                        }
                        sbp.bra = sbp.cursor;
                        if (!r_R2())
                        {
                            sbp.cursor = sbp.limit - v_2;
                            break lab1;
                        }
                        sbp.slice_del();
                        switch(among_var) {
                            case 0:
                                sbp.cursor = sbp.limit - v_2;
                                break lab1;
                            case 1:
                                sbp.ket = sbp.cursor;
                                if (!(sbp.eq_s_b(2, "at")))
                                {
                                    sbp.cursor = sbp.limit - v_2;
                                    break lab1;
                                }
                                sbp.bra = sbp.cursor;
                                if (!r_R2())
                                {
                                    sbp.cursor = sbp.limit - v_2;
                                    break lab1;
                                }
                                sbp.slice_del();
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
                    v_3 = sbp.limit - sbp.cursor;
                    lab2: do {
                        sbp.ket = sbp.cursor;
                        among_var = sbp.find_among_b(a_4, 3);
                        if (among_var == 0)
                        {
                            sbp.cursor = sbp.limit - v_3;
                            break lab2;
                        }
                        sbp.bra = sbp.cursor;
                        switch(among_var) {
                            case 0:
                                sbp.cursor = sbp.limit - v_3;
                                break lab2;
                            case 1:
                                if (!r_R2())
                                {
                                    sbp.cursor = sbp.limit - v_3;
                                    break lab2;
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
                    v_4 = sbp.limit - sbp.cursor;
                    lab3: do {
                        sbp.ket = sbp.cursor;
                        among_var = sbp.find_among_b(a_5, 3);
                        if (among_var == 0)
                        {
                            sbp.cursor = sbp.limit - v_4;
                            break lab3;
                        }
                        sbp.bra = sbp.cursor;
                        switch(among_var) {
                            case 0:
                                sbp.cursor = sbp.limit - v_4;
                                break lab3;
                            case 1:
                                if (!r_R2())
                                {
                                    sbp.cursor = sbp.limit - v_4;
                                    break lab3;
                                }
                                sbp.slice_del();
                                break;
                        }
                    } while (false);
                    break;
                case 9:
                    if (!r_R2())
                    {
                        return false;
                    }
                    sbp.slice_del();
                    v_5 = sbp.limit - sbp.cursor;
                    lab4: do {
                        sbp.ket = sbp.cursor;
                        if (!(sbp.eq_s_b(2, "at")))
                        {
                            sbp.cursor = sbp.limit - v_5;
                            break lab4;
                        }
                        sbp.bra = sbp.cursor;
                        if (!r_R2())
                        {
                            sbp.cursor = sbp.limit - v_5;
                            break lab4;
                        }
                        sbp.slice_del();
                    } while (false);
                    break;
            }
            return true;
        }

        function r_y_verb_suffix() {
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
            among_var = sbp.find_among_b(a_7, 12);
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
                    if (!(sbp.eq_s_b(1, "u")))
                    {
                        return false;
                    }
                    sbp.slice_del();
                    break;
            }
            return true;
        }

        function r_verb_suffix() {
            var among_var;
            var v_1;
            var v_2;
            var v_3;
            var v_4;
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
            among_var = sbp.find_among_b(a_8, 96);
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
                    v_3 = sbp.limit - sbp.cursor;
                    lab0: do {
                        if (!(sbp.eq_s_b(1, "u")))
                        {
                            sbp.cursor = sbp.limit - v_3;
                            break lab0;
                        }
                        v_4 = sbp.limit - sbp.cursor;
                        if (!(sbp.eq_s_b(1, "g")))
                        {
                            sbp.cursor = sbp.limit - v_3;
                            break lab0;
                        }
                        sbp.cursor = sbp.limit - v_4;
                    } while (false);
                    sbp.bra = sbp.cursor;
                    sbp.slice_del();
                    break;
                case 2:
                    sbp.slice_del();
                    break;
            }
            return true;
        }

        function r_residual_suffix() {
            var among_var;
            var v_1;
            var v_2;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_9, 8);
            if (among_var == 0)
            {
                return false;
            }
            sbp.bra = sbp.cursor;
            switch(among_var) {
                case 0:
                    return false;
                case 1:
                    if (!r_RV())
                    {
                        return false;
                    }
                    sbp.slice_del();
                    break;
                case 2:
                    if (!r_RV())
                    {
                        return false;
                    }
                    sbp.slice_del();
                    v_1 = sbp.limit - sbp.cursor;
                    lab0: do {
                        sbp.ket = sbp.cursor;
                        if (!(sbp.eq_s_b(1, "u")))
                        {
                            sbp.cursor = sbp.limit - v_1;
                            break lab0;
                        }
                        sbp.bra = sbp.cursor;
                        v_2 = sbp.limit - sbp.cursor;
                        if (!(sbp.eq_s_b(1, "g")))
                        {
                            sbp.cursor = sbp.limit - v_1;
                            break lab0;
                        }
                        sbp.cursor = sbp.limit - v_2;
                        if (!r_RV())
                        {
                            sbp.cursor = sbp.limit - v_1;
                            break lab0;
                        }
                        sbp.slice_del();
                    } while (false);
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
                if (!r_attached_pronoun())
                {
                    break lab1;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_2;
            v_3 = sbp.limit - sbp.cursor;
            lab2: do {
                lab3: do {
                    v_4 = sbp.limit - sbp.cursor;
                    lab4: do {
                        if (!r_standard_suffix())
                        {
                            break lab4;
                        }
                        break lab3;
                    } while (false);
                    sbp.cursor = sbp.limit - v_4;
                    lab5: do {
                        if (!r_y_verb_suffix())
                        {
                            break lab5;
                        }
                        break lab3;
                    } while (false);
                    sbp.cursor = sbp.limit - v_4;
                    if (!r_verb_suffix())
                    {
                        break lab2;
                    }
                } while (false);
            } while (false);
            sbp.cursor = sbp.limit - v_3;
            v_5 = sbp.limit - sbp.cursor;
            lab6: do {
                if (!r_residual_suffix())
                {
                    break lab6;
                }
            } while (false);
            sbp.cursor = sbp.limit - v_5;
            sbp.cursor = sbp.limit_backward;
            v_6 = sbp.cursor;
            lab7: do {
                if (!r_postlude())
                {
                    break lab7;
                }
            } while (false);
            sbp.cursor = v_6;
            return true;
        }

        this.setCurrent = function(word) {
                sbp.setCurrent(word);
        };

        this.getCurrent = function() {
                return sbp.getCurrent();
        };
}

return new spanishStemmer();
}