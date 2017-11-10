import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMap, fetchSpots, takeSpot } from '../store';
import Loader from 'react-loader';
import socket from '../socket';

export class UserHome extends Component {

  constructor() {
    super();
    this.state = {
      currentLong: 0,
      currentLat: 0,
      loaded: false,
      headingTo: 0
    };
    this.handleSpotTaken = this.handleSpotTaken.bind(this);
  }

  componentDidMount() {
    this.props.getSpots();
    this.props.getMap(this);
    socket.on('notifications', message => {
      console.log(message);
    })
  }

  handleSpotTaken() {
    if (this.state.headingTo) {
      this.props.occupySpot(this.state.headingTo);
    }
  }

  render() {
    const { email } = this.props;
    const { handleSpotTaken } = this;
    return (
      <div>
        <h3>Welcome, {email}</h3>
        <button onClick={handleSpotTaken}>Spot is taken!</button>
        <button>Found Another Spot</button>
        <Loader loaded={this.state.loaded} className="loader" />
        <div id="map"></div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    email: state.user.email,
    spots: state.streetspots
  };
};

const mapDispatch = (dispatch) => {
  return {
    getMap(component) {
      const thunk = fetchMap(component);
      dispatch(thunk);
    },
    getSpots() {
      dispatch(fetchSpots())
    },
    occupySpot(id) {
      const thunk = takeSpot(id);
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
