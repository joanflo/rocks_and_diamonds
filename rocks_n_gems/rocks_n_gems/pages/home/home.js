
(function () {
    "use strict";


    WinJS.UI.Pages.define("/pages/home/home.html", {

        ready: function (element, options) {

            // appbars
            var bottomAppbar = document.getElementById('bottom_appbar');
            bottomAppbar.disabled = true;
            var topAppbar = document.getElementById('top_appbar');
            topAppbar.disabled = true;

            // set menu
            setTile("Heading1", "pages/level_selection/level_selection.html", undefined);
            drawString("Campaign", document.getElementsByClassName('overlayHeading1Image')[0], 28);
            setTile("Heading2", "pages/game/game.html", CATCH_EM_ALL);
            drawString("Catch_Em_All", document.getElementsByClassName('overlayHeading2Image')[0], 28);
            setTile("Heading3", "pages/game/game.html", KILL_EM_ALL);
            drawString("Kill_Em_All", document.getElementsByClassName('overlayHeading3Image')[0], 28);
            setTile("Heading4", "pages/game/game.html", TUTORIAL);
            drawString("Tutorial", document.getElementsByClassName('overlayHeading4Image')[0], 22);
            setTile("Heading5", "pages/game/game.html", LEVEL_EDITOR);
            drawString("Level_Editor", document.getElementsByClassName('overlayHeading5Image')[0], 28);

            setShareLink("Heading6", "https://www.facebook.com/");
            setShareLink("Heading7", "https://www.twitter.com/");
        },

        unload: function () {

        },

        updateLayout: function (element, viewState, lastViewState) {

        }
    });


    function setTile(tileID, navURL, info) {
        var heading = document.getElementById(tileID);

        heading.addEventListener("click", function () {
            if (info == undefined) {
                WinJS.Navigation.navigate(navURL);
            } else {
                WinJS.Navigation.navigate(navURL, info);
            }
        }, false);
    }


    function setShareLink(tileID, link) {
        var heading = document.getElementById(tileID);

        heading.addEventListener("click", function () {
            window.open(link, "_blank");
        }, false);
    }


})();
