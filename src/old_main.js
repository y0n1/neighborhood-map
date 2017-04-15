var NeighborhoodMap = (function (google) {
  'use strict';

  var _menu, _main, _drawer;
  var MAP_SETTINGS = {
    center: {
      lat: -34.624,
      lng: 301.557
    },
    zoom: 12,
    mapTypeControl: true,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER
    }
  };

  function NeighborhoodMap() {
    _drawer = document.querySelector('#drawer');
    _menu = document.querySelector('#menu');
    _menu.addEventListener('click', function (event) {
      _drawer.classList.toggle('open');
      event.stopPropagation();
    });
    _main = document.querySelector('main');
    _main.addEventListener('click', function (event) {
      _drawer.classList.remove('open');
      event.stopPropagation();
    });

    this.map = new google.maps.Map(document.getElementById('map'), MAP_SETTINGS);
  }

  return {
    init: function () {
      new NeighborhoodMap()
    }
  };

})(google);
