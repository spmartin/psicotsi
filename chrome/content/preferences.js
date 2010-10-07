var PsicotsiPrefs = {
    _pref_branch: null,
    init: function () {
        var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
        this._pref_branch = prefs.getBranch("extensions.psicotsi.prefs.");
    },
    getString: function (pref_name) {
        try {
            return this._pref_branch.getComplexValue(pref_name, Components.interfaces.nsISupportsString).data;
        } catch (e) {
            return null;
        }
    },
    setString: function (pref_name, value) {
        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        str.data = value;
        this._pref_branch.setComplexValue(pref_name, Components.interfaces.nsISupportsString, str);
    },
    setInt: function (pref_name, value) {
        this._pref_branch.setIntPref(pref_name, value);
    },
    getInt: function (pref_name) {
        try {
            return this._pref_branch.getIntPref(pref_name);
        } catch (e) {
            return null;
        }
    },
    setBool: function (pref_name, value) {
        this._pref_branch.setBoolPref(pref_name, value);
    },
    getBool: function (pref_name) {
        try {
            return this._pref_branch.getBoolPref(pref_name);
        } catch (e) {
            return null;
        }
    },
    addPrefToList: function (list_name, pref_value) {
        if (pref_value == "") return false;
        var existing = PsicotsiPrefs.getList(list_name);
        var exists = existing.some(function (el) {
            if (el == pref_value) {
                return true;
            }
        });
        if (!exists) {
            existing.push(pref_value);
            PsicotsiPrefs._populateList(list_name, existing);
            return true;
        }
        return false
    },
    getList: function (list_name) {
        var names = PsicotsiPrefs._getElemNames(list_name);
        var list = new Array();
        for (var i in names) list.push(PsicotsiPrefs.getString(names[i]));
        return list;
    },
    _getElemNames: function (list_name) {
        try {
            if (list_name != "") return this._pref_branch.getChildList(list_name + ".", {});
            else return this._pref_branch.getChildList("", {});
        } catch (e) {
            return null;
        }
    },
    delListPref: function (list_name, pref_value) {
        var existing = PsicotsiPrefs.getList(list_name);
        existing = existing.filter(function (el) {
            if (el != pref_value) return el;
        });
        PsicotsiPrefs._populateList(list_name, existing);
    },
    _populateList: function (list_name, values) {
        this._pref_branch.deleteBranch(list_name);
        for (var i in values) PsicotsiPrefs.setString(list_name + "." + i, values[i]);
    },
    deleteValue: function (value_name) {
        this._pref_branch.deleteBranch(value_name);
    },
};