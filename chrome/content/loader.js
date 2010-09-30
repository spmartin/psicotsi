
if (!Psicotsi) var Psicotsi={};
Psicotsi.StatsHash = {};
Psicotsi.Loader = function(){var pub = {};pub.Load = function(){	
	
	
  var scripts = [
    'preferences.js',
    'const.js',
    'module.js',
    'l10n.js',
    'helper.js',
    'preferences-dialog.js',
    'scripts/predictPD.js',
    'scripts/predictTL.js',
    //'scripts/menuLinks.js',
    'modules_list.js',
    'psicotsi.js',
      ];
		
		
		var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
                .getService(Components.interfaces.mozIJSSubScriptLoader);
    for each (var script in scripts) {
			try {
				loader.loadSubScript('chrome://psicotsi/content/' + script);
			} catch (e) {
				var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
						.getService(Components.interfaces.nsIPromptService);
				promptService.alert(null, null,'Script loading failed > "' + script + '" \n ' + e );
			}
		}

	};
	return pub;	
}();
Psicotsi.Loader.Load();
PsicotsiMain.init();