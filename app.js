var express = require('express');
var fs = require('fs');
var app = express();
var globule = require('globule');
var icons = globule.find('pablic/icons/**/*.png');

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

app.use('/pablic', express.static(__dirname + '/pablic'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/pablic/index.html');
});
app.get('/icons', function (req, res) {
  var randIconArr = getRandArr(req.query.count, icons.length),
      correctAnswer = getRandArr(2, randIconArr.length);
  randIconArr[correctAnswer[0]] = randIconArr[correctAnswer[1]];
  for (var i = 0; i < randIconArr.length; i++) {
    randIconArr[i] = icons[randIconArr[i]];
  }
  res.json({
        randIconArr: randIconArr,
        correctAnswer: correctAnswer
      });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
