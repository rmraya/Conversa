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
NepaliStemmer = function() {
    var base = new BaseStemmer();
    /** @const */ var a_0 = [
        ["\u0932\u093E\u0907", -1, 1],
        ["\u0932\u093E\u0908", -1, 1],
        ["\u0938\u0901\u0917", -1, 1],
        ["\u0938\u0902\u0917", -1, 1],
        ["\u092E\u093E\u0930\u094D\u092B\u0924", -1, 1],
        ["\u0930\u0924", -1, 1],
        ["\u0915\u093E", -1, 2],
        ["\u092E\u093E", -1, 1],
        ["\u0926\u094D\u0935\u093E\u0930\u093E", -1, 1],
        ["\u0915\u093F", -1, 2],
        ["\u092A\u091B\u093F", -1, 1],
        ["\u0915\u0940", -1, 2],
        ["\u0932\u0947", -1, 1],
        ["\u0915\u0948", -1, 2],
        ["\u0938\u0901\u0917\u0948", -1, 1],
        ["\u092E\u0948", -1, 1],
        ["\u0915\u094B", -1, 2]
    ];

    /** @const */ var a_1 = [
        ["\u0901", -1, -1],
        ["\u0902", -1, -1],
        ["\u0948", -1, -1]
    ];

    /** @const */ var a_2 = [
        ["\u0901", -1, 1],
        ["\u0902", -1, 1],
        ["\u0948", -1, 2]
    ];

    /** @const */ var a_3 = [
        ["\u0925\u093F\u090F", -1, 1],
        ["\u091B", -1, 1],
        ["\u0907\u091B", 1, 1],
        ["\u090F\u091B", 1, 1],
        ["\u093F\u091B", 1, 1],
        ["\u0947\u091B", 1, 1],
        ["\u0928\u0947\u091B", 5, 1],
        ["\u0939\u0941\u0928\u0947\u091B", 6, 1],
        ["\u0907\u0928\u094D\u091B", 1, 1],
        ["\u093F\u0928\u094D\u091B", 1, 1],
        ["\u0939\u0941\u0928\u094D\u091B", 1, 1],
        ["\u090F\u0915\u093E", -1, 1],
        ["\u0907\u090F\u0915\u093E", 11, 1],
        ["\u093F\u090F\u0915\u093E", 11, 1],
        ["\u0947\u0915\u093E", -1, 1],
        ["\u0928\u0947\u0915\u093E", 14, 1],
        ["\u0926\u093E", -1, 1],
        ["\u0907\u0926\u093E", 16, 1],
        ["\u093F\u0926\u093E", 16, 1],
        ["\u0926\u0947\u0916\u093F", -1, 1],
        ["\u092E\u093E\u0925\u093F", -1, 1],
        ["\u090F\u0915\u0940", -1, 1],
        ["\u0907\u090F\u0915\u0940", 21, 1],
        ["\u093F\u090F\u0915\u0940", 21, 1],
        ["\u0947\u0915\u0940", -1, 1],
        ["\u0926\u0947\u0916\u0940", -1, 1],
        ["\u0925\u0940", -1, 1],
        ["\u0926\u0940", -1, 1],
        ["\u091B\u0941", -1, 1],
        ["\u090F\u091B\u0941", 28, 1],
        ["\u0947\u091B\u0941", 28, 1],
        ["\u0928\u0947\u091B\u0941", 30, 1],
        ["\u0928\u0941", -1, 1],
        ["\u0939\u0930\u0941", -1, 1],
        ["\u0939\u0930\u0942", -1, 1],
        ["\u091B\u0947", -1, 1],
        ["\u0925\u0947", -1, 1],
        ["\u0928\u0947", -1, 1],
        ["\u090F\u0915\u0948", -1, 1],
        ["\u0947\u0915\u0948", -1, 1],
        ["\u0928\u0947\u0915\u0948", 39, 1],
        ["\u0926\u0948", -1, 1],
        ["\u0907\u0926\u0948", 41, 1],
        ["\u093F\u0926\u0948", 41, 1],
        ["\u090F\u0915\u094B", -1, 1],
        ["\u0907\u090F\u0915\u094B", 44, 1],
        ["\u093F\u090F\u0915\u094B", 44, 1],
        ["\u0947\u0915\u094B", -1, 1],
        ["\u0928\u0947\u0915\u094B", 47, 1],
        ["\u0926\u094B", -1, 1],
        ["\u0907\u0926\u094B", 49, 1],
        ["\u093F\u0926\u094B", 49, 1],
        ["\u092F\u094B", -1, 1],
        ["\u0907\u092F\u094B", 52, 1],
        ["\u092D\u092F\u094B", 52, 1],
        ["\u093F\u092F\u094B", 52, 1],
        ["\u0925\u093F\u092F\u094B", 55, 1],
        ["\u0926\u093F\u092F\u094B", 55, 1],
        ["\u0925\u094D\u092F\u094B", 52, 1],
        ["\u091B\u094C", -1, 1],
        ["\u0907\u091B\u094C", 59, 1],
        ["\u090F\u091B\u094C", 59, 1],
        ["\u093F\u091B\u094C", 59, 1],
        ["\u0947\u091B\u094C", 59, 1],
        ["\u0928\u0947\u091B\u094C", 63, 1],
        ["\u092F\u094C", -1, 1],
        ["\u0925\u093F\u092F\u094C", 65, 1],
        ["\u091B\u094D\u092F\u094C", 65, 1],
        ["\u0925\u094D\u092F\u094C", 65, 1],
        ["\u091B\u0928\u094D", -1, 1],
        ["\u0907\u091B\u0928\u094D", 69, 1],
        ["\u090F\u091B\u0928\u094D", 69, 1],
        ["\u093F\u091B\u0928\u094D", 69, 1],
        ["\u0947\u091B\u0928\u094D", 69, 1],
        ["\u0928\u0947\u091B\u0928\u094D", 73, 1],
        ["\u0932\u093E\u0928\u094D", -1, 1],
        ["\u091B\u093F\u0928\u094D", -1, 1],
        ["\u0925\u093F\u0928\u094D", -1, 1],
        ["\u092A\u0930\u094D", -1, 1],
        ["\u0907\u0938\u094D", -1, 1],
        ["\u0925\u093F\u0907\u0938\u094D", 79, 1],
        ["\u091B\u0938\u094D", -1, 1],
        ["\u0907\u091B\u0938\u094D", 81, 1],
        ["\u090F\u091B\u0938\u094D", 81, 1],
        ["\u093F\u091B\u0938\u094D", 81, 1],
        ["\u0947\u091B\u0938\u094D", 81, 1],
        ["\u0928\u0947\u091B\u0938\u094D", 85, 1],
        ["\u093F\u0938\u094D", -1, 1],
        ["\u0925\u093F\u0938\u094D", 87, 1],
        ["\u091B\u0947\u0938\u094D", -1, 1],
        ["\u0939\u094B\u0938\u094D", -1, 1]
    ];



    /** @return {boolean} */
    function r_remove_category_1() {
        var /** number */ among_var;
        base.ket = base.cursor;
        among_var = base.find_among_b(a_0);
        if (among_var == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        switch (among_var) {
            case 1:
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 2:
                lab0: {
                    var /** number */ v_1 = base.limit - base.cursor;
                    lab1: {
                        lab2: {
                            var /** number */ v_2 = base.limit - base.cursor;
                            lab3: {
                                if (!(base.eq_s_b("\u090F")))
                                {
                                    break lab3;
                                }
                                break lab2;
                            }
                            base.cursor = base.limit - v_2;
                            if (!(base.eq_s_b("\u0947")))
                            {
                                break lab1;
                            }
                        }
                        break lab0;
                    }
                    base.cursor = base.limit - v_1;
                    if (!base.slice_del())
                    {
                        return false;
                    }
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_check_category_2() {
        base.ket = base.cursor;
        if (base.find_among_b(a_1) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        return true;
    };

    /** @return {boolean} */
    function r_remove_category_2() {
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
                lab0: {
                    var /** number */ v_1 = base.limit - base.cursor;
                    lab1: {
                        if (!(base.eq_s_b("\u092F\u094C")))
                        {
                            break lab1;
                        }
                        break lab0;
                    }
                    base.cursor = base.limit - v_1;
                    lab2: {
                        if (!(base.eq_s_b("\u091B\u094C")))
                        {
                            break lab2;
                        }
                        break lab0;
                    }
                    base.cursor = base.limit - v_1;
                    lab3: {
                        if (!(base.eq_s_b("\u0928\u094C")))
                        {
                            break lab3;
                        }
                        break lab0;
                    }
                    base.cursor = base.limit - v_1;
                    if (!(base.eq_s_b("\u0925\u0947")))
                    {
                        return false;
                    }
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 2:
                if (!(base.eq_s_b("\u0924\u094D\u0930")))
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
    function r_remove_category_3() {
        base.ket = base.cursor;
        if (base.find_among_b(a_3) == 0)
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
        r_remove_category_1();
        base.cursor = base.limit - v_1;
        var /** number */ v_2 = base.limit - base.cursor;
        lab0: {
            while(true)
            {
                var /** number */ v_3 = base.limit - base.cursor;
                lab1: {
                    var /** number */ v_4 = base.limit - base.cursor;
                    lab2: {
                        var /** number */ v_5 = base.limit - base.cursor;
                        if (!r_check_category_2())
                        {
                            break lab2;
                        }
                        base.cursor = base.limit - v_5;
                        if (!r_remove_category_2())
                        {
                            break lab2;
                        }
                    }
                    base.cursor = base.limit - v_4;
                    if (!r_remove_category_3())
                    {
                        break lab1;
                    }
                    continue;
                }
                base.cursor = base.limit - v_3;
                break;
            }
        }
        base.cursor = base.limit - v_2;
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


return new NepaliStemmer();
}