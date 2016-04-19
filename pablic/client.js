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
  self.channel = new Channel();
};

Grid.prototype.initialize = function () {
  var self = this,
      click = false;
  self.gridElement.onclick = function (e) {
    e.stopPropagation();
    e.preventDefault();
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

Grid.prototype.createCell = function (key) {
  var cell = document.createElement('img');
      self = this;
  cell.classList.add('cell');
  return {
          ell: cell
        };
};

Grid.prototype.addedNodes = function (length, size) {
  for (var i = 0; i < size - length; i++) {
    var cell = this.createCell(i + length);
    cell.ell.setAttribute('style', 'display: none;');
    this.elements.push(cell);
    this.gridElement.appendChild(cell.ell);
  }
};

Grid.prototype.reduceNodes = function (length, size) {
  for (var i = length - 1; i >= size; i--) {
    var node = this.elements[i].ell;
    this.gridElement.removeChild(node);
  }
  this.elements = this.elements.slice(0, size);
};

Grid.prototype.updateCellImg = function (randIconArr) {
  for (var i = 0; i < randIconArr.length; i++) {
    self.elements[i].ell.classList.remove('correct');
    self.elements[i].ell.classList.remove('incorrect');
    self.elements[i].ell.removeAttribute('style');
    self.elements[i].ell.setAttribute('src', randIconArr[i]);
    self.elements[i].ell.setAttribute('key', i);
  }
}

Grid.prototype.build = function () {
  var self = this;
  this.getNewIcons({ count: self.height * self.width }, function (data) {
    var sizeStyle = 'width: ' + self.width * 45 + 'px;' +
                    'height:' + self.height * 45 + 'px;',
        size = self.height * self.width,
        length = self.elements.length;

    if(length < size) {
      self.addedNodes(length, size);
    } else {
      self.reduceNodes(length, size);
    }

    self.correctAnswer = data.correctAnswer;
    self.gridElement.setAttribute('style', sizeStyle);
    setTimeout(function () { self.updateCellImg(data.randIconArr); }, 1000);
  });
};

Grid.prototype.getNewIcons = function (reqObj, cb) {
  var queryString = createParam(reqObj),
      self = this,
      xhr = new XMLHttpRequest();

  xhr.open('GET', '/icons' + '?' + queryString);
  xhr.onreadystatechange = function (data) {
    if (this.readyState === 4 && this.status === 200)
    {
      var respond = JSON.parse(data.target.responseText);
      cb(respond);
    }
  }
  xhr.send();
};

window.onload = function () {
  var gridInstance = new Grid('grid', 3, 3);
  gridInstance.initialize();
  gridInstance.build();
};
