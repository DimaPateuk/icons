function History(containerClass) {
  this.container = document.querySelector(containerClass);
  this.state = ''; /// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  this.start();
  window.onhashchange = this.start.bind(this);
}

History.prototype.setGamePage = function (game, gameClass, typetag) {
  var currentGame = window.stageObj.currentGame;
  if(currentGame instanceof game) {
    currentGame.build();
    return;
  }
  this.container.innerHTML = '';
  currentGame = new game(gameClass, typetag);
  currentGame.start();
  this.container.appendChild(currentGame.element);
  return;
}

History.prototype.start = function () {
  switch(location.hash.toLowerCase().replace('#', '')) {
    case 'grid':
      this.setGamePage(Grid, 'grid', 'div');
      return;
    case 'english':
      this.setGamePage(English, 'english', 'div');
      return;
    default:
      location.hash = 'grid';
      return;
  }
};



window.stageObj = {
  history: {},
  currentGame: {},
}


window.onload = function () {
    window.history = new History('.content');
};
