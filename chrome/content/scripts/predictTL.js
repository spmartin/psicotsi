var PsicotsiPredictTransferPage = {

    MODULE_NAME : "PredictTransferPage",
    MODULE_CATEGORY : Psicotsi.moduleCategories.MAIN,
    PAGES : new Array('transferListSearchResult'),
    DEFAULT_ENABLED : true,

    init : function() {
    },
  
    getInjury : function(searchClass,node,tag) {
        var classElements = new Array();
        if ( node == null )
            node = document;
        if ( tag == null )
            tag = '*';
        var els = node.getElementsByTagName(tag);
        var elsLen = els.length;
        var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
        for (var i = 0, j = 0; i < elsLen; i++) {
            if ( pattern.test(els[i].className) ) {
                return true;
            }
        }
        return false;
    },
    getVersion : function () {

        var extensionmanager = Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager);
        var version = extensionmanager.getItemForID('{7E77F5DF-8022-40e3-9122-F03DEBEFC43B}').version;

        return version;
    },
    run : function( page, doc ) {

        var SETT_SHOW_SEARCH_PAGE = true;
        try {
            var SETT_SHOW_SEARCH_PAGE = PsicotsiPrefs.getBool("showSearchPage");
        }
        catch (e){
            Psicotsi.alert('error #454158484 >>>\n'+e);
        }
	

	
  
        if (SETT_SHOW_SEARCH_PAGE){
   
            var SkilLink = [];
            var numberLinks = 0;
    	
            try {

                var alldivs = doc.getElementsByTagName('a');

                for (var j = 0; j < alldivs.length; j++) {

      
                    if (alldivs[j].className=="skill") {
			
                        SkilLink[numberLinks] = alldivs[j];
                        numberLinks++;


                    }
                }
            } catch (e){
                Psicotsi.alert('error #915411 >>\n'+e);
            }
            //	Psicotsi.alert('numlinks: '+numberLinks);
            var firstTLPlayer=0;
            var numberLinks2=numberLinks/11;

            for (ii = 0; ii <= numberLinks2; ii++) {
                var ageR = doc.getElementById('ctl00_CPMain_dl_ctrl' + ii + '_TransferPlayer_r3');
     
                if (this.getTLTableExist(ii,doc)==true){

                    firstTLPlayer=ii;
                    //Psicotsi.alert('firstTLPLAYER: '+ii);
                    break;
                }
            }

            for (i = firstTLPlayer; i <= numberLinks2; i++) {
                var offset = (11*i)-(firstTLPlayer*11);
                //Psicotsi.alert('offset: '+offset);
                var tableExist=this.getTLTableExist(i,doc);
                try {
    
                    var sta = parseFloat(PsicotsiHelper.getSkillLevelFromLink(SkilLink[3 + offset]));

                    var frm = parseFloat(PsicotsiHelper.getSkillLevelFromLink(SkilLink[2 + offset]));
                    var goa = parseFloat(PsicotsiHelper.getSkillLevelFromLink(SkilLink[4 + offset]));
                    var def = parseFloat(PsicotsiHelper.getSkillLevelFromLink(SkilLink[8 + offset]));
                    var pla = parseFloat(PsicotsiHelper.getSkillLevelFromLink(SkilLink[5 + offset]));
                    var win = parseFloat(PsicotsiHelper.getSkillLevelFromLink(SkilLink[7 + offset]));
                    var pas = parseFloat(PsicotsiHelper.getSkillLevelFromLink(SkilLink[6 + offset]));
                    var sco = parseFloat(PsicotsiHelper.getSkillLevelFromLink(SkilLink[9 + offset]));
                    var sp = parseFloat(PsicotsiHelper.getSkillLevelFromLink(SkilLink[10 + offset]));

                    
                    //Psicotsi.alert(sta+'-'+frm+'-'+goa+'-'+def+'-'+pla+'-'+win+'-'+pas+'-'+sco+'-'+sp);
                  
                    var ageR = null;
                    var tsiR = null;
                    try {
                        var ageR = doc.getElementById('ctl00_CPMain_dl_ctrl' + i + '_TransferPlayer_r3');
                        var tsiR = doc.getElementById('ctl00_CPMain_dl_ctrl' + i + '_TransferPlayer_r4');
 
                        if (ageR != null){
                            var ageRow = ageR.cells[1];
                            var tsiRow = tsiR.cells[1];
   
                            var age = parseFloat(ageRow.innerHTML.replace(/[\s]*/gi, ""));
                            //Psicotsi.alert('age: '+age);
                            var currTSI = parseFloat(Psicotsi.trim(tsiRow.innerHTML));//parseFloat(tsiRow.cells[1].textContent.replace(/[\s]*/gi, "")); //getTSI(infoTable);
                        //Psicotsi.alert('tsi: '+currTSI);
                        }
                        else{
                            var tableExist = false;
                        }
                    } catch(e){
                        Psicotsi.alert('eerdffrr #458158>\n'+e);
                    }
    
                    if (ageR == null){
                        var age = 20;
                        var currTSI = 999999;
                        var tableExist = false;
                    }
    
                    try {
                        var currWAGE = 0;
                        var injured = false;
      
                        //Psicotsi.alert('currTSI: '+currTSI);
                        //this is a really bad code... thinking about a better way

                        var node = doc.getElementById('ctl00_CPMain_dl_ctrl' + i + '_TransferPlayer_r1');
                        var testSearch = doc.evaluate(
                            "//img[contains(@class,'injuryInjured')]",
                            doc,
                            null,
                            Components.interfaces.nsIDOMXPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                            null);
                        for (kk = 0; kk < testSearch.snapshotLength; kk++)
                        {
                            testNode = testSearch.snapshotItem(kk).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                            if (testNode == node.previousSibling.previousSibling)
                                injured = true;
                        }
                    } catch(e){
                        Psicotsi.alert('eerdffrr #451158>\n'+e);
                    }
                    if (node == null){
                        injured = false;
                    }
                    //Psicotsi.alert('injured: '+injured);
 
    
                    var playerskills = new Array(frm, sta, pla, win, sco, goa, pas, def, sp);

                    var maxSkill = PsicotsiHelper.getMaxSkill(playerskills);
                    
                    //halt if player is a Divine or Non - existent
                    if ((playerskills[maxSkill] == 20) || (maxSkill == 0)) {
                        return;
                    }
                    var valMaxSkillAvg = 0;
                    var valMaxSkillLow = 0;
                    var valMaxSkillHigh = 0;
                    var valMaxSkillWage = 0;

                    var undef = PsicotsiHelper.undefinedMainSkill(playerskills);

                    var language = 0;

                    var limit = "Medium";
    
                    var isGK = PsicotsiHelper.isGoalkeeper(maxSkill);
    
                    if (!isGK) {
                        valMaxSkillAvg  = PsicotsiHelper.calcMaxSkill(playerskills, currTSI, "Avg");
                        valMaxSkillLow  = PsicotsiHelper.calcMaxSkill(playerskills, currTSI, "Low");
                        valMaxSkillHigh = PsicotsiHelper.calcMaxSkill(playerskills, currTSI, "High");
                        valMaxSkillWage = 0;
      
                        if (valMaxSkillLow-playerskills[maxSkill] <= 0.1) {
                            limit = "Low";
                        }
                        if (valMaxSkillHigh-playerskills[maxSkill] >= 0.8) {
                            limit = "High";
                        }
                    }
    
                    if (isGK) {
                        try {
                            valMaxSkillAvg  = PsicotsiHelper.calcMaxSkillGK(currTSI, frm, "Avg");
                            valMaxSkillLow  = PsicotsiHelper.calcMaxSkillGK(currTSI, frm, "Low");
                            valMaxSkillHigh = PsicotsiHelper.calcMaxSkillGK(currTSI, frm, "High");
                        }
                        catch(e){
                            Psicotsi.alert('error #344145445  > \n'+e);
                        }
                        valMaxSkillWage = 0;
      


                    }
                    var tableExist = true;
                }
                catch (e){
                    /*Psicotsi.alert('error #9211510 >'+e)*/;var tableExist = false;
                }

                var entryPoint = node.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
                this.drawMessageInSearchPage(tableExist,doc, entryPoint, isGK, undef, injured, age > 27, maxSkill, valMaxSkillHigh, valMaxSkillAvg, valMaxSkillLow, valMaxSkillWage, limit);
            }
        }
  
  
    },
    getTLTableExist : function (inte,doc) {
        var gte = doc.getElementById('ctl00_CPMain_dl_ctrl' + inte + '_TransferPlayer_r1');

        if (gte) {
            return true;
        }
        else {
            return false;
        }

    },
    drawMessageInSearchPage : function (tableExist,doc, entryPoint, isGK, isUndefinedMainskill, isInjured, isOld, maxSkill, valMaxSkillHigh, valMaxSkillAvg, valMaxSkillLow, valMaxSkillWage, limit) {

 


        const STR_S_PM = Psicotsil10n.getString("skillPlaymaking");
        const STR_S_WG = Psicotsil10n.getString("skillWinger");
        const STR_S_SC = Psicotsil10n.getString("skillScoring");
        const STR_S_PS = Psicotsil10n.getString("skillPassing");
        const STR_S_DF = Psicotsil10n.getString("skillDefending");
        const STR_S_GK = Psicotsil10n.getString("skillKeeper");

        const STR_FORM   = Psicotsil10n.getString("form");
        const STR_WAGE   = Psicotsil10n.getString("wage");

        const STR_F_HIGH = Psicotsil10n.getString("high");
        const STR_F_AVG  = Psicotsil10n.getString("average");
        const STR_F_LOW  = Psicotsil10n.getString("low");

        const STR_UNDEF_MAINSKILL = Psicotsil10n.getString("twoMainSkills");
        const STR_INJURED         = Psicotsil10n.getString("injuredPlayer");
        const STR_OLD             = Psicotsil10n.getString("oldPlayer");

        const STR_GOALKEEPER      = Psicotsil10n.getString("isGoalkeeper");
        const STR_SKILL_NOT_AVAIL = Psicotsil10n.getString("skillsNotAvailable");

        const STR_L_LOW  = Psicotsil10n.getString("limitLow");
        const STR_L_HIGH = Psicotsil10n.getString("limitHigh");
        var al_div = doc.createElement("div");
        var table = doc.createElement("table");
  
        var isAlertBoxStyle = false;
        var classTypeBox = "alert";
        var headerText = "PsicoTSI Terminus Edition";
        try {
            isAlertBoxStyle = PsicotsiPrefs.getBool("showAlertBox");
        } catch (e) { }

        if (isAlertBoxStyle) {
            al_div.setAttribute("class","alert");
            headerText = "PSICOTSI TERMINUS EDITION";
        }
        else {
            al_div.setAttribute("style","padding: 5px 5px 5px 5px;");
        }
        al_div.setAttribute("style","width: 60%;");


        var tr = doc.createElement("tr");
        var td1 = doc.createElement("td");
        var td2 = doc.createElement("td");
        var strong = doc.createElement("strong");
        strong.appendChild(doc.createTextNode(headerText + " " + this.getVersion()));
        al_div.appendChild(strong);
        //td2.appendChild(doc.createElement("br"));
        //td2.appendChild(doc.createElement("br"));
        tr.appendChild(td1);
        //tr.appendChild(td2);
        table.appendChild(tr);

        //var tableExist = this.getTLTableExist(i,doc);
        if (tableExist == false) {

 
            // Player has more than one mainskill
            var tr = doc.createElement("tr");
            var td1 = doc.createElement("td");
            var td2 = doc.createElement("td");
            var img = doc.createElement("img");
            img.setAttribute("src","chrome://psicotsi/content/resources/img/new.png");
            img.setAttribute("alt","");
            img.setAttribute("width","15");
            img.setAttribute("height","16");
            td1.setAttribute("style","text-align: center; vertical-align: middle;");
            td1.appendChild(img);
            td2.appendChild(doc.createTextNode(STR_SKILL_NOT_AVAIL));
            tr.appendChild(td1);
            tr.appendChild(td2);
            table.appendChild(tr);



            alert("Error in PSICOTSI (GK error 5991167):\n");
    
    
    
        }
        else {
            if (isUndefinedMainskill) {
                // Player has more than one mainskill
                var tr = doc.createElement("tr");
                var td1 = doc.createElement("td");
                var td2 = doc.createElement("td");
                var img = doc.createElement("img");
                img.setAttribute("src","chrome://psicotsi/content/resources/img/new.png");
                img.setAttribute("alt","");
                img.setAttribute("width","16");
                img.setAttribute("height","16");
                td1.setAttribute("style","text-align: center; vertical-align: middle;");
                td1.appendChild(img);
                td2.appendChild(doc.createTextNode(STR_UNDEF_MAINSKILL));
                tr.appendChild(td1);
                tr.appendChild(td2);
                table.appendChild(tr);
            }
            if (isInjured) {
                // Player is injured
                var tr = doc.createElement("tr");
                var td1 = doc.createElement("td");
                var td2 = doc.createElement("td");
                var img = doc.createElement("img");
                img.setAttribute("src","chrome://psicotsi/content/resources/img/injured.png");
                img.setAttribute("alt","");
                img.setAttribute("width","16");
                img.setAttribute("height","16");
                td1.setAttribute("style","text-align: center; vertical-align: middle;");
                td1.appendChild(img);
                td2.appendChild(doc.createTextNode(STR_INJURED));
                tr.appendChild(td1);
                tr.appendChild(td2);
                table.appendChild(tr);
            }
            if (isOld) {
                // Player is old
                var tr = doc.createElement("tr");
                var td1 = doc.createElement("td");
                var td2 = doc.createElement("td");
                var img = doc.createElement("img");
                img.setAttribute("src","chrome://psicotsi/content/resources/img/notdecided.png");
                img.setAttribute("alt","");
                img.setAttribute("width","16");
                img.setAttribute("height","16");
                td1.setAttribute("style","text-align: center; vertical-align: middle;");
                td1.appendChild(img);
                td2.appendChild(doc.createTextNode(STR_OLD));
                tr.appendChild(td1);
                tr.appendChild(td2);
                table.appendChild(tr);
            }
    
            var mainSkillText = "";
   	
            switch (maxSkill) {
                case 2:
                    mainSkillText = STR_S_PM;
                    break;
                case 3:
                    mainSkillText = STR_S_WG;
                    break;
                case 4:
                    mainSkillText = STR_S_SC;
                    break;
                case 5:
                    mainSkillText = STR_S_GK;
                    break;
                case 6:
                    mainSkillText = STR_S_PS;
                    break;
                case 7:
                    mainSkillText = STR_S_DF;
                    break;
            }
    
            var tr = doc.createElement("tr");
            var td1 = doc.createElement("td");
            var td2 = doc.createElement("td");
            var img = doc.createElement("img");
            var link = doc.createElement("a");
 
            img.setAttribute("src","chrome://psicotsi/content/resources/img/NNicon.gif");
            img.setAttribute("alt","");
            img.setAttribute("border","0");
            img.setAttribute("width","16");
            img.setAttribute("height","14");
            link.setAttribute("target","_blank");
            link.setAttribute("href","http://www.psicotsi.com");
            link.appendChild(img);
            td1.setAttribute("style","text-align: center; vertical-align: middle;");
            td1.appendChild(link);
            td2.appendChild(doc.createTextNode(mainSkillText + " [" + STR_FORM + "=" + STR_F_HIGH + "]=" + valMaxSkillHigh));
            td2.appendChild(doc.createElement("br"));
            td2.appendChild(doc.createTextNode(mainSkillText + " [" + STR_FORM + "=" + STR_F_AVG + "]=" + valMaxSkillAvg));
            td2.appendChild(doc.createElement("br"));
            td2.appendChild(doc.createTextNode(mainSkillText + " [" + STR_FORM + "=" + STR_F_LOW + "]=" + valMaxSkillLow));
            tr.appendChild(td1);
            tr.appendChild(td2);
            table.appendChild(tr);

            if (limit == "Low") {
                var tr = doc.createElement("tr");
                var td1 = doc.createElement("td");
                var td2 = doc.createElement("td");
                var img = doc.createElement("img");
                img.setAttribute("src","chrome://psicotsi/content/resources/img/approved.png");
                img.setAttribute("alt","");
                img.setAttribute("width","16");
                img.setAttribute("height","16");
                td1.setAttribute("style","text-align: center; vertical-align: middle;");
                td1.appendChild(img);
                td2.appendChild(doc.createTextNode(STR_L_LOW));
                tr.appendChild(td1);
                tr.appendChild(td2);
                table.appendChild(tr);
            } else if (limit == "High") {
                var tr = doc.createElement("tr");
                var td1 = doc.createElement("td");
                var td2 = doc.createElement("td");
                var img = doc.createElement("img");
                img.setAttribute("src","chrome://psicotsi/content/resources/img/dollar.png");
                img.setAttribute("alt","");
                img.setAttribute("width","16");
                img.setAttribute("height","16");
                td1.setAttribute("style","text-align: center; vertical-align: middle;");
                td1.appendChild(img);
                td2.appendChild(doc.createTextNode(STR_L_HIGH));
                tr.appendChild(td1);
                tr.appendChild(td2);
                table.appendChild(tr);
            }
        }


        al_div.appendChild(table);
        var mainTr = doc.createElement("tr");
        var mainTd = doc.createElement("td");
        mainTd.setAttribute("colspan","6");
        mainTd.appendChild(al_div);
        mainTr.appendChild(mainTd);
        entryPoint.parentNode.insertBefore(mainTr, entryPoint.nextSibling);
    }
};