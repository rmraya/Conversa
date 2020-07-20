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
IrishStemmer = function() {
    var base = new BaseStemmer();
    /** @const */ var a_0 = [
        ["b'", -1, 1],
        ["bh", -1, 4],
        ["bhf", 1, 2],
        ["bp", -1, 8],
        ["ch", -1, 5],
        ["d'", -1, 1],
        ["d'fh", 5, 2],
        ["dh", -1, 6],
        ["dt", -1, 9],
        ["fh", -1, 2],
        ["gc", -1, 5],
        ["gh", -1, 7],
        ["h-", -1, 1],
        ["m'", -1, 1],
        ["mb", -1, 4],
        ["mh", -1, 10],
        ["n-", -1, 1],
        ["nd", -1, 6],
        ["ng", -1, 7],
        ["ph", -1, 8],
        ["sh", -1, 3],
        ["t-", -1, 1],
        ["th", -1, 9],
        ["ts", -1, 3]
    ];

    /** @const */ var a_1 = [
        ["\u00EDochta", -1, 1],
        ["a\u00EDochta", 0, 1],
        ["ire", -1, 2],
        ["aire", 2, 2],
        ["abh", -1, 1],
        ["eabh", 4, 1],
        ["ibh", -1, 1],
        ["aibh", 6, 1],
        ["amh", -1, 1],
        ["eamh", 8, 1],
        ["imh", -1, 1],
        ["aimh", 10, 1],
        ["\u00EDocht", -1, 1],
        ["a\u00EDocht", 12, 1],
        ["ir\u00ED", -1, 2],
        ["air\u00ED", 14, 2]
    ];

    /** @const */ var a_2 = [
        ["\u00F3ideacha", -1, 6],
        ["patacha", -1, 5],
        ["achta", -1, 1],
        ["arcachta", 2, 2],
        ["eachta", 2, 1],
        ["grafa\u00EDochta", -1, 4],
        ["paite", -1, 5],
        ["ach", -1, 1],
        ["each", 7, 1],
        ["\u00F3ideach", 8, 6],
        ["gineach", 8, 3],
        ["patach", 7, 5],
        ["grafa\u00EDoch", -1, 4],
        ["pataigh", -1, 5],
        ["\u00F3idigh", -1, 6],
        ["acht\u00FAil", -1, 1],
        ["eacht\u00FAil", 15, 1],
        ["gineas", -1, 3],
        ["ginis", -1, 3],
        ["acht", -1, 1],
        ["arcacht", 19, 2],
        ["eacht", 19, 1],
        ["grafa\u00EDocht", -1, 4],
        ["arcachta\u00ED", -1, 2],
        ["grafa\u00EDochta\u00ED", -1, 4]
    ];

    /** @const */ var a_3 = [
        ["imid", -1, 1],
        ["aimid", 0, 1],
        ["\u00EDmid", -1, 1],
        ["a\u00EDmid", 2, 1],
        ["adh", -1, 2],
        ["eadh", 4, 2],
        ["faidh", -1, 1],
        ["fidh", -1, 1],
        ["\u00E1il", -1, 2],
        ["ain", -1, 2],
        ["tear", -1, 2],
        ["tar", -1, 2]
    ];

    /** @const */ var /** Array<int> */ g_v = [17, 65, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 17, 4, 2];

    var /** number */ I_p2 = 0;
    var /** number */ I_p1 = 0;
    var /** number */ I_pV = 0;


    /** @return {boolean} */
    function r_mark_regions() {
        I_pV = base.limit;
        I_p1 = base.limit;
        I_p2 = base.limit;
        var /** number */ v_1 = base.cursor;
        lab0: {
            golab1: while(true)
            {
                lab2: {
                    if (!(base.in_grouping(g_v, 97, 250)))
                    {
                        break lab2;
                    }
                    break golab1;
                }
                if (base.cursor >= base.limit)
                {
                    break lab0;
                }
                base.cursor++;
            }
            I_pV = base.cursor;
        }
        base.cursor = v_1;
        var /** number */ v_3 = base.cursor;
        lab3: {
            golab4: while(true)
            {
                lab5: {
                    if (!(base.in_grouping(g_v, 97, 250)))
                    {
                        break lab5;
                    }
                    break golab4;
                }
                if (base.cursor >= base.limit)
                {
                    break lab3;
                }
                base.cursor++;
            }
            golab6: while(true)
            {
                lab7: {
                    if (!(base.out_grouping(g_v, 97, 250)))
                    {
                        break lab7;
                    }
                    break golab6;
                }
                if (base.cursor >= base.limit)
                {
                    break lab3;
                }
                base.cursor++;
            }
            I_p1 = base.cursor;
            golab8: while(true)
            {
                lab9: {
                    if (!(base.in_grouping(g_v, 97, 250)))
                    {
                        break lab9;
                    }
                    break golab8;
                }
                if (base.cursor >= base.limit)
                {
                    break lab3;
                }
                base.cursor++;
            }
            golab10: while(true)
            {
                lab11: {
                    if (!(base.out_grouping(g_v, 97, 250)))
                    {
                        break lab11;
                    }
                    break golab10;
                }
                if (base.cursor >= base.limit)
                {
                    break lab3;
                }
                base.cursor++;
            }
            I_p2 = base.cursor;
        }
        base.cursor = v_3;
        return true;
    };

    /** @return {boolean} */
    function r_initial_morph() {
        var /** number */ among_var;
        base.bra = base.cursor;
        among_var = base.find_among(a_0);
        if (among_var == 0)
        {
            return false;
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
                if (!base.slice_from("f"))
                {
                    return false;
                }
                break;
            case 3:
                if (!base.slice_from("s"))
                {
                    return false;
                }
                break;
            case 4:
                if (!base.slice_from("b"))
                {
                    return false;
                }
                break;
            case 5:
                if (!base.slice_from("c"))
                {
                    return false;
                }
                break;
            case 6:
                if (!base.slice_from("d"))
                {
                    return false;
                }
                break;
            case 7:
                if (!base.slice_from("g"))
                {
                    return false;
                }
                break;
            case 8:
                if (!base.slice_from("p"))
                {
                    return false;
                }
                break;
            case 9:
                if (!base.slice_from("t"))
                {
                    return false;
                }
                break;
            case 10:
                if (!base.slice_from("m"))
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_RV() {
        if (!(I_pV <= base.cursor))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_R1() {
        if (!(I_p1 <= base.cursor))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_R2() {
        if (!(I_p2 <= base.cursor))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_noun_sfx() {
        var /** number */ among_var;
        base.ket = base.cursor;
        among_var = base.find_among_b(a_1);
        if (among_var == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        switch (among_var) {
            case 1:
                if (!r_R1())
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 2:
                if (!r_R2())
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
    function r_deriv() {
        var /** number */ among_var;
        base.ket = base.cursor;
        among_var = base.find_among_b(a_2);
        if (among_var == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        switch (among_var) {
            case 1:
                if (!r_R2())
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 2:
                if (!base.slice_from("arc"))
                {
                    return false;
                }
                break;
            case 3:
                if (!base.slice_from("gin"))
                {
                    return false;
                }
                break;
            case 4:
                if (!base.slice_from("graf"))
                {
                    return false;
                }
                break;
            case 5:
                if (!base.slice_from("paite"))
                {
                    return false;
                }
                break;
            case 6:
                if (!base.slice_from("\u00F3id"))
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_verb_sfx() {
        var /** number */ among_var;
        base.ket = base.cursor;
        among_var = base.find_among_b(a_3);
        if (among_var == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        switch (among_var) {
            case 1:
                if (!r_RV())
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 2:
                if (!r_R1())
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

    this.stem = /** @return {boolean} */ function() {
        var /** number */ v_1 = base.cursor;
        r_initial_morph();
        base.cursor = v_1;
        r_mark_regions();
        base.limit_backward = base.cursor; base.cursor = base.limit;
        var /** number */ v_3 = base.limit - base.cursor;
        r_noun_sfx();
        base.cursor = base.limit - v_3;
        var /** number */ v_4 = base.limit - base.cursor;
        r_deriv();
        base.cursor = base.limit - v_4;
        var /** number */ v_5 = base.limit - base.cursor;
        r_verb_sfx();
        base.cursor = base.limit - v_5;
        base.cursor = base.limit_backward;
        return true;
    };

    /**@return{string}*/
    this['stemWord'] = function(/**string*/word) {
        base.setCurrent(word);
        this.stem();
        return base.getCurrent();
    };
};


return new IrishStemmer();
}