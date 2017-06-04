function init() {
  'use strict';
  var map = map || new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(-34.624, 301.557),
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    mapTypeControl: false,
    zoom: 12
  });

  const _cache = new Map();
  const CacheKeys = {
    TEAMS_DATA: { name: 'TeamsData', value: 2 }
  };
  let currentOpenInfoWindow;

  async function _getInfoWindowContent(infoWindow, marker, lat, lng, term) {
    const teamsData = _cache.get(CacheKeys.TEAMS_DATA.name);
    if (!teamsData || !teamsData[term]) {
      const today = new Date();
      const [dd,mm,yyyy] = today.toLocaleDateString('fr-FR').split('/');
      const queryString = new URLSearchParams(Object.entries({
        ll: `${lat},${lng}`,
        query: term,
        v: `${yyyy}${mm}${dd}`,
        intent: 'match',
        client_id: 'QUYNYDUOIUVPL1QJD1UVC2OFNEQ1IA3RICXW42RRBJ10NJMX',
        client_secret: 'QGQOJS132CBIDNUZVVPQKN32555JX2OMBWNMSG30C0TLHHT2'
      }));

      const fetchSettings = {
        method: 'GET'
      }

      const endpoint = 'https://api.foursquare.com/v2/venues/search';
      try {
        const response = await fetch(`${endpoint}?${queryString}`, fetchSettings);
        const body = await response.json();
        if (body.response.venues.length == 0) {
          alert(`No data available for ${term}`);
        }

        const firstVenue = body.response.venues[0];
        const newContentString = firstVenue.url ? `<h4><a onclick="window.open('${firstVenue.url}');" href="${firstVenue.url}">${firstVenue.name}</a></h4>` : `<h4>${firstVenue.name}</h4>`;
        _cache.set(CacheKeys.TEAMS_DATA.name, { [`${term}`]: newContentString });
        infoWindow.setContent(newContentString);
      } catch (error) {
        alert(error.message);
      }
    }

    currentOpenInfoWindow = infoWindow;
    infoWindow.open(map, marker);
  }

  class Team {
    constructor(name, position) {
      const self = this;

      this.name = name;
      this.visible = ko.observable(true);
      this.position = ko.observable(position);
      this.infoWindow = new google.maps.InfoWindow();
      this.marker = new google.maps.Marker({
        map: map,
        title: this.name,
        animation: google.maps.Animation.DROP,
        position: this.position()
      });

      this.marker.addListener('click', this.click.bind(this));

      this.visible.subscribe(function changeVisibility(isVisible) {
        self.marker.setVisible(isVisible);
      });
    }

    toggleBounce() {
      if (this.marker.getAnimation() !== null) {
        this.marker.setAnimation(null);
      } else {
        this.marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }

    async click() {
      if (currentOpenInfoWindow && currentOpenInfoWindow.content !== this.infoWindow.content) {
        currentOpenInfoWindow.close();
      }

      map.setCenter(this.position());
      this.toggleBounce();
      await _getInfoWindowContent(this.infoWindow, this.marker, this.position().lat, this.position().lng, this.name);
      this.toggleBounce();
    }
  }

  class MainMenuViewModel {
    constructor() {
      this.isOpen = ko.observable(false);
      this.query = ko.observable('');
      this.teams = ko.observableArray([
        new Team("Club Atlético River Plate", { "lat": -34.545236, "lng": -58.449746 }),
        new Team("Club Atlético Boca Juniors", { "lat": -34.635607, "lng": -58.364751 }),
        new Team("Club Atlético Independiente", { "lat": -34.659071, "lng": -58.367513 }),
        new Team("Club Atlético San Lorenzo de Almagro", { "lat": -34.652166, "lng": -58.437009 }),
        new Team("Club Atlético Racing", { "lat": -34.663447, "lng": -58.362874 }),
      ]);
      this.visibleTeams = ko.observableArray(this.teams());
      this.query.subscribe(function search(searchValue) {
        this.visibleTeams(this.teams().filter(function (team) {
          const currentTeamShouldBeIncluded = team.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0;
          team.visible(currentTeamShouldBeIncluded);

          return currentTeamShouldBeIncluded;
        }));
      }, this, 'change');
    }

    toggle() {
      this.isOpen(!this.isOpen());
    }

    close() {
      this.isOpen(false);
    }
  }

  ko.applyBindings(new MainMenuViewModel());
}

