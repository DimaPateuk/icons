function Channel () {
  this.events = {};
}

Channel.prototype.on = function (name, cb) {
  if(!this.events[name]) {
    this.events[name] = [cb];
  } else {
    this.events[name].push(cb);
  }
};

Channel.prototype.emit = function (name, data) {
  if(this.events[name]) {
    var callbacks = this.events[name];
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i](data);
    }
  } else {
    console.warn('event', name, 'not subscribed yet!');
  }
};
