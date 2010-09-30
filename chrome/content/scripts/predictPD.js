var PsicotsiPredictPlayerDetail = {

  MODULE_NAME : "PredictPlayerDetail",
  MODULE_CATEGORY : Psicotsi.moduleCategories.MAIN,
	PAGES : new Array('playerdetail'), 
  DEFAULT_ENABLED : true,

  init : function() {
    },



getCurrency : function () {
  try {
  
  var currency = PsicotsiPrefs.getString("htCurrencyName");
    
} catch (e) {
var currency = 'null';
dump('  error getCurrency> \n'+e);
}
return currency;
},

getVersion : function () {

var extensionmanager = Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager);    
var version = extensionmanager.getItemForID('{7E77F5DF-8022-40e3-9122-F03DEBEFC43B}').version;

return version;
},

  run : function( page, doc ) {
  /*******START*********/
/*try {
	var doc = document;
    var href = doc.location.href;
    Psicotsi.alert('href:\n'+href);
    //Player page method
		if (this.isHattrickPlayerPage(href))
      this.playerPagePsicoTSI(doc);
    if (this.isHattrickSearchPage(href))
      this.searchPagePsicoTSI(doc);
    else return;
   
	} catch (e) { Psicotsi.alert("Error in PSICOTSI init():\n" + e); }*/
  

  //if ( !Psicotsi.getAccessOnStage(doc) ) return;

 




  try {
  var href = doc.location.href;
      }
	 catch (e) {Psicotsi.alert('er55>\n'+e);}


	
/*	try {
 var transfer = doc.getElementById('ctl00_CPMain_updBid');
 
  } catch (e) {var transfer = false; Psicotsi.alert('TL error>'+e);}*/
  
    	var SkilLink = [];
    	var numberLinks = 0;
			var alldivs = doc.getElementsByTagName('a');

		for (var j = 0; j < alldivs.length; j++) {

      
			if (alldivs[j].className=="skill") {
			
			SkilLink[numberLinks] = alldivs[j];
			numberLinks++;


			}
			}

			if (numberLinks == 15) {
      //Old Table (link skills)
      var sta = PsicotsiHelper.getSkillLevelFromLink(SkilLink[1]);
      var frm = PsicotsiHelper.getSkillLevelFromLink(SkilLink[0]);
      var goa = PsicotsiHelper.getSkillLevelFromLink(SkilLink[8]);
      var def = PsicotsiHelper.getSkillLevelFromLink(SkilLink[12]);
      var pla = PsicotsiHelper.getSkillLevelFromLink(SkilLink[9]);
      var win = PsicotsiHelper.getSkillLevelFromLink(SkilLink[11]);
      var pas = PsicotsiHelper.getSkillLevelFromLink(SkilLink[10]);
      var sco = PsicotsiHelper.getSkillLevelFromLink(SkilLink[13]);
      var sp = PsicotsiHelper.getSkillLevelFromLink(SkilLink[14]);
      entryPoint = SkilLink[8].parentNode.parentNode.parentNode.parentNode.parentNode;
      var tableExist=true;
		  }
			else if (numberLinks == 14) {
      //New Table (graph skills)
      var sta = PsicotsiHelper.getSkillLevelFromLink(SkilLink[1]);
      var frm = PsicotsiHelper.getSkillLevelFromLink(SkilLink[0]);
      var goa = PsicotsiHelper.getSkillLevelFromLink(SkilLink[7]);
      var def = PsicotsiHelper.getSkillLevelFromLink(SkilLink[8]);
      var pla = PsicotsiHelper.getSkillLevelFromLink(SkilLink[9]);
      var win = PsicotsiHelper.getSkillLevelFromLink(SkilLink[10]);
      var pas = PsicotsiHelper.getSkillLevelFromLink(SkilLink[11]);
      var sco = PsicotsiHelper.getSkillLevelFromLink(SkilLink[12]);
      var sp = PsicotsiHelper.getSkillLevelFromLink(SkilLink[13]);
      entryPoint = SkilLink[7].parentNode.parentNode.parentNode.parentNode.parentNode;
		  }
      else if (numberLinks == 16) {
      //New Table (graph skills)
      var sta = PsicotsiHelper.getSkillLevelFromLink(SkilLink[1]);
      var frm = PsicotsiHelper.getSkillLevelFromLink(SkilLink[0]);
      var goa = PsicotsiHelper.getSkillLevelFromLink(SkilLink[9]);
      var def = PsicotsiHelper.getSkillLevelFromLink(SkilLink[13]);
      var pla = PsicotsiHelper.getSkillLevelFromLink(SkilLink[10]);
      var win = PsicotsiHelper.getSkillLevelFromLink(SkilLink[12]);
      var pas = PsicotsiHelper.getSkillLevelFromLink(SkilLink[11]);
      var sco = PsicotsiHelper.getSkillLevelFromLink(SkilLink[14]);
      var sp = PsicotsiHelper.getSkillLevelFromLink(SkilLink[15]);
      entryPoint = SkilLink[9].parentNode.parentNode.parentNode.parentNode.parentNode;
		  }    	  
			else {
			var sta = 6;
      var frm = 6;
      var goa = 5;
      var def = 1;
      var pla = 1;
      var win = 1;
      var pas = 1;
      var sco = 1;
      var sp = 1;
			entryPoint = doc.getElementById('ctl00_CPMain_updBestLatest');
      //Psicotsi.alert('Table not found>\n'+numberLinks);
      }
			//Psicotsi.alert(tableExist);
		
			
//Psicotsi.alert(numberLinks);

	try {


      /* var links = doc.evaluate("//a[contains(@href,'&ll=')]",doc,null,
       doc.getElementById('ctl00_CPMain_UpdateProgress1').UNORDERED_NODE_SNAPSHOT_TYPE
       ,null);
    Psicotsi.alert(
    PsicotsiHelper.getSkillLevelFromLink(links.snapshotItem(7).href)+"\n\njoooo"
    );
    var kolacekShorcici = true;
    //if (links.snapshotLength < 14) {
    if (!kolacekShorcici){
      //Skills not available
      return;
    } else if (links.snapshotLength == 14) {
      //New Table
      var goa = this.getValueFromLink(links.snapshotItem(7).href)
      var def = this.getValueFromLink(links.snapshotItem(8).href)
      var pla = this.getValueFromLink(links.snapshotItem(9).href)
      var win = this.getValueFromLink(links.snapshotItem(10).href)
      var pas = this.getValueFromLink(links.snapshotItem(11).href)
      var sco = this.getValueFromLink(links.snapshotItem(12).href)
      var sp = this.getValueFromLink(links.snapshotItem(13).href)
      entryPoint = links.snapshotItem(7).parentNode.parentNode.parentNode.parentNode.parentNode;
    } else if (links.snapshotLength == 15) {
      //Old Table
      var goa = this.getValueFromLink(links.snapshotItem(8).href)
      var def = this.getValueFromLink(links.snapshotItem(12).href)
      var pla = this.getValueFromLink(links.snapshotItem(9).href)
      var win = this.getValueFromLink(links.snapshotItem(11).href)
      var pas = this.getValueFromLink(links.snapshotItem(10).href)
      var sco = this.getValueFromLink(links.snapshotItem(13).href)
      var sp = this.getValueFromLink(links.snapshotItem(14).href)
      entryPoint = links.snapshotItem(8).parentNode.parentNode.parentNode.parentNode.parentNode;
    } else if (links.snapshotLength == 16) {
      //Old Table
      var goa = this.getValueFromLink(links.snapshotItem(9).href)
      var def = this.getValueFromLink(links.snapshotItem(13).href)
      var pla = this.getValueFromLink(links.snapshotItem(10).href)
      var win = this.getValueFromLink(links.snapshotItem(12).href)
      var pas = this.getValueFromLink(links.snapshotItem(11).href)
      var sco = this.getValueFromLink(links.snapshotItem(14).href)
      var sp = this.getValueFromLink(links.snapshotItem(15).href)
      entryPoint = links.snapshotItem(9).parentNode.parentNode.parentNode.parentNode.parentNode;
    } else {

      throw ("Error in getting skills: unknown method");
    }
    

    */

    

    
    var age = PsicotsiHelper.getAge(doc);
    var infoTable = PsicotsiHelper.getInfoTable(doc);
    var currTSI = PsicotsiHelper.getTSI(infoTable);
		var currWAGE =  PsicotsiHelper.getWage(infoTable);
		var injured = PsicotsiHelper.getInjuries(infoTable);

    
  	var playerskills = new Array(
    parseFloat(frm),
    parseFloat(sta),
    parseFloat(pla),
    parseFloat(win),
    parseFloat(sco),
    parseFloat(goa),
    parseFloat(pas),
    parseFloat(def),
    parseFloat(sp)
    );

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
      valMaxSkillWage =  PsicotsiHelper.calcMaxSkillWage(playerskills, currWAGE);
      
      if (valMaxSkillLow-playerskills[maxSkill] <= 0.1) {
        limit = "Low";
      };
      if (valMaxSkillHigh-playerskills[maxSkill] >= 0.8) {
        limit = "High";
      };
    };
    
     if (isGK) {
      valMaxSkillAvg  = PsicotsiHelper.calcMaxSkillGK(currTSI, frm, "Avg");
      valMaxSkillLow  = PsicotsiHelper.calcMaxSkillGK(currTSI, frm, "Low");
      valMaxSkillHigh = PsicotsiHelper.calcMaxSkillGK(currTSI, frm, "High");
     };

    
    this.drawMessage(doc, entryPoint, isGK, undef, injured, age > 27, maxSkill, valMaxSkillHigh, valMaxSkillAvg, valMaxSkillLow, valMaxSkillWage, limit)
    
	
  } catch (e) {
  //Psicotsi.alert('e944>\n'+e);
  dump('e944.2>\n'+e);
  }
	
/**end of main func*/

},

drawMessage : function(doc, entryPoint, isGK, isUndefinedMainskill, isInjured, isOld, maxSkill, valMaxSkillHigh, valMaxSkillAvg, valMaxSkillLow, valMaxSkillWage, limit) {


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
  
  var table = doc.createElement("table");
  
  


  if (!PsicotsiHelper.getTableExist(doc)) {


         // Player has more than one mainskill
      var tr = doc.createElement("tr");
      var td1 = doc.createElement("td");
      var td2 = doc.createElement("td");
      var img = doc.createElement("img");
      img.setAttribute("src","chrome://psicotsi/content/resources/img/unknown.png");
      img.setAttribute("alt","");
      img.setAttribute("width","16");
      img.setAttribute("height","16");
      td1.setAttribute("style","text-align: center; vertical-align: middle;");
      td1.appendChild(img);
      td2.appendChild(doc.createTextNode(STR_SKILL_NOT_AVAIL));
      tr.appendChild(td1);
      tr.appendChild(td2);
      table.appendChild(tr);

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
  td2.appendChild(doc.createElement("br"));
  
  var SETT_SHOW_WAGE = false;
  try {
  var SETT_SHOW_WAGE = PsicotsiPrefs.getBool("showWage");
  
var currency = this.getCurrency();

  
  
    if (SETT_SHOW_WAGE) {
      if (!isGK) {
      td2.appendChild(doc.createTextNode(mainSkillText + " [" + STR_WAGE + "=" + currency + "]=" + valMaxSkillWage));
      td2.appendChild(doc.createElement("br"));
      }
    }
  } catch(e){ dump('  error at #533 predictPD.js>\n'+e); }
    
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
  
  }//end tableExist
  var optionsLink = doc.createElement("a");
    var SETT_HIDE_UNDER_SKILLS = false;
  try {
  	var SETT_HIDE_UNDER_SKILLS = PsicotsiPrefs.getBool("hideUnderSkills");
  	}
	  catch (e){ }
	  
	  if (SETT_HIDE_UNDER_SKILLS == false){
  // PsicoTSIBox is the default style

  
  var isAlertBoxStyle = false;
  var classTypeBox = "PsicoTSIBox";
  
  try {
    isAlertBoxStyle = PsicotsiPrefs.getBool("showAlertBox");
  } catch (e) { }

  if (isAlertBoxStyle) {
  var paddingOL = "5px";
    var title = doc.createElement("strong");
    title.appendChild(doc.createTextNode("PSICOTSI TERMINUS EDITION " + this.getVersion()));
    title.appendChild(doc.createElement("br"));
    title.appendChild(doc.createElement("br"));
    classTypeBox = "alert";
  }
  else {
  var paddingOL = "0";
    var title = doc.createElement("h2");
    title.appendChild(doc.createTextNode("PsicoTSI Terminus Edition " + this.getVersion()));
  }
  var optionDiv = doc.createElement("div");
	optionDiv.setAttribute("class", "psicotsi_option_div");
	
	var divobj = doc.createElement("div");
	divobj.setAttribute("class", classTypeBox );
	
	var innerdivobj = doc.createElement("div");
	innerdivobj.setAttribute("class", "boxLeft");
	
	
	//optionsLink.innerHTML = "Options";
  //optionsLink.setAttribute("style","float: right; padding: " + paddingOL + " 5px 5px 5px; ");
  //optionsLink.setAttribute("href"," ");
  //optionsLink.setAttribute("target","_blank");
  //optionsLink.setAttribute("rel","nofollow");
  innerdivobj.appendChild(title);

	divobj.appendChild(innerdivobj);
	
	divobj.appendChild(table);
	//optionDiv.appendChild(optionsLink);
  optionDiv.appendChild(divobj);
  entryPoint.parentNode.insertBefore(optionDiv, entryPoint.nextSibling);
  }
  
  var SETT_PREF_LEFT = false;
  try {
  	var SETT_PREF_LEFT = PsicotsiPrefs.getBool("showLeftMenu");
  	}
	  catch (e){Psicotsi.alert('PsicoTSI error #4711102 >>>\n'+e); }
	
	
	
  
  if (SETT_PREF_LEFT){
  var messagePTSI = doc.createElement("div");

  
  if (PsicotsiPrefs.getBool("showAlertBox")){
    messagePTSI.setAttribute("class","alert");
  }
  else {
    messagePTSI.setAttribute("class","psico_alert");
    messagePTSI.setAttribute("style","padding: 5px 5px 5px 5px;");
  }

   var messagePTSI_isEmpty = true;
  
  var nbsp = doc.createElement("div");
  nbsp.setAttribute("style","padding-left: 3px; width: 3px; height: 11px;");
  
  if (limit == "Low") {
       var img = doc.createElement("img");
      img.setAttribute("src","chrome://psicotsi/content/resources/img/approved.png");
      img.setAttribute("alt","Very low sub-skill");
      img.setAttribute("title",STR_L_LOW);
      img.setAttribute("width","16");
      img.setAttribute("height","16");
      img.setAttribute("style","padding-right: 3px;");
      messagePTSI.appendChild(img);
      messagePTSI_isEmpty = false;
      }
      
  else if (limit == "High") {
      var img = doc.createElement("img");
      img.setAttribute("src","chrome://psicotsi/content/resources/img/dollar.png");
      img.setAttribute("alt","High sub-skill");
      img.setAttribute("title",STR_L_HIGH);
      img.setAttribute("width","16");
      img.setAttribute("height","16");
      img.setAttribute("style","padding-right: 3px;");
      messagePTSI.appendChild(img);
      messagePTSI_isEmpty = false;
      }
      
  if (isUndefinedMainskill) {
      var img = doc.createElement("img");
      img.setAttribute("src","chrome://psicotsi/content/resources/img/new.png");
      img.setAttribute("alt","2 main skills");
      img.setAttribute("title",STR_UNDEF_MAINSKILL);
      img.setAttribute("width","16");
      img.setAttribute("height","16");
      img.setAttribute("style","padding-right: 3px;");
      messagePTSI.appendChild(img);
      messagePTSI_isEmpty = false;
      }
      
    if (isInjured) {
      var img = doc.createElement("img");
      img.setAttribute("src","chrome://psicotsi/content/resources/img/injured.png");
      img.setAttribute("alt","Injured");
      img.setAttribute("title",STR_INJURED);
      img.setAttribute("width","16");
      img.setAttribute("height","16");
      img.setAttribute("style","padding-right: 3px;");
      messagePTSI.appendChild(img);
      messagePTSI_isEmpty = false;
      }
      
    if (isOld) {
      var img = doc.createElement("img");
      img.setAttribute("src","chrome://psicotsi/content/resources/img/notdecided.png");
      img.setAttribute("alt","Too old");
      img.setAttribute("title",STR_OLD);
      img.setAttribute("width","16");
      img.setAttribute("height","16");
      img.setAttribute("style","padding-right: 3px;");
      messagePTSI.appendChild(img);
      messagePTSI_isEmpty = false;
      }
  
  
  var h3Tag = doc.getElementsByTagName("h3")[0];
  
  var divobj = doc.createElement("div");
  divobj.setAttribute("class","subMenuBox");
  var divH = doc.createElement("div");
  divH.setAttribute("class","boxHead");
  
  var divF = doc.createElement("div");
  divF.setAttribute("class","boxFooter");
  
  var divFL = doc.createElement("div");
  divFL.setAttribute("class","boxLeft");
  divFL.innerHTML = "&nbsp;";
  
  var divL = doc.createElement("div");
  divL.setAttribute("class","boxLeft");
  
  var h2 = doc.createElement("h2");
  h2.setAttribute("class","psicoFeat");
  h2.innerHTML = "PsicoTSI "+this.getVersion();

  var divB = doc.createElement("div");
  divB.setAttribute("class","boxBody");
  
    if (!PsicotsiHelper.getTableExist(doc)) {




      var img = doc.createElement("img");
      img.setAttribute("src","chrome://psicotsi/content/resources/img/unknown.png");
      img.setAttribute("alt","?");
      img.setAttribute("title",STR_SKILL_NOT_AVAIL);
      img.setAttribute("width","16");
      img.setAttribute("height","16");
      img.setAttribute("style","padding-right: 3px;");
      messagePTSI.appendChild(img);
      messagePTSI_isEmpty = false;

  }
  
  
  
else {  
  var formH = "["+STR_FORM + "=" + STR_F_HIGH+"]="+valMaxSkillHigh+"<br>";
  var formA = "["+STR_FORM + "=" + STR_F_AVG+"]="+valMaxSkillAvg+"<br>";
  var formL = "["+STR_FORM + "=" + STR_F_LOW+"]="+valMaxSkillLow+"<br>";
  if (!isGK){var wageNGK = "["+STR_WAGE + "=" + currency + "]="+valMaxSkillWage+"<br>";
    }else {var wageNGK = " ";}
  divB.innerHTML = "<br><b>"+mainSkillText+":</b><br>"+formH+formA+formL+wageNGK+"<br>";
}
 if ( !messagePTSI_isEmpty ) {
  divB.appendChild(messagePTSI);
  }
  
  divL.appendChild(h2);
  divH.appendChild(divL);
  divobj.appendChild(divH);
  divobj.appendChild(divB);
  divF.appendChild(divFL);
  divobj.appendChild(divF);
  
  var entryPoint = h3Tag.parentNode;
  entryPoint.parentNode.parentNode.insertBefore(divobj, entryPoint.nextSibling.NextSibling);
  
  }
 
  

},








// Neural Network simulation
// ---------------------------------------------------------------------------



  
  /******END***********/


};