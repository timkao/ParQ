import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mapboxgl from 'mapbox-gl';

/**
 * COMPONENT
 */

var getUserLocation = function (options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

export class UserHome extends Component{
  constructor(){
    super();
    this.state = {
      currentLong: 0,
      currentLat: 0
    };


  }
  componentDidMount(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ21lZGluYTIyOSIsImEiOiJjajlscHRhbXY0a2s4MzNxbXUxejBmY3ZqIn0.nAyOpUGA9NDN6tDGg_i6PQ';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-74.009160, 40.705076],
      zoom: 15
    });
    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
          enableHighAccuracy: true
      },
      trackUserLocation: true
    }));
    //getUserLocation may take a few seconds...
    getUserLocation()
      .then((position) => {
        const {longitude, latitude} = position.coords;
        this.setState({currentLat: longitude, currentLong: latitude});
        this.map.setCenter([longitude, latitude]);
      })
      .catch((err) => {
      console.error(err.message);
      });

  }
  render(){
    const {email} = this.props;
    return (
      <div>
      <h3>Welcome, {email}</h3>
      <div id="map" />
      </div>
    );
  }
}


/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.user.email
  };
};

export default connect(mapState)(UserHome);

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
};
