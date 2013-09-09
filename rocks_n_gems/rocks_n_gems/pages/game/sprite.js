


/* Constructor */
function Sprite(pos, size, speed, frames, dir, once) {
    this.pos = pos;                                         // the x and y coordinate in the image for this sprite
    this.size = size;                                       // size of the sprite (just one keyframe)
    this.speed = typeof speed === 'number' ? speed : 0;     // speed in frames/sec for animating
    this.frames = frames;                                   // an array of frame indexes for animating: [0, 1, 2, 1]
    this._index = 0;                                        // 
    this.dir = dir || 'horizontal';                         // which direction to move in the sprite map when animating: 'horizontal' (default) or 'vertical'
    this.once = once;                                       // true to only run the animation once, defaults to false
}


Sprite.prototype.update = function (deltaTime) {
    this._index += this.speed * (deltaTime / 1000);
}


Sprite.prototype.render = function () {
    var frame;

    // selecting current frame
    if (this.speed > 0) {
        var max = this.frames.length;
        var idx = Math.floor(this._index);
        frame = this.frames[idx % max];

        if (this.once && idx >= max) { // finished animation?
            this.done = true;
            return;
        }
    } else {
        frame = 0;
    }

    // selecting frame position in sprite map
    var x = this.pos[0];
    var y = this.pos[1];
    if (this.dir == 'vertical') {
        y += frame * this.size[1];
    } else {
        x += frame * this.size[0];
    }

    return [x, y, this.size];
}