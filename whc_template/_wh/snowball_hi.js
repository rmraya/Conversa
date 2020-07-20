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
HindiStemmer = function() {
    var base = new BaseStemmer();
    /** @const */ var a_0 = [
        ["\u0906\u0901", -1, -1],
        ["\u093E\u0901", -1, -1],
        ["\u0907\u092F\u093E\u0901", 1, -1],
        ["\u0906\u0907\u092F\u093E\u0901", 2, -1],
        ["\u093E\u0907\u092F\u093E\u0901", 2, -1],
        ["\u093F\u092F\u093E\u0901", 1, -1],
        ["\u0906\u0902", -1, -1],
        ["\u0909\u0906\u0902", 6, -1],
        ["\u0941\u0906\u0902", 6, -1],
        ["\u0908\u0902", -1, -1],
        ["\u0906\u0908\u0902", 9, -1],
        ["\u093E\u0908\u0902", 9, -1],
        ["\u090F\u0902", -1, -1],
        ["\u0906\u090F\u0902", 12, -1],
        ["\u0909\u090F\u0902", 12, -1],
        ["\u093E\u090F\u0902", 12, -1],
        ["\u0924\u093E\u090F\u0902", 15, -1, r_CONSONANT],
        ["\u0905\u0924\u093E\u090F\u0902", 16, -1],
        ["\u0928\u093E\u090F\u0902", 15, -1, r_CONSONANT],
        ["\u0905\u0928\u093E\u090F\u0902", 18, -1],
        ["\u0941\u090F\u0902", 12, -1],
        ["\u0913\u0902", -1, -1],
        ["\u0906\u0913\u0902", 21, -1],
        ["\u0909\u0913\u0902", 21, -1],
        ["\u093E\u0913\u0902", 21, -1],
        ["\u0924\u093E\u0913\u0902", 24, -1, r_CONSONANT],
        ["\u0905\u0924\u093E\u0913\u0902", 25, -1],
        ["\u0928\u093E\u0913\u0902", 24, -1, r_CONSONANT],
        ["\u0905\u0928\u093E\u0913\u0902", 27, -1],
        ["\u0941\u0913\u0902", 21, -1],
        ["\u093E\u0902", -1, -1],
        ["\u0907\u092F\u093E\u0902", 30, -1],
        ["\u0906\u0907\u092F\u093E\u0902", 31, -1],
        ["\u093E\u0907\u092F\u093E\u0902", 31, -1],
        ["\u093F\u092F\u093E\u0902", 30, -1],
        ["\u0940\u0902", -1, -1],
        ["\u0924\u0940\u0902", 35, -1, r_CONSONANT],
        ["\u0905\u0924\u0940\u0902", 36, -1],
        ["\u0906\u0924\u0940\u0902", 36, -1],
        ["\u093E\u0924\u0940\u0902", 36, -1],
        ["\u0947\u0902", -1, -1],
        ["\u094B\u0902", -1, -1],
        ["\u0907\u092F\u094B\u0902", 41, -1],
        ["\u0906\u0907\u092F\u094B\u0902", 42, -1],
        ["\u093E\u0907\u092F\u094B\u0902", 42, -1],
        ["\u093F\u092F\u094B\u0902", 41, -1],
        ["\u0905", -1, -1],
        ["\u0906", -1, -1],
        ["\u0907", -1, -1],
        ["\u0908", -1, -1],
        ["\u0906\u0908", 49, -1],
        ["\u093E\u0908", 49, -1],
        ["\u0909", -1, -1],
        ["\u090A", -1, -1],
        ["\u090F", -1, -1],
        ["\u0906\u090F", 54, -1],
        ["\u0907\u090F", 54, -1],
        ["\u0906\u0907\u090F", 56, -1],
        ["\u093E\u0907\u090F", 56, -1],
        ["\u093E\u090F", 54, -1],
        ["\u093F\u090F", 54, -1],
        ["\u0913", -1, -1],
        ["\u0906\u0913", 61, -1],
        ["\u093E\u0913", 61, -1],
        ["\u0915\u0930", -1, -1, r_CONSONANT],
        ["\u0905\u0915\u0930", 64, -1],
        ["\u0906\u0915\u0930", 64, -1],
        ["\u093E\u0915\u0930", 64, -1],
        ["\u093E", -1, -1],
        ["\u090A\u0902\u0917\u093E", 68, -1],
        ["\u0906\u090A\u0902\u0917\u093E", 69, -1],
        ["\u093E\u090A\u0902\u0917\u093E", 69, -1],
        ["\u0942\u0902\u0917\u093E", 68, -1],
        ["\u090F\u0917\u093E", 68, -1],
        ["\u0906\u090F\u0917\u093E", 73, -1],
        ["\u093E\u090F\u0917\u093E", 73, -1],
        ["\u0947\u0917\u093E", 68, -1],
        ["\u0924\u093E", 68, -1, r_CONSONANT],
        ["\u0905\u0924\u093E", 77, -1],
        ["\u0906\u0924\u093E", 77, -1],
        ["\u093E\u0924\u093E", 77, -1],
        ["\u0928\u093E", 68, -1, r_CONSONANT],
        ["\u0905\u0928\u093E", 81, -1],
        ["\u0906\u0928\u093E", 81, -1],
        ["\u093E\u0928\u093E", 81, -1],
        ["\u0906\u092F\u093E", 68, -1],
        ["\u093E\u092F\u093E", 68, -1],
        ["\u093F", -1, -1],
        ["\u0940", -1, -1],
        ["\u090A\u0902\u0917\u0940", 88, -1],
        ["\u0906\u090A\u0902\u0917\u0940", 89, -1],
        ["\u093E\u090A\u0902\u0917\u0940", 89, -1],
        ["\u090F\u0902\u0917\u0940", 88, -1],
        ["\u0906\u090F\u0902\u0917\u0940", 92, -1],
        ["\u093E\u090F\u0902\u0917\u0940", 92, -1],
        ["\u0942\u0902\u0917\u0940", 88, -1],
        ["\u0947\u0902\u0917\u0940", 88, -1],
        ["\u090F\u0917\u0940", 88, -1],
        ["\u0906\u090F\u0917\u0940", 97, -1],
        ["\u093E\u090F\u0917\u0940", 97, -1],
        ["\u0913\u0917\u0940", 88, -1],
        ["\u0906\u0913\u0917\u0940", 100, -1],
        ["\u093E\u0913\u0917\u0940", 100, -1],
        ["\u0947\u0917\u0940", 88, -1],
        ["\u094B\u0917\u0940", 88, -1],
        ["\u0924\u0940", 88, -1, r_CONSONANT],
        ["\u0905\u0924\u0940", 105, -1],
        ["\u0906\u0924\u0940", 105, -1],
        ["\u093E\u0924\u0940", 105, -1],
        ["\u0928\u0940", 88, -1, r_CONSONANT],
        ["\u0905\u0928\u0940", 109, -1],
        ["\u0941", -1, -1],
        ["\u0942", -1, -1],
        ["\u0947", -1, -1],
        ["\u090F\u0902\u0917\u0947", 113, -1],
        ["\u0906\u090F\u0902\u0917\u0947", 114, -1],
        ["\u093E\u090F\u0902\u0917\u0947", 114, -1],
        ["\u0947\u0902\u0917\u0947", 113, -1],
        ["\u0913\u0917\u0947", 113, -1],
        ["\u0906\u0913\u0917\u0947", 118, -1],
        ["\u093E\u0913\u0917\u0947", 118, -1],
        ["\u094B\u0917\u0947", 113, -1],
        ["\u0924\u0947", 113, -1, r_CONSONANT],
        ["\u0905\u0924\u0947", 122, -1],
        ["\u0906\u0924\u0947", 122, -1],
        ["\u093E\u0924\u0947", 122, -1],
        ["\u0928\u0947", 113, -1, r_CONSONANT],
        ["\u0905\u0928\u0947", 126, -1],
        ["\u0906\u0928\u0947", 126, -1],
        ["\u093E\u0928\u0947", 126, -1],
        ["\u094B", -1, -1],
        ["\u094D", -1, -1]
    ];

    /** @const */ var /** Array<int> */ g_consonant = [255, 255, 255, 255, 159, 0, 0, 0, 248, 7];

    var /** number */ I_p = 0;


    /** @return {boolean} */
    function r_CONSONANT() {
        if (!(base.in_grouping_b(g_consonant, 2325, 2399)))
        {
            return false;
        }
        return true;
    };

    this.stem = /** @return {boolean} */ function() {
        var /** number */ v_1 = base.cursor;
        if (base.cursor >= base.limit)
        {
            return false;
        }
        base.cursor++;
        I_p = base.cursor;
        base.cursor = v_1;
        base.limit_backward = base.cursor; base.cursor = base.limit;
        if (base.cursor < I_p)
        {
            return false;
        }
        var /** number */ v_3 = base.limit_backward;
        base.limit_backward = I_p;
        base.ket = base.cursor;
        if (base.find_among_b(a_0) == 0)
        {
            base.limit_backward = v_3;
            return false;
        }
        base.bra = base.cursor;
        base.limit_backward = v_3;
        if (!base.slice_del())
        {
            return false;
        }
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


return new HindiStemmer();
}