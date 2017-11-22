import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMap, addSpotOnServerGeo, addSpotOnServerMarker, fetchSpots, getHeadingTo, mapDirection, longitude, latitude } from '../store';
import Loader from 'react-loader';
import socket from '../socket';
import mapboxgl from 'mapbox-gl';
import {filterSpots} from '../helpers';

export class Map extends Component {

  constructor() {
    super();
    this.state = {
      loaded: false,
    };
    this.handleAddSpotGeo = this.handleAddSpotGeo.bind(this);
    this.renewSpotsWithMap = this.renewSpotsWithMap.bind(this);
  }

  componentDidMount() {
    this.props.getMap(this);
    socket.on('A Spot Taken', () => {
      this.renewSpotsWithMap();
    });
  }

  componentDidUpdate(prevProps, prevState){
    const { spots, map, headTo, lots, filter } = this.props;
    // remove existing marker (we can optimize it later)
    if (this.state.loaded === true && spots.features){
    const currentMarkers = document.getElementsByClassName('marker');
    const currentLots = document.getElementsByClassName('lot');
    while (currentMarkers.length > 0 ) {
      currentMarkers[0].remove();
    }
    while (currentLots.length > 0) {
      currentLots[0].remove();
    }
    let currentFilter = {};
    for (var key in filter){
      if (filter[key].length > 0 && key !== 'type'){
        currentFilter[key] = filter[key];
      }
    }

    let filteredSpots = filterSpots(currentFilter, spots.features);
    let filteredLots = filterSpots(currentFilter, lots.features);

    if (filter.type.includes('Street') || filter.type.length < 1 ){
      spots.features &&
      filteredSpots.forEach(function(spot) {
          // create the marker
          var el = document.createElement('div');
          el.className = 'marker';
          // add event listener
          el.addEventListener('click', () => {
            headTo(spot.properties.id);
            mapDirection.setOrigin([longitude, latitude]);
            mapDirection.setDestination(spot.geometry.coordinates);
          });
            // create the popup
            var popup = new mapboxgl.Popup()
            .setHTML('<button onClick=(console.log(`hi`))>hello</button>');
            new mapboxgl.Marker(el)
            .setLngLat(spot.geometry.coordinates)
            .setPopup(popup) // sets a popup on this marker
            .addTo(map);
        });
    }
    if (filter.type.includes('Lot') || filter.type.length < 1 ){
      lots.features && filteredLots.forEach(function(lot) {
        // create the marker
        var el = document.createElement('div');
        el.className = 'lot';
        // add event listener
        el.addEventListener('click', () => {
          headTo(lot.properties.id);
          mapDirection.setOrigin([longitude, latitude]);
          mapDirection.setDestination(lot.geometry.coordinates);
        });
          // create the popup
          var popup = new mapboxgl.Popup()
          .setHTML(`<div>${lot.place_name}</div>`);
          new mapboxgl.Marker(el)
          .setLngLat(lot.geometry.coordinates)
          .setPopup(popup) // sets a popup on this marker
          .addTo(map);
      });
    }
  }
  }

  handleAddSpotGeo() {
    this.props.addSpotGeo(this.map, this.props.id, null) //eventually pass in users default vehicle size
    // this.props.getMap(this);
  }

  handleAddSpotMarker(){
    //location of marker is returned by the .getSource function below
    let spot = {
      longitude: this.map.getSource('createdPoint')._data.features[0].geometry.coordinates[0],
      latitude: this.map.getSource('createdPoint')._data.features[0].geometry.coordinates[1],
    }
    this.props.addSpotMarker(this.map, this.props.id, null, spot) //eventually pass in users default vehicle size
    // this.props.getMap(this);
  }

  renewSpotsWithMap() {
    const { renewSpots, map } = this.props
    renewSpots(map);
  }

  render() {
    return (
      <div id="map">
        <Loader loaded={this.state.loaded} className="loader" />
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    id: state.user.id,
    spots: state.streetspots,
    map: state.map,
    lots: state.lots,
    filter: state.filter
  };
};

const mapDispatch = (dispatch) => {
  return {
    getMap(component) {
      const thunk = fetchMap(component);
      dispatch(thunk);
    },
    addSpotGeo(component, id){
      dispatch(addSpotOnServerGeo(component, id));
    },
    addSpotMarker(component, id, defaultVehicle, spot){
      dispatch(addSpotOnServerMarker(component, id, defaultVehicle, spot))
    },
    renewSpots() {
      dispatch(fetchSpots());
    },
    headTo(spotId){
      dispatch(getHeadingTo(spotId));
    }
  };
};

export default connect(mapState, mapDispatch)(Map);

/**
 * PROP TYPES
 */
Map.propTypes = {
  email: PropTypes.string
};
