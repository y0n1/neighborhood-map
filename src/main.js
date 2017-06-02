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
    AUTH_DATA: { name: 'AuthenticationData', value: 1 },
    TEAMS_DATA: { name: 'TeamsData', value: 2 }
  };
  const openInfoWindows = new Set();

  async function authenticate() {
    const authData = _cache.get(CacheKeys.AUTH_DATA.name);
    if (authData) {
      const hasNotExpiredAccessToken = Date.now() - authData.expires_in * 1000 > 0;
      if (hasNotExpiredAccessToken) {
        return authData.access_token;
      }
    }

    const data = new URLSearchParams(Object.entries({
      grant_type: 'client_credentials',
      client_id: 'L9NGO7AJfIXDH78gNFvCSA',
      client_secret: 'Y6yy6I0dALQ9n1KRuZIMzBdGq5ShQ6m2HsGFnTredX3M6OgQvipo6Biet4vVthAN'
    }));

    const fetchSettings = {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/x-www-form-urlencoded'
      }),
      body: data
    }

    const endpoint = 'https://api.yelp.com/oauth2/token';
    let returnValue;
    try {
      const response = await fetch(endpoint, fetchSettings);
      const body = await response.text();
      _cache.set(CacheKeys.AUTH_DATA.name, JSON.parse(body));
      returnValue = JSON.parse(body)['access_token'];
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }

    return returnValue;
  }

  async function getInfoWindowContent(infoWindow, marker, lat, lng, term) {
    const teamsData = _cache.get(CacheKeys.TEAMS_DATA.name);
    if (!teamsData || !teamsData[term]) {
      const queryString = new URLSearchParams(Object.entries({
        latitude: lat,
        longitude: lng,
        term: term,
        categories: 'sports_clubs',
        sort_by: 'best_match'
      }));

      const { token_type, access_token } = _cache.get(CacheKeys.AUTH_DATA.name)
      const fetchSettings = {
        method: 'GET',
        headers: new Headers({
          'authorization': `${token_type} ${access_token}`
        })
      }

      const endpoint = 'https://api.yelp.com/v3/businesses/search';
      try {
        const response = await fetch(`${endpoint}?${queryString}`, fetchSettings);
        const body = JSON.parse(await response.text());
        if (body.businesses.length == 0) {
          throw new Error(`No data available for ${term}`);
        }

        const firstBusiness = body.businesses[0];
        const newContentString = `<h4><a href="${firstBusiness.url}">${firstBusiness.name}</a></h4>`;
        _cache.set(CacheKeys.TEAMS_DATA.name, { [`${term}`]: newContentString });
        infoWindow.setContent(newContentString);
      } catch (error) {
        console.error(error);
      }
    }

    openInfoWindows.add(infoWindow);
    infoWindow.open(map, marker);
  }

  class Team {
    constructor(name, position) {
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
        this.marker.setVisible(isVisible);
      });
    }

    async click() {
      openInfoWindows.forEach((openInfoWindow) => {
        if (openInfoWindow.content !== this.infoWindow.content) {
          openInfoWindow.close();
        }
      });
      map.setCenter(this.position());
      await authenticate();
      await getInfoWindowContent(this.infoWindow, this.marker, this.position().lat, this.position().lng, this.name);
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

