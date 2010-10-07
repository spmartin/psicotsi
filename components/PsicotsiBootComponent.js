const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

function PsicotsiBootComponent() {
	this.wrappedJSObject = this;
};

PsicotsiBootComponent.prototype = {  
  // properties required for XPCOM registration:  
	classDescription: "Boot system which loads PsicoTSI",
  classID:          Components.ID("{9579bc30-6b81-11de-8a39-0800200c9a66}"),  
  contractID:       "@aldeaglobal.net/psicotsi-boot;1",  
  
  // QueryInterface implementation, e.g. using the generateQI helper  
 QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsIPsicotsi]),
  
  // ...component implementation...  
  load: function() {
    var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
                           .getService(Components.interfaces.mozIJSSubScriptLoader);
    loader.loadSubScript('chrome://psicotsi/content/loader.js');
  },

  getPsicotsi: function() {
      return Psicotsi;
  },

  getPsicotsiMain: function() {
      return PsicotsiMain;
  },
  
  getPsicotsiPrefs: function() {
      return PsicotsiPrefs;
  },
  
  getPsicotsil10n: function() {
      return Psicotsil10n;
  }
    
};  

/**
* XPCOMUtils.generateNSGetFactory was introduced in Mozilla 2 (Firefox 4).
* XPCOMUtils.generateNSGetModule is for Mozilla 1.9.2 (Firefox 3.6).
*/
if (XPCOMUtils.generateNSGetFactory)
    var NSGetFactory = XPCOMUtils.generateNSGetFactory([PsicotsiBootComponent]);
else
    var NSGetModule = XPCOMUtils.generateNSGetModule([PsicotsiBootComponent]);
