import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMap, addSpotOnServer, fetchSpots, getHeadingTo, mapDirection, longitude, latitude } from '../store';
import Loader from 'react-loader';
import socket from '../socket';
import { SpotInfo } from './';
import mapboxgl from 'mapbox-gl';

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
    this.props.onRef(this);
    socket.on('A Spot Taken', () => {
      this.renewSpotsWithMap();
    })
  }

  componentDidUpdate(prevProps, prevState){
    console.log('*map component updated*');
    const { spots, map, headTo } = this.props
    // remove existing marker (we can optimize it later)
    const currentMarkers = document.getElementsByClassName("marker");
    while (currentMarkers.length > 0) {
      currentMarkers[0].remove();
    }

    spots.features ?
    spots.features.forEach(function(spot) {
        // create the marker
        var el = document.createElement('div');
        el.className = 'marker';
        // add event listener
        el.addEventListener("click", () => {
          headTo(spot.properties.id)
          mapDirection.setOrigin([longitude, latitude]);
          mapDirection.setDestination(spot.geometry.coordinates);
        })
          // create the popup
          var popup = new mapboxgl.Popup()
          .setHTML('<button onClick=(console.log(`hi`))>hello</button>');
          new mapboxgl.Marker(el)
          .setLngLat(spot.geometry.coordinates)
          .setPopup(popup) // sets a popup on this marker
          .addTo(map);
      })
      : null
  }

  handleAddSpotGeo() {
    this.props.addSpot(this.map, this.props.id) //eventually pass in users default vehicle size
    // this.props.getMap(this);
  }

  renewSpotsWithMap() {
    const { renewSpots, map } = this.props
    renewSpots(map);
  }

  render() {
    // const { spots, map } = this.props
    // console.log('spots',spots)
    // console.log('map',map)
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
    map: state.map
  };
};

const mapDispatch = (dispatch) => {
  return {
    getMap(component) {
      const thunk = fetchMap(component);
      dispatch(thunk);
    },
    addSpot(component, id){
      dispatch(addSpotOnServer(component, id));
    },
    renewSpots(map) {
      dispatch(fetchSpots(map));
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
