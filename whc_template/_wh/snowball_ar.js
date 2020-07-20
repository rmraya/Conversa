function Snowball() {

/**@constructor*/
BaseStemmer = function() {
    this.setCurrent = function(value) {
        this.current = value;
	this.cursor = 0;
	this.limit = this.current.length;
	this.limit_backward = 0;
	this.bra = this.cursor;
	this.ket = this.limit;
    };

    this.getCurrent = function() {
        return this.current;
    };

    this.copy_from = function(other) {
	this.current          = other.current;
	this.cursor           = other.cursor;
	this.limit            = other.limit;
	this.limit_backward   = other.limit_backward;
	this.bra              = other.bra;
	this.ket              = other.ket;
    };

    this.in_grouping = function(s, min, max) {
	if (this.cursor >= this.limit) return false;
	var ch = this.current.charCodeAt(this.cursor);
	if (ch > max || ch < min) return false;
	ch -= min;
	if ((s[ch >>> 3] & (0x1 << (ch & 0x7))) == 0) return false;
	this.cursor++;
	return true;
    };

    this.in_grouping_b = function(s, min, max) {
	if (this.cursor <= this.limit_backward) return false;
	var ch = this.current.charCodeAt(this.cursor - 1);
	if (ch > max || ch < min) return false;
	ch -= min;
	if ((s[ch >>> 3] & (0x1 << (ch & 0x7))) == 0) return false;
	this.cursor--;
	return true;
    };

    this.out_grouping = function(s, min, max) {
	if (this.cursor >= this.limit) return false;
	var ch = this.current.charCodeAt(this.cursor);
	if (ch > max || ch < min) {
	    this.cursor++;
	    return true;
	}
	ch -= min;
	if ((s[ch >>> 3] & (0X1 << (ch & 0x7))) == 0) {
	    this.cursor++;
	    return true;
	}
	return false;
    };

    this.out_grouping_b = function(s, min, max) {
	if (this.cursor <= this.limit_backward) return false;
	var ch = this.current.charCodeAt(this.cursor - 1);
	if (ch > max || ch < min) {
	    this.cursor--;
	    return true;
	}
	ch -= min;
	if ((s[ch >>> 3] & (0x1 << (ch & 0x7))) == 0) {
	    this.cursor--;
	    return true;
	}
	return false;
    };

    this.eq_s = function(s)
    {
	if (this.limit - this.cursor < s.length) return false;
        if (this.current.slice(this.cursor, this.cursor + s.length) != s)
        {
            return false;
        }
	this.cursor += s.length;
	return true;
    };

    this.eq_s_b = function(s)
    {
	if (this.cursor - this.limit_backward < s.length) return false;
        if (this.current.slice(this.cursor - s.length, this.cursor) != s)
        {
            return false;
        }
	this.cursor -= s.length;
	return true;
    };

    /** @return {number} */ this.find_among = function(v)
    {
	var i = 0;
	var j = v.length;

	var c = this.cursor;
	var l = this.limit;

	var common_i = 0;
	var common_j = 0;

	var first_key_inspected = false;

	while (true)
        {
	    var k = i + ((j - i) >>> 1);
	    var diff = 0;
	    var common = common_i < common_j ? common_i : common_j; // smaller
	    // w[0]: string, w[1]: substring_i, w[2]: result, w[3]: function (optional)
	    var w = v[k];
	    var i2;
	    for (i2 = common; i2 < w[0].length; i2++)
            {
		if (c + common == l)
                {
		    diff = -1;
		    break;
		}
		diff = this.current.charCodeAt(c + common) - w[0].charCodeAt(i2);
		if (diff != 0) break;
		common++;
	    }
	    if (diff < 0)
            {
		j = k;
		common_j = common;
	    }
            else
            {
		i = k;
		common_i = common;
	    }
	    if (j - i <= 1)
            {
		if (i > 0) break; // v->s has been inspected
		if (j == i) break; // only one item in v

		// - but now we need to go round once more to get
		// v->s inspected. This looks messy, but is actually
		// the optimal approach.

		if (first_key_inspected) break;
		first_key_inspected = true;
	    }
	}
	do {
	    var w = v[i];
	    if (common_i >= w[0].length)
            {
		this.cursor = c + w[0].length;
		if (w.length < 4) return w[2];
		var res = w[3](this);
		this.cursor = c + w[0].length;
		if (res) return w[2];
	    }
	    i = w[1];
	} while (i >= 0);
	return 0;
    };

    // find_among_b is for backwards processing. Same comments apply
    this.find_among_b = function(v)
    {
	var i = 0;
	var j = v.length

	var c = this.cursor;
	var lb = this.limit_backward;

	var common_i = 0;
	var common_j = 0;

	var first_key_inspected = false;

	while (true)
        {
	    var k = i + ((j - i) >> 1);
	    var diff = 0;
	    var common = common_i < common_j ? common_i : common_j;
	    var w = v[k];
	    var i2;
	    for (i2 = w[0].length - 1 - common; i2 >= 0; i2--)
            {
		if (c - common == lb)
                {
		    diff = -1;
		    break;
		}
		diff = this.current.charCodeAt(c - 1 - common) - w[0].charCodeAt(i2);
		if (diff != 0) break;
		common++;
	    }
	    if (diff < 0)
            {
		j = k;
		common_j = common;
	    }
            else
            {
		i = k;
		common_i = common;
	    }
	    if (j - i <= 1)
            {
		if (i > 0) break;
		if (j == i) break;
		if (first_key_inspected) break;
		first_key_inspected = true;
	    }
	}
	do {
	    var w = v[i];
	    if (common_i >= w[0].length)
            {
		this.cursor = c - w[0].length;
		if (w.length < 4) return w[2];
		var res = w[3](this);
		this.cursor = c - w[0].length;
		if (res) return w[2];
	    }
	    i = w[1];
	} while (i >= 0);
	return 0;
    };

    /* to replace chars between c_bra and c_ket in this.current by the
     * chars in s.
     */
    this.replace_s = function(c_bra, c_ket, s)
    {
	var adjustment = s.length - (c_ket - c_bra);
	this.current = this.current.slice(0, c_bra) + s + this.current.slice(c_ket);
	this.limit += adjustment;
	if (this.cursor >= c_ket) this.cursor += adjustment;
	else if (this.cursor > c_bra) this.cursor = c_bra;
	return adjustment;
    };

    this.slice_check = function()
    {
        if (this.bra < 0 ||
            this.bra > this.ket ||
            this.ket > this.limit ||
            this.limit > this.current.length)
        {
            return false;
        }
        return true;
    };

    this.slice_from = function(s)
    {
        var result = false;
	if (this.slice_check())
        {
	    this.replace_s(this.bra, this.ket, s);
            result = true;
        }
        return result;
    };

    this.slice_del = function()
    {
	return this.slice_from("");
    };

    this.insert = function(c_bra, c_ket, s)
    {
        var adjustment = this.replace_s(c_bra, c_ket, s);
	if (c_bra <= this.bra) this.bra += adjustment;
	if (c_bra <= this.ket) this.ket += adjustment;
    };

    this.slice_to = function()
    {
        var result = '';
	if (this.slice_check())
        {
            result = this.current.slice(this.bra, this.ket);
        }
        return result;
    };

    this.assign_to = function()
    {
        return this.current.slice(0, this.limit);
    };
};


/*==============================================*/

// Generated by Snowball 2.0.0 - https://snowballstem.org/

/**@constructor*/
ArabicStemmer = function() {
    var base = new BaseStemmer();
    /** @const */ var a_0 = [
        ["\u0640", -1, 1],
        ["\u064B", -1, 1],
        ["\u064C", -1, 1],
        ["\u064D", -1, 1],
        ["\u064E", -1, 1],
        ["\u064F", -1, 1],
        ["\u0650", -1, 1],
        ["\u0651", -1, 1],
        ["\u0652", -1, 1],
        ["\u0660", -1, 2],
        ["\u0661", -1, 3],
        ["\u0662", -1, 4],
        ["\u0663", -1, 5],
        ["\u0664", -1, 6],
        ["\u0665", -1, 7],
        ["\u0666", -1, 8],
        ["\u0667", -1, 9],
        ["\u0668", -1, 10],
        ["\u0669", -1, 11],
        ["\uFE80", -1, 12],
        ["\uFE81", -1, 16],
        ["\uFE82", -1, 16],
        ["\uFE83", -1, 13],
        ["\uFE84", -1, 13],
        ["\uFE85", -1, 17],
        ["\uFE86", -1, 17],
        ["\uFE87", -1, 14],
        ["\uFE88", -1, 14],
        ["\uFE89", -1, 15],
        ["\uFE8A", -1, 15],
        ["\uFE8B", -1, 15],
        ["\uFE8C", -1, 15],
        ["\uFE8D", -1, 18],
        ["\uFE8E", -1, 18],
        ["\uFE8F", -1, 19],
        ["\uFE90", -1, 19],
        ["\uFE91", -1, 19],
        ["\uFE92", -1, 19],
        ["\uFE93", -1, 20],
        ["\uFE94", -1, 20],
        ["\uFE95", -1, 21],
        ["\uFE96", -1, 21],
        ["\uFE97", -1, 21],
        ["\uFE98", -1, 21],
        ["\uFE99", -1, 22],
        ["\uFE9A", -1, 22],
        ["\uFE9B", -1, 22],
        ["\uFE9C", -1, 22],
        ["\uFE9D", -1, 23],
        ["\uFE9E", -1, 23],
        ["\uFE9F", -1, 23],
        ["\uFEA0", -1, 23],
        ["\uFEA1", -1, 24],
        ["\uFEA2", -1, 24],
        ["\uFEA3", -1, 24],
        ["\uFEA4", -1, 24],
        ["\uFEA5", -1, 25],
        ["\uFEA6", -1, 25],
        ["\uFEA7", -1, 25],
        ["\uFEA8", -1, 25],
        ["\uFEA9", -1, 26],
        ["\uFEAA", -1, 26],
        ["\uFEAB", -1, 27],
        ["\uFEAC", -1, 27],
        ["\uFEAD", -1, 28],
        ["\uFEAE", -1, 28],
        ["\uFEAF", -1, 29],
        ["\uFEB0", -1, 29],
        ["\uFEB1", -1, 30],
        ["\uFEB2", -1, 30],
        ["\uFEB3", -1, 30],
        ["\uFEB4", -1, 30],
        ["\uFEB5", -1, 31],
        ["\uFEB6", -1, 31],
        ["\uFEB7", -1, 31],
        ["\uFEB8", -1, 31],
        ["\uFEB9", -1, 32],
        ["\uFEBA", -1, 32],
        ["\uFEBB", -1, 32],
        ["\uFEBC", -1, 32],
        ["\uFEBD", -1, 33],
        ["\uFEBE", -1, 33],
        ["\uFEBF", -1, 33],
        ["\uFEC0", -1, 33],
        ["\uFEC1", -1, 34],
        ["\uFEC2", -1, 34],
        ["\uFEC3", -1, 34],
        ["\uFEC4", -1, 34],
        ["\uFEC5", -1, 35],
        ["\uFEC6", -1, 35],
        ["\uFEC7", -1, 35],
        ["\uFEC8", -1, 35],
        ["\uFEC9", -1, 36],
        ["\uFECA", -1, 36],
        ["\uFECB", -1, 36],
        ["\uFECC", -1, 36],
        ["\uFECD", -1, 37],
        ["\uFECE", -1, 37],
        ["\uFECF", -1, 37],
        ["\uFED0", -1, 37],
        ["\uFED1", -1, 38],
        ["\uFED2", -1, 38],
        ["\uFED3", -1, 38],
        ["\uFED4", -1, 38],
        ["\uFED5", -1, 39],
        ["\uFED6", -1, 39],
        ["\uFED7", -1, 39],
        ["\uFED8", -1, 39],
        ["\uFED9", -1, 40],
        ["\uFEDA", -1, 40],
        ["\uFEDB", -1, 40],
        ["\uFEDC", -1, 40],
        ["\uFEDD", -1, 41],
        ["\uFEDE", -1, 41],
        ["\uFEDF", -1, 41],
        ["\uFEE0", -1, 41],
        ["\uFEE1", -1, 42],
        ["\uFEE2", -1, 42],
        ["\uFEE3", -1, 42],
        ["\uFEE4", -1, 42],
        ["\uFEE5", -1, 43],
        ["\uFEE6", -1, 43],
        ["\uFEE7", -1, 43],
        ["\uFEE8", -1, 43],
        ["\uFEE9", -1, 44],
        ["\uFEEA", -1, 44],
        ["\uFEEB", -1, 44],
        ["\uFEEC", -1, 44],
        ["\uFEED", -1, 45],
        ["\uFEEE", -1, 45],
        ["\uFEEF", -1, 46],
        ["\uFEF0", -1, 46],
        ["\uFEF1", -1, 47],
        ["\uFEF2", -1, 47],
        ["\uFEF3", -1, 47],
        ["\uFEF4", -1, 47],
        ["\uFEF5", -1, 51],
        ["\uFEF6", -1, 51],
        ["\uFEF7", -1, 49],
        ["\uFEF8", -1, 49],
        ["\uFEF9", -1, 50],
        ["\uFEFA", -1, 50],
        ["\uFEFB", -1, 48],
        ["\uFEFC", -1, 48]
    ];

    /** @const */ var a_1 = [
        ["\u0622", -1, 1],
        ["\u0623", -1, 1],
        ["\u0624", -1, 1],
        ["\u0625", -1, 1],
        ["\u0626", -1, 1]
    ];

    /** @const */ var a_2 = [
        ["\u0622", -1, 1],
        ["\u0623", -1, 1],
        ["\u0624", -1, 2],
        ["\u0625", -1, 1],
        ["\u0626", -1, 3]
    ];

    /** @const */ var a_3 = [
        ["\u0627\u0644", -1, 2],
        ["\u0628\u0627\u0644", -1, 1],
        ["\u0643\u0627\u0644", -1, 1],
        ["\u0644\u0644", -1, 2]
    ];

    /** @const */ var a_4 = [
        ["\u0623\u0622", -1, 2],
        ["\u0623\u0623", -1, 1],
        ["\u0623\u0624", -1, 1],
        ["\u0623\u0625", -1, 4],
        ["\u0623\u0627", -1, 3]
    ];

    /** @const */ var a_5 = [
        ["\u0641", -1, 1],
        ["\u0648", -1, 1]
    ];

    /** @const */ var a_6 = [
        ["\u0627\u0644", -1, 2],
        ["\u0628\u0627\u0644", -1, 1],
        ["\u0643\u0627\u0644", -1, 1],
        ["\u0644\u0644", -1, 2]
    ];

    /** @const */ var a_7 = [
        ["\u0628", -1, 1],
        ["\u0628\u0628", 0, 2],
        ["\u0643\u0643", -1, 3]
    ];

    /** @const */ var a_8 = [
        ["\u0633\u0623", -1, 4],
        ["\u0633\u062A", -1, 2],
        ["\u0633\u0646", -1, 3],
        ["\u0633\u064A", -1, 1]
    ];

    /** @const */ var a_9 = [
        ["\u062A\u0633\u062A", -1, 1],
        ["\u0646\u0633\u062A", -1, 1],
        ["\u064A\u0633\u062A", -1, 1]
    ];

    /** @const */ var a_10 = [
        ["\u0643\u0645\u0627", -1, 3],
        ["\u0647\u0645\u0627", -1, 3],
        ["\u0646\u0627", -1, 2],
        ["\u0647\u0627", -1, 2],
        ["\u0643", -1, 1],
        ["\u0643\u0645", -1, 2],
        ["\u0647\u0645", -1, 2],
        ["\u0647\u0646", -1, 2],
        ["\u0647", -1, 1],
        ["\u064A", -1, 1]
    ];

    /** @const */ var a_11 = [
        ["\u0646", -1, 1]
    ];

    /** @const */ var a_12 = [
        ["\u0627", -1, 1],
        ["\u0648", -1, 1],
        ["\u064A", -1, 1]
    ];

    /** @const */ var a_13 = [
        ["\u0627\u062A", -1, 1]
    ];

    /** @const */ var a_14 = [
        ["\u062A", -1, 1]
    ];

    /** @const */ var a_15 = [
        ["\u0629", -1, 1]
    ];

    /** @const */ var a_16 = [
        ["\u064A", -1, 1]
    ];

    /** @const */ var a_17 = [
        ["\u0643\u0645\u0627", -1, 3],
        ["\u0647\u0645\u0627", -1, 3],
        ["\u0646\u0627", -1, 2],
        ["\u0647\u0627", -1, 2],
        ["\u0643", -1, 1],
        ["\u0643\u0645", -1, 2],
        ["\u0647\u0645", -1, 2],
        ["\u0643\u0646", -1, 2],
        ["\u0647\u0646", -1, 2],
        ["\u0647", -1, 1],
        ["\u0643\u0645\u0648", -1, 3],
        ["\u0646\u064A", -1, 2]
    ];

    /** @const */ var a_18 = [
        ["\u0627", -1, 1],
        ["\u062A\u0627", 0, 2],
        ["\u062A\u0645\u0627", 0, 4],
        ["\u0646\u0627", 0, 2],
        ["\u062A", -1, 1],
        ["\u0646", -1, 1],
        ["\u0627\u0646", 5, 3],
        ["\u062A\u0646", 5, 2],
        ["\u0648\u0646", 5, 3],
        ["\u064A\u0646", 5, 3],
        ["\u064A", -1, 1]
    ];

    /** @const */ var a_19 = [
        ["\u0648\u0627", -1, 1],
        ["\u062A\u0645", -1, 1]
    ];

    /** @const */ var a_20 = [
        ["\u0648", -1, 1],
        ["\u062A\u0645\u0648", 0, 2]
    ];

    /** @const */ var a_21 = [
        ["\u0649", -1, 1]
    ];

    var /** boolean */ B_is_defined = false;
    var /** boolean */ B_is_verb = false;
    var /** boolean */ B_is_noun = false;


    /** @return {boolean} */
    function r_Normalize_pre() {
        var /** number */ among_var;
        var /** number */ v_1 = base.cursor;
        lab0: {
            while(true)
            {
                var /** number */ v_2 = base.cursor;
                lab1: {
                    lab2: {
                        var /** number */ v_3 = base.cursor;
                        lab3: {
                            base.bra = base.cursor;
                            among_var = base.find_among(a_0);
                            if (among_var == 0)
                            {
                                break lab3;
                            }
                            base.ket = base.cursor;
                            switch (among_var) {
                                case 1:
                                    if (!base.slice_del())
                                    {
                                        return false;
                                    }
                                    break;
                                case 2:
                                    if (!base.slice_from("0"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 3:
                                    if (!base.slice_from("1"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 4:
                                    if (!base.slice_from("2"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 5:
                                    if (!base.slice_from("3"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 6:
                                    if (!base.slice_from("4"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 7:
                                    if (!base.slice_from("5"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 8:
                                    if (!base.slice_from("6"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 9:
                                    if (!base.slice_from("7"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 10:
                                    if (!base.slice_from("8"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 11:
                                    if (!base.slice_from("9"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 12:
                                    if (!base.slice_from("\u0621"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 13:
                                    if (!base.slice_from("\u0623"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 14:
                                    if (!base.slice_from("\u0625"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 15:
                                    if (!base.slice_from("\u0626"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 16:
                                    if (!base.slice_from("\u0622"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 17:
                                    if (!base.slice_from("\u0624"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 18:
                                    if (!base.slice_from("\u0627"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 19:
                                    if (!base.slice_from("\u0628"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 20:
                                    if (!base.slice_from("\u0629"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 21:
                                    if (!base.slice_from("\u062A"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 22:
                                    if (!base.slice_from("\u062B"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 23:
                                    if (!base.slice_from("\u062C"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 24:
                                    if (!base.slice_from("\u062D"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 25:
                                    if (!base.slice_from("\u062E"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 26:
                                    if (!base.slice_from("\u062F"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 27:
                                    if (!base.slice_from("\u0630"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 28:
                                    if (!base.slice_from("\u0631"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 29:
                                    if (!base.slice_from("\u0632"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 30:
                                    if (!base.slice_from("\u0633"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 31:
                                    if (!base.slice_from("\u0634"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 32:
                                    if (!base.slice_from("\u0635"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 33:
                                    if (!base.slice_from("\u0636"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 34:
                                    if (!base.slice_from("\u0637"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 35:
                                    if (!base.slice_from("\u0638"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 36:
                                    if (!base.slice_from("\u0639"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 37:
                                    if (!base.slice_from("\u063A"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 38:
                                    if (!base.slice_from("\u0641"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 39:
                                    if (!base.slice_from("\u0642"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 40:
                                    if (!base.slice_from("\u0643"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 41:
                                    if (!base.slice_from("\u0644"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 42:
                                    if (!base.slice_from("\u0645"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 43:
                                    if (!base.slice_from("\u0646"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 44:
                                    if (!base.slice_from("\u0647"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 45:
                                    if (!base.slice_from("\u0648"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 46:
                                    if (!base.slice_from("\u0649"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 47:
                                    if (!base.slice_from("\u064A"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 48:
                                    if (!base.slice_from("\u0644\u0627"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 49:
                                    if (!base.slice_from("\u0644\u0623"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 50:
                                    if (!base.slice_from("\u0644\u0625"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 51:
                                    if (!base.slice_from("\u0644\u0622"))
                                    {
                                        return false;
                                    }
                                    break;
                            }
                            break lab2;
                        }
                        base.cursor = v_3;
                        if (base.cursor >= base.limit)
                        {
                            break lab1;
                        }
                        base.cursor++;
                    }
                    continue;
                }
                base.cursor = v_2;
                break;
            }
        }
        base.cursor = v_1;
        return true;
    };

    /** @return {boolean} */
    function r_Normalize_post() {
        var /** number */ among_var;
        var /** number */ v_1 = base.cursor;
        lab0: {
            base.limit_backward = base.cursor; base.cursor = base.limit;
            base.ket = base.cursor;
            if (base.find_among_b(a_1) == 0)
            {
                break lab0;
            }
            base.bra = base.cursor;
            if (!base.slice_from("\u0621"))
            {
                return false;
            }
            base.cursor = base.limit_backward;
        }
        base.cursor = v_1;
        var /** number */ v_2 = base.cursor;
        lab1: {
            while(true)
            {
                var /** number */ v_3 = base.cursor;
                lab2: {
                    lab3: {
                        var /** number */ v_4 = base.cursor;
                        lab4: {
                            base.bra = base.cursor;
                            among_var = base.find_among(a_2);
                            if (among_var == 0)
                            {
                                break lab4;
                            }
                            base.ket = base.cursor;
                            switch (among_var) {
                                case 1:
                                    if (!base.slice_from("\u0627"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 2:
                                    if (!base.slice_from("\u0648"))
                                    {
                                        return false;
                                    }
                                    break;
                                case 3:
                                    if (!base.slice_from("\u064A"))
                                    {
                                        return false;
                                    }
                                    break;
                            }
                            break lab3;
                        }
                        base.cursor = v_4;
                        if (base.cursor >= base.limit)
                        {
                            break lab2;
                        }
                        base.cursor++;
                    }
                    continue;
                }
                base.cursor = v_3;
                break;
            }
        }
        base.cursor = v_2;
        return true;
    };

    /** @return {boolean} */
    function r_Checks1() {
        var /** number */ among_var;
        base.bra = base.cursor;
        among_var = base.find_among(a_3);
        if (among_var == 0)
        {
            return false;
        }
        base.ket = base.cursor;
        switch (among_var) {
            case 1:
                if (!(base.current.length > 4))
                {
                    return false;
                }
                B_is_noun = true;
                B_is_verb = false;
                B_is_defined = true;
                break;
            case 2:
                if (!(base.current.length > 3))
                {
                    return false;
                }
                B_is_noun = true;
                B_is_verb = false;
                B_is_defined = true;
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Prefix_Step1() {
        var /** number */ among_var;
        base.bra = base.cursor;
        among_var = base.find_among(a_4);
        if (among_var == 0)
        {
            return false;
        }
        base.ket = base.cursor;
        switch (among_var) {
            case 1:
                if (!(base.current.length > 3))
                {
                    return false;
                }
                if (!base.slice_from("\u0623"))
                {
                    return false;
                }
                break;
            case 2:
                if (!(base.current.length > 3))
                {
                    return false;
                }
                if (!base.slice_from("\u0622"))
                {
                    return false;
                }
                break;
            case 3:
                if (!(base.current.length > 3))
                {
                    return false;
                }
                if (!base.slice_from("\u0627"))
                {
                    return false;
                }
                break;
            case 4:
                if (!(base.current.length > 3))
                {
                    return false;
                }
                if (!base.slice_from("\u0625"))
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Prefix_Step2() {
        {
            var /** number */ v_1 = base.cursor;
            lab0: {
                if (!(base.eq_s("\u0641\u0627")))
                {
                    break lab0;
                }
                return false;
            }
            base.cursor = v_1;
        }
        {
            var /** number */ v_2 = base.cursor;
            lab1: {
                if (!(base.eq_s("\u0648\u0627")))
                {
                    break lab1;
                }
                return false;
            }
            base.cursor = v_2;
        }
        base.bra = base.cursor;
        if (base.find_among(a_5) == 0)
        {
            return false;
        }
        base.ket = base.cursor;
        if (!(base.current.length > 3))
        {
            return false;
        }
        if (!base.slice_del())
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Prefix_Step3a_Noun() {
        var /** number */ among_var;
        base.bra = base.cursor;
        among_var = base.find_among(a_6);
        if (among_var == 0)
        {
            return false;
        }
        base.ket = base.cursor;
        switch (among_var) {
            case 1:
                if (!(base.current.length > 5))
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 2:
                if (!(base.current.length > 4))
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Prefix_Step3b_Noun() {
        var /** number */ among_var;
        {
            var /** number */ v_1 = base.cursor;
            lab0: {
                if (!(base.eq_s("\u0628\u0627")))
                {
                    break lab0;
                }
                return false;
            }
            base.cursor = v_1;
        }
        base.bra = base.cursor;
        among_var = base.find_among(a_7);
        if (among_var == 0)
        {
            return false;
        }
        base.ket = base.cursor;
        switch (among_var) {
            case 1:
                if (!(base.current.length > 3))
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 2:
                if (!(base.current.length > 3))
                {
                    return false;
                }
                if (!base.slice_from("\u0628"))
                {
                    return false;
                }
                break;
            case 3:
                if (!(base.current.length > 3))
                {
                    return false;
                }
                if (!base.slice_from("\u0643"))
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Prefix_Step3_Verb() {
        var /** number */ among_var;
        base.bra = base.cursor;
        among_var = base.find_among(a_8);
        if (among_var == 0)
        {
            return false;
        }
        base.ket = base.cursor;
        switch (among_var) {
            case 1:
                if (!(base.current.length > 4))
                {
                    return false;
                }
                if (!base.slice_from("\u064A"))
                {
                    return false;
                }
                break;
            case 2:
                if (!(base.current.length > 4))
                {
                    return false;
                }
                if (!base.slice_from("\u062A"))
                {
                    return false;
                }
                break;
            case 3:
                if (!(base.current.length > 4))
                {
                    return false;
                }
                if (!base.slice_from("\u0646"))
                {
                    return false;
                }
                break;
            case 4:
                if (!(base.current.length > 4))
                {
                    return false;
                }
                if (!base.slice_from("\u0623"))
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Prefix_Step4_Verb() {
        base.bra = base.cursor;
        if (base.find_among(a_9) == 0)
        {
            return false;
        }
        base.ket = base.cursor;
        if (!(base.current.length > 4))
        {
            return false;
        }
        B_is_verb = true;
        B_is_noun = false;
        if (!base.slice_from("\u0627\u0633\u062A"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Suffix_Noun_Step1a() {
        var /** number */ among_var;
        base.ket = base.cursor;
        among_var = base.find_among_b(a_10);
        if (among_var == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        switch (among_var) {
            case 1:
                if (!(base.current.length >= 4))
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 2:
                if (!(base.current.length >= 5))
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 3:
                if (!(base.current.length >= 6))
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Suffix_Noun_Step1b() {
        base.ket = base.cursor;
        if (base.find_among_b(a_11) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!(base.current.length > 5))
        {
            return false;
        }
        if (!base.slice_del())
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Suffix_Noun_Step2a() {
        base.ket = base.cursor;
        if (base.find_among_b(a_12) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!(base.current.length > 4))
        {
            return false;
        }
        if (!base.slice_del())
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Suffix_Noun_Step2b() {
        base.ket = base.cursor;
        if (base.find_among_b(a_13) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!(base.current.length >= 5))
        {
            return false;
        }
        if (!base.slice_del())
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Suffix_Noun_Step2c1() {
        base.ket = base.cursor;
        if (base.find_among_b(a_14) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!(base.current.length >= 4))
        {
            return false;
        }
        if (!base.slice_del())
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Suffix_Noun_Step2c2() {
        base.ket = base.cursor;
        if (base.find_among_b(a_15) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!(base.current.length >= 4))
        {
            return false;
        }
        if (!base.slice_del())
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Suffix_Noun_Step3() {
        base.ket = base.cursor;
        if (base.find_among_b(a_16) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!(base.current.length >= 3))
        {
            return false;
        }
        if (!base.slice_del())
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Suffix_Verb_Step1() {
        var /** number */ among_var;
        base.ket = base.cursor;
        among_var = base.find_among_b(a_17);
        if (among_var == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        switch (among_var) {
            case 1:
                if (!(base.current.length >= 4))
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 2:
                if (!(base.current.length >= 5))
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 3:
                if (!(base.current.length >= 6))
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Suffix_Verb_Step2a() {
        var /** number */ among_var;
        base.ket = base.cursor;
        among_var = base.find_among_b(a_18);
        if (among_var == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        switch (among_var) {
            case 1:
                if (!(base.current.length >= 4))
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 2:
                if (!(base.current.length >= 5))
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 3:
                if (!(base.current.length > 5))
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 4:
                if (!(base.current.length >= 6))
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Suffix_Verb_Step2b() {
        base.ket = base.cursor;
        if (base.find_among_b(a_19) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!(base.current.length >= 5))
        {
            return false;
        }
        if (!base.slice_del())
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Suffix_Verb_Step2c() {
        var /** number */ among_var;
        base.ket = base.cursor;
        among_var = base.find_among_b(a_20);
        if (among_var == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        switch (among_var) {
            case 1:
                if (!(base.current.length >= 4))
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 2:
                if (!(base.current.length >= 6))
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_Suffix_All_alef_maqsura() {
        base.ket = base.cursor;
        if (base.find_among_b(a_21) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_from("\u064A"))
        {
            return false;
        }
        return true;
    };

    this.stem = /** @return {boolean} */ function() {
        B_is_noun = true;
        B_is_verb = true;
        B_is_defined = false;
        var /** number */ v_1 = base.cursor;
        r_Checks1();
        base.cursor = v_1;
        r_Normalize_pre();
        base.limit_backward = base.cursor; base.cursor = base.limit;
        var /** number */ v_3 = base.limit - base.cursor;
        lab0: {
            lab1: {
                var /** number */ v_4 = base.limit - base.cursor;
                lab2: {
                    if (!B_is_verb)
                    {
                        break lab2;
                    }
                    lab3: {
                        var /** number */ v_5 = base.limit - base.cursor;
                        lab4: {
                            {
                                var v_6 = 1;
                                while(true)
                                {
                                    var /** number */ v_7 = base.limit - base.cursor;
                                    lab5: {
                                        if (!r_Suffix_Verb_Step1())
                                        {
                                            break lab5;
                                        }
                                        v_6--;
                                        continue;
                                    }
                                    base.cursor = base.limit - v_7;
                                    break;
                                }
                                if (v_6 > 0)
                                {
                                    break lab4;
                                }
                            }
                            lab6: {
                                var /** number */ v_8 = base.limit - base.cursor;
                                lab7: {
                                    if (!r_Suffix_Verb_Step2a())
                                    {
                                        break lab7;
                                    }
                                    break lab6;
                                }
                                base.cursor = base.limit - v_8;
                                lab8: {
                                    if (!r_Suffix_Verb_Step2c())
                                    {
                                        break lab8;
                                    }
                                    break lab6;
                                }
                                base.cursor = base.limit - v_8;
                                if (base.cursor <= base.limit_backward)
                                {
                                    break lab4;
                                }
                                base.cursor--;
                            }
                            break lab3;
                        }
                        base.cursor = base.limit - v_5;
                        lab9: {
                            if (!r_Suffix_Verb_Step2b())
                            {
                                break lab9;
                            }
                            break lab3;
                        }
                        base.cursor = base.limit - v_5;
                        if (!r_Suffix_Verb_Step2a())
                        {
                            break lab2;
                        }
                    }
                    break lab1;
                }
                base.cursor = base.limit - v_4;
                lab10: {
                    if (!B_is_noun)
                    {
                        break lab10;
                    }
                    var /** number */ v_9 = base.limit - base.cursor;
                    lab11: {
                        lab12: {
                            var /** number */ v_10 = base.limit - base.cursor;
                            lab13: {
                                if (!r_Suffix_Noun_Step2c2())
                                {
                                    break lab13;
                                }
                                break lab12;
                            }
                            base.cursor = base.limit - v_10;
                            lab14: {
                                lab15: {
                                    if (!B_is_defined)
                                    {
                                        break lab15;
                                    }
                                    break lab14;
                                }
                                if (!r_Suffix_Noun_Step1a())
                                {
                                    break lab14;
                                }
                                lab16: {
                                    var /** number */ v_12 = base.limit - base.cursor;
                                    lab17: {
                                        if (!r_Suffix_Noun_Step2a())
                                        {
                                            break lab17;
                                        }
                                        break lab16;
                                    }
                                    base.cursor = base.limit - v_12;
                                    lab18: {
                                        if (!r_Suffix_Noun_Step2b())
                                        {
                                            break lab18;
                                        }
                                        break lab16;
                                    }
                                    base.cursor = base.limit - v_12;
                                    lab19: {
                                        if (!r_Suffix_Noun_Step2c1())
                                        {
                                            break lab19;
                                        }
                                        break lab16;
                                    }
                                    base.cursor = base.limit - v_12;
                                    if (base.cursor <= base.limit_backward)
                                    {
                                        break lab14;
                                    }
                                    base.cursor--;
                                }
                                break lab12;
                            }
                            base.cursor = base.limit - v_10;
                            lab20: {
                                if (!r_Suffix_Noun_Step1b())
                                {
                                    break lab20;
                                }
                                lab21: {
                                    var /** number */ v_13 = base.limit - base.cursor;
                                    lab22: {
                                        if (!r_Suffix_Noun_Step2a())
                                        {
                                            break lab22;
                                        }
                                        break lab21;
                                    }
                                    base.cursor = base.limit - v_13;
                                    lab23: {
                                        if (!r_Suffix_Noun_Step2b())
                                        {
                                            break lab23;
                                        }
                                        break lab21;
                                    }
                                    base.cursor = base.limit - v_13;
                                    if (!r_Suffix_Noun_Step2c1())
                                    {
                                        break lab20;
                                    }
                                }
                                break lab12;
                            }
                            base.cursor = base.limit - v_10;
                            lab24: {
                                lab25: {
                                    if (!B_is_defined)
                                    {
                                        break lab25;
                                    }
                                    break lab24;
                                }
                                if (!r_Suffix_Noun_Step2a())
                                {
                                    break lab24;
                                }
                                break lab12;
                            }
                            base.cursor = base.limit - v_10;
                            if (!r_Suffix_Noun_Step2b())
                            {
                                base.cursor = base.limit - v_9;
                                break lab11;
                            }
                        }
                    }
                    if (!r_Suffix_Noun_Step3())
                    {
                        break lab10;
                    }
                    break lab1;
                }
                base.cursor = base.limit - v_4;
                if (!r_Suffix_All_alef_maqsura())
                {
                    break lab0;
                }
            }
        }
        base.cursor = base.limit - v_3;
        base.cursor = base.limit_backward;
        var /** number */ v_15 = base.cursor;
        lab26: {
            var /** number */ v_16 = base.cursor;
            lab27: {
                if (!r_Prefix_Step1())
                {
                    base.cursor = v_16;
                    break lab27;
                }
            }
            var /** number */ v_17 = base.cursor;
            lab28: {
                if (!r_Prefix_Step2())
                {
                    base.cursor = v_17;
                    break lab28;
                }
            }
            lab29: {
                var /** number */ v_18 = base.cursor;
                lab30: {
                    if (!r_Prefix_Step3a_Noun())
                    {
                        break lab30;
                    }
                    break lab29;
                }
                base.cursor = v_18;
                lab31: {
                    if (!B_is_noun)
                    {
                        break lab31;
                    }
                    if (!r_Prefix_Step3b_Noun())
                    {
                        break lab31;
                    }
                    break lab29;
                }
                base.cursor = v_18;
                if (!B_is_verb)
                {
                    break lab26;
                }
                var /** number */ v_19 = base.cursor;
                lab32: {
                    if (!r_Prefix_Step3_Verb())
                    {
                        base.cursor = v_19;
                        break lab32;
                    }
                }
                if (!r_Prefix_Step4_Verb())
                {
                    break lab26;
                }
            }
        }
        base.cursor = v_15;
        r_Normalize_post();
        return true;
    };

    /**@return{string}*/
    this['stemWord'] = function(/**string*/word) {
        base.setCurrent(word);
        this.stem();
        return base.getCurrent();
    };
};


return new ArabicStemmer();
}