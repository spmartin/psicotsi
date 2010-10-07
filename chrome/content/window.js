try {
    // this is needed to generally allow usage of components in javascript  
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    var PsicotsiService = Components.classes['@aldeaglobal.net/psicotsi-boot;1'].getService().wrappedJSObject;
    PsicotsiService.load();

} catch (anError) {
    dump("ERROR: " + anError);
}

var PsicotsiMain = PsicotsiService.getPsicotsiMain();
var Psicotsi = PsicotsiService.getPsicotsi();
var PsicotsiPrefs = PsicotsiService.getPsicotsiPrefs();
var Psicotsil10n = PsicotsiService.getPsicotsil10n();