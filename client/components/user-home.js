import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mapboxgl from 'mapbox-gl';
import { fetchMap } from '../store';

export class UserHome extends Component {

  constructor(){
    super();
    this.state = {
      currentLong: 0,
      currentLat: 0
    };
  }

  componentDidMount(){
    this.props.getMap(this);
  }

  render(){
    const {email} = this.props;
    return (
      <div>
      <h3>Welcome, {email}</h3>
      <div id="map"></div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    email: state.user.email
  };
};

const mapDispatch = (dispatch) => {
  return {
    getMap(component) {
      const thunk = fetchMap(component);
      dispatch(thunk);
    }
  }
}

export default connect(mapState, mapDispatch)(UserHome);

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
};
