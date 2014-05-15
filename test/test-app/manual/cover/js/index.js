var app = function () {
    function update(covers) {
        blackberry.ui.cover.updateCovers(
            covers, 
            function () { blackberry.app.minimize(); },
            function () { alert("ERROR"); }
        );      
    }
    function reset(name) {
        blackberry.ui.cover.resetCover(
            name,
            function () { blackberry.app.minimize(); },
            function () { alert("ERROR"); }
        );
    }
    return {
        getCoverSizes: function () {
            blackberry.ui.cover.getCoverSizes(function (result) {
                document.getElementById('sizes').value = JSON.stringify(result);
            });
        },
        fsSnapshot: function () {
            var fullsize = new blackberry.ui.cover.Cover('fullSize', blackberry.ui.cover.TYPE_SNAPSHOT);
            fullsize.text.push(new blackberry.ui.cover.Label('fullSize snapshot', 12));
            update([fullsize]);
        },
        fsImage: function () {
            var fullsize = new blackberry.ui.cover.Cover('fullSize', blackberry.ui.cover.TYPE_IMAGE);
            fullsize.text.push(new blackberry.ui.cover.Label('fullSize image', 12));
            fullsize.path = 'local:///manual/cover/cordova_logo_dark_gray.png';
            update([fullsize]); 
        },
        hsSnapshot: function () {
            var halfsize = new blackberry.ui.cover.Cover('halfSize', blackberry.ui.cover.TYPE_SNAPSHOT);
            halfsize.text.push(new blackberry.ui.cover.Label('halfSize snapshot', 12));
            update([halfsize]);
        },
        hsImage: function () {
            var halfsize = new blackberry.ui.cover.Cover('halfSize', blackberry.ui.cover.TYPE_IMAGE);
            halfsize.path = 'local:///manual/cover/cordova_logo_white.png';
            halfsize.text.push(new blackberry.ui.cover.Label('halfSize image', 12));
            update([halfsize]); 
        },
        both: function () {
            var fullsize = new blackberry.ui.cover.Cover('fullSize', blackberry.ui.cover.TYPE_SNAPSHOT),
                halfsize = new blackberry.ui.cover.Cover('halfSize', blackberry.ui.cover.TYPE_IMAGE);
            fullsize.text.push(new blackberry.ui.cover.Label('fullSize snapshot', 12));
            halfsize.text.push(new blackberry.ui.cover.Label('halfSize snapshot', 12));
            halfsize.path = 'local:///window2.jpg';
            update([fullsize, halfsize]); 
        },
        fsReset: function () {
            reset("fullSize");
        },
        hsReset: function () {
            reset("halfSize");
        }
    }
}();
