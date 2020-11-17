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
LithuanianStemmer = function() {
    var base = new BaseStemmer();
    /** @const */ var a_0 = [
        ["a", -1, -1],
        ["ia", 0, -1],
        ["eria", 1, -1],
        ["osna", 0, -1],
        ["iosna", 3, -1],
        ["uosna", 3, -1],
        ["iuosna", 5, -1],
        ["ysna", 0, -1],
        ["\u0117sna", 0, -1],
        ["e", -1, -1],
        ["ie", 9, -1],
        ["enie", 10, -1],
        ["erie", 10, -1],
        ["oje", 9, -1],
        ["ioje", 13, -1],
        ["uje", 9, -1],
        ["iuje", 15, -1],
        ["yje", 9, -1],
        ["enyje", 17, -1],
        ["eryje", 17, -1],
        ["\u0117je", 9, -1],
        ["ame", 9, -1],
        ["iame", 21, -1],
        ["sime", 9, -1],
        ["ome", 9, -1],
        ["\u0117me", 9, -1],
        ["tum\u0117me", 25, -1],
        ["ose", 9, -1],
        ["iose", 27, -1],
        ["uose", 27, -1],
        ["iuose", 29, -1],
        ["yse", 9, -1],
        ["enyse", 31, -1],
        ["eryse", 31, -1],
        ["\u0117se", 9, -1],
        ["ate", 9, -1],
        ["iate", 35, -1],
        ["ite", 9, -1],
        ["kite", 37, -1],
        ["site", 37, -1],
        ["ote", 9, -1],
        ["tute", 9, -1],
        ["\u0117te", 9, -1],
        ["tum\u0117te", 42, -1],
        ["i", -1, -1],
        ["ai", 44, -1],
        ["iai", 45, -1],
        ["eriai", 46, -1],
        ["ei", 44, -1],
        ["tumei", 48, -1],
        ["ki", 44, -1],
        ["imi", 44, -1],
        ["erimi", 51, -1],
        ["umi", 44, -1],
        ["iumi", 53, -1],
        ["si", 44, -1],
        ["asi", 55, -1],
        ["iasi", 56, -1],
        ["esi", 55, -1],
        ["iesi", 58, -1],
        ["siesi", 59, -1],
        ["isi", 55, -1],
        ["aisi", 61, -1],
        ["eisi", 61, -1],
        ["tumeisi", 63, -1],
        ["uisi", 61, -1],
        ["osi", 55, -1],
        ["\u0117josi", 66, -1],
        ["uosi", 66, -1],
        ["iuosi", 68, -1],
        ["siuosi", 69, -1],
        ["usi", 55, -1],
        ["ausi", 71, -1],
        ["\u010Diausi", 72, -1],
        ["\u0105si", 55, -1],
        ["\u0117si", 55, -1],
        ["\u0173si", 55, -1],
        ["t\u0173si", 76, -1],
        ["ti", 44, -1],
        ["enti", 78, -1],
        ["inti", 78, -1],
        ["oti", 78, -1],
        ["ioti", 81, -1],
        ["uoti", 81, -1],
        ["iuoti", 83, -1],
        ["auti", 78, -1],
        ["iauti", 85, -1],
        ["yti", 78, -1],
        ["\u0117ti", 78, -1],
        ["tel\u0117ti", 88, -1],
        ["in\u0117ti", 88, -1],
        ["ter\u0117ti", 88, -1],
        ["ui", 44, -1],
        ["iui", 92, -1],
        ["eniui", 93, -1],
        ["oj", -1, -1],
        ["\u0117j", -1, -1],
        ["k", -1, -1],
        ["am", -1, -1],
        ["iam", 98, -1],
        ["iem", -1, -1],
        ["im", -1, -1],
        ["sim", 101, -1],
        ["om", -1, -1],
        ["tum", -1, -1],
        ["\u0117m", -1, -1],
        ["tum\u0117m", 105, -1],
        ["an", -1, -1],
        ["on", -1, -1],
        ["ion", 108, -1],
        ["un", -1, -1],
        ["iun", 110, -1],
        ["\u0117n", -1, -1],
        ["o", -1, -1],
        ["io", 113, -1],
        ["enio", 114, -1],
        ["\u0117jo", 113, -1],
        ["uo", 113, -1],
        ["s", -1, -1],
        ["as", 118, -1],
        ["ias", 119, -1],
        ["es", 118, -1],
        ["ies", 121, -1],
        ["is", 118, -1],
        ["ais", 123, -1],
        ["iais", 124, -1],
        ["tumeis", 123, -1],
        ["imis", 123, -1],
        ["enimis", 127, -1],
        ["omis", 123, -1],
        ["iomis", 129, -1],
        ["umis", 123, -1],
        ["\u0117mis", 123, -1],
        ["enis", 123, -1],
        ["asis", 123, -1],
        ["ysis", 123, -1],
        ["ams", 118, -1],
        ["iams", 136, -1],
        ["iems", 118, -1],
        ["ims", 118, -1],
        ["enims", 139, -1],
        ["erims", 139, -1],
        ["oms", 118, -1],
        ["ioms", 142, -1],
        ["ums", 118, -1],
        ["\u0117ms", 118, -1],
        ["ens", 118, -1],
        ["os", 118, -1],
        ["ios", 147, -1],
        ["uos", 147, -1],
        ["iuos", 149, -1],
        ["ers", 118, -1],
        ["us", 118, -1],
        ["aus", 152, -1],
        ["iaus", 153, -1],
        ["ius", 152, -1],
        ["ys", 118, -1],
        ["enys", 156, -1],
        ["erys", 156, -1],
        ["\u0105s", 118, -1],
        ["i\u0105s", 159, -1],
        ["\u0117s", 118, -1],
        ["am\u0117s", 161, -1],
        ["iam\u0117s", 162, -1],
        ["im\u0117s", 161, -1],
        ["kim\u0117s", 164, -1],
        ["sim\u0117s", 164, -1],
        ["om\u0117s", 161, -1],
        ["\u0117m\u0117s", 161, -1],
        ["tum\u0117m\u0117s", 168, -1],
        ["at\u0117s", 161, -1],
        ["iat\u0117s", 170, -1],
        ["sit\u0117s", 161, -1],
        ["ot\u0117s", 161, -1],
        ["\u0117t\u0117s", 161, -1],
        ["tum\u0117t\u0117s", 174, -1],
        ["\u012Fs", 118, -1],
        ["\u016Bs", 118, -1],
        ["t\u0173s", 118, -1],
        ["at", -1, -1],
        ["iat", 179, -1],
        ["it", -1, -1],
        ["sit", 181, -1],
        ["ot", -1, -1],
        ["\u0117t", -1, -1],
        ["tum\u0117t", 184, -1],
        ["u", -1, -1],
        ["au", 186, -1],
        ["iau", 187, -1],
        ["\u010Diau", 188, -1],
        ["iu", 186, -1],
        ["eniu", 190, -1],
        ["siu", 190, -1],
        ["y", -1, -1],
        ["\u0105", -1, -1],
        ["i\u0105", 194, -1],
        ["\u0117", -1, -1],
        ["\u0119", -1, -1],
        ["\u012F", -1, -1],
        ["en\u012F", 198, -1],
        ["er\u012F", 198, -1],
        ["\u0173", -1, -1],
        ["i\u0173", 201, -1],
        ["er\u0173", 201, -1]
    ];

    /** @const */ var a_1 = [
        ["ing", -1, -1],
        ["aj", -1, -1],
        ["iaj", 1, -1],
        ["iej", -1, -1],
        ["oj", -1, -1],
        ["ioj", 4, -1],
        ["uoj", 4, -1],
        ["iuoj", 6, -1],
        ["auj", -1, -1],
        ["\u0105j", -1, -1],
        ["i\u0105j", 9, -1],
        ["\u0117j", -1, -1],
        ["\u0173j", -1, -1],
        ["i\u0173j", 12, -1],
        ["ok", -1, -1],
        ["iok", 14, -1],
        ["iuk", -1, -1],
        ["uliuk", 16, -1],
        ["u\u010Diuk", 16, -1],
        ["i\u0161k", -1, -1],
        ["iul", -1, -1],
        ["yl", -1, -1],
        ["\u0117l", -1, -1],
        ["am", -1, -1],
        ["dam", 23, -1],
        ["jam", 23, -1],
        ["zgan", -1, -1],
        ["ain", -1, -1],
        ["esn", -1, -1],
        ["op", -1, -1],
        ["iop", 29, -1],
        ["ias", -1, -1],
        ["ies", -1, -1],
        ["ais", -1, -1],
        ["iais", 33, -1],
        ["os", -1, -1],
        ["ios", 35, -1],
        ["uos", 35, -1],
        ["iuos", 37, -1],
        ["aus", -1, -1],
        ["iaus", 39, -1],
        ["\u0105s", -1, -1],
        ["i\u0105s", 41, -1],
        ["\u0119s", -1, -1],
        ["ut\u0117ait", -1, -1],
        ["ant", -1, -1],
        ["iant", 45, -1],
        ["siant", 46, -1],
        ["int", -1, -1],
        ["ot", -1, -1],
        ["uot", 49, -1],
        ["iuot", 50, -1],
        ["yt", -1, -1],
        ["\u0117t", -1, -1],
        ["yk\u0161t", -1, -1],
        ["iau", -1, -1],
        ["dav", -1, -1],
        ["sv", -1, -1],
        ["\u0161v", -1, -1],
        ["yk\u0161\u010D", -1, -1],
        ["\u0119", -1, -1],
        ["\u0117j\u0119", 60, -1]
    ];

    /** @const */ var a_2 = [
        ["ojime", -1, 7],
        ["\u0117jime", -1, 3],
        ["avime", -1, 6],
        ["okate", -1, 8],
        ["aite", -1, 1],
        ["uote", -1, 2],
        ["asius", -1, 5],
        ["okat\u0117s", -1, 8],
        ["ait\u0117s", -1, 1],
        ["uot\u0117s", -1, 2],
        ["esiu", -1, 4]
    ];

    /** @const */ var a_3 = [
        ["\u010D", -1, 1],
        ["d\u017E", -1, 2]
    ];

    /** @const */ var a_4 = [
        ["gd", -1, 1]
    ];

    /** @const */ var /** Array<int> */ g_v = [17, 65, 16, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 64, 1, 0, 64, 0, 0, 0, 0, 0, 0, 0, 4, 4];

    var /** number */ I_p1 = 0;


    /** @return {boolean} */
    function r_R1() {
        if (!(I_p1 <= base.cursor))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_step1() {
        if (base.cursor < I_p1)
        {
            return false;
        }
        var /** number */ v_2 = base.limit_backward;
        base.limit_backward = I_p1;
        base.ket = base.cursor;
        if (base.find_among_b(a_0) == 0)
        {
            base.limit_backward = v_2;
            return false;
        }
        base.bra = base.cursor;
        base.limit_backward = v_2;
        if (!r_R1())
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
    function r_step2() {
        while(true)
        {
            var /** number */ v_1 = base.limit - base.cursor;
            lab0: {
                if (base.cursor < I_p1)
                {
                    break lab0;
                }
                var /** number */ v_3 = base.limit_backward;
                base.limit_backward = I_p1;
                base.ket = base.cursor;
                if (base.find_among_b(a_1) == 0)
                {
                    base.limit_backward = v_3;
                    break lab0;
                }
                base.bra = base.cursor;
                base.limit_backward = v_3;
                if (!base.slice_del())
                {
                    return false;
                }
                continue;
            }
            base.cursor = base.limit - v_1;
            break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_fix_conflicts() {
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
                if (!base.slice_from("ait\u0117"))
                {
                    return false;
                }
                break;
            case 2:
                if (!base.slice_from("uot\u0117"))
                {
                    return false;
                }
                break;
            case 3:
                if (!base.slice_from("\u0117jimas"))
                {
                    return false;
                }
                break;
            case 4:
                if (!base.slice_from("esys"))
                {
                    return false;
                }
                break;
            case 5:
                if (!base.slice_from("asys"))
                {
                    return false;
                }
                break;
            case 6:
                if (!base.slice_from("avimas"))
                {
                    return false;
                }
                break;
            case 7:
                if (!base.slice_from("ojimas"))
                {
                    return false;
                }
                break;
            case 8:
                if (!base.slice_from("okat\u0117"))
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_fix_chdz() {
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
                if (!base.slice_from("t"))
                {
                    return false;
                }
                break;
            case 2:
                if (!base.slice_from("d"))
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_fix_gd() {
        base.ket = base.cursor;
        if (base.find_among_b(a_4) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_from("g"))
        {
            return false;
        }
        return true;
    };

    this.stem = /** @return {boolean} */ function() {
        I_p1 = base.limit;
        var /** number */ v_1 = base.cursor;
        lab0: {
            var /** number */ v_2 = base.cursor;
            lab1: {
                var /** number */ v_3 = base.cursor;
                if (!(base.eq_s("a")))
                {
                    base.cursor = v_2;
                    break lab1;
                }
                base.cursor = v_3;
                if (!(base.current.length > 6))
                {
                    base.cursor = v_2;
                    break lab1;
                }
                {
                    var /** number */ c1 = base.cursor + 1;
                    if (0 > c1 || c1 > base.limit)
                    {
                        base.cursor = v_2;
                        break lab1;
                    }
                    base.cursor = c1;
                }
            }
            golab2: while(true)
            {
                lab3: {
                    if (!(base.in_grouping(g_v, 97, 371)))
                    {
                        break lab3;
                    }
                    break golab2;
                }
                if (base.cursor >= base.limit)
                {
                    break lab0;
                }
                base.cursor++;
            }
            golab4: while(true)
            {
                lab5: {
                    if (!(base.out_grouping(g_v, 97, 371)))
                    {
                        break lab5;
                    }
                    break golab4;
                }
                if (base.cursor >= base.limit)
                {
                    break lab0;
                }
                base.cursor++;
            }
            I_p1 = base.cursor;
        }
        base.cursor = v_1;
        base.limit_backward = base.cursor; base.cursor = base.limit;
        var /** number */ v_6 = base.limit - base.cursor;
        r_fix_conflicts();
        base.cursor = base.limit - v_6;
        var /** number */ v_7 = base.limit - base.cursor;
        r_step1();
        base.cursor = base.limit - v_7;
        var /** number */ v_8 = base.limit - base.cursor;
        r_fix_chdz();
        base.cursor = base.limit - v_8;
        var /** number */ v_9 = base.limit - base.cursor;
        r_step2();
        base.cursor = base.limit - v_9;
        var /** number */ v_10 = base.limit - base.cursor;
        r_fix_chdz();
        base.cursor = base.limit - v_10;
        var /** number */ v_11 = base.limit - base.cursor;
        r_fix_gd();
        base.cursor = base.limit - v_11;
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


return new LithuanianStemmer();
}