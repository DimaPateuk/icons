function English (className, typetag) {
  BaseGame.call(this, className, typetag, 'english');
  this.data = {};
  this.dataReceived = false;
  this.channel = new Channel();
}

English.prototype = Object.create(BaseGame.prototype);

English.prototype.constryctor = English;

English.prototype.initialize = function() {
  var template = document.querySelector('#english-template');
  var self = this,
      queryString = createParam({
        theme: 'theme 1'
      });

  self.element.innerHTML = template.innerHTML;
  self.questionWordElement = self.element.querySelector('.english_value label');
  self.translationElement = self.element.querySelector('.english_translation label');
  self.timerElement = self.element.querySelector('.english_timer');
  http('GET', '/english' + '?' + queryString, function (data) {
    self.data = data;
    self.dataReceived = true;
    self.build();
    self.channel.emit('dataReceived');
  });

  self.channel.on('dataReceived', self.startTimer.bind(self));
  self.channel.on('timeOff', self.timeOffReaction.bind(self));

};

English.prototype.timeOffReaction = function () {
  var self = this;
  setTimeout(function nextQuestionDelay() {
    self.stopTimer();
    self.build();
    self.startTimer();
  });
};

English.prototype.build = function() {
  var theme = 'Phrasal verbs',///////
      indexWord = getRandomInt(0, this.data[theme].length),
      indexTranstalion =  getRandomInt(0, this.data[theme][indexWord].translation.length); ////

  this.questionData = this.data[theme][indexWord];
  this.questionWordElement.innerText = this.questionData.value;
  this.translationElement.innerText = this.questionData.translation[indexTranstalion];
};

English.prototype.startTimer = function() {

  var self = this,
      tick = 0;

  self.timerElement.innerText = tick;
  self.timer = setInterval(function timerTick() {
    
    if(tick === 3) {
      self.channel.emit('timeOff');

    } else {
      tick++;
    }
    self.timerElement.innerText = tick;
  }, 1000);
};

English.prototype.stopTimer = function() {
  if(this.timer) {
    clearInterval(this.timer);
  }
};

English.prototype.start = function() {
  this.initialize();
};
