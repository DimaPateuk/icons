function Grid(className, typetag) {
  BaseGame.call(this, className, typetag, 'grid');
  this.height = 3;
  this.width = 3;
  this.elements = [];
  this.allowClick = true;
  this.channel = new Channel();
};

Grid.prototype = Object.create(BaseGame.prototype);

Grid.prototype.constructor = Grid;

Grid.prototype.reactOnCorrectAnswer = function (data) {
  if(self.height !== 10 && self.width !== 10) {
    self.height++;
    self.width++;
  }
  self.elements[data[0]].ell.classList.add('correct');
  self.elements[data[1]].ell.classList.add('correct');

  setTimeout(function () {
    self.elements[data[0]].ell.classList.remove('correct');
    self.elements[data[1]].ell.classList.remove('correct');
  }, 500);

  setTimeout(function () {
    self.build(self.height,self.width);
    self.allowClick = !self.allowClick;
  }, 1000);
};

Grid.prototype.reactOnIncorrectAnswer = function (data) {
  if(self.height !== 3 && self.width !== 3) {
    self.height--;
    self.width--;
  }
  self.elements[data.answer].ell.classList.add('incorrect');
  self.elements[data.correctAnswer[0]].ell.classList.add('correct');
  self.elements[data.correctAnswer[1]].ell.classList.add('correct');

  setTimeout(function () {
    self.elements[data.answer].ell.classList.remove('incorrect');
    self.elements[data.correctAnswer[0]].ell.classList.remove('correct');
    self.elements[data.correctAnswer[1]].ell.classList.remove('correct');
  }, 500);

  setTimeout(function () {
    self.build(self.height,self.width);
    self.allowClick = !self.allowClick;
  }, 1000);
};

Grid.prototype.initialize = function () {
  var self = this;
  self.element.onclick = function (e) {
    e.stopPropagation();
    e.preventDefault();
    if(!self.allowClick) return;
    self.allowClick = !self.allowClick;
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

  self.channel.on('correct', self.reactOnCorrectAnswer);
  self.channel.on('incorrect', self.reactOnIncorrectAnswer);
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
    this.elements.push(cell);
    this.element.appendChild(cell.ell);
  }
};

Grid.prototype.reduceNodes = function (length, size) {
  for (var i = length - 1; i >= size; i--) {
    var node = this.elements[i].ell;
    this.element.removeChild(node);
  }
  this.elements = this.elements.slice(0, size);
};

Grid.prototype.updateCellImg = function (randIconArr) {
  for (var i = 0; i < randIconArr.length; i++) {
    self.elements[i].ell.classList.remove('hide');
    self.elements[i].ell.setAttribute('src', randIconArr[i]);
    self.elements[i].ell.setAttribute('key', i);
  }
}

Grid.prototype.hideAllImg = function () {
  for (var i = 0; i < this.elements.length; i++) {
    this.elements[i].ell.classList.add('hide');
  }
};

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
    self.hideAllImg();
    self.correctAnswer = data.correctAnswer;
    self.element.setAttribute('style', sizeStyle);
    setTimeout(function () { self.updateCellImg(data.randIconArr); }, 1000);
  });
};

Grid.prototype.getNewIcons = function (reqObj, cb) {
  var queryString = createParam(reqObj),
      self = this;

  http('GET', '/icons' + '?' + queryString, cb)
};

Grid.prototype.start = function () {
  this.initialize();
  this.hideAllImg();
  this.build();
}
