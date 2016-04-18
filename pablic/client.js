function Grid(className) {
  className = className[0] === '.' ? className : '.' + className;
  this.gridElement = document.querySelector(className);
  this.height = 0;
  this.width = 0;
  this.elements = [];
  this.xhr = new XMLHttpRequest();
};

function Model() {}
function Collection () {}

function ModelGridItem() {}
function CollectionGridItems () {}

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
  var cell = document.createElement('div'),
      img = document.createElement('img');
  cell.appendChild(img);
  cell.classList.add('cell');
  return {
          ell: cell,
          img: img,
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
      cell.img.setAttribute('src', data.randIconArr[i]);
      cell.img.setAttribute('key', i);
      self.gridElement.appendChild(cell.ell);
      self.elements.push(cell)
    }
  })
};

Grid.prototype.getNewIcons = function (reqObj, cb) {
  var queryString = createParam(reqObj);
  this.xhr.open('GET', '/icons' + '?' + queryString);
  this.xhr.onreadystatechange = function (data) {
    cb(JSON.parse(data.target.responseText));
  }
  this.xhr.send();
};

window.onload = function () {
  var gridInstance = new Grid('grid');
  gridInstance.build(3,3);

  var relod = document.querySelector('#relod');
  relod.onclick = function () {
    gridInstance.build(3,3);
  };

};
