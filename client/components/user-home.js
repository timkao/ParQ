import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMap, fetchSpots, takeSpot, addSpotOnServer } from '../store';
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
    this.handleAddSpotGeo = this.handleAddSpotGeo.bind(this);
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

  handleAddSpotGeo() {
    this.props.addSpot(this.map, this.props.id) //eventually pass in users default vehicle size
    // this.props.getMap(this);
  }

  render() {
    const { email } = this.props;
    const { handleSpotTaken, handleAddSpotGeo } = this;
    const { showNotification } = this.state;

    return (
      <div>
        <h3>Welcome, {email}</h3>
        <button onClick={handleSpotTaken}>Mark Spot Taken</button>
        <button onClick={handleAddSpotGeo}>Open Spot Here</button>
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
    id: state.user.id,
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
    occupySpot(id) {
      const thunk = takeSpot(id);
      dispatch(thunk);
    },
    addSpot(component, id){
      dispatch(addSpotOnServer(component, id))
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
