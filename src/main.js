require.config({
  baseUrl: '/',
  paths: {
    ko: 'libs/knockout/build/output/knockout-latest.debug',
    text: 'libs/text/text',
    models: 'models',
    components: 'components'
  }
});

define(function (require) {
  'use strict';
  
  var KO = require('ko');
  var Teams = JSON.parse(require('text!models/teams.json'));

  function MainViewModel() {
    this.isOpen = KO.observable(false);
    this.teams = KO.observableArray(Teams);
    this.query = KO.observable('');
    this.query.subscribe(function search(newValue) {
      this.teams(Teams.filter(function (team) {
        return team.name.toLowerCase().indexOf(newValue.toLowerCase()) >= 0;
      }));
    }, this, 'beforeChange');
  }

  MainViewModel.prototype.toggle = function toggle() {
    this.isOpen(!this.isOpen());
  };

  MainViewModel.prototype.close = function close() {
    this.isOpen(false);
  };

  KO.applyBindings(new MainViewModel());
});
