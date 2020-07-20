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
GreekStemmer = function() {
    var base = new BaseStemmer();
    /** @const */ var a_0 = [
        ["", -1, 25],
        ["\u0386", 0, 1],
        ["\u0388", 0, 5],
        ["\u0389", 0, 7],
        ["\u038A", 0, 9],
        ["\u038C", 0, 15],
        ["\u038E", 0, 20],
        ["\u038F", 0, 24],
        ["\u0390", 0, 7],
        ["\u0391", 0, 1],
        ["\u0392", 0, 2],
        ["\u0393", 0, 3],
        ["\u0394", 0, 4],
        ["\u0395", 0, 5],
        ["\u0396", 0, 6],
        ["\u0397", 0, 7],
        ["\u0398", 0, 8],
        ["\u0399", 0, 9],
        ["\u039A", 0, 10],
        ["\u039B", 0, 11],
        ["\u039C", 0, 12],
        ["\u039D", 0, 13],
        ["\u039E", 0, 14],
        ["\u039F", 0, 15],
        ["\u03A0", 0, 16],
        ["\u03A1", 0, 17],
        ["\u03A3", 0, 18],
        ["\u03A4", 0, 19],
        ["\u03A5", 0, 20],
        ["\u03A6", 0, 21],
        ["\u03A7", 0, 22],
        ["\u03A8", 0, 23],
        ["\u03A9", 0, 24],
        ["\u03AA", 0, 9],
        ["\u03AB", 0, 20],
        ["\u03AC", 0, 1],
        ["\u03AD", 0, 5],
        ["\u03AE", 0, 7],
        ["\u03AF", 0, 9],
        ["\u03B0", 0, 20],
        ["\u03C2", 0, 18],
        ["\u03CA", 0, 7],
        ["\u03CB", 0, 20],
        ["\u03CC", 0, 15],
        ["\u03CD", 0, 20],
        ["\u03CE", 0, 24]
    ];

    /** @const */ var a_1 = [
        ["\u03C3\u03BA\u03B1\u03B3\u03B9\u03B1", -1, 2],
        ["\u03C6\u03B1\u03B3\u03B9\u03B1", -1, 1],
        ["\u03BF\u03BB\u03BF\u03B3\u03B9\u03B1", -1, 3],
        ["\u03C3\u03BF\u03B3\u03B9\u03B1", -1, 4],
        ["\u03C4\u03B1\u03C4\u03BF\u03B3\u03B9\u03B1", -1, 5],
        ["\u03BA\u03C1\u03B5\u03B1\u03C4\u03B1", -1, 6],
        ["\u03C0\u03B5\u03C1\u03B1\u03C4\u03B1", -1, 7],
        ["\u03C4\u03B5\u03C1\u03B1\u03C4\u03B1", -1, 8],
        ["\u03B3\u03B5\u03B3\u03BF\u03BD\u03BF\u03C4\u03B1", -1, 11],
        ["\u03BA\u03B1\u03B8\u03B5\u03C3\u03C4\u03C9\u03C4\u03B1", -1, 10],
        ["\u03C6\u03C9\u03C4\u03B1", -1, 9],
        ["\u03C0\u03B5\u03C1\u03B1\u03C4\u03B7", -1, 7],
        ["\u03C3\u03BA\u03B1\u03B3\u03B9\u03C9\u03BD", -1, 2],
        ["\u03C6\u03B1\u03B3\u03B9\u03C9\u03BD", -1, 1],
        ["\u03BF\u03BB\u03BF\u03B3\u03B9\u03C9\u03BD", -1, 3],
        ["\u03C3\u03BF\u03B3\u03B9\u03C9\u03BD", -1, 4],
        ["\u03C4\u03B1\u03C4\u03BF\u03B3\u03B9\u03C9\u03BD", -1, 5],
        ["\u03BA\u03C1\u03B5\u03B1\u03C4\u03C9\u03BD", -1, 6],
        ["\u03C0\u03B5\u03C1\u03B1\u03C4\u03C9\u03BD", -1, 7],
        ["\u03C4\u03B5\u03C1\u03B1\u03C4\u03C9\u03BD", -1, 8],
        ["\u03B3\u03B5\u03B3\u03BF\u03BD\u03BF\u03C4\u03C9\u03BD", -1, 11],
        ["\u03BA\u03B1\u03B8\u03B5\u03C3\u03C4\u03C9\u03C4\u03C9\u03BD", -1, 10],
        ["\u03C6\u03C9\u03C4\u03C9\u03BD", -1, 9],
        ["\u03BA\u03C1\u03B5\u03B1\u03C3", -1, 6],
        ["\u03C0\u03B5\u03C1\u03B1\u03C3", -1, 7],
        ["\u03C4\u03B5\u03C1\u03B1\u03C3", -1, 8],
        ["\u03B3\u03B5\u03B3\u03BF\u03BD\u03BF\u03C3", -1, 11],
        ["\u03BA\u03C1\u03B5\u03B1\u03C4\u03BF\u03C3", -1, 6],
        ["\u03C0\u03B5\u03C1\u03B1\u03C4\u03BF\u03C3", -1, 7],
        ["\u03C4\u03B5\u03C1\u03B1\u03C4\u03BF\u03C3", -1, 8],
        ["\u03B3\u03B5\u03B3\u03BF\u03BD\u03BF\u03C4\u03BF\u03C3", -1, 11],
        ["\u03BA\u03B1\u03B8\u03B5\u03C3\u03C4\u03C9\u03C4\u03BF\u03C3", -1, 10],
        ["\u03C6\u03C9\u03C4\u03BF\u03C3", -1, 9],
        ["\u03BA\u03B1\u03B8\u03B5\u03C3\u03C4\u03C9\u03C3", -1, 10],
        ["\u03C6\u03C9\u03C3", -1, 9],
        ["\u03C3\u03BA\u03B1\u03B3\u03B9\u03BF\u03C5", -1, 2],
        ["\u03C6\u03B1\u03B3\u03B9\u03BF\u03C5", -1, 1],
        ["\u03BF\u03BB\u03BF\u03B3\u03B9\u03BF\u03C5", -1, 3],
        ["\u03C3\u03BF\u03B3\u03B9\u03BF\u03C5", -1, 4],
        ["\u03C4\u03B1\u03C4\u03BF\u03B3\u03B9\u03BF\u03C5", -1, 5]
    ];

    /** @const */ var a_2 = [
        ["\u03C0\u03B1", -1, 1],
        ["\u03BE\u03B1\u03BD\u03B1\u03C0\u03B1", 0, 1],
        ["\u03B5\u03C0\u03B1", 0, 1],
        ["\u03C0\u03B5\u03C1\u03B9\u03C0\u03B1", 0, 1],
        ["\u03B1\u03BD\u03B1\u03BC\u03C0\u03B1", 0, 1],
        ["\u03B5\u03BC\u03C0\u03B1", 0, 1],
        ["\u03B4\u03B1\u03BD\u03B5", -1, 1],
        ["\u03B1\u03B8\u03C1\u03BF", -1, 1],
        ["\u03C3\u03C5\u03BD\u03B1\u03B8\u03C1\u03BF", 7, 1]
    ];

    /** @const */ var a_3 = [
        ["\u03B2", -1, 1],
        ["\u03B2\u03B1\u03B8\u03C5\u03C1\u03B9", -1, 1],
        ["\u03B2\u03B1\u03C1\u03BA", -1, 1],
        ["\u03BC\u03B1\u03C1\u03BA", -1, 1],
        ["\u03BB", -1, 1],
        ["\u03BC", -1, 1],
        ["\u03BA\u03BF\u03C1\u03BD", -1, 1],
        ["\u03C0", -1, 1],
        ["\u03B9\u03BC\u03C0", 7, 1],
        ["\u03C1", -1, 1],
        ["\u03BC\u03B1\u03C1", 9, 1],
        ["\u03B1\u03BC\u03C0\u03B1\u03C1", 9, 1],
        ["\u03B3\u03BA\u03C1", 9, 1],
        ["\u03B2\u03BF\u03BB\u03B2\u03BF\u03C1", 9, 1],
        ["\u03B3\u03BB\u03C5\u03BA\u03BF\u03C1", 9, 1],
        ["\u03C0\u03B9\u03C0\u03B5\u03C1\u03BF\u03C1", 9, 1],
        ["\u03C0\u03C1", 9, 1],
        ["\u03BC\u03C0\u03C1", 16, 1],
        ["\u03B1\u03C1\u03C1", 9, 1],
        ["\u03B3\u03BB\u03C5\u03BA\u03C5\u03C1", 9, 1],
        ["\u03C0\u03BF\u03BB\u03C5\u03C1", 9, 1],
        ["\u03BB\u03BF\u03C5", -1, 1]
    ];

    /** @const */ var a_4 = [
        ["\u03B9\u03B6\u03B1", -1, 1],
        ["\u03B9\u03B6\u03B5", -1, 1],
        ["\u03B9\u03B6\u03B1\u03BC\u03B5", -1, 1],
        ["\u03B9\u03B6\u03BF\u03C5\u03BC\u03B5", -1, 1],
        ["\u03B9\u03B6\u03B1\u03BD\u03B5", -1, 1],
        ["\u03B9\u03B6\u03BF\u03C5\u03BD\u03B5", -1, 1],
        ["\u03B9\u03B6\u03B1\u03C4\u03B5", -1, 1],
        ["\u03B9\u03B6\u03B5\u03C4\u03B5", -1, 1],
        ["\u03B9\u03B6\u03B5\u03B9", -1, 1],
        ["\u03B9\u03B6\u03B1\u03BD", -1, 1],
        ["\u03B9\u03B6\u03BF\u03C5\u03BD", -1, 1],
        ["\u03B9\u03B6\u03B5\u03C3", -1, 1],
        ["\u03B9\u03B6\u03B5\u03B9\u03C3", -1, 1],
        ["\u03B9\u03B6\u03C9", -1, 1]
    ];

    /** @const */ var a_5 = [
        ["\u03B2\u03B9", -1, 1],
        ["\u03BB\u03B9", -1, 1],
        ["\u03B1\u03BB", -1, 1],
        ["\u03B5\u03BD", -1, 1],
        ["\u03C3", -1, 1],
        ["\u03C7", -1, 1],
        ["\u03C5\u03C8", -1, 1],
        ["\u03B6\u03C9", -1, 1]
    ];

    /** @const */ var a_6 = [
        ["\u03C9\u03B8\u03B7\u03BA\u03B1", -1, 1],
        ["\u03C9\u03B8\u03B7\u03BA\u03B5", -1, 1],
        ["\u03C9\u03B8\u03B7\u03BA\u03B1\u03BC\u03B5", -1, 1],
        ["\u03C9\u03B8\u03B7\u03BA\u03B1\u03BD\u03B5", -1, 1],
        ["\u03C9\u03B8\u03B7\u03BA\u03B1\u03C4\u03B5", -1, 1],
        ["\u03C9\u03B8\u03B7\u03BA\u03B1\u03BD", -1, 1],
        ["\u03C9\u03B8\u03B7\u03BA\u03B5\u03C3", -1, 1]
    ];

    /** @const */ var a_7 = [
        ["\u03BE\u03B1\u03BD\u03B1\u03C0\u03B1", -1, 1],
        ["\u03B5\u03C0\u03B1", -1, 1],
        ["\u03C0\u03B5\u03C1\u03B9\u03C0\u03B1", -1, 1],
        ["\u03B1\u03BD\u03B1\u03BC\u03C0\u03B1", -1, 1],
        ["\u03B5\u03BC\u03C0\u03B1", -1, 1],
        ["\u03C7\u03B1\u03C1\u03C4\u03BF\u03C0\u03B1", -1, 1],
        ["\u03B5\u03BE\u03B1\u03C1\u03C7\u03B1", -1, 1],
        ["\u03BA\u03BB\u03B5", -1, 1],
        ["\u03B5\u03BA\u03BB\u03B5", 7, 1],
        ["\u03B1\u03C0\u03B5\u03BA\u03BB\u03B5", 8, 1],
        ["\u03B1\u03C0\u03BF\u03BA\u03BB\u03B5", 7, 1],
        ["\u03B5\u03C3\u03C9\u03BA\u03BB\u03B5", 7, 1],
        ["\u03B4\u03B1\u03BD\u03B5", -1, 1],
        ["\u03C0\u03B5", -1, 1],
        ["\u03B5\u03C0\u03B5", 13, 1],
        ["\u03BC\u03B5\u03C4\u03B5\u03C0\u03B5", 14, 1],
        ["\u03B5\u03C3\u03B5", -1, 1],
        ["\u03B1\u03B8\u03C1\u03BF", -1, 1],
        ["\u03C3\u03C5\u03BD\u03B1\u03B8\u03C1\u03BF", 17, 1]
    ];

    /** @const */ var a_8 = [
        ["\u03B3\u03B5", -1, 1],
        ["\u03B3\u03BA\u03B5", -1, 1],
        ["\u03B3\u03BA", -1, 1],
        ["\u03BC", -1, 1],
        ["\u03C0\u03BF\u03C5\u03BA\u03B1\u03BC", 3, 1],
        ["\u03BA\u03BF\u03BC", 3, 1],
        ["\u03B1\u03BD", -1, 1],
        ["\u03BF\u03BB\u03BF", -1, 1],
        ["\u03C0", -1, 1],
        ["\u03BB\u03B1\u03C1", -1, 1],
        ["\u03B4\u03B7\u03BC\u03BF\u03BA\u03C1\u03B1\u03C4", -1, 1],
        ["\u03B1\u03C6", -1, 1],
        ["\u03B3\u03B9\u03B3\u03B1\u03BD\u03C4\u03BF\u03B1\u03C6", 11, 1]
    ];

    /** @const */ var a_9 = [
        ["\u03B9\u03C3\u03B1", -1, 1],
        ["\u03B9\u03C3\u03B1\u03BC\u03B5", -1, 1],
        ["\u03B9\u03C3\u03B1\u03BD\u03B5", -1, 1],
        ["\u03B9\u03C3\u03B5", -1, 1],
        ["\u03B9\u03C3\u03B1\u03C4\u03B5", -1, 1],
        ["\u03B9\u03C3\u03B1\u03BD", -1, 1],
        ["\u03B9\u03C3\u03B5\u03C3", -1, 1]
    ];

    /** @const */ var a_10 = [
        ["\u03BE\u03B1\u03BD\u03B1\u03C0\u03B1", -1, 1],
        ["\u03B5\u03C0\u03B1", -1, 1],
        ["\u03C0\u03B5\u03C1\u03B9\u03C0\u03B1", -1, 1],
        ["\u03B1\u03BD\u03B1\u03BC\u03C0\u03B1", -1, 1],
        ["\u03B5\u03BC\u03C0\u03B1", -1, 1],
        ["\u03C7\u03B1\u03C1\u03C4\u03BF\u03C0\u03B1", -1, 1],
        ["\u03B5\u03BE\u03B1\u03C1\u03C7\u03B1", -1, 1],
        ["\u03BA\u03BB\u03B5", -1, 1],
        ["\u03B5\u03BA\u03BB\u03B5", 7, 1],
        ["\u03B1\u03C0\u03B5\u03BA\u03BB\u03B5", 8, 1],
        ["\u03B1\u03C0\u03BF\u03BA\u03BB\u03B5", 7, 1],
        ["\u03B5\u03C3\u03C9\u03BA\u03BB\u03B5", 7, 1],
        ["\u03B4\u03B1\u03BD\u03B5", -1, 1],
        ["\u03C0\u03B5", -1, 1],
        ["\u03B5\u03C0\u03B5", 13, 1],
        ["\u03BC\u03B5\u03C4\u03B5\u03C0\u03B5", 14, 1],
        ["\u03B5\u03C3\u03B5", -1, 1],
        ["\u03B1\u03B8\u03C1\u03BF", -1, 1],
        ["\u03C3\u03C5\u03BD\u03B1\u03B8\u03C1\u03BF", 17, 1]
    ];

    /** @const */ var a_11 = [
        ["\u03B9\u03C3\u03BF\u03C5\u03BC\u03B5", -1, 1],
        ["\u03B9\u03C3\u03BF\u03C5\u03BD\u03B5", -1, 1],
        ["\u03B9\u03C3\u03B5\u03C4\u03B5", -1, 1],
        ["\u03B9\u03C3\u03B5\u03B9", -1, 1],
        ["\u03B9\u03C3\u03BF\u03C5\u03BD", -1, 1],
        ["\u03B9\u03C3\u03B5\u03B9\u03C3", -1, 1],
        ["\u03B9\u03C3\u03C9", -1, 1]
    ];

    /** @const */ var a_12 = [
        ["\u03BA\u03BB\u03B5", -1, 1],
        ["\u03B5\u03C3\u03C9\u03BA\u03BB\u03B5", 0, 1],
        ["\u03C0\u03BB\u03B5", -1, 1],
        ["\u03B4\u03B1\u03BD\u03B5", -1, 1],
        ["\u03C3\u03B5", -1, 1],
        ["\u03B1\u03C3\u03B5", 4, 1],
        ["\u03C3\u03C5\u03BD\u03B1\u03B8\u03C1\u03BF", -1, 1]
    ];

    /** @const */ var a_13 = [
        ["\u03B1\u03C4\u03B1", -1, 1],
        ["\u03C6\u03B1", -1, 1],
        ["\u03B7\u03C6\u03B1", 1, 1],
        ["\u03BC\u03B5\u03B3", -1, 1],
        ["\u03BB\u03C5\u03B3", -1, 1],
        ["\u03B7\u03B4", -1, 1],
        ["\u03BA\u03B1\u03B8", -1, 1],
        ["\u03B5\u03C7\u03B8", -1, 1],
        ["\u03BA\u03B1\u03BA", -1, 1],
        ["\u03BC\u03B1\u03BA", -1, 1],
        ["\u03C3\u03BA", -1, 1],
        ["\u03C6\u03B9\u03BB", -1, 1],
        ["\u03BA\u03C5\u03BB", -1, 1],
        ["\u03BC", -1, 1],
        ["\u03B3\u03B5\u03BC", 13, 1],
        ["\u03B1\u03C7\u03BD", -1, 1],
        ["\u03C0", -1, 1],
        ["\u03B1\u03C0", 16, 1],
        ["\u03B5\u03BC\u03C0", 16, 1],
        ["\u03B5\u03C5\u03C0", 16, 1],
        ["\u03B1\u03C1", -1, 1],
        ["\u03B1\u03BF\u03C1", -1, 1],
        ["\u03B3\u03C5\u03C1", -1, 1],
        ["\u03C7\u03C1", -1, 1],
        ["\u03C7\u03C9\u03C1", -1, 1],
        ["\u03BA\u03C4", -1, 1],
        ["\u03B1\u03BA\u03C4", 25, 1],
        ["\u03C7\u03C4", -1, 1],
        ["\u03B1\u03C7\u03C4", 27, 1],
        ["\u03C4\u03B1\u03C7", -1, 1],
        ["\u03C3\u03C7", -1, 1],
        ["\u03B1\u03C3\u03C7", 30, 1],
        ["\u03C5\u03C8", -1, 1]
    ];

    /** @const */ var a_14 = [
        ["\u03B9\u03C3\u03C4\u03B1", -1, 1],
        ["\u03B9\u03C3\u03C4\u03B5", -1, 1],
        ["\u03B9\u03C3\u03C4\u03B7", -1, 1],
        ["\u03B9\u03C3\u03C4\u03BF\u03B9", -1, 1],
        ["\u03B9\u03C3\u03C4\u03C9\u03BD", -1, 1],
        ["\u03B9\u03C3\u03C4\u03BF", -1, 1],
        ["\u03B9\u03C3\u03C4\u03B5\u03C3", -1, 1],
        ["\u03B9\u03C3\u03C4\u03B7\u03C3", -1, 1],
        ["\u03B9\u03C3\u03C4\u03BF\u03C3", -1, 1],
        ["\u03B9\u03C3\u03C4\u03BF\u03C5\u03C3", -1, 1],
        ["\u03B9\u03C3\u03C4\u03BF\u03C5", -1, 1]
    ];

    /** @const */ var a_15 = [
        ["\u03B5\u03B3\u03BA\u03BB\u03B5", -1, 1],
        ["\u03B1\u03C0\u03BF\u03BA\u03BB\u03B5", -1, 1],
        ["\u03C3\u03B5", -1, 1],
        ["\u03BC\u03B5\u03C4\u03B1\u03C3\u03B5", 2, 1],
        ["\u03BC\u03B9\u03BA\u03C1\u03BF\u03C3\u03B5", 2, 1]
    ];

    /** @const */ var a_16 = [
        ["\u03B4\u03B1\u03BD\u03B5", -1, 1],
        ["\u03B1\u03BD\u03C4\u03B9\u03B4\u03B1\u03BD\u03B5", 0, 1]
    ];

    /** @const */ var a_17 = [
        ["\u03B1\u03C4\u03BF\u03BC\u03B9\u03BA", -1, 2],
        ["\u03B5\u03B8\u03BD\u03B9\u03BA", -1, 4],
        ["\u03C4\u03BF\u03C0\u03B9\u03BA", -1, 7],
        ["\u03B5\u03BA\u03BB\u03B5\u03BA\u03C4\u03B9\u03BA", -1, 5],
        ["\u03C3\u03BA\u03B5\u03C0\u03C4\u03B9\u03BA", -1, 6],
        ["\u03B3\u03BD\u03C9\u03C3\u03C4\u03B9\u03BA", -1, 3],
        ["\u03B1\u03B3\u03BD\u03C9\u03C3\u03C4\u03B9\u03BA", 5, 1],
        ["\u03B1\u03BB\u03B5\u03BE\u03B1\u03BD\u03B4\u03C1\u03B9\u03BD", -1, 8],
        ["\u03B8\u03B5\u03B1\u03C4\u03C1\u03B9\u03BD", -1, 10],
        ["\u03B2\u03C5\u03B6\u03B1\u03BD\u03C4\u03B9\u03BD", -1, 9]
    ];

    /** @const */ var a_18 = [
        ["\u03B9\u03C3\u03BC\u03BF\u03B9", -1, 1],
        ["\u03B9\u03C3\u03BC\u03C9\u03BD", -1, 1],
        ["\u03B9\u03C3\u03BC\u03BF", -1, 1],
        ["\u03B9\u03C3\u03BC\u03BF\u03C3", -1, 1],
        ["\u03B9\u03C3\u03BC\u03BF\u03C5\u03C3", -1, 1],
        ["\u03B9\u03C3\u03BC\u03BF\u03C5", -1, 1]
    ];

    /** @const */ var a_19 = [
        ["\u03C3", -1, 1],
        ["\u03C7", -1, 1]
    ];

    /** @const */ var a_20 = [
        ["\u03BF\u03C5\u03B4\u03B1\u03BA\u03B9\u03B1", -1, 1],
        ["\u03B1\u03C1\u03B1\u03BA\u03B9\u03B1", -1, 1],
        ["\u03BF\u03C5\u03B4\u03B1\u03BA\u03B9", -1, 1],
        ["\u03B1\u03C1\u03B1\u03BA\u03B9", -1, 1]
    ];

    /** @const */ var a_21 = [
        ["\u03B2\u03B1\u03BC\u03B2", -1, 1],
        ["\u03C3\u03BB\u03BF\u03B2", -1, 1],
        ["\u03C4\u03C3\u03B5\u03C7\u03BF\u03C3\u03BB\u03BF\u03B2", 1, 1],
        ["\u03C4\u03B6", -1, 1],
        ["\u03BA", -1, 1],
        ["\u03BA\u03B1\u03C0\u03B1\u03BA", 4, 1],
        ["\u03C3\u03BF\u03BA", 4, 1],
        ["\u03C3\u03BA", 4, 1],
        ["\u03BC\u03B1\u03BB", -1, 1],
        ["\u03C0\u03BB", -1, 1],
        ["\u03BB\u03BF\u03C5\u03BB", -1, 1],
        ["\u03C6\u03C5\u03BB", -1, 1],
        ["\u03BA\u03B1\u03B9\u03BC", -1, 1],
        ["\u03BA\u03BB\u03B9\u03BC", -1, 1],
        ["\u03C6\u03B1\u03C1\u03BC", -1, 1],
        ["\u03C3\u03C0\u03B1\u03BD", -1, 1],
        ["\u03BA\u03BF\u03BD", -1, 1],
        ["\u03BA\u03B1\u03C4\u03C1\u03B1\u03C0", -1, 1],
        ["\u03C1", -1, 1],
        ["\u03B2\u03C1", 18, 1],
        ["\u03BB\u03B1\u03B2\u03C1", 19, 1],
        ["\u03B1\u03BC\u03B2\u03C1", 19, 1],
        ["\u03BC\u03B5\u03C1", 18, 1],
        ["\u03B1\u03BD\u03B8\u03C1", 18, 1],
        ["\u03BA\u03BF\u03C1", 18, 1],
        ["\u03C3", -1, 1],
        ["\u03BD\u03B1\u03B3\u03BA\u03B1\u03C3", 25, 1],
        ["\u03BC\u03BF\u03C5\u03C3\u03C4", -1, 1],
        ["\u03C1\u03C5", -1, 1],
        ["\u03C6", -1, 1],
        ["\u03C3\u03C6", 29, 1],
        ["\u03B1\u03BB\u03B9\u03C3\u03C6", 30, 1],
        ["\u03C7", -1, 1]
    ];

    /** @const */ var a_22 = [
        ["\u03B2", -1, 1],
        ["\u03BA\u03B1\u03C1\u03B4", -1, 1],
        ["\u03B6", -1, 1],
        ["\u03C3\u03BA", -1, 1],
        ["\u03B2\u03B1\u03BB", -1, 1],
        ["\u03B3\u03BB", -1, 1],
        ["\u03C4\u03C1\u03B9\u03C0\u03BF\u03BB", -1, 1],
        ["\u03B3\u03B9\u03B1\u03BD", -1, 1],
        ["\u03B7\u03B3\u03BF\u03C5\u03BC\u03B5\u03BD", -1, 1],
        ["\u03BA\u03BF\u03BD", -1, 1],
        ["\u03BC\u03B1\u03BA\u03C1\u03C5\u03BD", -1, 1],
        ["\u03C0", -1, 1],
        ["\u03C0\u03B1\u03C4\u03B5\u03C1", -1, 1],
        ["\u03C4\u03BF\u03C3", -1, 1],
        ["\u03BD\u03C5\u03C6", -1, 1]
    ];

    /** @const */ var a_23 = [
        ["\u03B1\u03BA\u03B9\u03B1", -1, 1],
        ["\u03B1\u03C1\u03B1\u03BA\u03B9\u03B1", 0, 1],
        ["\u03B9\u03C4\u03C3\u03B1", -1, 1],
        ["\u03B1\u03BA\u03B9", -1, 1],
        ["\u03B1\u03C1\u03B1\u03BA\u03B9", 3, 1],
        ["\u03B9\u03C4\u03C3\u03C9\u03BD", -1, 1],
        ["\u03B9\u03C4\u03C3\u03B1\u03C3", -1, 1],
        ["\u03B9\u03C4\u03C3\u03B5\u03C3", -1, 1]
    ];

    /** @const */ var a_24 = [
        ["\u03C8\u03B1\u03BB", -1, 1],
        ["\u03B1\u03B9\u03C6\u03BD", -1, 1],
        ["\u03BF\u03BB\u03BF", -1, 1],
        ["\u03B9\u03C1", -1, 1]
    ];

    /** @const */ var a_25 = [
        ["\u03B5", -1, 1],
        ["\u03C0\u03B1\u03B9\u03C7\u03BD", -1, 1]
    ];

    /** @const */ var a_26 = [
        ["\u03B9\u03B4\u03B9\u03B1", -1, 1],
        ["\u03B9\u03B4\u03B9\u03C9\u03BD", -1, 1],
        ["\u03B9\u03B4\u03B9\u03BF", -1, 1]
    ];

    /** @const */ var a_27 = [
        ["\u03B9\u03B2", -1, 1],
        ["\u03B4", -1, 1],
        ["\u03C6\u03C1\u03B1\u03B3\u03BA", -1, 1],
        ["\u03BB\u03C5\u03BA", -1, 1],
        ["\u03BF\u03B2\u03B5\u03BB", -1, 1],
        ["\u03BC\u03B7\u03BD", -1, 1],
        ["\u03C1", -1, 1]
    ];

    /** @const */ var a_28 = [
        ["\u03B9\u03C3\u03BA\u03B5", -1, 1],
        ["\u03B9\u03C3\u03BA\u03BF", -1, 1],
        ["\u03B9\u03C3\u03BA\u03BF\u03C3", -1, 1],
        ["\u03B9\u03C3\u03BA\u03BF\u03C5", -1, 1]
    ];

    /** @const */ var a_29 = [
        ["\u03B1\u03B4\u03C9\u03BD", -1, 1],
        ["\u03B1\u03B4\u03B5\u03C3", -1, 1]
    ];

    /** @const */ var a_30 = [
        ["\u03B3\u03B9\u03B1\u03B3\u03B9", -1, -1],
        ["\u03B8\u03B5\u03B9", -1, -1],
        ["\u03BF\u03BA", -1, -1],
        ["\u03BC\u03B1\u03BC", -1, -1],
        ["\u03BC\u03B1\u03BD", -1, -1],
        ["\u03BC\u03C0\u03B1\u03BC\u03C0", -1, -1],
        ["\u03C0\u03B5\u03B8\u03B5\u03C1", -1, -1],
        ["\u03C0\u03B1\u03C4\u03B5\u03C1", -1, -1],
        ["\u03BA\u03C5\u03C1", -1, -1],
        ["\u03BD\u03C4\u03B1\u03BD\u03C4", -1, -1]
    ];

    /** @const */ var a_31 = [
        ["\u03B5\u03B4\u03C9\u03BD", -1, 1],
        ["\u03B5\u03B4\u03B5\u03C3", -1, 1]
    ];

    /** @const */ var a_32 = [
        ["\u03BC\u03B9\u03BB", -1, 1],
        ["\u03B4\u03B1\u03C0", -1, 1],
        ["\u03B3\u03B7\u03C0", -1, 1],
        ["\u03B9\u03C0", -1, 1],
        ["\u03B5\u03BC\u03C0", -1, 1],
        ["\u03BF\u03C0", -1, 1],
        ["\u03BA\u03C1\u03B1\u03C3\u03C0", -1, 1],
        ["\u03C5\u03C0", -1, 1]
    ];

    /** @const */ var a_33 = [
        ["\u03BF\u03C5\u03B4\u03C9\u03BD", -1, 1],
        ["\u03BF\u03C5\u03B4\u03B5\u03C3", -1, 1]
    ];

    /** @const */ var a_34 = [
        ["\u03C4\u03C1\u03B1\u03B3", -1, 1],
        ["\u03C6\u03B5", -1, 1],
        ["\u03BA\u03B1\u03BB\u03B9\u03B1\u03BA", -1, 1],
        ["\u03B1\u03C1\u03BA", -1, 1],
        ["\u03C3\u03BA", -1, 1],
        ["\u03C0\u03B5\u03C4\u03B1\u03BB", -1, 1],
        ["\u03B2\u03B5\u03BB", -1, 1],
        ["\u03BB\u03BF\u03C5\u03BB", -1, 1],
        ["\u03C6\u03BB", -1, 1],
        ["\u03C7\u03BD", -1, 1],
        ["\u03C0\u03BB\u03B5\u03BE", -1, 1],
        ["\u03C3\u03C0", -1, 1],
        ["\u03C6\u03C1", -1, 1],
        ["\u03C3", -1, 1],
        ["\u03BB\u03B9\u03C7", -1, 1]
    ];

    /** @const */ var a_35 = [
        ["\u03B5\u03C9\u03BD", -1, 1],
        ["\u03B5\u03C9\u03C3", -1, 1]
    ];

    /** @const */ var a_36 = [
        ["\u03B4", -1, 1],
        ["\u03B9\u03B4", 0, 1],
        ["\u03B8", -1, 1],
        ["\u03B3\u03B1\u03BB", -1, 1],
        ["\u03B5\u03BB", -1, 1],
        ["\u03BD", -1, 1],
        ["\u03C0", -1, 1],
        ["\u03C0\u03B1\u03C1", -1, 1]
    ];

    /** @const */ var a_37 = [
        ["\u03B9\u03B1", -1, 1],
        ["\u03B9\u03C9\u03BD", -1, 1],
        ["\u03B9\u03BF\u03C5", -1, 1]
    ];

    /** @const */ var a_38 = [
        ["\u03B9\u03BA\u03B1", -1, 1],
        ["\u03B9\u03BA\u03C9\u03BD", -1, 1],
        ["\u03B9\u03BA\u03BF", -1, 1],
        ["\u03B9\u03BA\u03BF\u03C5", -1, 1]
    ];

    /** @const */ var a_39 = [
        ["\u03B1\u03B4", -1, 1],
        ["\u03C3\u03C5\u03BD\u03B1\u03B4", 0, 1],
        ["\u03BA\u03B1\u03C4\u03B1\u03B4", 0, 1],
        ["\u03B1\u03BD\u03C4\u03B9\u03B4", -1, 1],
        ["\u03B5\u03BD\u03B4", -1, 1],
        ["\u03C6\u03C5\u03BB\u03BF\u03B4", -1, 1],
        ["\u03C5\u03C0\u03BF\u03B4", -1, 1],
        ["\u03C0\u03C1\u03C9\u03C4\u03BF\u03B4", -1, 1],
        ["\u03B5\u03BE\u03C9\u03B4", -1, 1],
        ["\u03B7\u03B8", -1, 1],
        ["\u03B1\u03BD\u03B7\u03B8", 9, 1],
        ["\u03BE\u03B9\u03BA", -1, 1],
        ["\u03B1\u03BB", -1, 1],
        ["\u03B1\u03BC\u03BC\u03BF\u03C7\u03B1\u03BB", 12, 1],
        ["\u03C3\u03C5\u03BD\u03BF\u03BC\u03B7\u03BB", -1, 1],
        ["\u03BC\u03C0\u03BF\u03BB", -1, 1],
        ["\u03BC\u03BF\u03C5\u03BB", -1, 1],
        ["\u03C4\u03C3\u03B1\u03BC", -1, 1],
        ["\u03B2\u03C1\u03C9\u03BC", -1, 1],
        ["\u03B1\u03BC\u03B1\u03BD", -1, 1],
        ["\u03BC\u03C0\u03B1\u03BD", -1, 1],
        ["\u03BA\u03B1\u03BB\u03BB\u03B9\u03BD", -1, 1],
        ["\u03C0\u03BF\u03C3\u03C4\u03B5\u03BB\u03BD", -1, 1],
        ["\u03C6\u03B9\u03BB\u03BF\u03BD", -1, 1],
        ["\u03BA\u03B1\u03BB\u03C0", -1, 1],
        ["\u03B3\u03B5\u03C1", -1, 1],
        ["\u03C7\u03B1\u03C3", -1, 1],
        ["\u03BC\u03C0\u03BF\u03C3", -1, 1],
        ["\u03C0\u03BB\u03B9\u03B1\u03C4\u03C3", -1, 1],
        ["\u03C0\u03B5\u03C4\u03C3", -1, 1],
        ["\u03C0\u03B9\u03C4\u03C3", -1, 1],
        ["\u03C6\u03C5\u03C3", -1, 1],
        ["\u03BC\u03C0\u03B1\u03B3\u03B9\u03B1\u03C4", -1, 1],
        ["\u03BD\u03B9\u03C4", -1, 1],
        ["\u03C0\u03B9\u03BA\u03B1\u03BD\u03C4", -1, 1],
        ["\u03C3\u03B5\u03C1\u03C4", -1, 1]
    ];

    /** @const */ var a_40 = [
        ["\u03B1\u03B3\u03B1\u03BC\u03B5", -1, 1],
        ["\u03B7\u03BA\u03B1\u03BC\u03B5", -1, 1],
        ["\u03B7\u03B8\u03B7\u03BA\u03B1\u03BC\u03B5", 1, 1],
        ["\u03B7\u03C3\u03B1\u03BC\u03B5", -1, 1],
        ["\u03BF\u03C5\u03C3\u03B1\u03BC\u03B5", -1, 1]
    ];

    /** @const */ var a_41 = [
        ["\u03B2\u03BF\u03C5\u03B2", -1, 1],
        ["\u03BE\u03B5\u03B8", -1, 1],
        ["\u03C0\u03B5\u03B8", -1, 1],
        ["\u03B1\u03C0\u03BF\u03B8", -1, 1],
        ["\u03B1\u03C0\u03BF\u03BA", -1, 1],
        ["\u03BF\u03C5\u03BB", -1, 1],
        ["\u03B1\u03BD\u03B1\u03C0", -1, 1],
        ["\u03C0\u03B9\u03BA\u03C1", -1, 1],
        ["\u03C0\u03BF\u03C4", -1, 1],
        ["\u03B1\u03C0\u03BF\u03C3\u03C4", -1, 1],
        ["\u03C7", -1, 1],
        ["\u03C3\u03B9\u03C7", 10, 1]
    ];

    /** @const */ var a_42 = [
        ["\u03C4\u03C1", -1, 1],
        ["\u03C4\u03C3", -1, 1]
    ];

    /** @const */ var a_43 = [
        ["\u03B1\u03B3\u03B1\u03BD\u03B5", -1, 1],
        ["\u03B7\u03BA\u03B1\u03BD\u03B5", -1, 1],
        ["\u03B7\u03B8\u03B7\u03BA\u03B1\u03BD\u03B5", 1, 1],
        ["\u03B7\u03C3\u03B1\u03BD\u03B5", -1, 1],
        ["\u03BF\u03C5\u03C3\u03B1\u03BD\u03B5", -1, 1],
        ["\u03BF\u03BD\u03C4\u03B1\u03BD\u03B5", -1, 1],
        ["\u03B9\u03BF\u03BD\u03C4\u03B1\u03BD\u03B5", 5, 1],
        ["\u03BF\u03C5\u03BD\u03C4\u03B1\u03BD\u03B5", -1, 1],
        ["\u03B9\u03BF\u03C5\u03BD\u03C4\u03B1\u03BD\u03B5", 7, 1],
        ["\u03BF\u03C4\u03B1\u03BD\u03B5", -1, 1],
        ["\u03B9\u03BF\u03C4\u03B1\u03BD\u03B5", 9, 1]
    ];

    /** @const */ var a_44 = [
        ["\u03C4\u03B1\u03B2", -1, 1],
        ["\u03BD\u03C4\u03B1\u03B2", 0, 1],
        ["\u03C8\u03B7\u03BB\u03BF\u03C4\u03B1\u03B2", 0, 1],
        ["\u03BB\u03B9\u03B2", -1, 1],
        ["\u03BA\u03BB\u03B9\u03B2", 3, 1],
        ["\u03BE\u03B7\u03C1\u03BF\u03BA\u03BB\u03B9\u03B2", 4, 1],
        ["\u03B3", -1, 1],
        ["\u03B1\u03B3", 6, 1],
        ["\u03C4\u03C1\u03B1\u03B3", 7, 1],
        ["\u03C4\u03C3\u03B1\u03B3", 7, 1],
        ["\u03B1\u03B8\u03B9\u03B3\u03B3", 6, 1],
        ["\u03C4\u03C3\u03B9\u03B3\u03B3", 6, 1],
        ["\u03B1\u03C4\u03C3\u03B9\u03B3\u03B3", 11, 1],
        ["\u03C3\u03C4\u03B5\u03B3", 6, 1],
        ["\u03B1\u03C0\u03B7\u03B3", 6, 1],
        ["\u03C3\u03B9\u03B3", 6, 1],
        ["\u03B1\u03BD\u03BF\u03C1\u03B3", 6, 1],
        ["\u03B5\u03BD\u03BF\u03C1\u03B3", 6, 1],
        ["\u03BA\u03B1\u03BB\u03C0\u03BF\u03C5\u03B6", -1, 1],
        ["\u03B8", -1, 1],
        ["\u03BC\u03C9\u03B1\u03BC\u03B5\u03B8", 19, 1],
        ["\u03C0\u03B9\u03B8", 19, 1],
        ["\u03B1\u03C0\u03B9\u03B8", 21, 1],
        ["\u03B4\u03B5\u03BA", -1, 1],
        ["\u03C0\u03B5\u03BB\u03B5\u03BA", -1, 1],
        ["\u03B9\u03BA", -1, 1],
        ["\u03B1\u03BD\u03B9\u03BA", 25, 1],
        ["\u03B2\u03BF\u03C5\u03BB\u03BA", -1, 1],
        ["\u03B2\u03B1\u03C3\u03BA", -1, 1],
        ["\u03B2\u03C1\u03B1\u03C7\u03C5\u03BA", -1, 1],
        ["\u03B3\u03B1\u03BB", -1, 1],
        ["\u03BA\u03B1\u03C4\u03B1\u03B3\u03B1\u03BB", 30, 1],
        ["\u03BF\u03BB\u03BF\u03B3\u03B1\u03BB", 30, 1],
        ["\u03B2\u03B1\u03B8\u03C5\u03B3\u03B1\u03BB", 30, 1],
        ["\u03BC\u03B5\u03BB", -1, 1],
        ["\u03BA\u03B1\u03C3\u03C4\u03B5\u03BB", -1, 1],
        ["\u03C0\u03BF\u03C1\u03C4\u03BF\u03BB", -1, 1],
        ["\u03C0\u03BB", -1, 1],
        ["\u03B4\u03B9\u03C0\u03BB", 37, 1],
        ["\u03BB\u03B1\u03BF\u03C0\u03BB", 37, 1],
        ["\u03C8\u03C5\u03C7\u03BF\u03C0\u03BB", 37, 1],
        ["\u03BF\u03C5\u03BB", -1, 1],
        ["\u03BC", -1, 1],
        ["\u03BF\u03BB\u03B9\u03B3\u03BF\u03B4\u03B1\u03BC", 42, 1],
        ["\u03BC\u03BF\u03C5\u03C3\u03BF\u03C5\u03BB\u03BC", 42, 1],
        ["\u03B4\u03C1\u03B1\u03B4\u03BF\u03C5\u03BC", 42, 1],
        ["\u03B2\u03C1\u03B1\u03C7\u03BC", 42, 1],
        ["\u03BD", -1, 1],
        ["\u03B1\u03BC\u03B5\u03C1\u03B9\u03BA\u03B1\u03BD", 47, 1],
        ["\u03C0", -1, 1],
        ["\u03B1\u03B4\u03B1\u03C0", 49, 1],
        ["\u03C7\u03B1\u03BC\u03B7\u03BB\u03BF\u03B4\u03B1\u03C0", 49, 1],
        ["\u03C0\u03BF\u03BB\u03C5\u03B4\u03B1\u03C0", 49, 1],
        ["\u03BA\u03BF\u03C0", 49, 1],
        ["\u03C5\u03C0\u03BF\u03BA\u03BF\u03C0", 53, 1],
        ["\u03C4\u03C3\u03BF\u03C0", 49, 1],
        ["\u03C3\u03C0", 49, 1],
        ["\u03B5\u03C1", -1, 1],
        ["\u03B3\u03B5\u03C1", 57, 1],
        ["\u03B2\u03B5\u03C4\u03B5\u03C1", 57, 1],
        ["\u03BB\u03BF\u03C5\u03B8\u03B7\u03C1", -1, 1],
        ["\u03BA\u03BF\u03C1\u03BC\u03BF\u03C1", -1, 1],
        ["\u03C0\u03B5\u03C1\u03B9\u03C4\u03C1", -1, 1],
        ["\u03BF\u03C5\u03C1", -1, 1],
        ["\u03C3", -1, 1],
        ["\u03B2\u03B1\u03C3", 64, 1],
        ["\u03C0\u03BF\u03BB\u03B9\u03C3", 64, 1],
        ["\u03C3\u03B1\u03C1\u03B1\u03BA\u03B1\u03C4\u03C3", 64, 1],
        ["\u03B8\u03C5\u03C3", 64, 1],
        ["\u03B4\u03B9\u03B1\u03C4", -1, 1],
        ["\u03C0\u03BB\u03B1\u03C4", -1, 1],
        ["\u03C4\u03C3\u03B1\u03C1\u03BB\u03B1\u03C4", -1, 1],
        ["\u03C4\u03B5\u03C4", -1, 1],
        ["\u03C0\u03BF\u03C5\u03C1\u03B9\u03C4", -1, 1],
        ["\u03C3\u03BF\u03C5\u03BB\u03C4", -1, 1],
        ["\u03BC\u03B1\u03B9\u03BD\u03C4", -1, 1],
        ["\u03B6\u03C9\u03BD\u03C4", -1, 1],
        ["\u03BA\u03B1\u03C3\u03C4", -1, 1],
        ["\u03C6", -1, 1],
        ["\u03B4\u03B9\u03B1\u03C6", 78, 1],
        ["\u03C3\u03C4\u03B5\u03C6", 78, 1],
        ["\u03C6\u03C9\u03C4\u03BF\u03C3\u03C4\u03B5\u03C6", 80, 1],
        ["\u03C0\u03B5\u03C1\u03B7\u03C6", 78, 1],
        ["\u03C5\u03C0\u03B5\u03C1\u03B7\u03C6", 82, 1],
        ["\u03BA\u03BF\u03B9\u03BB\u03B1\u03C1\u03C6", 78, 1],
        ["\u03C0\u03B5\u03BD\u03C4\u03B1\u03C1\u03C6", 78, 1],
        ["\u03BF\u03C1\u03C6", 78, 1],
        ["\u03C7", -1, 1],
        ["\u03B1\u03BC\u03B7\u03C7", 87, 1],
        ["\u03B2\u03B9\u03BF\u03BC\u03B7\u03C7", 87, 1],
        ["\u03BC\u03B5\u03B3\u03BB\u03BF\u03B2\u03B9\u03BF\u03BC\u03B7\u03C7", 89, 1],
        ["\u03BA\u03B1\u03C0\u03BD\u03BF\u03B2\u03B9\u03BF\u03BC\u03B7\u03C7", 89, 1],
        ["\u03BC\u03B9\u03BA\u03C1\u03BF\u03B2\u03B9\u03BF\u03BC\u03B7\u03C7", 89, 1],
        ["\u03C0\u03BF\u03BB\u03C5\u03BC\u03B7\u03C7", 87, 1],
        ["\u03BB\u03B9\u03C7", 87, 1]
    ];

    /** @const */ var a_45 = [
        ["\u03B7\u03C3\u03B5\u03C4\u03B5", -1, 1]
    ];

    /** @const */ var a_46 = [
        ["\u03B5\u03BD\u03B4", -1, 1],
        ["\u03C3\u03C5\u03BD\u03B4", -1, 1],
        ["\u03BF\u03B4", -1, 1],
        ["\u03B4\u03B9\u03B1\u03B8", -1, 1],
        ["\u03BA\u03B1\u03B8", -1, 1],
        ["\u03C1\u03B1\u03B8", -1, 1],
        ["\u03C4\u03B1\u03B8", -1, 1],
        ["\u03C4\u03B9\u03B8", -1, 1],
        ["\u03B5\u03BA\u03B8", -1, 1],
        ["\u03B5\u03BD\u03B8", -1, 1],
        ["\u03C3\u03C5\u03BD\u03B8", -1, 1],
        ["\u03C1\u03BF\u03B8", -1, 1],
        ["\u03C5\u03C0\u03B5\u03C1\u03B8", -1, 1],
        ["\u03C3\u03B8", -1, 1],
        ["\u03B5\u03C5\u03B8", -1, 1],
        ["\u03B1\u03C1\u03BA", -1, 1],
        ["\u03C9\u03C6\u03B5\u03BB", -1, 1],
        ["\u03B2\u03BF\u03BB", -1, 1],
        ["\u03B1\u03B9\u03BD", -1, 1],
        ["\u03C0\u03BF\u03BD", -1, 1],
        ["\u03C1\u03BF\u03BD", -1, 1],
        ["\u03C3\u03C5\u03BD", -1, 1],
        ["\u03B2\u03B1\u03C1", -1, 1],
        ["\u03B2\u03C1", -1, 1],
        ["\u03B1\u03B9\u03C1", -1, 1],
        ["\u03C6\u03BF\u03C1", -1, 1],
        ["\u03B5\u03C5\u03C1", -1, 1],
        ["\u03C0\u03C5\u03C1", -1, 1],
        ["\u03C7\u03C9\u03C1", -1, 1],
        ["\u03BD\u03B5\u03C4", -1, 1],
        ["\u03C3\u03C7", -1, 1]
    ];

    /** @const */ var a_47 = [
        ["\u03C0\u03B1\u03B3", -1, 1],
        ["\u03B4", -1, 1],
        ["\u03B1\u03B4", 1, 1],
        ["\u03B8", -1, 1],
        ["\u03B1\u03B8", 3, 1],
        ["\u03C4\u03BF\u03BA", -1, 1],
        ["\u03C3\u03BA", -1, 1],
        ["\u03C0\u03B1\u03C1\u03B1\u03BA\u03B1\u03BB", -1, 1],
        ["\u03C3\u03BA\u03B5\u03BB", -1, 1],
        ["\u03B1\u03C0\u03BB", -1, 1],
        ["\u03B5\u03BC", -1, 1],
        ["\u03B1\u03BD", -1, 1],
        ["\u03B2\u03B5\u03BD", -1, 1],
        ["\u03B2\u03B1\u03C1\u03BF\u03BD", -1, 1],
        ["\u03BA\u03BF\u03C0", -1, 1],
        ["\u03C3\u03B5\u03C1\u03C0", -1, 1],
        ["\u03B1\u03B2\u03B1\u03C1", -1, 1],
        ["\u03B5\u03BD\u03B1\u03C1", -1, 1],
        ["\u03B1\u03B2\u03C1", -1, 1],
        ["\u03BC\u03C0\u03BF\u03C1", -1, 1],
        ["\u03B8\u03B1\u03C1\u03C1", -1, 1],
        ["\u03BD\u03C4\u03C1", -1, 1],
        ["\u03C5", -1, 1],
        ["\u03BD\u03B9\u03C6", -1, 1],
        ["\u03C3\u03C5\u03C1\u03C6", -1, 1]
    ];

    /** @const */ var a_48 = [
        ["\u03BF\u03BD\u03C4\u03B1\u03C3", -1, 1],
        ["\u03C9\u03BD\u03C4\u03B1\u03C3", -1, 1]
    ];

    /** @const */ var a_49 = [
        ["\u03BF\u03BC\u03B1\u03C3\u03C4\u03B5", -1, 1],
        ["\u03B9\u03BF\u03BC\u03B1\u03C3\u03C4\u03B5", 0, 1]
    ];

    /** @const */ var a_50 = [
        ["\u03C0", -1, 1],
        ["\u03B1\u03C0", 0, 1],
        ["\u03B1\u03BA\u03B1\u03C4\u03B1\u03C0", 1, 1],
        ["\u03C3\u03C5\u03BC\u03C0", 0, 1],
        ["\u03B1\u03C3\u03C5\u03BC\u03C0", 3, 1],
        ["\u03B1\u03BC\u03B5\u03C4\u03B1\u03BC\u03C6", -1, 1]
    ];

    /** @const */ var a_51 = [
        ["\u03B6", -1, 1],
        ["\u03B1\u03BB", -1, 1],
        ["\u03C0\u03B1\u03C1\u03B1\u03BA\u03B1\u03BB", 1, 1],
        ["\u03B5\u03BA\u03C4\u03B5\u03BB", -1, 1],
        ["\u03BC", -1, 1],
        ["\u03BE", -1, 1],
        ["\u03C0\u03C1\u03BF", -1, 1],
        ["\u03B1\u03C1", -1, 1],
        ["\u03BD\u03B9\u03C3", -1, 1]
    ];

    /** @const */ var a_52 = [
        ["\u03B7\u03B8\u03B7\u03BA\u03B1", -1, 1],
        ["\u03B7\u03B8\u03B7\u03BA\u03B5", -1, 1],
        ["\u03B7\u03B8\u03B7\u03BA\u03B5\u03C3", -1, 1]
    ];

    /** @const */ var a_53 = [
        ["\u03C0\u03B9\u03B8", -1, 1],
        ["\u03BF\u03B8", -1, 1],
        ["\u03BD\u03B1\u03C1\u03B8", -1, 1],
        ["\u03C3\u03BA\u03BF\u03C5\u03BB", -1, 1],
        ["\u03C3\u03BA\u03C9\u03BB", -1, 1],
        ["\u03C3\u03C6", -1, 1]
    ];

    /** @const */ var a_54 = [
        ["\u03B8", -1, 1],
        ["\u03B4\u03B9\u03B1\u03B8", 0, 1],
        ["\u03C0\u03B1\u03C1\u03B1\u03BA\u03B1\u03C4\u03B1\u03B8", 0, 1],
        ["\u03C3\u03C5\u03BD\u03B8", 0, 1],
        ["\u03C0\u03C1\u03BF\u03C3\u03B8", 0, 1]
    ];

    /** @const */ var a_55 = [
        ["\u03B7\u03BA\u03B1", -1, 1],
        ["\u03B7\u03BA\u03B5", -1, 1],
        ["\u03B7\u03BA\u03B5\u03C3", -1, 1]
    ];

    /** @const */ var a_56 = [
        ["\u03C6\u03B1\u03B3", -1, 1],
        ["\u03BB\u03B7\u03B3", -1, 1],
        ["\u03C6\u03C1\u03C5\u03B4", -1, 1],
        ["\u03BC\u03B1\u03BD\u03C4\u03B9\u03BB", -1, 1],
        ["\u03BC\u03B1\u03BB\u03BB", -1, 1],
        ["\u03BF\u03BC", -1, 1],
        ["\u03B2\u03BB\u03B5\u03C0", -1, 1],
        ["\u03C0\u03BF\u03B4\u03B1\u03C1", -1, 1],
        ["\u03BA\u03C5\u03BC\u03B1\u03C4", -1, 1],
        ["\u03C0\u03C1\u03C9\u03C4", -1, 1],
        ["\u03BB\u03B1\u03C7", -1, 1],
        ["\u03C0\u03B1\u03BD\u03C4\u03B1\u03C7", -1, 1]
    ];

    /** @const */ var a_57 = [
        ["\u03C4\u03C3\u03B1", -1, 1],
        ["\u03C7\u03B1\u03B4", -1, 1],
        ["\u03BC\u03B5\u03B4", -1, 1],
        ["\u03BB\u03B1\u03BC\u03C0\u03B9\u03B4", -1, 1],
        ["\u03B4\u03B5", -1, 1],
        ["\u03C0\u03BB\u03B5", -1, 1],
        ["\u03BC\u03B5\u03C3\u03B1\u03B6", -1, 1],
        ["\u03B4\u03B5\u03C3\u03C0\u03BF\u03B6", -1, 1],
        ["\u03B1\u03B9\u03B8", -1, 1],
        ["\u03C6\u03B1\u03C1\u03BC\u03B1\u03BA", -1, 1],
        ["\u03B1\u03B3\u03BA", -1, 1],
        ["\u03B1\u03BD\u03B7\u03BA", -1, 1],
        ["\u03BB", -1, 1],
        ["\u03BC", -1, 1],
        ["\u03B1\u03BC", 13, 1],
        ["\u03B2\u03C1\u03BF\u03BC", 13, 1],
        ["\u03C5\u03C0\u03BF\u03C4\u03B5\u03B9\u03BD", -1, 1],
        ["\u03B5\u03BA\u03BB\u03B9\u03C0", -1, 1],
        ["\u03C1", -1, 1],
        ["\u03B5\u03BD\u03B4\u03B9\u03B1\u03C6\u03B5\u03C1", 18, 1],
        ["\u03B1\u03BD\u03B1\u03C1\u03C1", 18, 1],
        ["\u03C0\u03B1\u03C4", -1, 1],
        ["\u03BA\u03B1\u03B8\u03B1\u03C1\u03B5\u03C5", -1, 1],
        ["\u03B4\u03B5\u03C5\u03C4\u03B5\u03C1\u03B5\u03C5", -1, 1],
        ["\u03BB\u03B5\u03C7", -1, 1]
    ];

    /** @const */ var a_58 = [
        ["\u03BF\u03C5\u03C3\u03B1", -1, 1],
        ["\u03BF\u03C5\u03C3\u03B5", -1, 1],
        ["\u03BF\u03C5\u03C3\u03B5\u03C3", -1, 1]
    ];

    /** @const */ var a_59 = [
        ["\u03C8\u03BF\u03C6", -1, -1],
        ["\u03BD\u03B1\u03C5\u03BB\u03BF\u03C7", -1, -1]
    ];

    /** @const */ var a_60 = [
        ["\u03C0\u03B5\u03BB", -1, 1],
        ["\u03BB\u03BB", -1, 1],
        ["\u03C3\u03BC\u03B7\u03BD", -1, 1],
        ["\u03C1\u03C0", -1, 1],
        ["\u03C0\u03C1", -1, 1],
        ["\u03C6\u03C1", -1, 1],
        ["\u03C7\u03BF\u03C1\u03C4", -1, 1],
        ["\u03BF\u03C6", -1, 1],
        ["\u03C3\u03C6", -1, 1],
        ["\u03BB\u03BF\u03C7", -1, 1]
    ];

    /** @const */ var a_61 = [
        ["\u03B1\u03BC\u03B1\u03BB\u03BB\u03B9", -1, 1],
        ["\u03BB", -1, 1],
        ["\u03B1\u03BC\u03B1\u03BB", 1, 1],
        ["\u03BC", -1, 1],
        ["\u03BF\u03C5\u03BB\u03B1\u03BC", 3, 1],
        ["\u03B5\u03BD", -1, 1],
        ["\u03B4\u03B5\u03C1\u03B2\u03B5\u03BD", 5, 1],
        ["\u03C0", -1, 1],
        ["\u03B1\u03B5\u03B9\u03C0", 7, 1],
        ["\u03B1\u03C1\u03C4\u03B9\u03C0", 7, 1],
        ["\u03C3\u03C5\u03BC\u03C0", 7, 1],
        ["\u03BD\u03B5\u03BF\u03C0", 7, 1],
        ["\u03BA\u03C1\u03BF\u03BA\u03B1\u03BB\u03BF\u03C0", 7, 1],
        ["\u03BF\u03BB\u03BF\u03C0", 7, 1],
        ["\u03C0\u03C1\u03BF\u03C3\u03C9\u03C0\u03BF\u03C0", 7, 1],
        ["\u03C3\u03B9\u03B4\u03B7\u03C1\u03BF\u03C0", 7, 1],
        ["\u03B4\u03C1\u03BF\u03C3\u03BF\u03C0", 7, 1],
        ["\u03B1\u03C3\u03C0", 7, 1],
        ["\u03B1\u03BD\u03C5\u03C0", 7, 1],
        ["\u03C1", -1, 1],
        ["\u03B1\u03C3\u03C0\u03B1\u03C1", 19, 1],
        ["\u03C7\u03B1\u03C1", 19, 1],
        ["\u03B1\u03C7\u03B1\u03C1", 21, 1],
        ["\u03B1\u03C0\u03B5\u03C1", 19, 1],
        ["\u03C4\u03C1", 19, 1],
        ["\u03BF\u03C5\u03C1", 19, 1],
        ["\u03C4", -1, 1],
        ["\u03B4\u03B9\u03B1\u03C4", 26, 1],
        ["\u03B5\u03C0\u03B9\u03C4", 26, 1],
        ["\u03C3\u03C5\u03BD\u03C4", 26, 1],
        ["\u03BF\u03BC\u03BF\u03C4", 26, 1],
        ["\u03BD\u03BF\u03BC\u03BF\u03C4", 30, 1],
        ["\u03B1\u03C0\u03BF\u03C4", 26, 1],
        ["\u03C5\u03C0\u03BF\u03C4", 26, 1],
        ["\u03B1\u03B2\u03B1\u03C3\u03C4", 26, 1],
        ["\u03B1\u03B9\u03BC\u03BF\u03C3\u03C4", 26, 1],
        ["\u03C0\u03C1\u03BF\u03C3\u03C4", 26, 1],
        ["\u03B1\u03BD\u03C5\u03C3\u03C4", 26, 1],
        ["\u03BD\u03B1\u03C5", -1, 1],
        ["\u03B1\u03C6", -1, 1],
        ["\u03BE\u03B5\u03C6", -1, 1],
        ["\u03B1\u03B4\u03B7\u03C6", -1, 1],
        ["\u03C0\u03B1\u03BC\u03C6", -1, 1],
        ["\u03C0\u03BF\u03BB\u03C5\u03C6", -1, 1]
    ];

    /** @const */ var a_62 = [
        ["\u03B1\u03B3\u03B1", -1, 1],
        ["\u03B1\u03B3\u03B5", -1, 1],
        ["\u03B1\u03B3\u03B5\u03C3", -1, 1]
    ];

    /** @const */ var a_63 = [
        ["\u03B7\u03C3\u03B1", -1, 1],
        ["\u03B7\u03C3\u03B5", -1, 1],
        ["\u03B7\u03C3\u03BF\u03C5", -1, 1]
    ];

    /** @const */ var a_64 = [
        ["\u03BD", -1, 1],
        ["\u03B4\u03C9\u03B4\u03B5\u03BA\u03B1\u03BD", 0, 1],
        ["\u03B5\u03C0\u03C4\u03B1\u03BD", 0, 1],
        ["\u03BC\u03B5\u03B3\u03B1\u03BB\u03BF\u03BD", 0, 1],
        ["\u03B5\u03C1\u03B7\u03BC\u03BF\u03BD", 0, 1],
        ["\u03C7\u03B5\u03C1\u03C3\u03BF\u03BD", 0, 1]
    ];

    /** @const */ var a_65 = [
        ["\u03B7\u03C3\u03C4\u03B5", -1, 1]
    ];

    /** @const */ var a_66 = [
        ["\u03C3\u03B2", -1, 1],
        ["\u03B1\u03C3\u03B2", 0, 1],
        ["\u03B1\u03C0\u03BB", -1, 1],
        ["\u03B1\u03B5\u03B9\u03BC\u03BD", -1, 1],
        ["\u03C7\u03C1", -1, 1],
        ["\u03B1\u03C7\u03C1", 4, 1],
        ["\u03BA\u03BF\u03B9\u03BD\u03BF\u03C7\u03C1", 4, 1],
        ["\u03B4\u03C5\u03C3\u03C7\u03C1", 4, 1],
        ["\u03B5\u03C5\u03C7\u03C1", 4, 1],
        ["\u03C0\u03B1\u03BB\u03B9\u03BC\u03C8", -1, 1]
    ];

    /** @const */ var a_67 = [
        ["\u03BF\u03C5\u03BD\u03B5", -1, 1],
        ["\u03B7\u03B8\u03BF\u03C5\u03BD\u03B5", 0, 1],
        ["\u03B7\u03C3\u03BF\u03C5\u03BD\u03B5", 0, 1]
    ];

    /** @const */ var a_68 = [
        ["\u03C3\u03C0\u03B9", -1, 1],
        ["\u03BD", -1, 1],
        ["\u03B5\u03BE\u03C9\u03BD", 1, 1],
        ["\u03C1", -1, 1],
        ["\u03C3\u03C4\u03C1\u03B1\u03B2\u03BF\u03BC\u03BF\u03C5\u03C4\u03C3", -1, 1],
        ["\u03BA\u03B1\u03BA\u03BF\u03BC\u03BF\u03C5\u03C4\u03C3", -1, 1]
    ];

    /** @const */ var a_69 = [
        ["\u03BF\u03C5\u03BC\u03B5", -1, 1],
        ["\u03B7\u03B8\u03BF\u03C5\u03BC\u03B5", 0, 1],
        ["\u03B7\u03C3\u03BF\u03C5\u03BC\u03B5", 0, 1]
    ];

    /** @const */ var a_70 = [
        ["\u03B1\u03B6", -1, 1],
        ["\u03C9\u03C1\u03B9\u03BF\u03C0\u03BB", -1, 1],
        ["\u03B1\u03C3\u03BF\u03C5\u03C3", -1, 1],
        ["\u03C0\u03B1\u03C1\u03B1\u03C3\u03BF\u03C5\u03C3", 2, 1],
        ["\u03B1\u03BB\u03BB\u03BF\u03C3\u03BF\u03C5\u03C3", -1, 1],
        ["\u03C6", -1, 1],
        ["\u03C7", -1, 1]
    ];

    /** @const */ var a_71 = [
        ["\u03BC\u03B1\u03C4\u03B1", -1, 1],
        ["\u03BC\u03B1\u03C4\u03C9\u03BD", -1, 1],
        ["\u03BC\u03B1\u03C4\u03BF\u03C3", -1, 1]
    ];

    /** @const */ var a_72 = [
        ["\u03B1", -1, 1],
        ["\u03B9\u03BF\u03C5\u03BC\u03B1", 0, 1],
        ["\u03BF\u03BC\u03BF\u03C5\u03BD\u03B1", 0, 1],
        ["\u03B9\u03BF\u03BC\u03BF\u03C5\u03BD\u03B1", 2, 1],
        ["\u03BF\u03C3\u03BF\u03C5\u03BD\u03B1", 0, 1],
        ["\u03B9\u03BF\u03C3\u03BF\u03C5\u03BD\u03B1", 4, 1],
        ["\u03B5", -1, 1],
        ["\u03B1\u03B3\u03B1\u03C4\u03B5", 6, 1],
        ["\u03B7\u03BA\u03B1\u03C4\u03B5", 6, 1],
        ["\u03B7\u03B8\u03B7\u03BA\u03B1\u03C4\u03B5", 8, 1],
        ["\u03B7\u03C3\u03B1\u03C4\u03B5", 6, 1],
        ["\u03BF\u03C5\u03C3\u03B1\u03C4\u03B5", 6, 1],
        ["\u03B5\u03B9\u03C4\u03B5", 6, 1],
        ["\u03B7\u03B8\u03B5\u03B9\u03C4\u03B5", 12, 1],
        ["\u03B9\u03B5\u03BC\u03B1\u03C3\u03C4\u03B5", 6, 1],
        ["\u03BF\u03C5\u03BC\u03B1\u03C3\u03C4\u03B5", 6, 1],
        ["\u03B9\u03BF\u03C5\u03BC\u03B1\u03C3\u03C4\u03B5", 15, 1],
        ["\u03B9\u03B5\u03C3\u03B1\u03C3\u03C4\u03B5", 6, 1],
        ["\u03BF\u03C3\u03B1\u03C3\u03C4\u03B5", 6, 1],
        ["\u03B9\u03BF\u03C3\u03B1\u03C3\u03C4\u03B5", 18, 1],
        ["\u03B7", -1, 1],
        ["\u03B9", -1, 1],
        ["\u03B1\u03BC\u03B1\u03B9", 21, 1],
        ["\u03B9\u03B5\u03BC\u03B1\u03B9", 21, 1],
        ["\u03BF\u03BC\u03B1\u03B9", 21, 1],
        ["\u03BF\u03C5\u03BC\u03B1\u03B9", 21, 1],
        ["\u03B1\u03C3\u03B1\u03B9", 21, 1],
        ["\u03B5\u03C3\u03B1\u03B9", 21, 1],
        ["\u03B9\u03B5\u03C3\u03B1\u03B9", 27, 1],
        ["\u03B1\u03C4\u03B1\u03B9", 21, 1],
        ["\u03B5\u03C4\u03B1\u03B9", 21, 1],
        ["\u03B9\u03B5\u03C4\u03B1\u03B9", 30, 1],
        ["\u03BF\u03BD\u03C4\u03B1\u03B9", 21, 1],
        ["\u03BF\u03C5\u03BD\u03C4\u03B1\u03B9", 21, 1],
        ["\u03B9\u03BF\u03C5\u03BD\u03C4\u03B1\u03B9", 33, 1],
        ["\u03B5\u03B9", 21, 1],
        ["\u03B1\u03B5\u03B9", 35, 1],
        ["\u03B7\u03B8\u03B5\u03B9", 35, 1],
        ["\u03B7\u03C3\u03B5\u03B9", 35, 1],
        ["\u03BF\u03B9", 21, 1],
        ["\u03B1\u03BD", -1, 1],
        ["\u03B1\u03B3\u03B1\u03BD", 40, 1],
        ["\u03B7\u03BA\u03B1\u03BD", 40, 1],
        ["\u03B7\u03B8\u03B7\u03BA\u03B1\u03BD", 42, 1],
        ["\u03B7\u03C3\u03B1\u03BD", 40, 1],
        ["\u03BF\u03C5\u03C3\u03B1\u03BD", 40, 1],
        ["\u03BF\u03BD\u03C4\u03BF\u03C5\u03C3\u03B1\u03BD", 45, 1],
        ["\u03B9\u03BF\u03BD\u03C4\u03BF\u03C5\u03C3\u03B1\u03BD", 46, 1],
        ["\u03BF\u03BD\u03C4\u03B1\u03BD", 40, 1],
        ["\u03B9\u03BF\u03BD\u03C4\u03B1\u03BD", 48, 1],
        ["\u03BF\u03C5\u03BD\u03C4\u03B1\u03BD", 40, 1],
        ["\u03B9\u03BF\u03C5\u03BD\u03C4\u03B1\u03BD", 50, 1],
        ["\u03BF\u03C4\u03B1\u03BD", 40, 1],
        ["\u03B9\u03BF\u03C4\u03B1\u03BD", 52, 1],
        ["\u03BF\u03BC\u03B1\u03C3\u03C4\u03B1\u03BD", 40, 1],
        ["\u03B9\u03BF\u03BC\u03B1\u03C3\u03C4\u03B1\u03BD", 54, 1],
        ["\u03BF\u03C3\u03B1\u03C3\u03C4\u03B1\u03BD", 40, 1],
        ["\u03B9\u03BF\u03C3\u03B1\u03C3\u03C4\u03B1\u03BD", 56, 1],
        ["\u03BF\u03C5\u03BD", -1, 1],
        ["\u03B7\u03B8\u03BF\u03C5\u03BD", 58, 1],
        ["\u03BF\u03BC\u03BF\u03C5\u03BD", 58, 1],
        ["\u03B9\u03BF\u03BC\u03BF\u03C5\u03BD", 60, 1],
        ["\u03B7\u03C3\u03BF\u03C5\u03BD", 58, 1],
        ["\u03BF\u03C3\u03BF\u03C5\u03BD", 58, 1],
        ["\u03B9\u03BF\u03C3\u03BF\u03C5\u03BD", 63, 1],
        ["\u03C9\u03BD", -1, 1],
        ["\u03B7\u03B4\u03C9\u03BD", 65, 1],
        ["\u03BF", -1, 1],
        ["\u03B1\u03C3", -1, 1],
        ["\u03B5\u03C3", -1, 1],
        ["\u03B7\u03B4\u03B5\u03C3", 69, 1],
        ["\u03B7\u03C3\u03B5\u03C3", 69, 1],
        ["\u03B7\u03C3", -1, 1],
        ["\u03B5\u03B9\u03C3", -1, 1],
        ["\u03B7\u03B8\u03B5\u03B9\u03C3", 73, 1],
        ["\u03BF\u03C3", -1, 1],
        ["\u03C5\u03C3", -1, 1],
        ["\u03BF\u03C5\u03C3", 76, 1],
        ["\u03C5", -1, 1],
        ["\u03BF\u03C5", 78, 1],
        ["\u03C9", -1, 1],
        ["\u03B1\u03C9", 80, 1],
        ["\u03B7\u03B8\u03C9", 80, 1],
        ["\u03B7\u03C3\u03C9", 80, 1]
    ];

    /** @const */ var a_73 = [
        ["\u03BF\u03C4\u03B5\u03C1", -1, 1],
        ["\u03B5\u03C3\u03C4\u03B5\u03C1", -1, 1],
        ["\u03C5\u03C4\u03B5\u03C1", -1, 1],
        ["\u03C9\u03C4\u03B5\u03C1", -1, 1],
        ["\u03BF\u03C4\u03B1\u03C4", -1, 1],
        ["\u03B5\u03C3\u03C4\u03B1\u03C4", -1, 1],
        ["\u03C5\u03C4\u03B1\u03C4", -1, 1],
        ["\u03C9\u03C4\u03B1\u03C4", -1, 1]
    ];

    /** @const */ var /** Array<int> */ g_v = [81, 65, 16, 1];

    /** @const */ var /** Array<int> */ g_v2 = [81, 65, 0, 1];

    var /** boolean */ B_test1 = false;


    /** @return {boolean} */
    function r_has_min_length() {
        if (!(base.current.length >= 3))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_tolower() {
        var /** number */ among_var;
        while(true)
        {
            var /** number */ v_1 = base.limit - base.cursor;
            lab0: {
                base.ket = base.cursor;
                among_var = base.find_among_b(a_0);
                if (among_var == 0)
                {
                    break lab0;
                }
                base.bra = base.cursor;
                switch (among_var) {
                    case 1:
                        if (!base.slice_from("\u03B1"))
                        {
                            return false;
                        }
                        break;
                    case 2:
                        if (!base.slice_from("\u03B2"))
                        {
                            return false;
                        }
                        break;
                    case 3:
                        if (!base.slice_from("\u03B3"))
                        {
                            return false;
                        }
                        break;
                    case 4:
                        if (!base.slice_from("\u03B4"))
                        {
                            return false;
                        }
                        break;
                    case 5:
                        if (!base.slice_from("\u03B5"))
                        {
                            return false;
                        }
                        break;
                    case 6:
                        if (!base.slice_from("\u03B6"))
                        {
                            return false;
                        }
                        break;
                    case 7:
                        if (!base.slice_from("\u03B7"))
                        {
                            return false;
                        }
                        break;
                    case 8:
                        if (!base.slice_from("\u03B8"))
                        {
                            return false;
                        }
                        break;
                    case 9:
                        if (!base.slice_from("\u03B9"))
                        {
                            return false;
                        }
                        break;
                    case 10:
                        if (!base.slice_from("\u03BA"))
                        {
                            return false;
                        }
                        break;
                    case 11:
                        if (!base.slice_from("\u03BB"))
                        {
                            return false;
                        }
                        break;
                    case 12:
                        if (!base.slice_from("\u03BC"))
                        {
                            return false;
                        }
                        break;
                    case 13:
                        if (!base.slice_from("\u03BD"))
                        {
                            return false;
                        }
                        break;
                    case 14:
                        if (!base.slice_from("\u03BE"))
                        {
                            return false;
                        }
                        break;
                    case 15:
                        if (!base.slice_from("\u03BF"))
                        {
                            return false;
                        }
                        break;
                    case 16:
                        if (!base.slice_from("\u03C0"))
                        {
                            return false;
                        }
                        break;
                    case 17:
                        if (!base.slice_from("\u03C1"))
                        {
                            return false;
                        }
                        break;
                    case 18:
                        if (!base.slice_from("\u03C3"))
                        {
                            return false;
                        }
                        break;
                    case 19:
                        if (!base.slice_from("\u03C4"))
                        {
                            return false;
                        }
                        break;
                    case 20:
                        if (!base.slice_from("\u03C5"))
                        {
                            return false;
                        }
                        break;
                    case 21:
                        if (!base.slice_from("\u03C6"))
                        {
                            return false;
                        }
                        break;
                    case 22:
                        if (!base.slice_from("\u03C7"))
                        {
                            return false;
                        }
                        break;
                    case 23:
                        if (!base.slice_from("\u03C8"))
                        {
                            return false;
                        }
                        break;
                    case 24:
                        if (!base.slice_from("\u03C9"))
                        {
                            return false;
                        }
                        break;
                    case 25:
                        if (base.cursor <= base.limit_backward)
                        {
                            break lab0;
                        }
                        base.cursor--;
                        break;
                }
                continue;
            }
            base.cursor = base.limit - v_1;
            break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step1() {
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
                if (!base.slice_from("\u03C6\u03B1"))
                {
                    return false;
                }
                break;
            case 2:
                if (!base.slice_from("\u03C3\u03BA\u03B1"))
                {
                    return false;
                }
                break;
            case 3:
                if (!base.slice_from("\u03BF\u03BB\u03BF"))
                {
                    return false;
                }
                break;
            case 4:
                if (!base.slice_from("\u03C3\u03BF"))
                {
                    return false;
                }
                break;
            case 5:
                if (!base.slice_from("\u03C4\u03B1\u03C4\u03BF"))
                {
                    return false;
                }
                break;
            case 6:
                if (!base.slice_from("\u03BA\u03C1\u03B5"))
                {
                    return false;
                }
                break;
            case 7:
                if (!base.slice_from("\u03C0\u03B5\u03C1"))
                {
                    return false;
                }
                break;
            case 8:
                if (!base.slice_from("\u03C4\u03B5\u03C1"))
                {
                    return false;
                }
                break;
            case 9:
                if (!base.slice_from("\u03C6\u03C9"))
                {
                    return false;
                }
                break;
            case 10:
                if (!base.slice_from("\u03BA\u03B1\u03B8\u03B5\u03C3\u03C4"))
                {
                    return false;
                }
                break;
            case 11:
                if (!base.slice_from("\u03B3\u03B5\u03B3\u03BF\u03BD"))
                {
                    return false;
                }
                break;
        }
        B_test1 = false;
        return true;
    };

    /** @return {boolean} */
    function r_steps1() {
        base.ket = base.cursor;
        if (base.find_among_b(a_4) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        lab0: {
            var /** number */ v_1 = base.limit - base.cursor;
            lab1: {
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (base.find_among_b(a_2) == 0)
                {
                    break lab1;
                }
                if (base.cursor > base.limit_backward)
                {
                    break lab1;
                }
                if (!base.slice_from("\u03B9"))
                {
                    return false;
                }
                break lab0;
            }
            base.cursor = base.limit - v_1;
            base.ket = base.cursor;
            base.bra = base.cursor;
            if (base.find_among_b(a_3) == 0)
            {
                return false;
            }
            if (base.cursor > base.limit_backward)
            {
                return false;
            }
            if (!base.slice_from("\u03B9\u03B6"))
            {
                return false;
            }
        }
        return true;
    };

    /** @return {boolean} */
    function r_steps2() {
        base.ket = base.cursor;
        if (base.find_among_b(a_6) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        base.ket = base.cursor;
        base.bra = base.cursor;
        if (base.find_among_b(a_5) == 0)
        {
            return false;
        }
        if (base.cursor > base.limit_backward)
        {
            return false;
        }
        if (!base.slice_from("\u03C9\u03BD"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_steps3() {
        base.ket = base.cursor;
        if (base.find_among_b(a_9) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        lab0: {
            var /** number */ v_1 = base.limit - base.cursor;
            lab1: {
                if (!(base.eq_s_b("\u03B9\u03C3\u03B1")))
                {
                    break lab1;
                }
                if (base.cursor > base.limit_backward)
                {
                    break lab1;
                }
                if (!base.slice_from("\u03B9\u03C3"))
                {
                    return false;
                }
                break lab0;
            }
            base.cursor = base.limit - v_1;
            lab2: {
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (base.find_among_b(a_7) == 0)
                {
                    break lab2;
                }
                if (base.cursor > base.limit_backward)
                {
                    break lab2;
                }
                if (!base.slice_from("\u03B9"))
                {
                    return false;
                }
                break lab0;
            }
            base.cursor = base.limit - v_1;
            base.ket = base.cursor;
            base.bra = base.cursor;
            if (base.find_among_b(a_8) == 0)
            {
                return false;
            }
            if (base.cursor > base.limit_backward)
            {
                return false;
            }
            if (!base.slice_from("\u03B9\u03C3"))
            {
                return false;
            }
        }
        return true;
    };

    /** @return {boolean} */
    function r_steps4() {
        base.ket = base.cursor;
        if (base.find_among_b(a_11) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        base.ket = base.cursor;
        base.bra = base.cursor;
        if (base.find_among_b(a_10) == 0)
        {
            return false;
        }
        if (base.cursor > base.limit_backward)
        {
            return false;
        }
        if (!base.slice_from("\u03B9"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_steps5() {
        base.ket = base.cursor;
        if (base.find_among_b(a_14) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        lab0: {
            var /** number */ v_1 = base.limit - base.cursor;
            lab1: {
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (base.find_among_b(a_12) == 0)
                {
                    break lab1;
                }
                if (base.cursor > base.limit_backward)
                {
                    break lab1;
                }
                if (!base.slice_from("\u03B9"))
                {
                    return false;
                }
                break lab0;
            }
            base.cursor = base.limit - v_1;
            base.ket = base.cursor;
            base.bra = base.cursor;
            if (base.find_among_b(a_13) == 0)
            {
                return false;
            }
            if (base.cursor > base.limit_backward)
            {
                return false;
            }
            if (!base.slice_from("\u03B9\u03C3\u03C4"))
            {
                return false;
            }
        }
        return true;
    };

    /** @return {boolean} */
    function r_steps6() {
        var /** number */ among_var;
        base.ket = base.cursor;
        if (base.find_among_b(a_18) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        lab0: {
            var /** number */ v_1 = base.limit - base.cursor;
            lab1: {
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (base.find_among_b(a_15) == 0)
                {
                    break lab1;
                }
                if (base.cursor > base.limit_backward)
                {
                    break lab1;
                }
                if (!base.slice_from("\u03B9\u03C3\u03BC"))
                {
                    return false;
                }
                break lab0;
            }
            base.cursor = base.limit - v_1;
            lab2: {
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (base.find_among_b(a_16) == 0)
                {
                    break lab2;
                }
                if (base.cursor > base.limit_backward)
                {
                    break lab2;
                }
                if (!base.slice_from("\u03B9"))
                {
                    return false;
                }
                break lab0;
            }
            base.cursor = base.limit - v_1;
            base.ket = base.cursor;
            among_var = base.find_among_b(a_17);
            if (among_var == 0)
            {
                return false;
            }
            base.bra = base.cursor;
            switch (among_var) {
                case 1:
                    if (!base.slice_from("\u03B1\u03B3\u03BD\u03C9\u03C3\u03C4"))
                    {
                        return false;
                    }
                    break;
                case 2:
                    if (!base.slice_from("\u03B1\u03C4\u03BF\u03BC"))
                    {
                        return false;
                    }
                    break;
                case 3:
                    if (!base.slice_from("\u03B3\u03BD\u03C9\u03C3\u03C4"))
                    {
                        return false;
                    }
                    break;
                case 4:
                    if (!base.slice_from("\u03B5\u03B8\u03BD"))
                    {
                        return false;
                    }
                    break;
                case 5:
                    if (!base.slice_from("\u03B5\u03BA\u03BB\u03B5\u03BA\u03C4"))
                    {
                        return false;
                    }
                    break;
                case 6:
                    if (!base.slice_from("\u03C3\u03BA\u03B5\u03C0\u03C4"))
                    {
                        return false;
                    }
                    break;
                case 7:
                    if (!base.slice_from("\u03C4\u03BF\u03C0"))
                    {
                        return false;
                    }
                    break;
                case 8:
                    if (!base.slice_from("\u03B1\u03BB\u03B5\u03BE\u03B1\u03BD\u03B4\u03C1"))
                    {
                        return false;
                    }
                    break;
                case 9:
                    if (!base.slice_from("\u03B2\u03C5\u03B6\u03B1\u03BD\u03C4"))
                    {
                        return false;
                    }
                    break;
                case 10:
                    if (!base.slice_from("\u03B8\u03B5\u03B1\u03C4\u03C1"))
                    {
                        return false;
                    }
                    break;
            }
        }
        return true;
    };

    /** @return {boolean} */
    function r_steps7() {
        base.ket = base.cursor;
        if (base.find_among_b(a_20) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        base.ket = base.cursor;
        base.bra = base.cursor;
        if (base.find_among_b(a_19) == 0)
        {
            return false;
        }
        if (base.cursor > base.limit_backward)
        {
            return false;
        }
        if (!base.slice_from("\u03B1\u03C1\u03B1\u03BA"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_steps8() {
        base.ket = base.cursor;
        if (base.find_among_b(a_23) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        lab0: {
            var /** number */ v_1 = base.limit - base.cursor;
            lab1: {
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (base.find_among_b(a_21) == 0)
                {
                    break lab1;
                }
                if (base.cursor > base.limit_backward)
                {
                    break lab1;
                }
                if (!base.slice_from("\u03B1\u03BA"))
                {
                    return false;
                }
                break lab0;
            }
            base.cursor = base.limit - v_1;
            lab2: {
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (base.find_among_b(a_22) == 0)
                {
                    break lab2;
                }
                if (base.cursor > base.limit_backward)
                {
                    break lab2;
                }
                if (!base.slice_from("\u03B9\u03C4\u03C3"))
                {
                    return false;
                }
                break lab0;
            }
            base.cursor = base.limit - v_1;
            base.ket = base.cursor;
            base.bra = base.cursor;
            if (!(base.eq_s_b("\u03BA\u03BF\u03C1")))
            {
                return false;
            }
            if (!base.slice_from("\u03B9\u03C4\u03C3"))
            {
                return false;
            }
        }
        return true;
    };

    /** @return {boolean} */
    function r_steps9() {
        base.ket = base.cursor;
        if (base.find_among_b(a_26) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        lab0: {
            var /** number */ v_1 = base.limit - base.cursor;
            lab1: {
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (base.find_among_b(a_24) == 0)
                {
                    break lab1;
                }
                if (base.cursor > base.limit_backward)
                {
                    break lab1;
                }
                if (!base.slice_from("\u03B9\u03B4"))
                {
                    return false;
                }
                break lab0;
            }
            base.cursor = base.limit - v_1;
            base.ket = base.cursor;
            base.bra = base.cursor;
            if (base.find_among_b(a_25) == 0)
            {
                return false;
            }
            if (!base.slice_from("\u03B9\u03B4"))
            {
                return false;
            }
        }
        return true;
    };

    /** @return {boolean} */
    function r_steps10() {
        base.ket = base.cursor;
        if (base.find_among_b(a_28) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        base.ket = base.cursor;
        base.bra = base.cursor;
        if (base.find_among_b(a_27) == 0)
        {
            return false;
        }
        if (base.cursor > base.limit_backward)
        {
            return false;
        }
        if (!base.slice_from("\u03B9\u03C3\u03BA"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step2a() {
        base.ket = base.cursor;
        if (base.find_among_b(a_29) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        {
            var /** number */ v_1 = base.limit - base.cursor;
            lab0: {
                base.ket = base.cursor;
                if (base.find_among_b(a_30) == 0)
                {
                    break lab0;
                }
                base.bra = base.cursor;
                return false;
            }
            base.cursor = base.limit - v_1;
        }
        {
            var /** number */ c1 = base.cursor;
            base.insert(base.cursor, base.cursor, "\u03B1\u03B4");
            base.cursor = c1;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step2b() {
        base.ket = base.cursor;
        if (base.find_among_b(a_31) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        base.ket = base.cursor;
        base.bra = base.cursor;
        if (base.find_among_b(a_32) == 0)
        {
            return false;
        }
        if (!base.slice_from("\u03B5\u03B4"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step2c() {
        base.ket = base.cursor;
        if (base.find_among_b(a_33) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        base.ket = base.cursor;
        base.bra = base.cursor;
        if (base.find_among_b(a_34) == 0)
        {
            return false;
        }
        if (!base.slice_from("\u03BF\u03C5\u03B4"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step2d() {
        base.ket = base.cursor;
        if (base.find_among_b(a_35) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        base.ket = base.cursor;
        base.bra = base.cursor;
        if (base.find_among_b(a_36) == 0)
        {
            return false;
        }
        if (base.cursor > base.limit_backward)
        {
            return false;
        }
        if (!base.slice_from("\u03B5"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step3() {
        base.ket = base.cursor;
        if (base.find_among_b(a_37) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        base.ket = base.cursor;
        base.bra = base.cursor;
        if (!(base.in_grouping_b(g_v, 945, 969)))
        {
            return false;
        }
        if (!base.slice_from("\u03B9"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step4() {
        base.ket = base.cursor;
        if (base.find_among_b(a_38) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        lab0: {
            var /** number */ v_1 = base.limit - base.cursor;
            lab1: {
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (!(base.in_grouping_b(g_v, 945, 969)))
                {
                    break lab1;
                }
                if (!base.slice_from("\u03B9\u03BA"))
                {
                    return false;
                }
                break lab0;
            }
            base.cursor = base.limit - v_1;
            base.ket = base.cursor;
        }
        base.bra = base.cursor;
        if (base.find_among_b(a_39) == 0)
        {
            return false;
        }
        if (base.cursor > base.limit_backward)
        {
            return false;
        }
        if (!base.slice_from("\u03B9\u03BA"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step5a() {
        var /** number */ v_1 = base.limit - base.cursor;
        lab0: {
            if (!(base.eq_s_b("\u03B1\u03B3\u03B1\u03BC\u03B5")))
            {
                break lab0;
            }
            if (base.cursor > base.limit_backward)
            {
                break lab0;
            }
            if (!base.slice_from("\u03B1\u03B3\u03B1\u03BC"))
            {
                return false;
            }
        }
        base.cursor = base.limit - v_1;
        var /** number */ v_2 = base.limit - base.cursor;
        lab1: {
            base.ket = base.cursor;
            if (base.find_among_b(a_40) == 0)
            {
                break lab1;
            }
            base.bra = base.cursor;
            if (!base.slice_del())
            {
                return false;
            }
            B_test1 = false;
        }
        base.cursor = base.limit - v_2;
        base.ket = base.cursor;
        if (!(base.eq_s_b("\u03B1\u03BC\u03B5")))
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        base.ket = base.cursor;
        base.bra = base.cursor;
        if (base.find_among_b(a_41) == 0)
        {
            return false;
        }
        if (base.cursor > base.limit_backward)
        {
            return false;
        }
        if (!base.slice_from("\u03B1\u03BC"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step5b() {
        var /** number */ v_1 = base.limit - base.cursor;
        lab0: {
            base.ket = base.cursor;
            if (base.find_among_b(a_43) == 0)
            {
                break lab0;
            }
            base.bra = base.cursor;
            if (!base.slice_del())
            {
                return false;
            }
            B_test1 = false;
            base.ket = base.cursor;
            base.bra = base.cursor;
            if (base.find_among_b(a_42) == 0)
            {
                break lab0;
            }
            if (base.cursor > base.limit_backward)
            {
                break lab0;
            }
            if (!base.slice_from("\u03B1\u03B3\u03B1\u03BD"))
            {
                return false;
            }
        }
        base.cursor = base.limit - v_1;
        base.ket = base.cursor;
        if (!(base.eq_s_b("\u03B1\u03BD\u03B5")))
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        lab1: {
            var /** number */ v_2 = base.limit - base.cursor;
            lab2: {
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (!(base.in_grouping_b(g_v2, 945, 969)))
                {
                    break lab2;
                }
                if (!base.slice_from("\u03B1\u03BD"))
                {
                    return false;
                }
                break lab1;
            }
            base.cursor = base.limit - v_2;
            base.ket = base.cursor;
        }
        base.bra = base.cursor;
        if (base.find_among_b(a_44) == 0)
        {
            return false;
        }
        if (base.cursor > base.limit_backward)
        {
            return false;
        }
        if (!base.slice_from("\u03B1\u03BD"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step5c() {
        var /** number */ v_1 = base.limit - base.cursor;
        lab0: {
            base.ket = base.cursor;
            if (base.find_among_b(a_45) == 0)
            {
                break lab0;
            }
            base.bra = base.cursor;
            if (!base.slice_del())
            {
                return false;
            }
            B_test1 = false;
        }
        base.cursor = base.limit - v_1;
        base.ket = base.cursor;
        if (!(base.eq_s_b("\u03B5\u03C4\u03B5")))
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        lab1: {
            var /** number */ v_2 = base.limit - base.cursor;
            lab2: {
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (!(base.in_grouping_b(g_v2, 945, 969)))
                {
                    break lab2;
                }
                if (!base.slice_from("\u03B5\u03C4"))
                {
                    return false;
                }
                break lab1;
            }
            base.cursor = base.limit - v_2;
            lab3: {
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (base.find_among_b(a_46) == 0)
                {
                    break lab3;
                }
                if (!base.slice_from("\u03B5\u03C4"))
                {
                    return false;
                }
                break lab1;
            }
            base.cursor = base.limit - v_2;
            base.ket = base.cursor;
        }
        base.bra = base.cursor;
        if (base.find_among_b(a_47) == 0)
        {
            return false;
        }
        if (base.cursor > base.limit_backward)
        {
            return false;
        }
        if (!base.slice_from("\u03B5\u03C4"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step5d() {
        base.ket = base.cursor;
        if (base.find_among_b(a_48) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        lab0: {
            var /** number */ v_1 = base.limit - base.cursor;
            lab1: {
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (!(base.eq_s_b("\u03B1\u03C1\u03C7")))
                {
                    break lab1;
                }
                if (base.cursor > base.limit_backward)
                {
                    break lab1;
                }
                if (!base.slice_from("\u03BF\u03BD\u03C4"))
                {
                    return false;
                }
                break lab0;
            }
            base.cursor = base.limit - v_1;
            base.ket = base.cursor;
            base.bra = base.cursor;
            if (!(base.eq_s_b("\u03BA\u03C1\u03B5")))
            {
                return false;
            }
            if (!base.slice_from("\u03C9\u03BD\u03C4"))
            {
                return false;
            }
        }
        return true;
    };

    /** @return {boolean} */
    function r_step5e() {
        base.ket = base.cursor;
        if (base.find_among_b(a_49) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        base.ket = base.cursor;
        base.bra = base.cursor;
        if (!(base.eq_s_b("\u03BF\u03BD")))
        {
            return false;
        }
        if (base.cursor > base.limit_backward)
        {
            return false;
        }
        if (!base.slice_from("\u03BF\u03BC\u03B1\u03C3\u03C4"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step5f() {
        var /** number */ v_1 = base.limit - base.cursor;
        lab0: {
            base.ket = base.cursor;
            if (!(base.eq_s_b("\u03B9\u03B5\u03C3\u03C4\u03B5")))
            {
                break lab0;
            }
            base.bra = base.cursor;
            if (!base.slice_del())
            {
                return false;
            }
            B_test1 = false;
            base.ket = base.cursor;
            base.bra = base.cursor;
            if (base.find_among_b(a_50) == 0)
            {
                break lab0;
            }
            if (base.cursor > base.limit_backward)
            {
                break lab0;
            }
            if (!base.slice_from("\u03B9\u03B5\u03C3\u03C4"))
            {
                return false;
            }
        }
        base.cursor = base.limit - v_1;
        base.ket = base.cursor;
        if (!(base.eq_s_b("\u03B5\u03C3\u03C4\u03B5")))
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        base.ket = base.cursor;
        base.bra = base.cursor;
        if (base.find_among_b(a_51) == 0)
        {
            return false;
        }
        if (base.cursor > base.limit_backward)
        {
            return false;
        }
        if (!base.slice_from("\u03B9\u03B5\u03C3\u03C4"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step5g() {
        var /** number */ v_1 = base.limit - base.cursor;
        lab0: {
            base.ket = base.cursor;
            if (base.find_among_b(a_52) == 0)
            {
                break lab0;
            }
            base.bra = base.cursor;
            if (!base.slice_del())
            {
                return false;
            }
            B_test1 = false;
        }
        base.cursor = base.limit - v_1;
        base.ket = base.cursor;
        if (base.find_among_b(a_55) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        lab1: {
            var /** number */ v_2 = base.limit - base.cursor;
            lab2: {
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (base.find_among_b(a_53) == 0)
                {
                    break lab2;
                }
                if (!base.slice_from("\u03B7\u03BA"))
                {
                    return false;
                }
                break lab1;
            }
            base.cursor = base.limit - v_2;
            base.ket = base.cursor;
            base.bra = base.cursor;
            if (base.find_among_b(a_54) == 0)
            {
                return false;
            }
            if (base.cursor > base.limit_backward)
            {
                return false;
            }
            if (!base.slice_from("\u03B7\u03BA"))
            {
                return false;
            }
        }
        return true;
    };

    /** @return {boolean} */
    function r_step5h() {
        base.ket = base.cursor;
        if (base.find_among_b(a_58) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        lab0: {
            var /** number */ v_1 = base.limit - base.cursor;
            lab1: {
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (base.find_among_b(a_56) == 0)
                {
                    break lab1;
                }
                if (!base.slice_from("\u03BF\u03C5\u03C3"))
                {
                    return false;
                }
                break lab0;
            }
            base.cursor = base.limit - v_1;
            base.ket = base.cursor;
            base.bra = base.cursor;
            if (base.find_among_b(a_57) == 0)
            {
                return false;
            }
            if (base.cursor > base.limit_backward)
            {
                return false;
            }
            if (!base.slice_from("\u03BF\u03C5\u03C3"))
            {
                return false;
            }
        }
        return true;
    };

    /** @return {boolean} */
    function r_step5i() {
        base.ket = base.cursor;
        if (base.find_among_b(a_62) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        lab0: {
            var /** number */ v_1 = base.limit - base.cursor;
            lab1: {
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (!(base.eq_s_b("\u03BA\u03BF\u03BB\u03BB")))
                {
                    break lab1;
                }
                if (!base.slice_from("\u03B1\u03B3"))
                {
                    return false;
                }
                break lab0;
            }
            base.cursor = base.limit - v_1;
            {
                var /** number */ v_2 = base.limit - base.cursor;
                lab2: {
                    base.ket = base.cursor;
                    if (base.find_among_b(a_59) == 0)
                    {
                        break lab2;
                    }
                    base.bra = base.cursor;
                    return false;
                }
                base.cursor = base.limit - v_2;
            }
            lab3: {
                var /** number */ v_3 = base.limit - base.cursor;
                lab4: {
                    base.ket = base.cursor;
                    base.bra = base.cursor;
                    if (base.find_among_b(a_60) == 0)
                    {
                        break lab4;
                    }
                    if (!base.slice_from("\u03B1\u03B3"))
                    {
                        return false;
                    }
                    break lab3;
                }
                base.cursor = base.limit - v_3;
                base.ket = base.cursor;
                base.bra = base.cursor;
                if (base.find_among_b(a_61) == 0)
                {
                    return false;
                }
                if (base.cursor > base.limit_backward)
                {
                    return false;
                }
                if (!base.slice_from("\u03B1\u03B3"))
                {
                    return false;
                }
            }
        }
        return true;
    };

    /** @return {boolean} */
    function r_step5j() {
        base.ket = base.cursor;
        if (base.find_among_b(a_63) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        base.ket = base.cursor;
        base.bra = base.cursor;
        if (base.find_among_b(a_64) == 0)
        {
            return false;
        }
        if (base.cursor > base.limit_backward)
        {
            return false;
        }
        if (!base.slice_from("\u03B7\u03C3"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step5k() {
        base.ket = base.cursor;
        if (base.find_among_b(a_65) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        base.ket = base.cursor;
        base.bra = base.cursor;
        if (base.find_among_b(a_66) == 0)
        {
            return false;
        }
        if (base.cursor > base.limit_backward)
        {
            return false;
        }
        if (!base.slice_from("\u03B7\u03C3\u03C4"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step5l() {
        base.ket = base.cursor;
        if (base.find_among_b(a_67) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        base.ket = base.cursor;
        base.bra = base.cursor;
        if (base.find_among_b(a_68) == 0)
        {
            return false;
        }
        if (base.cursor > base.limit_backward)
        {
            return false;
        }
        if (!base.slice_from("\u03BF\u03C5\u03BD"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step5m() {
        base.ket = base.cursor;
        if (base.find_among_b(a_69) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        B_test1 = false;
        base.ket = base.cursor;
        base.bra = base.cursor;
        if (base.find_among_b(a_70) == 0)
        {
            return false;
        }
        if (base.cursor > base.limit_backward)
        {
            return false;
        }
        if (!base.slice_from("\u03BF\u03C5\u03BC"))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step6() {
        var /** number */ v_1 = base.limit - base.cursor;
        lab0: {
            base.ket = base.cursor;
            if (base.find_among_b(a_71) == 0)
            {
                break lab0;
            }
            base.bra = base.cursor;
            if (!base.slice_from("\u03BC\u03B1"))
            {
                return false;
            }
        }
        base.cursor = base.limit - v_1;
        if (!B_test1)
        {
            return false;
        }
        base.ket = base.cursor;
        if (base.find_among_b(a_72) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step7() {
        base.ket = base.cursor;
        if (base.find_among_b(a_73) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        return true;
    };

    this.stem = /** @return {boolean} */ function() {
        base.limit_backward = base.cursor; base.cursor = base.limit;
        var /** number */ v_1 = base.limit - base.cursor;
        r_tolower();
        base.cursor = base.limit - v_1;
        if (!r_has_min_length())
        {
            return false;
        }
        B_test1 = true;
        var /** number */ v_2 = base.limit - base.cursor;
        r_step1();
        base.cursor = base.limit - v_2;
        var /** number */ v_3 = base.limit - base.cursor;
        r_steps1();
        base.cursor = base.limit - v_3;
        var /** number */ v_4 = base.limit - base.cursor;
        r_steps2();
        base.cursor = base.limit - v_4;
        var /** number */ v_5 = base.limit - base.cursor;
        r_steps3();
        base.cursor = base.limit - v_5;
        var /** number */ v_6 = base.limit - base.cursor;
        r_steps4();
        base.cursor = base.limit - v_6;
        var /** number */ v_7 = base.limit - base.cursor;
        r_steps5();
        base.cursor = base.limit - v_7;
        var /** number */ v_8 = base.limit - base.cursor;
        r_steps6();
        base.cursor = base.limit - v_8;
        var /** number */ v_9 = base.limit - base.cursor;
        r_steps7();
        base.cursor = base.limit - v_9;
        var /** number */ v_10 = base.limit - base.cursor;
        r_steps8();
        base.cursor = base.limit - v_10;
        var /** number */ v_11 = base.limit - base.cursor;
        r_steps9();
        base.cursor = base.limit - v_11;
        var /** number */ v_12 = base.limit - base.cursor;
        r_steps10();
        base.cursor = base.limit - v_12;
        var /** number */ v_13 = base.limit - base.cursor;
        r_step2a();
        base.cursor = base.limit - v_13;
        var /** number */ v_14 = base.limit - base.cursor;
        r_step2b();
        base.cursor = base.limit - v_14;
        var /** number */ v_15 = base.limit - base.cursor;
        r_step2c();
        base.cursor = base.limit - v_15;
        var /** number */ v_16 = base.limit - base.cursor;
        r_step2d();
        base.cursor = base.limit - v_16;
        var /** number */ v_17 = base.limit - base.cursor;
        r_step3();
        base.cursor = base.limit - v_17;
        var /** number */ v_18 = base.limit - base.cursor;
        r_step4();
        base.cursor = base.limit - v_18;
        var /** number */ v_19 = base.limit - base.cursor;
        r_step5a();
        base.cursor = base.limit - v_19;
        var /** number */ v_20 = base.limit - base.cursor;
        r_step5b();
        base.cursor = base.limit - v_20;
        var /** number */ v_21 = base.limit - base.cursor;
        r_step5c();
        base.cursor = base.limit - v_21;
        var /** number */ v_22 = base.limit - base.cursor;
        r_step5d();
        base.cursor = base.limit - v_22;
        var /** number */ v_23 = base.limit - base.cursor;
        r_step5e();
        base.cursor = base.limit - v_23;
        var /** number */ v_24 = base.limit - base.cursor;
        r_step5f();
        base.cursor = base.limit - v_24;
        var /** number */ v_25 = base.limit - base.cursor;
        r_step5g();
        base.cursor = base.limit - v_25;
        var /** number */ v_26 = base.limit - base.cursor;
        r_step5h();
        base.cursor = base.limit - v_26;
        var /** number */ v_27 = base.limit - base.cursor;
        r_step5j();
        base.cursor = base.limit - v_27;
        var /** number */ v_28 = base.limit - base.cursor;
        r_step5i();
        base.cursor = base.limit - v_28;
        var /** number */ v_29 = base.limit - base.cursor;
        r_step5k();
        base.cursor = base.limit - v_29;
        var /** number */ v_30 = base.limit - base.cursor;
        r_step5l();
        base.cursor = base.limit - v_30;
        var /** number */ v_31 = base.limit - base.cursor;
        r_step5m();
        base.cursor = base.limit - v_31;
        var /** number */ v_32 = base.limit - base.cursor;
        r_step6();
        base.cursor = base.limit - v_32;
        var /** number */ v_33 = base.limit - base.cursor;
        r_step7();
        base.cursor = base.limit - v_33;
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


return new GreekStemmer();
}