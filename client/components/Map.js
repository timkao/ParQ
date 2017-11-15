import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMap, addSpotOnServer, fetchSpots, fetchAddress, getHeadingTo, mapDirection, longitude, latitude } from '../store';
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
    console.log('updated');
    console.log(<SpotInfo />)
    const { spots, map } = this.props
        const currentMarkers = document.getElementsByClassName("marker");
    if (currentMarkers.length > 0) {
      for (let i = 0; i < currentMarkers.length; i++) {
        currentMarkers[i].remove();
      }
    }
    console.log('spots', spots)
    spots.features ?
    spots.features.forEach(function(spot) {
        // create the marker
        var el = document.createElement('div');
        el.className = 'marker';
        // add event listener
        el.addEventListener("click", () => {
          getHeadingTo(spot.properties.id)
          mapDirection.setOrigin([longitude, latitude]);
          mapDirection.setDestination(spot.geometry.coordinates);
        })
          // create the popup
          var popup = new mapboxgl.Popup()
          .setText(`Size: ${ spot.properties.size }`);
          new mapboxgl.Marker(el)
          .setLngLat(spot.geometry.coordinates)
          .setPopup(popup) // sets a popup on this marker
          .addTo(map);

      })
      : null
    //check for spots that came back in the props and then create the popups in here
    //can probably do the same for the markers honestlty
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
    getAddress(coor){
      dispatch(fetchAddress(coor));
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
