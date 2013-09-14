

function Portal(i, j) {
    //portal position
    this.position = new Object();
    this.position.i = i;
    this.position.j = j;

    this.avaiable = true;
}


Portal.prototype.getPosition = function () {
    var pos = { // cloning object ~ passing by value
        i: this.position.i,
        j: this.position.j
    };
    return pos;
};

Portal.prototype.setPosition = function (i, j) {
    this.position.i = i;
    this.position.j = j;
};


Portal.prototype.isAvaiable = function () {
    return this.avaiable;
};

Portal.prototype.setAvaiable = function (avaiable) {
    this.avaiable = avaiable;
};