

function Character(i, j) {
    //character position
    this.position = new Object();
    this.position.i = i;
    this.position.j = j;

    this.avaiable = true;
}


Character.prototype.getPosition = function () {
    var pos = { // cloning object ~ passing by value
        i: this.position.i,
        j: this.position.j
    };
    return pos;
};

Character.prototype.setPosition = function (i, j) {
    this.position.i = i;
    this.position.j = j;
};


Character.prototype.isAvaiable = function () {
    return this.avaiable;
};

Character.prototype.setAvaiable = function (avaiable) {
    this.avaiable = avaiable;
};