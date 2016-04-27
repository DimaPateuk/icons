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
}

function http(method, url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onreadystatechange = function (data) {
    if (this.readyState === 4 && this.status === 200) {
      var respond = JSON.parse(data.target.responseText);
      cb(respond);
    }
  };
  xhr.send();
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandArr (count, max) {
  var result = [];

  for (var i = 0;i < count;) {
    var rand = getRandomInt(0, max),
        add = true;
    for (var j = 0; j < result.length; j++) {
      if(result[j] === rand) {
        add = false;
        break;
      }
    }
    if(add) {
      result.push(rand);
      i++;
    }
  }
  return result;
}
