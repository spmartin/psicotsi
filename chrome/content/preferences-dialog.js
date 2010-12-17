var PsicotsiPreferencesDialog = {

    init: function () {

        for (var i in PsicotsiPreferencesDialog.core_modules) {
            PsicotsiPreferencesDialog.core_modules[i].init()
        }

        this.initCaptionsAndLabels(document);
        this.initMainPref(document);
        this.initAboutPref(document);

        for each(cat in Psicotsi.moduleCategories) {
            this._fillModulesList(document, cat);
        }

        this.pref_show('main_list');
    },

    initCaptionsAndLabels: function (document) {

        // Window title
        window.title = Psicotsil10n.getString("psicotsi.prefs.preferences");
        // Captions and labels
        var allLabels = ["MainTab", "AboutTab", "buttonSave", "buttonCancel"];
        for (var i = 0; i < allLabels.length; i++) {
            var thisElement = document.getElementById(allLabels[i]);
            thisElement.setAttribute("label", Psicotsil10n.getString("psicotsi.prefs." + allLabels[i]));
        }
    },

    initOptPrefs: function () {

        var boolPrefs = new Array("showWage", "showAlertBox", "showSearchPage", "hideUnderSkills", "showLeftMenu");

        return boolPrefs;
    },

    initMainPref: function (doc) {
        var boolPrefs = this.initOptPrefs();
        
        var modules_list = doc.getElementById("main_list");
        modules_list.setAttribute("style", "background-color:ButtonFace !important; color: ButtonText !important;");

        // prefs at deafult warning
        if (!PsicotsiPrefs.getBool("PrefsSavedOnce")) {
            var groupbox = doc.createElement("groupbox");
            groupbox.setAttribute("style", "background-color:#FCF6DF; color:black;");
            var caption = doc.createElement("caption");
            caption.setAttribute("label", Psicotsil10n.getString("psicotsi.prefs.PrefDefaultWarningLabel"));
            caption.setAttribute("style", "background-color:#FCF6DF; color:black;");
            var vbox = doc.createElement("vbox");
            var desc_box = this._getWrapableBox(Psicotsil10n.getString("psicotsi.prefs.PrefDefaultWarningText"));
            vbox.appendChild(desc_box);
            groupbox.appendChild(caption);
            groupbox.appendChild(vbox);
            modules_list.appendChild(groupbox);
        }

        //Functions checkboxes
        try {
            var boolPrefs = this.initOptPrefs();
            var groupbox4 = doc.createElement("groupbox");
            var hbox4 = doc.createElement("hbox");
            hbox4.setAttribute('flex', "1");
            var caption4 = doc.createElement("caption");
            caption4.setAttribute("label", Psicotsil10n.getString("psicotsi.prefs.captionFunctions"));
            caption4.setAttribute("style", "background-color:ButtonFace; color: ButtonText;");
            var vbox4 = doc.createElement("vbox");
            vbox4.setAttribute('flex', "1");

            for (var i = 0; i < boolPrefs.length; i++) {
                var temp = boolPrefs[i];
                var checkbox4 = doc.createElement("checkbox");

                checkbox4.setAttribute('id', boolPrefs[i]);
                checkbox4.setAttribute('checked', PsicotsiPrefs.getBool(boolPrefs[i]));
                checkbox4.setAttribute('label', Psicotsil10n.getString("psicotsi.prefs." + boolPrefs[i]));
                vbox4.appendChild(checkbox4);
            }

            hbox4.appendChild(vbox4);
            groupbox4.appendChild(caption4);
            groupbox4.appendChild(hbox4);
        } catch (e) {
            Psicotsi.dump(e);
        }

/*try {
		var boolPrefs = this.initOptPrefs();
		for (var i=0; i<boolPrefs.length; i++) {
			doc.getElementById(boolPrefs[i]).label = Psicotsil10n.getString("psicotsi.prefs." + boolPrefs[i]);
		}
	}catch (e){    Psicotsi.dump(e); }*/

        // language
        var groupbox2 = doc.createElement("groupbox");
        var hbox1 = doc.createElement("hbox");
        hbox1.setAttribute('flex', "1");

        var caption1 = doc.createElement("caption");
        caption1.setAttribute("label", Psicotsil10n.getString("psicotsi.prefs.captionHTLanguage"));
        caption1.setAttribute("style", "background-color:ButtonFace; color: ButtonText;");

        var vbox1 = doc.createElement("vbox");
        vbox1.setAttribute('flex', "1");
        var menulist1 = doc.createElement("menulist");
        menulist1.setAttribute('id', "htLanguage");
        var menupopup1 = doc.createElement("menupopup");
        menupopup1.setAttribute('id', "htLanguagePopup");
        menulist1.appendChild(menupopup1);
        var spacer = document.createElement("spacer");
        spacer.setAttribute('flex', '1');
        vbox1.appendChild(spacer);
        vbox1.appendChild(menulist1);
        var spacer = document.createElement("spacer");
        spacer.setAttribute('flex', '1');
        vbox1.appendChild(spacer);
        hbox1.appendChild(vbox1);
        groupbox2.appendChild(caption1);
        groupbox2.appendChild(hbox1);


        //currency
        var groupbox3 = doc.createElement("groupbox");
        var hbox2 = doc.createElement("hbox");
        hbox2.setAttribute('flex', "1");

        var vbox2 = doc.createElement("vbox");
        vbox2.setAttribute('flex', "1");
        var caption2 = doc.createElement("caption");
        caption2.setAttribute("label", Psicotsil10n.getString("psicotsi.prefs.captionHTCurrency"));
        caption2.setAttribute("style", "background-color:ButtonFace !important; color: ButtonText !important;");
        var menulist2 = doc.createElement("menulist");
        menulist2.setAttribute('id', "htCurrency");
        var menupopup2 = doc.createElement("menupopup");
        menupopup2.setAttribute('id', "htCurrencyPopup");
        menulist2.appendChild(menupopup2);
        var spacer = document.createElement("spacer");
        spacer.setAttribute('flex', '1');

        vbox2.appendChild(spacer);
        vbox2.appendChild(menulist2);
        hbox2.appendChild(vbox2);
        groupbox3.appendChild(caption2);
        groupbox3.appendChild(hbox2);


        modules_list.appendChild(groupbox2);
        //modules_list.appendChild(groupbox);
        modules_list.appendChild(groupbox3);
        modules_list.appendChild(groupbox4);
        var htLanguagesXml = doc.implementation.createDocument("", "", null);
        htLanguagesXml.async = false;
        htLanguagesXml.load("chrome://psicotsi/content/htlocales/htlang.xml", "text/xml");
        var itemToSelect = this.fillListFromXml("htLanguagePopup", "htLanguage-", htLanguagesXml, "language", "desc", "name", PsicotsiPrefs.getString("htLanguage"));
        document.getElementById("htLanguage").selectedIndex = itemToSelect;

        var htCurrencyXml = document.implementation.createDocument("", "", null);
        htCurrencyXml.async = false;
        htCurrencyXml.load("chrome://psicotsi/content/htlocales/htcurrency.xml", "text/xml");
        var itemToSelect2 = this.fillListFromXml("htCurrencyPopup", "htCurrency-", htCurrencyXml, "currency", "name", "code", PsicotsiPrefs.getString("htCurrency"));
        document.getElementById("htCurrency").selectedIndex = itemToSelect2;



        // disable options
        var groupbox = doc.createElement("groupbox");
        //disable caption
        var caption = doc.createElement("caption");
        caption.setAttribute("label", Psicotsil10n.getString("psicotsi.prefs.captionDisableSettings"));
        caption.setAttribute("style", "background-color:ButtonFace !important; color: ButtonText !important;");
        var vbox = doc.createElement("vbox");
        // stage
        var checkbox = doc.createElement("checkbox");
        checkbox.setAttribute("label", Psicotsil10n.getString("psicotsi.prefs.stagepref"));
        checkbox.setAttribute('id', "stagepref");
        checkbox.setAttribute("checked", PsicotsiPrefs.getBool("disableOnStage"));
        vbox.appendChild(checkbox);
        // temporary
        var checkbox = doc.createElement("checkbox");
        checkbox.setAttribute("label", Psicotsil10n.getString("psicotsi.prefs.disableTemporaryLabel"));
        checkbox.setAttribute('id', "disableTemporary");
        checkbox.setAttribute("checked", PsicotsiPrefs.getBool("disableTemporary"));
        vbox.appendChild(checkbox);

        groupbox.appendChild(caption);
        groupbox.appendChild(vbox);
        modules_list.appendChild(groupbox);


        // ShowOnStatusBar
        var groupbox = doc.createElement("groupbox");
        var caption = doc.createElement("caption");
        caption.setAttribute("label", Psicotsil10n.getString("psicotsi.prefs.captionShowOnStatusBar"));
        caption.setAttribute("style", "background-color:ButtonFace !important; color: ButtonText !important;");
        var vbox = doc.createElement("vbox");
        var checkbox = doc.createElement("checkbox");
        checkbox.setAttribute("label", Psicotsil10n.getString("psicotsi.prefs.statusbarpref"));
        checkbox.setAttribute('id', "statusbarpref");
        checkbox.setAttribute("checked", PsicotsiPrefs.getBool("statusbarshow"));
        vbox.appendChild(checkbox);

/*if (PsicotsiPrefs.getBool( "reloadPsicoDev" )){
		var checkbox= doc.createElement("checkbox");
		checkbox.setAttribute("label",Psicotsil10n.getString("psicotsi.prefs.statusbarshowreload"));
		checkbox.setAttribute('id',"statusbarshowreload");
		checkbox.setAttribute( "checked", PsicotsiPrefs.getBool( "statusbarshowreload" ) );
		vbox.appendChild(checkbox);
		}*/

        groupbox.appendChild(caption);
        groupbox.appendChild(vbox);
        modules_list.appendChild(groupbox);




        var spacer = doc.createElement('spacer');
        spacer.setAttribute('flex', 0);
        spacer.setAttribute('height', 20);
        modules_list.appendChild(spacer);

    },

    initAboutPref: function (doc) {
        try {
            document.getElementById("psico-version-num").value = "PsicoTSI Terminus Edition";

            document.getElementById('INPUTAbout').value = Psicotsil10n.getString("psicotsi.prefs.aboutPolicyTextBox");
            document.getElementById('Label_As_Is').value = Psicotsil10n.getString("psicotsi.prefs.distribAsIs");

            var modules_list = doc.getElementById("about_list");
            modules_list.setAttribute("style", "background-color:ButtonFace !important; color: ButtonText !important;");
            var vbox = doc.createElement("vbox");
        } catch (e) {
            Psicotsi.dump(e);
        }
        try {
            //developers
            var spacer = document.createElement("spacer");
            spacer.setAttribute('flex', '1');

            var xmlresponse = Psicotsi.LoadXML("chrome://psicotsi/content/htlocales/ptabout.xml");
            var label = doc.createElement("label");
            label.setAttribute("value", Psicotsil10n.getString("psicotsi.prefs.developers"));
            label.setAttribute("style", "font-weight: bold;");
            vbox.appendChild(label);
            var labels = Psicotsi.XML_evaluate(xmlresponse, "about/developers/label", "value");

            for (var i = 0; i < labels.length; ++i) {

                var label = doc.createElement("label");
                label.setAttribute("value", labels[i]);
                vbox.appendChild(label);

            }
            vbox.appendChild(spacer);
            //translators
            var xmlresponse = Psicotsi.LoadXML("chrome://psicotsi/content/htlocales/ptabout.xml");
            var label = doc.createElement("label");
            label.setAttribute("value", Psicotsil10n.getString("psicotsi.prefs.translators"));
            label.setAttribute("style", "font-weight: bold;");
            vbox.appendChild(label);
            var labels = Psicotsi.XML_evaluate(xmlresponse, "about/translations/label", "value");

            for (var i = 0; i < labels.length; ++i) {

                var label = doc.createElement("label");
                label.setAttribute("value", labels[i]);
                vbox.appendChild(label);

            }


            modules_list.appendChild(vbox);
        } catch (e) {
            Psicotsi.dump(e);
        }
    },

    onDialogAccept: function () {
        try {
            var boolPrefs = this.initOptPrefs();
            for (var i = 0; i < boolPrefs.length; i++) {
                var temp = boolPrefs[i];
                PsicotsiPrefs.setBool(temp, document.getElementById(temp).checked);
            }

            var modules_list;
            for each(cat in Psicotsi.moduleCategories) {
                switch (cat) {
                case Psicotsi.moduleCategories.MAIN:
                    continue;
                    break;
                default:
                    continue;
                    break;
                }

                for (var i = 0; i < modules_list.childNodes.length; ++i) {
                    if (modules_list.childNodes[i].nodeName == 'spacer') continue;
                    PsicotsiPreferencesDialog.setModuleEnableState(modules_list.childNodes[i].prefname, modules_list.childNodes[i].childNodes[0].childNodes[0].checked);
                    if (modules_list.childNodes[i].radio) {
                        var radiogroup = modules_list.childNodes[i].childNodes[3].childNodes[0].childNodes;
                        for (var j = 0; j < radiogroup.length; j++) {
                            if (radiogroup[j].selected) {
                                PsicotsiPreferencesDialog.setModuleValue(modules_list.childNodes[i].prefname, j);
                                break;
                            }
                        }
                    } else if (modules_list.childNodes[i].checkbox) {
                        var checkboxes = modules_list.childNodes[i].childNodes[3].childNodes;
                        for (var j = 0; j < checkboxes.length; j++) {
                            if (checkboxes[j].id.search(/_text$/) == -1) PsicotsiPreferencesDialog.setModuleEnableState(modules_list.childNodes[i].prefname + "." + checkboxes[j].id, checkboxes[j].checked);
                            else PsicotsiPreferencesDialog.setModuleOptionsText(modules_list.childNodes[i].prefname + "." + checkboxes[j].firstChild.id, checkboxes[j].firstChild.value);
                        }
                    }
                }
            }

            try {
                var htCurrenciesXml = document.implementation.createDocument("", "", null);
                htCurrenciesXml.async = false;
                htCurrenciesXml.load("chrome://psicotsi/content/htlocales/htcurrency.xml", "text/xml");


                var path = "hattrickcurrencies/currency[@code='" + document.getElementById("htCurrency").value + "']";
                var obj = htCurrenciesXml.evaluate(path, htCurrenciesXml, null, htCurrenciesXml.DOCUMENT_NODE, null).singleNodeValue;
                var currency = obj.attributes.getNamedItem("shortname").textContent;
                var rate = 1.0 / parseFloat(obj.attributes.getNamedItem("eurorate").textContent);

            } catch (e) {
                var rate = '1.0';
                Psicotsi.dump(e);
            }



            //Disable warning
            PsicotsiPrefs.setBool("PrefsSavedOnce", true);

            //Lang
            PsicotsiPrefs.setString("htLanguage", document.getElementById("htLanguage").value);

            //Currency
            PsicotsiPrefs.setString("htCurrency", document.getElementById("htCurrency").value);
            PsicotsiPrefs.setString("htCurrencyRate", rate);
            PsicotsiPrefs.setString("htCurrencyName", currency);
            //Options
            PsicotsiPrefs.setBool("statusbarshow", document.getElementById("statusbarpref").checked);
            PsicotsiPrefs.setBool("disableOnStage", document.getElementById("stagepref").checked);

            // disabled option!
            //PsicotsiPrefs.setBool("statusbarshowreload", document.getElementById("statusbarshowreload").checked);   


            PsicotsiPrefs.setBool("disableTemporary", document.getElementById("disableTemporary").checked);

            // other
            //PsicotsiPrefs.setString("oldVersion", document.getElementById("htOldVersion").value);

            PsicotsiMain.init();

            return true;

        }
        catch (e) {
            Psicotsi.dump(e);
        }
    },

    getOffsetValue: function (itemToSearch, xmlDoc) {
        try {
            var returnedOffset = 0;
            var values = xmlDoc.getElementsByTagName("country");

            for (var i = 0; i < values.length; i++) {
                try {
                    var test = values[i].attributes.getNamedItem("name").textContent;

                    if (test == itemToSearch) {
                        // alert( '['+test+']['+itemToSearch+']' );
                        returnedOffset = (values[i].attributes.getNamedItem("offset").textContent);
                        // alert( returnedOffset );
                    }
                } catch (e) {
                  Psicotsi.dump(e);
                }
            }
            return returnedOffset;
        }
        catch (e) {
            Psicotsi.dump(e);
            return 0;
        }
    },

    fillListFromXml: function (id, prefix, xmlDoc, elem, descAttr, valAttr, itemToSelect) {

        var indexToSelect = -1;
        var values = xmlDoc.getElementsByTagName(elem);
        var menupopup = document.getElementById(id);
        var langs = [];

        for (var i = 0; i < values.length; i++) {
            var label = values[i].attributes.getNamedItem(descAttr).textContent;
            var value = values[i].attributes.getNamedItem(valAttr).textContent;
            langs.push([label, value]);
        }

        function sortfunction(a, b) {
            return a[0].localeCompare(b[0]);
        }

        langs.sort(sortfunction);

        for (var i = 0; i < langs.length; i++) {

            var label = langs[i][0];
            var value = langs[i][1];

            var obj = document.createElement("menuitem");
            obj.setAttribute("id", prefix + value);
            obj.setAttribute("label", label);
            obj.setAttribute("value", value);

            menupopup.appendChild(obj);

            if (itemToSelect == value) indexToSelect = i;
        }

        return indexToSelect;

    },

    _fillModulesList: function (doc, category) {
        var modules_list;

        switch (category) {
        case Psicotsi.moduleCategories.MAIN:
            return;
            break;

        default:
            return;
            break;
        }

        for (var i in Psicotsi.modules) {
            var module = Psicotsi.modules[i];
            var module_category;
            module_category = module.MODULE_CATEGORY;
            if (!module_category) {
                // MODULE_CATEGORY isn't set; use default
                module_category = "shortcutsandtweaks";
            }
            if (module_category == category) {
                var entry;
                if (module.RADIO_OPTIONS != null) {
                    entry = PsicotsiPreferencesDialog._radioModule(module);
                } else if (module.OPTIONS != null) {
                    var bOptionTexts = (module.OPTION_TEXTS != null && module.OPTION_TEXTS);
                    entry = PsicotsiPreferencesDialog._checkboxModule(module, bOptionTexts);
                } else {
                    entry = PsicotsiPreferencesDialog._normalModule(module);
                }
                modules_list.appendChild(entry);
            }
        }
        var spacer = doc.createElement('spacer');
        spacer.setAttribute('flex', 0);
        spacer.setAttribute('height', 100);

        modules_list.appendChild(spacer);
    },

    _getWrapableBox: function (desc_text) {
        var desc_box = document.createElement("hbox");
        var desc = document.createElement("textbox");
        desc.setAttribute("class", "plain"); //#ece9d7
        desc.setAttribute("style", "background-color:ButtonFace !important; color: ButtonText !important;");
        desc.setAttribute("height", "20 ");
        desc.setAttribute("flex", "1");
        desc.setAttribute("multiline", "true");
        desc.setAttribute("readonly", "true");
        desc.setAttribute("onoverflow", "this.heigh=20; this.height = this.inputField.scrollHeight;");
        desc.setAttribute("DOMAttrModified", "if(event.attrName == 'value') this.value = event.newValue; return true;");
        desc.setAttribute("value", desc_text);
        desc_box.appendChild(desc);
        return desc_box;
    },

    _normalModule: function (module) {
        var entry = document.createElement("vbox");
        entry.prefname = module.MODULE_NAME;
        entry.setAttribute("class", "normal_entry");
        var hbox = document.createElement("hbox");
        hbox.addEventListener("click", function (ev) {
            ev.currentTarget.childNodes[0].checked = !(ev.currentTarget.childNodes[0].checked);
        }, false);

        var check = document.createElement("checkbox");
        check.addEventListener("click", function (ev) {
            ev.target.checked = !ev.target.checked;
        }, true);
        check.setAttribute("checked", Psicotsi.isModuleEnabled(module));
        check.setAttribute("class", "checkbox_normal");
        hbox.appendChild(check);
        var name = document.createElement("label");
        name.setAttribute("class", "name");
        name.setAttribute("value", module.MODULE_NAME);
        hbox.appendChild(name);
        entry.appendChild(hbox);

        var desc_box = this._getWrapableBox(PsicotsiPreferencesDialog.getModuleDescription(module.MODULE_NAME));
        entry.appendChild(desc_box);

        return entry;
    }
};
PsicotsiPreferencesDialog.core_modules = [PsicotsiPrefs, Psicotsil10n];

PsicotsiPreferencesDialog.configurePsicotsi = function (button) {
    if (!button) {
        window.open("chrome://psicotsi/content/preferences-dialog.xul", "", "centerscreen, chrome, modal, resizable=yes");
    }
}


PsicotsiPreferencesDialog.deactivate = function (button) {
    if (!button) {
        PsicotsiPrefs.setBool("disableTemporary", !PsicotsiPrefs.getBool("disableTemporary"));
        PsicotsiMain.init();
    }
}

PsicotsiPreferencesDialog.copy_id = function (button) {
    if (!button) {
        var ID = Psicotsi.CopyID;
        Psicotsi.copyStringToClipboard(ID);
        Psicotsi.popupMenu.setAttribute("hidden", true);
    }
}


PsicotsiPreferencesDialog.pref_show = function (vbox) {
    VBOXES = ["main_list", "about_list"];
    var box;
    for (var i = 0; i < VBOXES.length; i++) {
        try {
            box = document.getElementById(VBOXES[i]);
            if (VBOXES[i] == vbox) {
                box.style.overflow = "hidden";
                box.setAttribute("style", "color:ButtonText !important; background-color:ButtonFace !important;");
            }
            else {
                box.style.height = "300px";
                box.style.overflow = "hidden";
                box.setAttribute("style", "color:ButtonText !important; background-color:ButtonFace !important;");
            }
        }
        catch (e) {
            Psicotsi.dump(e);
        }
    }
}

PsicotsiPreferencesDialog.prefhelp_show = function (HelpTitle, HelpDesc, where) {
    openDialog("chrome://psicotsi/content/preferences-help.xul", "PsicoTSI Help", "titlebar=no, modal, left=" + (where.boxObject.screenX + 20) + ", top=" + (where.boxObject.screenY - 10), HelpTitle, HelpDesc);
}



PsicotsiPreferencesDialog.SavePrefs = function (ev) {
    try {
        var locpath = Psicotsi.selectFileSave(window);
        if (locpath == null) {
            return;
        }
        var File = Components.classes["@mozilla.org/file/local;1"].
        createInstance(Components.interfaces.nsILocalFile);
        File.initWithPath(locpath);

        var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].
        createInstance(Components.interfaces.nsIFileOutputStream);
        foStream.init(File, 0x02 | 0x08 | 0x20, 0666, 0);
        var os = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
        os.init(foStream, "UTF-8", 0, 0x0000);

        var array = PsicotsiPrefs._getElemNames("");
        for (var i = 0; i < array.length; i++) {
            if ((PsicotsiPreferencesDialog.isPrefSetting(array[i]) && document.getElementById("saveprefsid").checked) || (!PsicotsiPreferencesDialog.isPrefSetting(array[i]) && document.getElementById("savenotesid").checked)) {

                var value = PsicotsiPrefs.getString(array[i]);
                if (value != null) os.writeString('user_pref("extensions.psicotsi.prefs.' + array[i] + '","' + value.replace(/\n/g, "\\n") + '");\n');
                else {
                    value = PsicotsiPrefs.getInt(array[i]);
                    if (value == null) value = PsicotsiPrefs.getBool(array[i]);
                    os.writeString('user_pref("extensions.psicotsi.prefs.' + array[i] + '",' + value + ');\n');
                }
            }
        }
        os.close();
        foStream.close();

        if (!ev) close();
    }
    catch (e) {
        Psicotsi.dump(e);
    }
    return true;
}

PsicotsiPreferencesDialog.LoadPrefs = function (ev) {
    try {
        var locpath = Psicotsi.selectFile(window);
        if (locpath == null) return;
        var File = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        File.initWithPath(locpath);

        var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
        converter.charset = "UTF-8";
        var fis = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
        fis.init(File, -1, -1, 0);
        var lis = fis.QueryInterface(Components.interfaces.nsILineInputStream);
        var lineData = {};
        var cont;
        do {
            cont = lis.readLine(lineData);
            var line = converter.ConvertToUnicode(lineData.value);
            var key = line.match(/user_pref\("extensions\.psicotsi\.prefs\.(.+)",/)[1];
            var value = line.match(/\",(.+)\)\;/)[1];
            var strval = value.match(/\"(.+)\"/);
            if (value == "\"\"") PsicotsiPrefs.setString(key, "");
            else if (strval != null) PsicotsiPrefs.setString(key, strval[1]);
            else if (value == "true") PsicotsiPrefs.setBool(key, true);
            else if (value == "false") PsicotsiPrefs.setBool(key, false);
            else PsicotsiPrefs.setInt(key, value);
        } while (cont);

        fis.close();
        PsicotsiMain.init();
        if (!ev) close();


    }
    catch (e) {
        Psicotsi.dump(e);
    }
    return true;
}