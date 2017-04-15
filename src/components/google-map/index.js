define([
  'ko',
  'text!components/map/template.html',
], function(ko, template) {
  'use strict';

  var _settings = {};

  function GoogleMapViewModel(center, zoom) {
    debugger;
    var centerLatLng, lat, lng;
    centerLatLng = center.split(',').map(function(token) {
      return Number(token.trim());
    });
    lat = centerLatLng[0];
    lng = centerLatLng[1];
    _settings.zoom = Number(zoom);
    _settings = ko.utils.extend({
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      center: new google.maps.LatLng(lat, lng)
    });
  }

  GoogleMapViewModel.prototype.init = function init() {
    this.map = new google.maps.Map(document.getElementById('map'), _settings);
  };

  return {
    viewModel: GoogleMapViewModel,
    template: template,
  };
});
