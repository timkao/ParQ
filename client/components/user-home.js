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
      currentLong: 0,  // this two might not be neccessary
      currentLat: 0,   // this might not be neccessary
      loaded: false,
      headingTo: 0,
      showNotification: {isShow: false, message: ''}
    };
    this.handleSpotTaken = this.handleSpotTaken.bind(this);
  }

  componentDidMount() {
    this.props.getMap(this);
    socket.on('notifications', message => {
      this.setState({showNotification: {isShow: true, message: message}});
      setTimeout(() => { this.setState({ showNotification: {isShow: false, message: ''}})}, 4000);
    });
  }

  handleSpotTaken() {
    if (this.state.headingTo) {
      this.props.occupySpot(this.state.headingTo);
    }
  }

  render() {
    const { email } = this.props;
    const { handleSpotTaken } = this;
    const { showNotification } = this.state;

    return (
      <div>
        <h3>Welcome, {email}</h3>
        <button onClick={handleSpotTaken}>Spot is taken!</button>
        <button>Found Another Spot</button>
        {
          showNotification.isShow && <p className="alert alert-warning">{showNotification.message}</p>
        }
        <Loader loaded={this.state.loaded} className="loader" />
        <div id="map"></div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    email: state.user.email,
    spots: state.streetspots,
    spotsTaken: state.user.spotsTaken
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
  };
};

export default connect(mapState, mapDispatch)(UserHome);

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
};
