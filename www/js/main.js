var app = {
    // Application Constructor

    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
    },

    setDayColors: function () {
        var colors = ["#ea493b", "#7fccbd", "#81c256", "#f6d24c",
                      "#9765b8", "#73a6db", "#73a6db", "#e6b294"];

        $(".day-title").each( function(i) {
            console.log("b");
            this.style.background = colors[i % 8];
        });
    }
};
