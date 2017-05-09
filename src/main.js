function init() {
  'use strict';

  var map = map || new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(-34.624, 301.557),
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    mapTypeControl: false,
    zoom: 12
  });

  function Team(name, position) {
    var self = this;

    this.name = name;
    this.position = ko.observable(position);
    this.infoWindow = new google.maps.InfoWindow();
    this.marker = new google.maps.Marker({
      map: map,
      title: self.name,
      animation: google.maps.Animation.DROP,
      position: self.position()
    });
    this.marker.addListener('click', function () {
      self.infoWindow.open(map, self.marker);
    });
    this.visible = ko.observable(true);
    this.visible.subscribe(function changeVisibility(isVisible) {
      self.marker.setVisible(isVisible);
    });
  }

  Team.timer = null;

  Team.prototype.click = function click() {
    var self = this;

    map.setCenter(this.position());
    self.infoWindow.open(map, self.marker);
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    Team.timer = setTimeout(function () {
      // clearTimeout(Team.timer);
      self.marker.setAnimation(null);
    }, 3000);
  };

  function MainViewModel() {
    this.isOpen = ko.observable(false);
    this.query = ko.observable('');
    this.teams = ko.observableArray([
      new Team("River Plate", { "lat": -34.545236, "lng": -58.449746 }),
      new Team("Boca Juniors", { "lat": -34.635607, "lng": -58.364751 }),
      new Team("Independiente", { "lat": -34.659071, "lng": -58.367513 }),
      new Team("San Lorenzo", { "lat": -34.652166, "lng": -58.437009 }),
      new Team("Racing", { "lat": -34.663447, "lng": -58.362874 }),
    ]);
    this.visibleTeams = ko.observableArray(this.teams());
    this.query.subscribe(function search(searchValue) {
      this.visibleTeams(this.teams().filter(function (team) {
        var currentTeamShouldBeIncluded = team.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0;
        team.visible(currentTeamShouldBeIncluded);

        return currentTeamShouldBeIncluded;
      }));
    }, this, 'change');
  }

  MainViewModel.prototype.toggle = function toggle() {
    this.isOpen(!this.isOpen());
  };

  MainViewModel.prototype.close = function close() {
    this.isOpen(false);
  };

  ko.applyBindings(new MainViewModel());
}
