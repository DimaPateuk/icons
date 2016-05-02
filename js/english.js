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

  this.currentMode = 'theme';
  this.modes = ['theme', 'texts'];

}

English.prototype = Object.create(BaseGame.prototype);

English.prototype.constryctor = English;

English.prototype.chooseLearnMode = function(mode, name) {
  var self = this,
      queryString = createParam({
        name: name
      });
  self.dataReceived = false;
  self.currentMode = mode;
  http('GET', '/english/' + mode + '/' + '?' + queryString, function (data) {
    self.data = data;
    self.dataReceived = true;
    self.build();
    self.channel.emit('dataReceived');
  });
};

English.prototype.initialize = function() {
  var template = document.querySelector('#english-template');
  var self = this;

  self.element.innerHTML = template.innerHTML;
  self.questionElement = self.element.querySelector('.english_value label');
  self.translationElement = self.element.querySelector('.english_translation label');
  self.timerElement = self.element.querySelector('.english_timer');

  self.translationElement.style.visibility = 'hidden';

  //self.chooseLearnMode('theme', 'Fun and games');
  self.chooseLearnMode('texts', 'text');

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
  switch(this.currentMode) {
    case 'texts': {
      this.modeLearnWordsromText();
      return;
    }
    default :{
      this.modeLearnByTheme()
      return;
    }
  }
};

English.prototype.makeAsk = function(questionData, indexTranstalion) {
  var askTranslation = !!getRandomInt(0,2);
  if(askTranslation) {
    this.questionElement.innerText = questionData.value;
    this.translationElement.innerText = questionData.translation[indexTranstalion];
  } else {
    this.translationElement.innerText = questionData.value;
    this.questionElement.innerText = questionData.translation[indexTranstalion];
  }
};

English.prototype.modeLearnByTheme = function() {
  var section = this.sections[getRandomInt(0, this.sections.length)],
      indexWord = getRandomInt(0, this.data[section].length),
      indexTranstalion = getRandomInt(0, this.data[section][indexWord].translation.length),
      questionData = this.data[section][indexWord];

  this.makeAsk(questionData, indexTranstalion);

};

English.prototype.modeLearnWordsromText = function() {
  var indexWord = getRandomInt(0, this.data.length),
      indexTranstalion = getRandomInt(0, this.data[indexWord].translation.length),
      questionData = this.data[indexWord];

  this.makeAsk(questionData, indexTranstalion);
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
