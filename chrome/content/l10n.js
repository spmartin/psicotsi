var Psicotsil10n = {
    _strings_bundle_default: null,
    _strings_bundle: null,
    init: function () {
        this._strings_bundle_default = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService).createBundle("chrome://psicotsi/content/psicotsi.properties");
        this.get_strings_bundle(PsicotsiPrefs.getString("htLanguage"));
    },
    get_strings_bundle: function (localecode) {
        try {
            this._strings_bundle = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService).createBundle("chrome://psicotsi/content/locale/" + localecode + "/psicotsi.properties");
        } catch (e) {
            dump('Psicotsi l10n->get_strings_bundle: Error reading language file: ' + e + '\n');
        }
    },
    getString: function (str) {
        if (this._strings_bundle) {
            try {
                return this._strings_bundle.GetStringFromName(str);
            } catch (e) {
                try {
                    if (this._strings_bundle_default) return this._strings_bundle_default.GetStringFromName(str);
                } catch (ee) {
                    dump("** l10n error 1 ** '" + str + "'\n");
                    return "** l10n error 1 **";
                }
            }
        } else {
            dump("** l10n error 2 ** '" + str + "'\n");
            return "** n10n error 2 **";
        }
    },
    getFormattedString: function (str, key_array) {
        if (this._strings_bundle) {
            try {
                return this._strings_bundle.formatStringFromName(str, key_array);
            } catch (e) {
                try {
                    return this._strings_bundle_default.formatStringFromName(str, key_array);
                } catch (ee) {
                    return "** l10n error **";
                }
            }
        } else return "** l10n error **";
    },
    isStringAvailable: function (str) {
        if (this._strings_bundle) {
            try {
                return this._strings_bundle.GetStringFromName(str) != null;
            } catch (e) {
                try {
                    return this._strings_bundle_default.GetStringFromName(str) != null;
                } catch (e) {
                    return false;
                }
            }
        }
        return false;
    },
    isStringAvailableLocal: function (str) {
        if (this._strings_bundle) {
            try {
                return this._strings_bundle.GetStringFromName(str) != null;
            } catch (e) {
                return false;
            }
        }
        return false;
    },
};