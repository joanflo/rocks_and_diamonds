

var xmlDoc;
var dataFile;



function openDataFile() {
    Windows.Storage.ApplicationData.current.roamingFolder.getFileAsync("data.xml")
        .then(function (file) {
            return file;
        }).done(function (file) {
            dataFile = file;

            var loadSettings = new Windows.Data.Xml.Dom.XmlLoadSettings;
            loadSettings.prohibitDtd = false;
            loadSettings.resolveExternals = false;

            Windows.Data.Xml.Dom.XmlDocument.loadFromFileAsync(file, loadSettings).then(function (doc) {
                xmlDoc = doc;
            }, false);
        }, false);
}



function saveDataFile() {
    xmlDoc.saveToFileAsync(dataFile);
}



// info: level number (array index), level tittle, bloqued "yes"/"no"
function getLevelsList() {
    var xmlLevels = xmlDoc.getElementsByTagName('level');
    var levelsList = new Array(xmlLevels.length);

    for (var i = 0; i < xmlLevels.length; i++) {
        var level = new Object();
        level.levelTittle = xmlLevels[i].getElementsByTagName('tittle')[0].innerText;
        level.levelBloqued = xmlLevels[i].getAttribute("bloqued");
        levelsList[i] = level;
    }

    return levelsList;
}



// info about catch_em_all
function getCatchEmAllInfo() {
    var xmlCatchEmAll = xmlDoc.getElementsByTagName('catch_em_all')[0];
    return getScores(xmlCatchEmAll);
}



// info about kill_em_all
function getKillEmAllInfo() {
    var xmlKillEmAll = xmlDoc.getElementsByTagName('kill_em_all')[0];
    return getScores(xmlKillEmAll);
}



// info: tittle, description, difficulty (normal scores, hard scores, hard difficulty bloqued "yes"/"no")
function getLevelInfo(levelNumber) {
    var xmlLevel = xmlDoc.getElementsByTagName('level')[levelNumber];

    var level = new Object();
    level.levelTittle = xmlLevel.getElementsByTagName('tittle')[0].innerText;
    level.levelDescription = xmlLevel.getElementsByTagName('description')[0].innerText;

    var xmlNormalDifficulty = xmlLevel.getElementsByTagName('normal')[0];
    level.normalDifficultyScores = getScores(xmlNormalDifficulty);

    var xmlHardDifficulty = xmlLevel.getElementsByTagName('hard')[0];
    level.hardDifficultyScores = getScores(xmlHardDifficulty);
    level.hardDifficultyBloqued = xmlHardDifficulty.getAttribute("bloqued");

    return level;
}



// info: scores array: gems number, time, position, score date
function getScores(xmlContainer) {
    var xmlScores = xmlContainer.getElementsByTagName('score');
    var scores = new Array(xmlScores.length);

    for (var i = 0; i < xmlScores.length; i++) {
        var score = new Object();
        score.gems = xmlScores[i].getElementsByTagName('gems')[0].innerText;
        score.time = xmlScores[i].getElementsByTagName('time')[0].innerText;
        score.position = xmlScores[i].getAttribute("position");
        score.date = xmlScores[i].getAttribute("date");

        scores[i] = score;
    }

    return scores;
}



function setScores(containerName, levelNumber, time, gems) {
    // containerName = {catch_em_all, kill_em_all, normal, hard}
    var xmlContainer;
    switch (containerName) {
        case "catch_em_all":
        case "kill_em_all":
            xmlContainer = xmlDoc.getElementsByTagName(containerName)[0];
            break;
        case "normal":
        case "hard":
            var xmlLevel = xmlDoc.getElementsByTagName('level')[levelNumber];
            xmlContainer = xmlLevel.getElementsByTagName(containerName)[0];
            break;
    }
    var scores = getScores(xmlContainer);

    // add the new score
    var score = new Object();
    score.gems = gems;
    score.time = time;
    score.date = new Date().getTime();
    scores[scores.length] = score;

    // sort by time (when equals, gems number)
    var scoreAux;
    for (var i = 0; i < scores.length; i++) {
        score = scores[i];
        for (var j = i; j < scores.length - 1; j++) {
            scoreAux = scores[j + 1];
            if (parseInt(score.time) > parseInt(scoreAux.time) ||
                (parseInt(score.time) == parseInt(scoreAux.time) && parseInt(score.gems) <= parseInt(scoreAux.gems))) { // swap
                scores[i] = scoreAux;
                scores[j + 1] = score;
            }
        }
    }

    // replace scores
    var xmlScores = xmlContainer.getElementsByTagName('score');
    for (var i = 0; i < scores.length - 1; i++) {
        xmlScores[i].getElementsByTagName('gems')[0].innerText = scores[i].gems;
        xmlScores[i].getElementsByTagName('time')[0].innerText = scores[i].time;
        xmlScores[i].setAttribute("position", i + 1);
        xmlScores[i].setAttribute("date", scores[i].date);
    }

    saveDataFile();
}



function setLevelBloqued(levelNumber, bloqued) {
    var xmlLevel = xmlDoc.getElementsByTagName('level')[levelNumber];
    xmlLevel.setAttribute("bloqued", bloqued);

    saveDataFile();
}



function setHardDifficultyBloqued(levelNumber, bloqued) {
    var xmlLevel = xmlDoc.getElementsByTagName('level')[levelNumber];
    var xmlHardDifficulty = xmlLevel.getElementsByTagName('hard')[0];
    xmlHardDifficulty.setAttribute("bloqued", bloqued);

    saveDataFile();
}