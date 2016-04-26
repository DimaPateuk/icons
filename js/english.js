function English (className, typetag) {
  BaseGame.call(this, className, typetag, 'english');
  this.initialize();

}

English.prototype = Object.create(BaseGame.prototype);

English.prototype.constryctor = English;

English.prototype.initialize = function() {
  var template = document.querySelector('#english-template');
  this.element.innerHTML = template.innerHTML;
}

English.prototype.build = function() {
  var self = this,
      queryString = createParam({
        theme: 'theme 1'
      });

  http('GET', '/english' + '?' + queryString, function (data) {
    //console.log(data['Phrasal verbs']);
  })
}

English.prototype.start = function() {
  this.build();
}
