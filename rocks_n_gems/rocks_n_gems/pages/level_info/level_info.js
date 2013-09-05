

(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/level_info/level_info.html", {

        ready: function (element, numLevel) {

            // appbars
            var bottomAppbar = document.getElementById('bottom_appbar');
            bottomAppbar.disabled = true;
            var topAppbar = document.getElementById('top_appbar');
            topAppbar.disabled = true;


            // get level info from XML file
            var level = getLevelInfo(numLevel);
            document.getElementsByClassName('pagetitle')[0].innerText = (numLevel + 1) + "- " + level.levelTittle;
            document.getElementById('description').innerText = level.levelDescription;
            setScoresMarkers(level.normalDifficultyScores, level.hardDifficultyScores);


            // options
            drawString("Normal_Mode", document.getElementById('normal_tittle'), 45);
            drawString("Hard_Mode", document.getElementById('hard_tittle'), 45);

            setTile("normal", NORMAL_MODE, numLevel);
            if (isHardDifficultyBloqued(level.hardDifficultyBloqued)) {
                document.getElementById('hard').className = "hard_bloqued";
            } else {
                document.getElementById('hard').className = "hard_nobloqued";
                setTile("hard", HARD_MODE, numLevel);
            }

            setShareLink("facebook", "https://www.facebook.com/");
            setShareLink("twitter", "https://www.twitter.com/");
        },

        unload: function () {

        },

        updateLayout: function (element, viewState, lastViewState) {

        }
    });


    function setScoresMarkers(normalDifficultyScores, hardDifficultyScores) {
        drawString("Scores", document.getElementById('scores_tittle'), 45);

        drawString("normal", document.getElementById('normal_scores_tittle'), 22);
        setScoreMarker("normal", normalDifficultyScores);

        drawString("hard", document.getElementById('hard_scores_tittle'), 22);
        setScoreMarker("hard", hardDifficultyScores);
    }



    function setScoreMarker(mode, scores) {
        for (var i = 0; i < scores.length; i++) {
            var scoreMarker = document.getElementById(mode + "_" + scores[i].position);
            var scoreText = scoreMarker.getElementsByTagName('p');

            var date = new Date(scores[i].date * 1000); // to seconds
            scoreText[0].innerText = date.getDay() + "." + date.getMonth() + "." + date.getYear() + " " + date.getHours() + ":" + date.getMinutes();
            scoreText[1].innerText = scores[i].time + " seconds";
            scoreText[2].innerText = scores[i].gems + " diamonds";
        }
    }



    function isHardDifficultyBloqued(bloqued) {
        return bloqued == "yes";
    }


    function setTile(tileID, difficulty, level) {
        var option = document.getElementById(tileID);

        option.addEventListener("click", function () {
            var info = new Object();
            info.mode = CAMPAIGN;
            info.difficulty = difficulty;
            info.level = level;
            info.title = document.getElementsByClassName('pagetitle')[0].innerText;

            WinJS.Navigation.navigate("pages/game/game.html", info);
        }, false);
    }


    function setShareLink(tileID, link) {
        var heading = document.getElementById(tileID);

        heading.addEventListener("click", function () {
            window.open(link, "_blank");
        }, false);
    }


})();
