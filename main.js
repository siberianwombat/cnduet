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

var UrlPrefix="http://zav.org.ua/cnduet/"; // @todo: take this from request URL

(function (){
    let docURL = new URL(document.location.href);
    let seed = docURL.searchParams.get('seed');
    let side = docURL.searchParams.get('side');

    // if no seed, show just index page to offer to get one
    if (seed == null) {
        document.getElementById("index").style.display='block';
        document.getElementById("genLayoutLink").href = '?seed=' + getRandomSeed()
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
    document.getElementById("player2linkToSend").onclick = function () {
        pl2UrlTextArea.select();
        try {
            document.execCommand('copy');
            window.alert("Link copied, send it to another team")
        } catch (err) {
            window.alert("Oops, unable to copy")
        }
    }
    document.getElementById("player1linkToSend").onclick = function () {
        pl1UrlTextArea.select();
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
    document.getElementById(side==2 ? "player2" : "player1").style.display='block';
})();