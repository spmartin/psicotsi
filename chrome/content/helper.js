var PsicotsiHelper = {
    MODULE_NAME: "Helper",
    PAGES: new Array('myhattrick'),
    DEFAULT_ENABLED: true,
    init: function () {},
    run: function (page, doc) {
        this.getOwnTeamInfo(doc);
    },
    change: function (page, doc) {},
    findTeamId: function (element) {
        var links = element.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            if (links[i].href.match(/TeamID=/i)) {
                return links[i].href.replace(/.+TeamID=/i, "").match(/^\d+/)[0];
            }
        }
        return false;
    },
    findSecondTeamId: function (element, firstteamid) {
        var links = element.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            if (links[i].href.match(/TeamID=/i)) {
                var id = links[i].href.replace(/.+TeamID=/i, "").match(/^\d+/)[0];
                if (id != firstteamid) return id;
            }
        }
        return 0;
    },
    findPlayerId: function (element) {
        var links = element.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            if (links[i].href.match(/playerID=/i)) {
                return links[i].href.replace(/.+playerID=/i, "").match(/^\d+/)[0];
            }
        }
        return null;
    },
    findYouthPlayerId: function (element) {
        var links = element.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            if (links[i].href.match(/YouthPlayerID=/i)) {
                return links[i].href.replace(/.+YouthPlayerID=/i, "").match(/^\d+/)[0];
            }
        }
        return null;
    },
    getSkillLevelFromLink: function (link) {
        var value = link.href.replace(/.+(ll|labellevel)=/i, "").match(/^\d+/);
        return value;
    },


    isHattrickPlayerPage: function (href) {
        var regexp = /^http:\/\/(193\.34\.189\.[0-9]+|[^\.]*\.hattrick\.(org|ws|uol\.com\.br)|hattrick\.(org|ws|uol\.com\.br))\/Club\/Players\/Player.aspx/i;
        return regexp.test(href);
    },

    isHattrickSearchPage: function (href) {
        var regexp = /^http:\/\/(193\.34\.189\.[0-9]+|[^\.]*\.hattrick\.(org|ws|uol\.com\.br)|hattrick\.(org|ws|uol\.com\.br))\/World\/Transfers\/TransfersSearchResult.aspx/i;
        return regexp.test(href);
    },

    getMaxSkill: function (vector) {
        var vmax = 0;
        var pmax = 0;
        for (var i = 2; i < vector.length - 1; i++) {
            if (vector[i] - vmax > 0) {
                vmax = vector[i];
                pmax = i;
            };
        };
        return pmax;
    },

    getValueFromLink: function (link) {
      var skill = -1;
      try {
         skill = link.replace(/.+ll=/i, "").match(/^\d+/);
         if (skill < 0 || skill > 20) throw "Skill (" + skill + ") out of bounds";
      } catch (e) {
            throw ("In function getValueFromLink()\n - " + e);
      }
      return parseInt(skill);
    },

    getInfoTable: function (doc) {
        var infoTable = null;
        try {
           var infoDiv = doc.getElementById("ctl00_ctl00_CPContent_CPMain_pnlplayerInfo");
           infoTable = infoDiv.childNodes[infoDiv.childNodes.length - 2];
            if (!infoTable.rows) throw ("Unable to find Player's Info Table");
        } catch (e) {
            throw ("In function getInfoTable()\n - " + e);
        }
        return infoTable;
    },

    tableExists: function (doc) {
        try {
          var links = doc.evaluate("//a[@class='skill']", doc, null, Components.interfaces.nsIDOMXPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
          return (links.snapshotLength > 13)
        } catch (e) {
            throw ("In function getTableExist()\n - " + e);
        }
        return false;
    },

    getTSI: function (infoTable) {
        var tsi = -1;
        try {
            tsi = parseInt(infoTable.rows[1].cells[1].textContent.replace(/[\s]*/gi, ""));
            if (tsi < 0) throw "Negative TSI (" + tsi + ").";
        } catch (e) {
            throw ("In function getTSI()\n - " + e);
        }
        return parseInt(tsi);
    },


    getWage: function (infoTable) {
        var wage = -1;
        try {
            wage = parseFloat(infoTable.rows[2].cells[1].textContent.replace(/[\s]*/gi, ""));

            try {
                var currencyCode = PsicotsiPrefs.getString("htCurrency");
            } catch (e) {
                currencyCode = "EUR";
            }

            try {
/*var htCurrenciesXml = getCurrenciesXML(doc);
    var path = "hattrickcurrencies/currency[@code='" + currencyCode + "']";
    var obj = htCurrenciesXml.evaluate(path,htCurrenciesXml,null,htCurrenciesXml.DOCUMENT_NODE,null).singleNodeValue;
    currency = obj.attributes.getNamedItem("shortname").textContent;
    rate = 1.0/parseFloat(obj.attributes.getNamedItem("eurorate").textContent);*/
                var currency = PsicotsiPrefs.getString("htCurrency");
                var rate = PsicotsiPrefs.getString("htCurrencyRate");

            } catch (e) {
                var currency = "€";
                var rate = 1.0;
            }



            wage = wage / rate;

            if (wage < 0) throw "Negative wage (" + wage + ").";
            if (infoTable.rows[2].cells[1].textContent.match(/\%/i)) {
                wage = wage / 1.2;
            }
            wage += 250;




        } catch (e) {
            throw ("In function getWage()\n - " + e);
        }

        return parseInt(wage);
    },

    getInjuries: function (infoTable) {
        try {
            var container = infoTable.rows[4].cells[1];
            if (container.textContent.search(/\d+/) > -1) return true;
        } catch (e) {
            throw ("In function getInjuries()\n - " + e);
        }
        return false;
    },


    getAge: function (doc) {
        var age = -1;
        try {
            var node = doc.getElementById("ctl00_ctl00_CPContent_CPMain_ucPlayerFace_pnlAvatar");
            if (!node) {
                //not a supporter or face not showed
                node = doc.getElementById("ctl00_ctl00_CPContent_CPMain_pnlplayerInfo");
                node = node.previousSibling.previousSibling;
            }
            else {
                node = node.previousSibling.previousSibling;
            }
            var node2 = node;
    
            //check if player is playing a match
            if (node.id == "eventWrapper") {
               node = node.previousSibling.previousSibling;
            }
    
            //check if player has a statement
            if (node.tagName == "EM") {

                node = node.previousSibling.previousSibling;

            }
            try {
                age = node.textContent.match(/\d+/)[0];
            }
            catch (e) {
                //Psicotsi.alert("Error in getAge():\nIf you\'re using foxtrick, please disable module \'MovePlayerStatement\'\n '+e);
            }
            if (age < 17 || age > 99) dump("Age (" + age + ") out of bounds");
        } catch (e) {
            dump("In function getAge()\n - " + e);
        }
        return parseInt(age);
    },



    // CHECKS IF A PLAYER HAS MORE THAN ONE MAIN SKILL
    undefinedMainSkill: function (vector) {
        var vmax = 0;
        var pmax = 0;
        for (var i = 2; i < vector.length - 1; i++) {
            if (vector[i] - vmax > 0) {
                vmax = vector[i];
                pmax = i;
            };
        };
        for (var i = 2; i < vector.length - 1; i++) {
            if (vector[i] - vector[pmax] == 0 && i != pmax) {
                return true;
            };
        };
        return false;
    },

    // CHECKS IF PLAYER IS A GOALKEEPER
    isGoalkeeper: function (maxSkill) {
        return (maxSkill == 5);
    },

    // FOR DEBUG PURPOSES ONLY
    debugalert: function (text) {
        Psicotsi.alert(text);
        dump(text + "\n");
    },

    // ---------------------------------------------------------------------------
    //Calculate Keepr skill, thanks to Emporeor for the formula

    // Calculates the MaxSkill value for a player with "WAGE"
    calcMaxSkill: function (playerskills, TSI, formSubLevel) {
        var pinput = new Array(1, 0, 0, 0, 0, 0, 0, 0);
        // Neural Network Input values 
        // Form
        if (formSubLevel == "Low") {
            pinput[1] = playerskills[0] + 0.01;
        };
        if (formSubLevel == "Avg") {
            pinput[1] = playerskills[0] + 0.5;
        };
        if (formSubLevel == "High") {
            pinput[1] = playerskills[0] + 0.99;
        };

        if (pinput[1] > 8) {
            pinput[1] = 8;
        };
        // Stamina
        if (playerskills[1] < 9) {
            pinput[2] = playerskills[1] + 0.25;
        } else {
            pinput[2] = playerskills[1];
        };
        pinput[3] = playerskills[2] + 0.25;
        pinput[4] = playerskills[3] + 0.25;
        pinput[5] = playerskills[4] + 0.25;
        pinput[6] = playerskills[6] + 0.25;
        pinput[7] = playerskills[7] + 0.25;
        // Main skill
        var pskillMax = PsicotsiHelper.getMaxSkill(playerskills);
        if (pskillMax > 5) {
            pskillMax = pskillMax - 1;
        };
        pskillMax = pskillMax + 1;
        if (pinput[pskillMax] > 7) {
            pinput[pskillMax] = pinput[pskillMax] - 0.2;
        } else {
            pinput[pskillMax] = pinput[pskillMax] - 0.1;
        }
        // Recognising mainSkill
        switch (pskillMax) {
        case 3:
            mainSkill = "PM";
            break;
        case 4:
            mainSkill = "WG";
            break;
        case 5:
            mainSkill = "SC";
            break;
        case 6:
            mainSkill = "PS";
            break;
        case 7:
            mainSkill = "DF";
            break;
        };

        // Starting approximation
        var level = pinput[pskillMax];
        var sublevel = 0;
        var err = 10000;
        var newTSI = this.sim(pinput, mainSkill);
        var cont = 0;
        while (err > 1 && cont < 100) {
            if (newTSI > TSI) {
                sublevel = sublevel - Math.pow(0.5, cont);
            }
            if (newTSI < TSI) {
                sublevel = sublevel + Math.pow(0.5, cont);
            }
            pinput[pskillMax] = level + sublevel;
            newTSI = this.sim(pinput, mainSkill);
            err = Math.abs(newTSI - TSI);
            cont++;
        };
        // Extreme values correction
        if (sublevel < 0) {
            sublevel = sublevel / 8;
        }
        if (sublevel > 1) {
            sublevel = 1 + (sublevel - 1) / 8;
        }
        // Output
        return Math.round((level + sublevel) * 100) / 100;
    },

    simWage: function (skillValue, mainSkill, sta) {
        var salary = 0;
        var WageArray = new Array(new Array(2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004), new Array(2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004), new Array(2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004), new Array(2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004), new Array(2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004, 2.698970004), new Array(2.716003344, 2.716003344, 2.707486674, 2.707486674, 2.707486674, 2.728492395, 2.716003344, 2.707486674, 2.716003344), new Array(2.748188027, 2.732393760, 2.732393760, 2.732393760, 2.732393760, 2.748657963, 2.732393760, 2.732393760, 2.732393760), new Array(2.819543936, 2.806179974, 2.806179974, 2.778151250, 2.778151250, 2.789658988, 2.792391689, 2.763427994, 2.792391689), new Array(2.954242509, 2.934498451, 2.911433147, 2.874361836, 2.846766673, 2.911193307, 2.934498451, 2.872617546, 2.903089987), new Array(3.170000000, 3.139879086, 3.116813782, 3.079742471, 3.052147309, 3.104423127, 3.139879086, 3.041392685, 3.107209970), new Array(3.397940009, 3.365487985, 3.342422681, 3.305351369, 3.277756207, 3.266439474, 3.354108439, 3.179542656, 3.313867220), new Array(3.643452676, 3.617418939, 3.591497524, 3.556302501, 3.528707338, 3.454303288, 3.595496222, 3.317692628, 3.546542663), new Array(3.893428615, 3.863700000, 3.833784375, 3.788805636, 3.761210473, 3.674115352, 3.833784375, 3.455842599, 3.788168371), new Array(4.120573931, 4.091595803, 4.070000000, 4.025021261, 3.997426099, 3.893923757, 4.062205809, 3.593992570, 4.011993115), new Array(4.343605508, 4.310000000, 4.283865660, 4.238886921, 4.211291759, 4.095261523, 4.280760369, 3.732142541, 4.231979027), new Array(4.552327416, 4.517313266, 4.503518313, 4.458539574, 4.430944412, 4.307902055, 4.486288206, 3.870292513, 4.436798510), new Array(4.747970819, 4.694254112, 4.680459159, 4.635480420, 4.607885258, 4.492329889, 4.679427897, 4.008442484, 4.621757675), new Array(4.926959488, 4.904239142, 4.870000000, 4.825021261, 4.797426099, 4.662981108, 4.856002845, 4.146592455, 4.810501348), new Array(5.095977842, 5.056599976, 5.027066049, 4.982087311, 4.954492148, 4.815855091, 5.040850938, 4.284742426, 4.971832280), new Array(5.252916130, 5.213538264, 5.184004337, 5.139025598, 5.111430436, 4.971117953, 5.267171728, 4.422892397, 5.138807765), new Array(5.417836912, 5.350000000, 5.320466073, 5.275487334, 5.247892172, 5.291071343, 5.345116665, 4.561042369, 5.355643050), new Array(5.417836912, 5.350000000, 5.320466073, 5.275487334, 5.247892172, 5.291071343, 5.345116665, 4.561042369, 5.355643050));

        var row = Math.floor(skillValue);

        var col = 0;
        switch (mainSkill) {
        case "PM":
            switch (sta) {
            case 9:
                col = 0;
                break;
            case 8:
                col = 0;
                break;
            case 7:
                col = 1;
                break;
            case 6:
                col = 2;
                break;
            case 5:
                col = 3;
                break;
            case 4:
                col = 4;
                break;
            case 3:
                col = 4;
                break;
            case 2:
                col = 4;
                break;
            case 1:
                col = 4;
                break;
            case 0:
                col = 4;
                break;

            };
            break;
        case "WG":
            col = 5;
            break;
        case "SC":
            col = 6;
            break;
        case "PS":
            col = 7;
            break;
        case "DF":
            col = 8;
            break;

        }
        salary = WageArray[row][col] + (skillValue - row) * (WageArray[row + 1][col] - WageArray[row][col]);
        return Math.pow(10, salary);
    },

    calcMaxSkillWage: function (playerskills, salary) {
        // Main skill detecting
        var pskillMax = PsicotsiHelper.getMaxSkill(playerskills);
        // Recognising mainSkill
        switch (pskillMax) {
        case 2:
            mainSkill = "PM";
            break;
        case 3:
            mainSkill = "WG";
            break;
        case 4:
            mainSkill = "SC";
            break;
        case 6:
            mainSkill = "PS";
            break;
        case 7:
            mainSkill = "DF";
            break;
        }
        // Starting approximation
        var level = playerskills[pskillMax];
        var sublevel = 0;
        var err = 10000;
        var newWAGE = PsicotsiHelper.simWage(level + sublevel, mainSkill, playerskills[1]);
        var cont = 0;
        while (err > 1 && cont < 100) {
            if (newWAGE > salary) {
                sublevel = sublevel - Math.pow(0.5, cont);
            }
            if (newWAGE < salary) {
                sublevel = sublevel + Math.pow(0.5, cont);
            }

            newWAGE = PsicotsiHelper.simWage(level + sublevel, mainSkill, playerskills[1]);

            err = Math.abs(newWAGE - salary);
            cont++;
        }
        sublevel = sublevel - 0.04;
        // Extreme values correction
        if (sublevel < 0) {
            sublevel = sublevel / 8;
        }
        if (sublevel > 1) {
            sublevel = 1 + (sublevel - 1) / 8;
        }
        // Output
        return Math.round((level + sublevel) * 100) / 100;
    },








    sim: function (pinput, mainSkill) {

        // PlayMaking
        if (mainSkill == "PM") {
            var meanp = new Array(0, 6.37560321715818, 6.8295799821269, 9.18572832886573, 3.82265415549598, 3.80478105451296, 3.97028596961573, 3.7316800714924);
            var stdp = new Array(1, 1.27931620538792, 2.068121874063, 2.64814773627783, 1.25944526479215, 1.23643585187472, 1.41074883966057, 1.200261576732);
            var meant = 3.44951885218574;
            var stdt = 0.69620243901134;
            var IW = new Array(new Array(-0.978045139728464, 0.00301687457750677, -0.048841998968147, -0.404735131313642, -0.0362317679661696, 0.0379976393063689, 0.010290023976103, -0.0147760361492318), new Array(0.177344012094537, -0.0314455259871624, -0.013402962769724, -0.0892159635787965, 0.149684600060107, 0.0129173095791169, -0.0627676826414977, -0.0140624018719683), new Array(1.36521889783453, -0.00637939702956546, 0.0153705440757856, 0.556447703939989, -0.0241943951441762, -0.0493823748265197, -0.21427629169483, -0.00101793041393101), new Array(0.196053426793117, -0.02079754895227, 0.00105220616818506, -0.0444692661662335, -0.125304863742313, 0.000952177286031863, 0.0555651518906449, -0.0497925245034302), new Array(0.692342189504846, -0.651215170938504, -0.0773280848125734, -0.0299899107255201, 0.0102778174399698, -0.00729484262085779, 0.019086283284809, -0.0704572408040264), new Array(1.58818822767738, -0.00884634038142363, 0.0255779210123106, 0.487506584936556, 0.0814314344175245, -0.251017981688899, 0.0901880561018751, -0.0166380710765307), new Array(-0.349984574105507, -0.00620252485894222, 0.0100312003087919, 0.23260892557538, 0.0260982230419322, 0.111026396362525, 0.037817626462384, -0.319122796193367));
            var LW = new Array(1.45005860984466, -5.08419804987079, -3.09594267675791, -2.19350882485451, -3.55681002955351, 0.212673777310428, -2.17305546140852, 0.669079546193561);
            var phidden = new Array(1, 0, 0, 0, 0, 0, 0, 0);
            for (var i = 1; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    phidden[i] = phidden[i] + ((pinput[j] - meanp[j]) / stdp[j]) * IW[i - 1][j];
                };
                phidden[i] = this.tanh(phidden[i]);
            };
            var poutput = 0;
            for (var k = 0; k < 8; k++) {
                poutput = poutput + phidden[k] * LW[k];
            };
            return Math.pow(10, poutput * stdt + meant);
        };

        // Winger
        if (mainSkill == "WG") {
            var meanp = new Array(0, 6.11559888579387, 6.38544568245125, 4.19986072423398, 9.07820334261824, 3.78899721448468, 4.09261838440111, 3.94707520891365);
            var stdp = new Array(1, 1.35219800030418, 1.87676157709407, 1.60495529959243, 1.92480738248487, 1.23672495343354, 1.35904038569407, 1.42286644873124);
            var meant = 3.34828115361494;
            var stdt = 0.50248598993484;
            var IW = new Array(new Array(-0.660772073958308, -0.01833440065284, -0.0878004061319683, 0.00014551774875378, -0.09581305124871, -0.018902774261109, -0.0267581613703629, -0.0533105102621847), new Array(0.512421132362667, 0.0382337124466166, 0.0773884058542099, -0.0478971000074065, -0.227090911654096, 0.0749380149540642, -0.0192496230658901, 0.591939574122913), new Array(-1.37612347434054, -0.0172255940860493, 0.0372075456228269, 0.732664914012482, -0.636332206449557, 0.0660828680402308, -0.13569710277901, -0.0969683305370428), new Array(-0.767604389511557, 0.0164740614163994, 0.0996416926112712, 0.0574768132107605, 0.406081043832447, -0.0338799984024221, -0.755504987651843, 0.0404297482763663), new Array(0.51444631220829, 0.0227910340702376, -0.194434226880239, 0.0157033323422596, 0.145696031716467, 0.0280447811851727, 0.0997626514667552, 0.0600548994144656));
            var LW = new Array(-4.87066368568217, -8.12793906828807, -0.56007809906691, 0.451613517207488, 0.354350670244603, 2.07516604461788);
            var phidden = new Array(1, 0, 0, 0, 0, 0);
            for (var i = 1; i < 6; i++) {
                for (var j = 0; j < 8; j++) {
                    phidden[i] = phidden[i] + ((pinput[j] - meanp[j]) / stdp[j]) * IW[i - 1][j];
                };
                phidden[i] = this.tanh(phidden[i]);
            };
            var poutput = 0;
            for (var k = 0; k < 6; k++) {
                poutput = poutput + phidden[k] * LW[k];
            };
            return Math.pow(10, poutput * stdt + meant);
        };

        // Scoring
        if (mainSkill == "SC") {
            var meanp = new Array(0, 6.21562558619396, 5.79731757643969, 3.79764584505721, 3.78432751828925, 9.20751266179118, 4.23921403113862, 3.88655974488839);
            var stdp = new Array(1, 1.45803238481507, 1.84919443347091, 1.29668412881596, 1.21518918313263, 1.71476790521195, 1.54547609249067, 1.29572069955967);
            var meant = 3.45478105603469;
            var stdt = 0.44019807215147;
            var IW = new Array(new Array(1.40301200769146, -0.0193144940635949, 0.0212311747405729, -0.175540588154821, -0.0221115046234967, 0.214900394271821, 0.0193996813745877, -0.0481966024580163), new Array(-1.30320677336796, -0.00823005974306588, -0.0639798654429837, -0.0548890263553145, -0.000909477091528763, -0.439094120327123, 0.616393481014018, -0.00643510347147235), new Array(0.622274133245999, 0.0155796819413849, 0.231654894650702, -0.0891031925337777, -0.157262349055432, -0.589802519029839, -0.143798421154869, -0.187230559566363), new Array(-0.634112378069713, -0.000944335329076177, -0.0544022297082993, 0.0193751289262962, -0.0100586795623683, -0.106747528361095, 9.52666848716332e-005, -0.035002277549141), new Array(-0.760416443748201, -0.00710422254483257, -0.0438615652834481, 0.102521784762147, -0.0281872796781719, -0.0687360185898756, 0.0163874310887414, -0.228778191132918), new Array(-2.04885929453845, -0.320961567561186, 0.000944441355045404, -0.0305253294471756, -0.00788624645149755, 0.0126358849478757, 0.00808561844967016, -0.00871625102475451), new Array(0.283890100480124, 0.0136008146777745, -0.362135507458957, -0.00175774533580776, 0.0181290187333429, 0.220512760178359, 0.044816292969784, 0.032774317851683));
            var LW = new Array(-7.7074616828558, -4.81464556813888, 0.640026643980887, 0.221373217042846, -17.1398121382442, 2.59419730774328, -4.26616397837132, 1.10880653486695);
            var phidden = new Array(1, 0, 0, 0, 0, 0, 0, 0);
            for (var i = 1; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    phidden[i] = phidden[i] + ((pinput[j] - meanp[j]) / stdp[j]) * IW[i - 1][j];
                };
                phidden[i] = this.tanh(phidden[i]);
            };
            var poutput = 0;
            for (var k = 0; k < 8; k++) {
                poutput = poutput + phidden[k] * LW[k];
            };
            return Math.pow(10, poutput * stdt + meant);
        };

        // Passing
        if (mainSkill == "PS") {
            var meanp = new Array(0, 5.9037558685446, 6.04694835680751, 4.12323943661972, 4.09976525821596, 4.21713615023474, 7.21807511737088, 4.38615023474178);
            var stdp = new Array(1, 1.52228260105579, 1.95290122400408, 1.29144037033675, 1.29438644360604, 1.49333417169661, 0.961187627213399, 1.67817798097032);
            var meant = 3.06630240883934;
            var stdt = 0.42308172264001;
            var IW = new Array(new Array(-11.8900701342496, -0.024750835138891, -0.965752396040145, -2.09746089518353, -0.321967528454612, -2.38676435871213, -5.1471801821007, 7.79174276667143), new Array(0.529380858245977, 0.0291519802983588, 0.0369583467350457, 0.032424613698893, 0.0329191863310305, 0.0396041328798249, 0.0930316090276224, 0.0356752670740693), new Array(2.33113350771975, 3.74579049731695, 7.11876326800507, -7.91110226838671, 3.6497359930875, -3.87258670301254, -3.046829371455, 5.84457458310682));
            var LW = new Array(-3.83433618763949, 0.297797052746795, 8.55140826231407, -0.0817402547000788);
            var phidden = new Array(1, 0, 0, 0);
            for (var i = 1; i < 4; i++) {
                for (var j = 0; j < 8; j++) {
                    phidden[i] = phidden[i] + ((pinput[j] - meanp[j]) / stdp[j]) * IW[i - 1][j];
                };
                phidden[i] = this.tanh(phidden[i]);
            };
            var poutput = 0;
            for (var k = 0; k < 4; k++) {
                poutput = poutput + phidden[k] * LW[k];
            };
            return Math.pow(10, poutput * stdt + meant);
        };

        // Defending
        if (mainSkill == "DF") {
            var meanp = new Array(0, 6.71400113830393, 5.55150825270347, 3.49132043255549, 3.53173022196927, 3.54083665338645, 3.75028457598179, 8.03890153670999);
            var stdp = new Array(1, 1.48828675945146, 1.84177487301679, 1.14089446002011, 1.1547523721879, 1.09262970647274, 1.27111995210437, 1.91951279588256);
            var meant = 3.07079169070856;
            var stdt = 0.54669631751747;
            var IW = new Array(new Array(0.6857172999329, 0.144851901928772, 0.00732053581209846, 0.142004608852104, 0.322390526898797, 0.541747526748434, 0.00470511682361453, -0.352618377429687), new Array(0.620509248945402, -0.0126640050506412, -0.0313294540757459, 0.0726382032031436, -0.0658046623810817, -0.0531578337102174, 0.14309876313257, -0.262817885221702), new Array(0.361958560232547, 0.0191873845346643, 0.0940541699357571, -0.042618354807883, 0.123768814062805, 0.178214776227766, 0.0870625029013581, 0.545801377669313), new Array(0.807238317377399, 0.050804039114291, 0.0338844355782919, 0.246852103250382, -0.0694942575939604, -0.10098194009457, -0.354751810513075, -0.124777986713548), new Array(-0.341621423026568, 0.000309270803772757, 0.00956076398728777, 0.175139999720122, -0.0332175436812512, -0.0333469154384476, 0.0646493157528646, -0.0239336387359904), new Array(2.76039548716256, -0.00904355194026333, 1.64943269580411, -0.0338036046909946, -0.198593977982261, -0.109517200651956, -0.167444994960601, -0.230909331468331), new Array(1.58875346153719, 0.293418924006587, 0.0211646546315773, 0.0824895902178759, 0.0040093750686147, 0.0394329201279045, 0.020570514119798, -0.0305463551011085));
            var LW = new Array(0.140377452993393, -0.339571400603176, -2.30959398112466, 0.985381658295128, -0.767870805617256, 2.35039694690841, 0.215556071649187, 2.22390988552588);
            var phidden = new Array(1, 0, 0, 0, 0, 0, 0, 0);
            for (var i = 1; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    phidden[i] = phidden[i] + ((pinput[j] - meanp[j]) / stdp[j]) * IW[i - 1][j];
                };
                phidden[i] = this.tanh(phidden[i]);
            };
            var poutput = 0;
            for (var k = 0; k < 8; k++) {
                poutput = poutput + phidden[k] * LW[k];
            };
            return Math.pow(10, poutput * stdt + meant);
        };

    },

    // Math Functions
    log10: function (x) {
        return Math.log(x) / Math.log(10);
    },


    tanh: function (x) {
        var res;
        res = (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
        return res;
    },
    calcMaxSkillGK: function (TSI, FORM, subForm) {

        if (subForm == "Low") {
            var odc = 0.01255;
        }
        if (subForm == "Avg") {
            var odc = 0;
        }
        if (subForm == "High") {
            var odc = -0.01255;
        }


        var form = (FORM * 0.025) + 0.100;
        try {
            var skill = ((Math.pow((100 * TSI) / (form), 1 / 3.4)) / 10 + 1);
        } catch (e) {
            Psicotsi.alert('ERROR #159347> \n' + e);
        }
        var skill2 = Math.round(((skill - Math.floor(skill)) + odc) * 100);



        var skill = Math.floor(skill);

        var skill = (skill2 / 100) + skill;
        skill = Math.floor(skill * 100) / 100;

        return skill;
    },
};