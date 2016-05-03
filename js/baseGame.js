function BaseGame(className, typetag, gameType) {
  this.element = document.createElement(typetag);
  this.element.classList.add(className);
  this.element.classList.add(className);
  this.element.setAttribute('type', gameType);
}

BaseGame.prototype.constryctor = BaseGame;

BaseGame.prototype.start = function () {
  console.warn('method "start" shoud be implementes in heir');
};

BaseGame.prototype.build = function () {
  console.warn('method "build" shoud be implementes in heir');
};

BaseGame.prototype.end = function () {
  console.warn('method "end" shoud be implementes in heir, thi is reaction on change url for free all anavailable variables');
};
