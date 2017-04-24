define(function (require) {
  'use strict';

  var ko = require('ko');

  function DrawerViewModel(params) {
    this.isOpen = ko.observable(false);
  }

  DrawerViewModel.prototype.toggle = function toggle() {
    this.isOpen(!this.isOpen());
  };
  
  DrawerViewModel.prototype.close = function toggle() {
    this.isOpen(false);
  };

  return {
    viewModel: DrawerViewModel,
    template: require('text!components/drawer/drawer-template.html')
  };
});
