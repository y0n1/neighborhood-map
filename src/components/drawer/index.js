define([
  'ko',
  'text!components/drawer/template.html',
], function(ko, template) {
  'use strict';

  function DrawerModel() {
    
  }

  return {
    viewModel: DrawerModel,
    template: template,
  };
});
