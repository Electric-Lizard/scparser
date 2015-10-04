/**
 * Created by username on 10/3/15.
 */
export class Pool {
    /* All time in ms*/
    _coolDown;
    _lastCall;
    /** @type {function[]} */
    _pool;

    constructor(coolDown = 3) {
        this._coolDown = coolDown * 1000;
        this._lastCall = 0;
        this._pool = [];
        _.bindAll(this, 'release');
    }

    dip(callback) {
        var timestamp = Date.now();
        if (timestamp - this._lastCall > this._coolDown) {
            this._lastCall = Date.now();
            callback();
            setTimeout(this.release, this._coolDown);
        } else {
            this._pool.push(callback);
        }
    }

    release() {
        this._lastCall = Date.now();
        if (this._pool.length > 0) {
            this._pool.shift()();
            setTimeout(this.release, this._coolDown);
        }
    }
}