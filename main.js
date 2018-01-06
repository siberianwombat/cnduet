// simple prng
function Random(seed) {
    this._seed = seed % 2147483647;
    if (this._seed <= 0) this._seed += 2147483646;
}
Random.prototype.next = function () { return this._seed = this._seed * 16807 % 2147483647; };
Random.prototype.nextFloat = function () { return (this.next() - 1) / 2147483646; };
function getRandomSeed() { return Math.round(Math.random()*2147483646); }

// returns the array of cardNo => two-letter card class
function gettingLayoutWithSeed(seed) {
    let assignOrder = ['aa', 'ah', 'ax', 'ha', 'xa', 'hx', 'hx', 'hx', 'hx', 'hx', 'xh', 'xh', 'xh', 'xh', 'xh', 'hh', 'hh', 'hh'];
    let layout = ['xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx', 'xx'];
    var r = new Random(seed); r.next(); r.next(); // skipping couple of iterations just to make it more random
    for (var i = 0; i < assignOrder.length; i++) {
        let cardAssigned = false;
        while (!cardAssigned) {
            let roll = Math.round(r.nextFloat() * 25)
            if (layout[roll]=='xx') {
                layout[roll] = assignOrder[i];
                cardAssigned = true;
            }
        }
    }
    return layout
}

var UrlPrefix = document.location.href.replace(document.location.search, '');

(function (){
    let docURL = new URL(document.location.href);
    let seed = parseInt(docURL.searchParams.get('seed'), 10);
    let side = parseInt(docURL.searchParams.get('side'), 10);

    // if no seed, show just index page to offer to get one
    if (!seed) {
        document.getElementById("index").style.display='block';
        document.getElementById("genLayoutLink").onclick = function() {
            document.getElementById("genLayoutLink").href = '?seed=' + getRandomSeed()
            return true;
        }
        return
    }

    // otherwise, show the panel corresponding to the side (player1/player2)
    let layout = gettingLayoutWithSeed(seed);
    for (var i = 0; i < layout.length; i++) {
        document.getElementById("p1card" + (i+1)).classList.add("cell" + layout[i][0]);
        document.getElementById("p2card" + (i+1)).classList.add("cell" + layout[i][1]);
    }

    // generating the opposing team link
    var pl1UrlTextArea = document.getElementById("pl1UrlTextArea")
    pl1UrlTextArea.value = UrlPrefix + "?seed=" + seed + "&side=2";
    var pl2UrlTextArea = document.getElementById("pl2UrlTextArea")
    pl2UrlTextArea.value = UrlPrefix + "?seed=" + seed;

    var selectInputContent = input => {
        if (navigator.userAgent.match(/Android|webOS|iPhone|iPad|Windows Phone/i)) {
            let range = document.createRange();
            range.selectNodeContents(input);

            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            input.setSelectionRange(0, 999999);
        } else {
            input.select()
        }
    }

    document.getElementById("player2linkToSend").onclick = function () {
        selectInputContent(pl2UrlTextArea);
        try {
            document.execCommand('copy');
            window.alert("Link copied, send it to another team")
        } catch (err) {
            window.alert("Oops, unable to copy")
        }
    }
    document.getElementById("player1linkToSend").onclick = function () {
        selectInputContent(pl1UrlTextArea);
        try {
            document.execCommand('copy');
            window.alert("Link copied, send it to another team")
        } catch (err) {
            window.alert("Oops, unable to copy")
        }
    }

    // showing layout id
    document.getElementById("p1layout").innerHTML = "#" + seed;
    document.getElementById("p2layout").innerHTML = "#" + seed;

    // showing the panel
    let playerPanel = document.getElementById(side==2 ? "player2" : "player1");
    playerPanel.style.display = 'block';

    // settings
    document.getElementById('nextGame').href = window.location.search.replace('seed='+seed, 'seed='+(seed+1));
    document.getElementById('controls').style.display = 'block';
    if (window.localStorage.getItem('card-shape') === 'square') {
        playerPanel.classList.add('square-cells');
    }

    // auto-hide the screen when tipped flat
    function autoShow() {
        document.getElementById('hidden').style.top = '110vh';
    }
    let angle_start = 33, angle_end = 45;
    let hidden_top_start = 110, hidden_top_end = 0;
    function handleOrientation(e) {
        /*
            in portrait mode:
                beta = negative, when tipped forward beyond flat
                beta = 0 when flat
                beta = 90 when upright
                beta = 90-180 when tipped back beyond upright
            in landscape:
                gamma = 0 when flat
                gamma = +/-90 when upright (depending on if which way it was tipped)
                gamma = opposite sign, when tipped beyond upright
        */
        let angle = Math.max(Math.abs(e.beta), Math.abs(e.gamma))
        if (angle < angle_end) {
            // hide
            let percent;
            if (angle < angle_start) {
                percent = 0;
            } else {
                percent = (angle_start - angle) / (angle_start - angle_end);
            }
            percent = Math.round(percent*200)/200;  // limit amount of precision, so browser doesn't have to repaint for every minute change
            let hidden_top = percent * (hidden_top_start - hidden_top_end) + hidden_top_end;
            document.getElementById('hidden').style.top = hidden_top + 'vh';
            document.getElementById('hidden').style.opacity = 1-percent/2;
        } else {
            autoShow();
        }
        //pl1UrlTextArea.value += "  b: " + Math.round(e.beta) + "  g: " + Math.round(e.gamma);
    }
    if (window.localStorage.getItem('auto-hide-disabled')) {
        document.getElementById('enableAutoHideControls').style.display = 'block';
    } else {
        window.addEventListener("deviceorientation", handleOrientation);
    }
    document.getElementById('disableAutoHide').onclick = function () {
        autoShow();
        document.getElementById('enableAutoHideControls').style.display = 'block';
        window.removeEventListener("deviceorientation", handleOrientation);
        window.localStorage.setItem('auto-hide-disabled', 'true');
    };
    document.getElementById('enableAutoHide').onclick = function () {
        document.getElementById('enableAutoHideControls').style.display = 'none';
        window.addEventListener("deviceorientation", handleOrientation);
        window.localStorage.removeItem('auto-hide-disabled');
    };


    document.getElementById('rectCardSetting').onclick = function() {
        playerPanel.classList.remove('square-cells');
        window.localStorage.setItem('card-shape', 'rect');
    };
    document.getElementById('squareCardSetting').onclick = function() {
        playerPanel.classList.add('square-cells');
        window.localStorage.setItem('card-shape', 'square');
    };
})();
