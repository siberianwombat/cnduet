// the main idea: get the cards position determined by prng seed given as the parameter
// showing the first player his cars and giving him opportynity to send out the link to another part
console.log("initializing the script")

function Random(seed) {
    this._seed = seed % 2147483647;
    if (this._seed <= 0) this._seed += 2147483646;
}

Random.prototype.next = function () {
    return this._seed = this._seed * 16807 % 2147483647;
};

Random.prototype.nextFloat = function (opt_minOrMax, opt_max) {
    return (this.next() - 1) / 2147483646;
};

function getRandomSeed() {
    return Math.round(Math.random()*2147483646);
}

(function (){
    // getting url parameters
    let docURL = new URL(document.location.href);
    let seed = docURL.searchParams.get('seed');
    let side = docURL.searchParams.get('side');
    // if no seed, offer to get one
    if (seed == null) {
        // showing just index page
        console.log("showing the index page")
        document.getElementById("index").style.display='block';
        document.getElementById("genLayoutLink").href = '?seed=' + getRandomSeed()
        return
    }
    // otherwise, show the panel corresponding to the side (player1/player2)
})();