// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";


    WinJS.UI.Pages.define("/pages/level_selection/level_selection.html", {

        ready: function (element, options) {

            // appbars
            var bottomAppbar = document.getElementById('bottom_appbar');
            bottomAppbar.disabled = true;
            var topAppbar = document.getElementById('top_appbar');
            topAppbar.disabled = true;

            // set levels
            var levelsList = getLevelsList();
            var items = document.getElementsByClassName('item');
            var colors = new Array("#b200ff", "#ff6a00", "#ff006e", "#ffd800", "#4cff00");
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                item.id = i;
                var level = levelsList[i];

                var levelName = item.getElementsByClassName('level_name')[0];
                var str = processString(level.levelTittle);
                var margin;
                
                drawString(str, levelName, 13);
                if (isLevelBloqued(level.levelBloqued)) {
                    item.className = "item item_locked" + ((i % 5) + 1);
                    margin = 6;

                } else {
                    levelName.style.backgroundColor = colors[i % 5];
                    var numberOfLines = str.split("_").length;

                    switch (numberOfLines) {
                        case 1:
                            margin = 26;
                            break;
                        case 2:
                            margin = 15;
                            break;
                        default: //3 or more
                            margin = 6;
                            break;
                    }

                    item.addEventListener("click", levelSelected, false);
                }
                levelName.style.marginTop = margin + "px";

            }

        },

        unload: function () {

        },

        updateLayout: function (element, viewState, lastViewState) {

        }
    });


    function isLevelBloqued(levelBloqued) {
        return levelBloqued == "yes";
    }


    function levelSelected(evt) {
        WinJS.Navigation.navigate("pages/level_info/level_info.html", parseInt(evt.currentTarget.id));
    }

})();
