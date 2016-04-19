function Model() {}
function Collection () {}

function ModelGridItem() {}
function CollectionGridItems () {}

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

function Grid(className, height, width) {
  var self = this;
  className = className[0] === '.' ? className : '.' + className;

  self.gridElement = document.querySelector(className);
  self.height = height;
  self.width = width;
  self.elements = [];
  self.xhr = new XMLHttpRequest();
  self.channel = new Channel();

  var click = false;

  self.gridElement.onclick = function (e) {
    if(click) return;
    click = !click;
    if(e.target.attributes.key) {
        var key = parseInt(e.target.attributes.key.nodeValue);
        if(key === self.correctAnswer[0] || key === self.correctAnswer[1]) {
          self.channel.emit('correct', self.correctAnswer);
        } else {
          self.channel.emit('incorrect', {
            answer: key,
            correctAnswer: self.correctAnswer
          });
        }
    }
   };

  self.channel.on('correct', function (data) {
    if(self.height !== 10 && self.width !== 10) {
      self.height++;
      self.width++;
    }
    self.elements[data[0]].ell.classList.add('correct');
    self.elements[data[1]].ell.classList.add('correct');
    setTimeout(function () {
      self.build(self.height,self.width);
      click = !click;
    }, 1000);
  });
  self.channel.on('incorrect', function (data) {
    if(self.height !== 3 && self.width !== 3) {
      self.height--;
      self.width--;
    }
    self.elements[data.answer].ell.classList.add('incorrect');
    self.elements[data.correctAnswer[0]].ell.classList.add('correct');
    self.elements[data.correctAnswer[1]].ell.classList.add('correct');
    setTimeout(function () {
      self.build(self.height,self.width);
      click = !click;
    }, 1000);
  });
};

// utils
function createParam(object) {
    var encodedString = '';
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (encodedString.length > 0) {
                encodedString += '&';
            }
            encodedString += encodeURI(prop + '=' + object[prop]);
        }
    }
    return encodedString;
};

Grid.prototype.createCell = function (key) {
  var cell = document.createElement('img');
      self = this;
  cell.classList.add('cell');
  return {
          ell: cell,
          key: key
        };
};

Grid.prototype.build = function (height, width) {
  var self = this;

  this.getNewIcons({ count: height * width }, function (data) {
    var sizeStyle = 'width: ' + width * 45 + 'px;' +
                    'height:' + height * 45 + 'px;';
    self.gridElement.setAttribute('style', sizeStyle);
    self.gridElement.innerHTML = '';
    // need clear elements correct
    self.elements = [];
    self.correctAnswer = data.correctAnswer;
    for (var i = 0; i < data.randIconArr.length; i++) {
      var cell = self.createCell(i);
      cell.ell.setAttribute('src', data.randIconArr[i]);
      cell.ell.setAttribute('key', i);
      self.gridElement.appendChild(cell.ell);
      self.elements.push(cell)
    }
  })
};

Grid.prototype.getNewIcons = function (reqObj, cb) {
  var queryString = createParam(reqObj),
      self = this;
  self.xhr.open('GET', '/icons' + '?' + queryString);

  self.xhr.onreadystatechange = function (data) {
    if(data.target.responseText) {
      var respond = JSON.parse(data.target.responseText);
      cb(respond);
    }
  }
  self.xhr.send();
};

window.onload = function () {
  var gridInstance = new Grid('grid', 3, 3);
  gridInstance.build(gridInstance.height, gridInstance.width);

  var relod = document.querySelector('#relod');
  relod.onclick = function () {
    gridInstance.build(gridInstance.height, gridInstance.width);
  };

};
