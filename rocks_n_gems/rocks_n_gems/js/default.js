

var ready = false;
var rocks_n_gems;

(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;


    var page = WinJS.UI.Pages.define("/default.html", {
        ready: function (element, options) {
            loadCharacterImages();
            openDataFile();

            //document.getElementById("check_scores").addEventListener("click", checkScores, true);
        },

        unload: function () {
            AppBarSampleUtils.removeAppBars();
        }
    });

    function checkScores() {
        WinJS.Navigation.navigate("/pages/scores/scores.html");
    }



    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            document.addEventListener("visibilitychange", function (e) {
                if (ready) {
                    //sendTileNotificationQueue();
                    //rocks_n_gems.pauseGame();
                }
            });
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }

            }));
        }
    });


    app.oncheckpoint = function (args) {
        app.sessionState.history = nav.history;
    };


    app.onsettings = function (e) {
        e.detail.applicationcommands = {
            "about": {
                href: "/pages/about/about.html",
                title: "About"
            },

            "settings": {
                href: "/pages/settings/settings.html",
                title: "Settings"
            },

            "privacy": {
                href: "/pages/privacy/privacy.html",
                title: "Privacy"
            }
        }
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    app.start();
})();
