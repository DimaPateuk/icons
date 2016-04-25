function History() {

    location.hash = location.hash.replace('#', '');
    console.log(location.hash);
    switch(location.hash.toLowerCase()) {
      case 'grid':
        console.log(location.hash.toLowerCase());
        return;
      default:
      console.log(location.hash.toLowerCase());
        location.hash = 'grid';
        return;
    }
}

History.protytype.start = function () {

};


window.stageObj = {
  history: {},
  currentGame: {},
}
window.onhashchange = History;


window.onload = function () {
  history.replaceState({}, document.title, "/");

  window.stageObj.currentGame = new Grid('grid');
  window.stageObj.currentGame.start();
};
