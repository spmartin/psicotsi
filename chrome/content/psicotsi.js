if (!Psicotsi) var Psicotsi = {};
Psicotsi.LinkCollection = {};
Psicotsi.run_on_page = [];
Psicotsi.run_every_page = [];
Psicotsi.run_on_cur_page = [];
Psicotsi.may_run_on_page = [];
Psicotsi.core_modules = [PsicotsiPrefs, Psicotsil10n];
Psicotsi.news = [];
Psicotsi.consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);

Psicotsi.globals = [];
for (Psicotsi.global in this) {
    Psicotsi.globals.push(Psicotsi.global);
}

var PsicotsiMain = {
    new_start: true,
    isStandard: true,
    isRTL: false,
    vars: null,
    IsNewVersion: false,

    init: function () {
        // remove before release
        /*
        if (!Psicotsi.numglobals) {
            for (var i = 0; i < Psicotsi.globals.length; ++i) dump('global: ' + Psicotsi.globals[i] + '\n');
            Psicotsi.numglobals = Psicotsi.globals.length;
        }
        else {
            for (var i = Psicotsi.numglobals; i < Psicotsi.globals.length; ++i)
            if (Psicotsi.globals[i] != 'QueryInterface') dump('undeclared local global variable: ' + Psicotsi.globals[i] + '\n');
        }
        */
        
        // init core modules
        for (var i in Psicotsi.core_modules) {
            Psicotsi.core_modules[i].init();
        }

        // check if this is a new version
        var curVersion = PsicotsiPrefs.getString("curVersion");
        var oldVersion = PsicotsiPrefs.getString("oldVersion");
        if (oldVersion < curVersion) {
            PsicotsiMain.IsNewVersion = true;
            PsicotsiPrefs.setString("oldVersion", curVersion);
        }

        // create handler arrays for each recognized page
        for (var i in Psicotsi.ht_pages) {
            Psicotsi.run_on_page[i] = new Array();
            Psicotsi.may_run_on_page[i] = new Array();
        }

        // init all modules
        for (var i in Psicotsi.modules) {
            var module = Psicotsi.modules[i];
            // if module has an init() function and is enabled
            if (module.MODULE_NAME && Psicotsi.isModuleEnabled(module)) {
                if (module.init) {
                    try {
                        module.init();
                        //dump( "Psicotsi enabled module: " + module.MODULE_NAME + "\n");
                    } catch (e) {
                        Psicotsi.dump("[psicotsi.js] Psicotsi module " + module.MODULE_NAME + " init() exception: " + "\n  " + e + "\n");
                        Components.utils.reportError(e);
                    }
                }
                else {
                    //Psicotsi.dump( "[psicotsi.js] Psicotsi disabled module: " + module.MODULE_NAME + "\n" );
                }
            }

            if (module.MODULE_NAME && module.PAGES) {
                Psicotsi.registerModulePages(module);
            }
        }
        if (Psicotsi && Psicotsi.statusbarDeactivate) Psicotsi.statusbarDeactivate.setAttribute("checked", PsicotsiPrefs.getBool("disableTemporary"));


        PsicotsiMain.new_start = true;

    },

    registerOnPageLoad: function (document) {
        var statusbarImg = document.getElementById("psicotsi-status-bar-img");

        if (PsicotsiPrefs.getBool("disableTemporary")) {
            statusbarImg.src = "chrome://psicotsi/skin/nnicon_disabled.png";
        }
        else {
            statusbarImg.src = "chrome://psicotsi/skin/nnicon.png";
        }
        
        var statusBarPanel = document.getElementById("psicotsi-status-bar-panel");
        
        statusBarPanel.hidden = !PsicotsiPrefs.getBool("statusbarshow");

        // init menu titles
        var statusbarMenu = document.getElementById("psicotsi_statusbar_config_menu");

        statusbarMenu.setAttribute("label", Psicotsil10n.getString("psicotsi.menu.configurepsicotsi"));

        var statusbarReload = document.getElementById("psicotsi_statusbar_reload");

        statusbarReload.setAttribute("label", Psicotsil10n.getString("psicotsi.menu.reloadpsicotsi"));

        if (!PsicotsiPrefs.getBool("statusbarshowreload")) statusbarReload.setAttribute("hidden", true);
        var statusbarDeactivate = document.getElementById("psicotsi_statusbar_deactivate");
        statusbarDeactivate.setAttribute("label", Psicotsil10n.getString("psicotsi.prefs.disableTemporaryLabel"));
        statusbarDeactivate.setAttribute("checked", PsicotsiPrefs.getBool("disableTemporary"));
        Psicotsi.statusbarDeactivate = statusbarDeactivate;


        var toolsMenu = document.getElementById("psicotsi-config-menu");
        toolsMenu.setAttribute("label", Psicotsil10n.getString("psicotsi.menu.configurepsicotsi"));

        var appcontent = document.getElementById("appcontent");
        if (appcontent) {
            // listen to page loads   
            appcontent.addEventListener("DOMContentLoaded", this.onPageLoad, true);
            appcontent.addEventListener("unload", this.onPageUnLoad, true);
        }
    },

    onPageChange: function (ev) {
        var doc = ev.originalTarget.ownerDocument;
        if (doc.nodeName != "#document") return;
        var content = doc.getElementById("content");
        // remove event listener while Psicotsi executes
        content.removeEventListener("DOMSubtreeModified", PsicotsiMain.onPageChange, true);
        var begin = new Date();
        PsicotsiMain.change(doc);
        var end = new Date();
        var time = (end.getSeconds() - begin.getSeconds()) * 1000 + end.getMilliseconds() - begin.getMilliseconds();
        // Psicotsi.dump( "[psicotsi.js] Psicotsi bezi -cas: " + time + " ms\n" );
        // re-add event listener
        content.addEventListener("DOMSubtreeModified", PsicotsiMain.onPageChange, true);
    },

    onPageLoad: function (ev) {
        var doc = ev.originalTarget;
        if (doc.nodeName != "#document") return;

        if (Psicotsi.getHref(doc).search(PsicotsiPrefs.getString("HTURL")) > -1) {
            var begin = new Date();
            var time = (begin.getSeconds() - this._unloadtime.getSeconds()) * 1000 + begin.getMilliseconds() - this._unloadtime.getMilliseconds();
            //Psicotsi.dump("[psicotsi.js] load+ccs time: " + time + " ms | " + doc.location.pathname + doc.location.search + '\n');

            PsicotsiMain.run(doc);

            var end = new Date();
            var time = (end.getSeconds() - begin.getSeconds()) * 1000 + end.getMilliseconds() - begin.getMilliseconds();
            //Psicotsi.dump("[psicotsi.js] run time: " + time + " ms | " + doc.location.pathname + doc.location.search + '\n');
            var content = doc.getElementById("content");
            if (content) {
                content.addEventListener("DOMSubtreeModified", PsicotsiMain.onPageChange, true);
            }
        }
    },

    _unloadtime: 0,
    onPageUnLoad: function (ev) {
        var doc = ev.originalTarget;
        if (doc.nodeName != "#document") return;
        this._unloadtime = new Date();

    },


    run: function (doc) {
        try {

            var stage_regexp = /http:\/\/stage\.hattrick\.org/i;
            if ((!(PsicotsiPrefs.getBool("disableOnStage") && Psicotsi.getHref(doc).search(stage_regexp) > -1)) && (!PsicotsiPrefs.getBool("disableTemporary"))) {
                // check newstart or design change and reload modul css if needed
                if (PsicotsiMain.new_start) {
                    PsicotsiMain.isStandard = Psicotsi.isStandardLayout(doc);
                    Psicotsi.reload_module_css(doc);
                    PsicotsiMain.new_start = false;
                }
                else {
                    var curr_isStandard = Psicotsi.isStandardLayout(doc);

                    if (curr_isStandard != PsicotsiMain.isStandard) {
                        PsicotsiMain.isStandard = curr_isStandard;
                        Psicotsi.reload_module_css(doc);
                    }
                }

                // empty
                Psicotsi.run_on_cur_page.splice(0, Psicotsi.run_on_cur_page.length);

                // call the modules that want to be run() on every hattrick page
                Psicotsi.run_every_page.forEach(

                function (fn) {
                    try {
                        fn.run(doc);
                        //Psicotsi.run_on_cur_page.push({'page':'','module':fn});								
                    } catch (e) {
                        Psicotsi.dump("[psicotsi.js] Psicotsi module " + fn.MODULE_NAME + " run() exception: \n  " + e + "\n");
                        Components.utils.reportError(e);
                    }
                });


                for (var i in Psicotsi.ht_pages) {
                    if (Psicotsi.isPage(Psicotsi.ht_pages[i], doc)) {
                        // on a specific page, run all handlers
                        Psicotsi.run_on_page[i].forEach(

                        function (fn) {
                            try {
                                //Psicotsi.dump ( "[psicotsi.js] Psicotsi module " + fn.MODULE_NAME + " run() at page " + i + "\n  " );								
                                fn.run(i, doc);
                            } catch (e) {
                                Psicotsi.dump("[psicotsi.js] Psicotsi module " + fn.MODULE_NAME + " run() exception at page " + i + "\n  " + e + "\n");
                                Components.utils.reportError(e);
                            }
                        });
                        Psicotsi.may_run_on_page[i].forEach(

                        function (fn) {
                            Psicotsi.run_on_cur_page.push({
                                'page': i,
                                'module': fn
                            });
                        });
                    }
                }
                for (var j = 0; j < Psicotsi.run_on_cur_page.length; ++j) {
                    //Psicotsi.dump ( "[psicotsi.js] may run " + Psicotsi.run_on_cur_page[j].module.MODULE_NAME + " : page " + Psicotsi.run_on_cur_page[j].page + "\n  " );																
                }


                //doc.addEventListener('contextmenu', PsicotsiContextMenueCopyId.onContext, false);
            }
            else {


                var stage_regexp = /http:\/\/stage\.hattrick\.org/i;
                if (PsicotsiMain.new_start && (((PsicotsiPrefs.getBool("disableOnStage") && Psicotsi.getHref(doc).search(stage_regexp) != -1)) || (PsicotsiPrefs.getBool("disableTemporary")))) {

                    PsicotsiMain.isStandard = Psicotsi.isStandardLayout(doc);

                    PsicotsiMain.new_start = false;
                    Psicotsi.unload_module_css();
                }
            }
        } catch (e) {
            Psicotsi.dump('[psicotsi.js] Psicotsi.run: ' + e + '\n');
        }
    },


    change: function (doc) {
        var stage_regexp = /http:\/\/stage\.hattrick\.org/i;
        if ((!(PsicotsiPrefs.getBool("disableOnStage") && Psicotsi.getHref(doc).search(stage_regexp) > -1)) && (!PsicotsiPrefs.getBool("disableTemporary"))) {

            // call the modules that want to be run() on every hattrick page
            Psicotsi.run_every_page.forEach(

            function (fn) {
                try {
                    fn.change(doc);
                } catch (e) {
                    Psicotsi.dump("[psicotsi.js] Psicotsi module " + fn.MODULE_NAME + " change() exception: \n  " + e + "\n");
                    Components.utils.reportError(e);
                }
            });

            for (var i in Psicotsi.ht_pages) {
                if (Psicotsi.isPage(Psicotsi.ht_pages[i], doc)) {

                    Psicotsi.run_on_page[i].forEach(

                    function (fn) {
                        try {
                            fn.change(i, doc);
                        } catch (e) {
                            Psicotsi.dump("[psicotsi.js] Psicotsi module " + fn.MODULE_NAME + " change() exception at page " + i + "\n  " + e + "\n");
                            Components.utils.reportError(e);
                        }
                    });
                }
            }
        }
        else Psicotsi.dump('[psicotsi.js] Psicotsi modules deactivated\n');
    }

};

Psicotsi.isPage = function (page, doc) {
    var htpage_regexp = new RegExp(page, "i");
    return Psicotsi.getHref(doc).search(htpage_regexp) > -1;
}

Psicotsi.getHref = function (doc) {
    try {
      return doc.location.href;
    } catch (e) {
      return "";
    }
}


Psicotsi.registerModulePages = function (module) {
    try {
        // if is enabled in preferences and has a run() function
        if (module.run) {
            for (var i = 0; i < module.PAGES.length; ++i) {
                if (module.ONPAGEPREF_PAGE) Psicotsi.may_run_on_page[module.ONPAGEPREF_PAGE].push(module);
                else Psicotsi.may_run_on_page[module.PAGES[i]].push(module);
                //Psicotsi.dump(module.PAGES[i]+'\n');
                if (Psicotsi.isModuleEnabled(module)) Psicotsi.run_on_page[module.PAGES[i]].push(module);
            }
        }
    } catch (e) {
        Psicotsi.dump('[psicotsi.js] registerModulePages: ' + e + '\n');
    }
}

Psicotsi.registerPageHandler = function (page, who) {

    if (who.run) {
        Psicotsi.run_on_page[page].push(who);
    }
}

Psicotsi.registerAllPagesHandler = function (who) {
    if (who.run) {
        Psicotsi.run_every_page.push(who);
    }
}


Psicotsi.addStyleSheet = function (doc, css) {
    var path = "head[1]";
    var head = doc.evaluate(path, doc.documentElement, null, doc.DOCUMENT_NODE, null).singleNodeValue;

    var link = doc.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("media", "all");
    link.setAttribute("href", css);
    head.appendChild(link);
}

Psicotsi.confirmDialog = function (msg) {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    return promptService.confirm(null, null, msg);
}

Psicotsi.alert = function (msg) {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    return promptService.alert(null, null, msg);
}

Psicotsi.trim = function (text) {
    return text.replace(/^\s+/, "").replace(/\s+$/, '').replace(/&nbsp;/g, "");
}

Psicotsi.hasMainBodyScroll = function (doc) {
    // Check if scrolling is on for MainBody
    var mainBodyChildren = doc.getElementById('mainBody').childNodes;
    var i = 0,
        child;
    while (child = mainBodyChildren[i++])
    if (child.nodeName == 'SCRIPT' && child.innerHTML && child.innerHTML.search(/adjustHeight\(\'mainBody\'/) != -1) return true;
    return false;
}

Psicotsi.trimnum = function (text) {
    //return text.replace(/[\D\s]/g, '');
    text += '';
    if (text == null || text.length == 0) return 0;
    return text.replace(/&nbsp;/g, "").replace(/[\s]/g, '').match(/-\d+|\d+/);
}

Psicotsi.substr_count = function (haystack, needle, offset, length) {

    var pos = 0,
        cnt = 0;
    haystack += '';
    needle += '';
    if (isNaN(offset)) offset = 0;
    if (isNaN(length)) length = 0;
    offset--;
    while ((offset = haystack.indexOf(needle, offset + 1)) != -1) {
        if (length > 0 && (offset + needle.length) > length) {
            return false;
        } else {
            cnt++;
        }
    }
    return cnt;
}

Psicotsi.isModuleEnabled = function (module) {
    try {
        var val = PsicotsiPrefs.getBool("module." + module.MODULE_NAME + ".enabled");
        return (val != null) ? val : module.DEFAULT_ENABLED;
    } catch (e) {
        return false;
    }
}

Psicotsi.isModuleFeatureEnabled = function (module, feature) {
    try {
        var val = PsicotsiPrefs.getBool("module." + module.MODULE_NAME + "." + feature + ".enabled");
        return (val != null) ? val : module.DEFAULT_ENABLED;
    } catch (e) {
        return false;
    }
}

Psicotsi.getModuleValue = function (module) {
    try {
        var val = PsicotsiPrefs.getInt("module." + module.MODULE_NAME + ".value");
        return (val != null) ? val : 0;
    } catch (e) {
        return false;
    }
}

Psicotsi.LOG = function (msg) {
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
    consoleService.logStringMessage(msg);
}

Psicotsi.reload_module_css = function (doc) {
    //Psicotsi.dump('[psicotsi.js] reload permanents css\n');
    // check permanant css
    var isStandard = Psicotsi.isStandardLayout(doc);

    for (var i in Psicotsi.modules) {
        var module = Psicotsi.modules[i];
        // if module has an css) function and is enabled
        if (module.MODULE_NAME) {
            if (module.OLD_CSS && module.OLD_CSS != "") {
                Psicotsi.unload_css_permanent(module.OLD_CSS);
            }
            if (module.CSS_SIMPLE && module.CSS_SIMPLE != "") {
                if (Psicotsi.isModuleEnabled(module) && !isStandard) {


                    Psicotsi.unload_css_permanent(module.CSS_SIMPLE);

                }
                else {
                    Psicotsi.unload_css_permanent(module.CSS_SIMPLE);

                }
            }

            if (module.OPTIONS_CSS) {
                for (var k = 0; k < module.OPTIONS_CSS.length; ++k) {
                    if (Psicotsi.isModuleEnabled(module) && Psicotsi.isModuleFeatureEnabled(module, module.OPTIONS[k])) {
                        if (module.OPTIONS_CSS[k] != "" && (!isRTL || !module.OPTIONS_CSS_RTL)) {
                            if (module.OPTIONS_CSS_RTL && module.OPTIONS_CSS_RTL[k] != "") Psicotsi.unload_css_permanent(module.OPTIONS_CSS_RTL[k]);
                            Psicotsi.load_css_permanent(module.OPTIONS_CSS[k]);
                        }
                        else {
                            if (module.OPTIONS_CSS[k] != "") Psicotsi.unload_css_permanent(module.OPTIONS_CSS[k]);
                            if (isRTL) {
                                if (module.OPTIONS_CSS_RTL && module.OPTIONS_CSS_RTL[k] != "") Psicotsi.load_css_permanent(module.OPTIONS_CSS_RTL[k]);
                            }
                            else {
                                if (module.OPTIONS_CSS_RTL && module.OPTIONS_CSS_RTL[k] != "") Psicotsi.unload_css_permanent(module.OPTIONS_CSS_RTL[k]);
                            }
                        }
                    }
                    else {
                        if (module.OPTIONS_CSS[k] != "") Psicotsi.unload_css_permanent(module.OPTIONS_CSS[k]);
                        if (module.OPTIONS_CSS_RTL && module.OPTIONS_CSS_RTL[k] != "") Psicotsi.unload_css_permanent(module.OPTIONS_CSS_RTL[k]);
                    }
                }
            }
        }
    }
}

Psicotsi.addBoxToSidebar = function (doc, newBoxHeader, newBoxContent, boxId, referenceHeader, altReferenceHeader, column) {
    // If we already added this, return
    // Should ideally be checked by the change() function already
    var boxContentId = newBoxContent.id;
    if (!boxContentId) {
        Psicotsi.dump("[psicotsi.js] addBoxToSideBar: error: box content should have an id.\n");
        return;
    }
    if (Psicotsi.hasElement(doc, boxId) || Psicotsi.hasElement(doc, boxContentId)) {
        return;
    }

    var sidebar = null;
    var box_class = '';
    if (!column || column == 'right') {
        sidebar = doc.getElementById("sidebar");
        box_class = 'sidebarBox';
    }
    else {
        sidebar = doc.getElementById("ctl00_pnlSubMenu");
        box_class = 'subMenuBox';
    }
    if (!sidebar) return; // no sidebar. can't add something. someone consider creating sidebar later.
    var divs = sidebar.getElementsByTagName("div");

    // Check if any of the other sidebarboxes have the same header
    // and find the (alternative/normal) reference-object in the process
    var otherBox = false;
    var referenceObject = false;
    var altReferenceObject = false;
    var currentBox, i = 0;
    while (currentBox = divs[i++]) {
        // Check if this child is of box_class
        if (currentBox.className == box_class) {
            var header = currentBox.getElementsByTagName("h2")[0];
            if (header.innerHTML == newBoxHeader) {
                otherBox = currentBox;
            }
            if (header.innerHTML == referenceHeader) {
                referenceObject = currentBox;
            }
            if (header.innerHTML == altReferenceHeader) {
                altReferenceObject = currentBox;
            }
        }
        currentBox = currentBox.nextSibling;
    }

    if (!referenceObject && referenceHeader != "first" && referenceHeader != "last") {
        // the reference header could not be found; try the alternative
        if (!altReferenceObject && altReferenceHeader != "first" && altReferenceHeader != "last") {
            // alternative header couldn't be found either
            // place the box on top
            Psicotsi.dump("[psicotsi.js] addBoxToSidebar: Could not find referenceHeader " + referenceHeader + "\n" + "nor alternative referenceHeader " + altReferenceHeader + "\n");
            referenceHeader = "first";
        } else {
            referenceObject = altReferenceObject;
            referenceHeader = altReferenceHeader;
        }
    }
    if (referenceHeader == "first") {
        referenceObject = sidebar.firstChild;
    }
    if (Psicotsi.isStandardLayout(doc)) {

        if (otherBox) {
            newBoxContent.style.display = "inline";
            var subDivs = otherBox.getElementsByTagName("div");
            for (var i = 0; i < subDivs.length; i++) {
                if (subDivs[i].className == "boxBody") {
                    var firstDiv = subDivs[i].getElementsByTagName("div")[0];
                    firstDiv.setAttribute("style", "display: inline;");
                    subDivs[i].insertBefore(newBoxContent, firstDiv);
                }
            }
        } else {
            // create the sidebarbox
            var ownSidebarBox = doc.createElement("div");
            ownSidebarBox.className = box_class;
            ownSidebarBox.setAttribute("id", boxId);
            // create the boxhead
            var ownBoxHead = doc.createElement("div");
            ownBoxHead.className = "boxHead";
            ownSidebarBox.appendChild(ownBoxHead);
            var ownBoxLeftHeader = doc.createElement("div");
            ownBoxLeftHeader.className = "boxLeft";
            ownBoxHead.appendChild(ownBoxLeftHeader);
            // create the header
            var ownHeader = doc.createElement("h2");
            ownHeader.innerHTML = newBoxHeader;
            ownBoxLeftHeader.appendChild(ownHeader);
            // create the boxbody
            var ownBoxBody = doc.createElement("div");
            ownBoxBody.className = "boxBody";
            ownSidebarBox.appendChild(ownBoxBody);
            // insert the content
            ownBoxBody.appendChild(newBoxContent);
            // create the footer
            var ownBoxFooter = doc.createElement("div");
            ownBoxFooter.className = "boxFooter";
            ownSidebarBox.appendChild(ownBoxFooter);
            var ownBoxLeftFooter = doc.createElement("div");
            ownBoxLeftFooter.className = "boxLeft";
            ownBoxLeftFooter.innerHTML = "&nbsp;";
            ownBoxFooter.appendChild(ownBoxLeftFooter);
            if (referenceHeader == "last") {
                sidebar.appendChild(ownSidebarBox);
            } else {
                sidebar.insertBefore(ownSidebarBox, referenceObject);
            }
        }
    } else {

        if (otherBox) {
            var otherBoxHeader = otherBox.getElementsByTagName("h2")[0];

            otherBox.insertBefore(newBoxContent, otherBoxHeader.nextSibling);
        } else {
            var ownSidebarBox = doc.createElement("div");
            ownSidebarBox.className = box_class;
            ownSidebarBox.setAttribute("id", boxId);
            var ownHeader = doc.createElement("h2");
            ownHeader.innerHTML = newBoxHeader;
            ownSidebarBox.appendChild(ownHeader);
            ownSidebarBox.appendChild(newBoxContent);
            if (referenceHeader == "last") {
                sidebar.appendChild(ownSidebarBox);
            } else {
                sidebar.insertBefore(ownSidebarBox, referenceObject);
            }
        }
    }
}

Psicotsi.getSortedLinks = function (links) {
    function sortfunction(a, b) {
        return a.link.title.localeCompare(b.link.title);
    }
    links.sort(sortfunction);
    return links;
}

Psicotsi.keysortfunction = function (a, b) {
    return a["title"].localeCompare(b["title"]);
}

/**********************************************************************
 *
 *  Unicode ? UTF-8
 *
 *  Copyright (c) 2005 AOK <soft@aokura.com>
 *
 **********************************************************************/

Psicotsi._to_utf8 = function (s) {
    var c, d = "";
    for (var i = 0; i < s.length; i++) {
        c = s.charCodeAt(i);
        if (c <= 0x7f) {
            d += s.charAt(i);
        } else if (c >= 0x80 && c <= 0x7ff) {
            d += String.fromCharCode(((c >> 6) & 0x1f) | 0xc0);
            d += String.fromCharCode((c & 0x3f) | 0x80);
        } else {
            d += String.fromCharCode((c >> 12) | 0xe0);
            d += String.fromCharCode(((c >> 6) & 0x3f) | 0x80);
            d += String.fromCharCode((c & 0x3f) | 0x80);
        }
    }
    return d;
}

Psicotsi._from_utf8 = function (s) {
    var c, d = "",
        flag = 0,
        tmp;
    for (var i = 0; i < s.length; i++) {
        c = s.charCodeAt(i);
        if (flag == 0) {
            if ((c & 0xe0) == 0xe0) {
                flag = 2;
                tmp = (c & 0x0f) << 12;
            } else if ((c & 0xc0) == 0xc0) {
                flag = 1;
                tmp = (c & 0x1f) << 6;
            } else if ((c & 0x80) == 0) {
                d += s.charAt(i);
            } else {
                flag = 0;
            }
        } else if (flag == 1) {
            flag = 0;
            d += String.fromCharCode(tmp | (c & 0x3f));
        } else if (flag == 2) {
            flag = 3;
            tmp |= (c & 0x3f) << 6;
        } else if (flag == 3) {
            flag = 0;
            d += String.fromCharCode(tmp | (c & 0x3f));
        } else {
            flag = 0;
        }
    }
    return d;
}

Psicotsi.getElementsByClass = function (searchClass, node, tag) {
    var classElements = new Array();
    if (node == null) node = document;
    if (tag == null) tag = '*';
    var els = node.getElementsByTagName(tag);
    var elsLen = els.length;
    var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
    for (var i = 0, j = 0; i < elsLen; i++) {
        if (pattern.test(els[i].className)) {
            classElements[j] = els[i];
            j++;
        }
    }
    return classElements;
}


Psicotsi.substr = function (f_string, f_start, f_length) {
    f_string += '';

    if (f_start < 0) {
        f_start += f_string.length;
    }

    if (f_length == undefined) {
        f_length = f_string.length;
    } else if (f_length < 0) {
        f_length += f_string.length;
    } else {
        f_length += f_start;
    }

    if (f_length < f_start) {
        f_length = f_start;
    }

    return f_string.substring(f_start, f_length);
}

Psicotsi.strrpos = function (haystack, needle, offset) {
    var i = (haystack + '').lastIndexOf(needle, offset); // returns -1
    return i >= 0 ? i : false;
}

Psicotsi.ReturnFormatedValue = function (number, separator) {
    number = '' + number;
    if (number.length > 3) {
        var mod = number.length % 3;
        var output = (mod > 0 ? (number.substring(0, mod)) : '');
        for (var i = 0; i < Math.floor(number.length / 3); i++) {
            if ((mod == 0) && (i == 0)) output += number.substring(mod + 3 * i, mod + 3 * i + 3);
            else output += separator + number.substring(mod + 3 * i, mod + 3 * i + 3);
        }
        return (output);
    }
    else return number;
}


Psicotsi.isStandardLayout = function (doc) {

    var link = doc.getElementsByTagName("link")[0];
    return link.href.search("Simple") == -1; // true = standard / false = simple
}

Psicotsi.isRTLLayout = function (doc) {
    var links = doc.getElementsByTagName("head")[0].getElementsByTagName("link");
    var rtl = false;
    var i = 0,
        link;
    while (link = links[i++]) {
        if (link.href.search("_rtl.css") != -1) rtl = true;
    }
    return rtl;
}

Psicotsi.LoadXML = function (xmlfile) {
    var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
    req.open("GET", xmlfile, false);
    req.send(null);
    var response = req.responseXML;
    if (response.documentElement.nodeName == "parsererror") {
        Psicotsi.dump("[psicotsi.js] error parsing " + xmlfile + "\n");
        return null;
    }
    return response;
}

Psicotsi.XML_evaluate = function (xmlresponse, basenodestr, labelstr, valuestr, value2str, value3str) {
    var result = new Array();
    if (xmlresponse) {
        var nodes = xmlresponse.evaluate(basenodestr, xmlresponse, null, 7, null);
        for (var i = 0; i < nodes.snapshotLength; i++) {
            var node = nodes.snapshotItem(i);
            var label = node.getAttribute(labelstr);
            var value = null;
            var value2 = null;
            var value3 = null;

            if (valuestr) value = node.getAttribute(valuestr);
            if (value2str) value2 = node.getAttribute(value2str);
            if (value3str) value3 = node.getAttribute(value3str);

            if (valuestr) result.push([label, value, value2, value3]);
            else result.push(label);
        }
    }
    return result;
}

Psicotsi.get_url_param = function (url, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);

    if (results == null) return null;
    else return results[1];
}

Psicotsi.linebreak = function (txt, where) {
    try {
        if (txt == null) return '';
        txt = txt.replace(/\<br\>/gi, ' <br> ');
        var d = txt.split(' ');
        for (var j = 0; j < d.length; j++) {
            if (d[j].length > where && d[j].search(/href\=|title\=/i) == -1) {
                d[j] = Psicotsi.cut_word(d[j], where);
            }
        }
        return d.join(" ");
    } catch (e) {
        Psicotsi.dump('[psicotsi.js] LINEBREAK: ' + e + '\n');
    }
}

Psicotsi.cut_word = function (txt, where) {
    try {
        if (txt == null) return '';
        txt = txt.replace(/\<\//g, ' </')
        var c, a = 0,
            g = 0,
            d = new Array();
        for (c = 0; c < txt.length; c++) {

            d[c + g] = txt[c];
            if (txt[c] != " ") a++;
            else if (txt[c] == " ") a = 0;
            if (a == where) {
                g++;
                d[c + g] = " ";
                a = 0;
            }

        }
        return d.join("");
    } catch (e) {
        Psicotsi.dump('[psicotsi.js] CUT WORD: ' + e + '\n');
    }
}

Psicotsi.dump = function (aMessage) {
  Psicotsi.consoleService.logStringMessage("PsicoTSI: " + aMessage);
}
