function English (className, typetag) {
  BaseGame.call(this, className, typetag, 'english');
  this.data = {};
  this.dataReceived = false;
  this.channel = new Channel();

  this.sections = [
    'Topic vocabulary',
    'Phrasal verbs',
    'Prepositional phrases',
    'Word formation',
    'Word patterns'
  ];

}

English.prototype = Object.create(BaseGame.prototype);

English.prototype.constryctor = English;

English.prototype.initialize = function() {
  var template = document.querySelector('#english-template');
  var self = this,
      queryString = createParam({
        section: 'section 1'
      });

  self.element.innerHTML = template.innerHTML;
  self.questionElement = self.element.querySelector('.english_value label');
  self.translationElement = self.element.querySelector('.english_translation label');
  self.timerElement = self.element.querySelector('.english_timer');

  self.translationElement.style.visibility = 'hidden';

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
  self.translationElement.style.visibility = '';
  self.timerElement.style.visibility = 'hidden';
  setTimeout(function nextQuestionDelay() {
    self.build();
    self.startTimer();
    self.translationElement.style.visibility = 'hidden';
    self.timerElement.style.visibility = '';
  }, 2000);
};

English.prototype.build = function() {
  var section = this.sections[getRandomInt(0, this.sections.length)],
      indexWord = getRandomInt(0, this.data[section].length),
      indexTranstalion =  getRandomInt(0, this.data[section][indexWord].translation.length),
      askTranslation = !!getRandomInt(0,1);
  this.questionData = this.data[section][indexWord];

  if(askTranslation) {
    this.questionElement.innerText = this.questionData.value;
    this.translationElement.innerText = this.questionData.translation[indexTranstalion];
  } else {
    this.translationElement.innerText = this.questionData.value;
    this.questionElement.innerText = this.questionData.translation[indexTranstalion];
  }
};

English.prototype.startTimer = function() {
  var self = this,
      tick = 0;

  self.timerElement.innerText = tick;
  self.timer = setInterval(function timerTick() {

    if(tick === 2) {
      self.stopTimer();
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
