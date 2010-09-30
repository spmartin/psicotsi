try {
    var	htLanguageXml = document.implementation.createDocument("", "", null);
    htLanguageXml.async = false;
    htLanguageXml.load("chrome://psicotsi/content/htlocales/htlang.xml", "text/xml");
} catch (e) {
	alert(e);
}
