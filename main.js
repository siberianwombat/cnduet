// the main idea: get the cards position determined by prng seed given as the parameter
// showing the first player his cars and giving him opportynity to send out the link to another part

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
