import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMap, fetchSpots, takeSpot, addSpotOnServer } from '../store';
import socket from '../socket';
import Map from './Map';
import List from './List';

export class UserHome extends Component {

  constructor() {
    super();
    this.state = {
      currentLong: 0,  // this two might not be neccessary
      currentLat: 0,   // this might not be neccessary
      headingTo: 0,
      showNotification: {isShow: false, message: ''},
      mapView: true
    };
    this.handleSpotTaken = this.handleSpotTaken.bind(this);
    this.setMapView = this.setMapView.bind(this);
    this.handleAddSpotGeo = this.handleAddSpotGeo.bind(this);
  }

  componentDidMount() {
    socket.on('notifications', message => {
      this.setState({showNotification: {isShow: true, message: message}});
      setTimeout(() => {
        this.setState({ showNotification: {isShow: false, message: ''}});
      }, 4000);
    });
  }

  handleSpotTaken() {
    if (this.state.headingTo) {
      this.props.occupySpot(this.state.headingTo);
    }
  }
  setMapView(bool){
    this.setState({mapView: bool});
  }

  handleAddSpotGeo() {
    this.props.addSpot(this.map, this.props.id) //eventually pass in users default vehicle size
    // this.props.getMap(this);
  }

  render() {
    const { email, spots } = this.props;
    const { handleSpotTaken, setMapView, handleAddSpotGeo } = this;
    const { showNotification, mapView } = this.state;

    return (
      <div className="container">
        <h3>Welcome, {email}</h3>
        <div className="row">
          <div className="col-md-4">
            <button className="btn btn-default" onClick={handleSpotTaken}>Mark Spot Taken</button>
            <button className="btn btn-default" onClick={handleAddSpotGeo}>Open Spot Here</button>
            {
              showNotification.isShow && <p className="alert alert-warning">{showNotification.message}</p>
            }
          </div>
          <div className="col-md-4 col-md-offset-4">
            <button onClick={() => setMapView(true) } className="btn btn-default pull-right"><span className="glyphicon glyphicon-map-marker" /> Map</button>
            <button onClick={() => setMapView(false) } className="btn btn-default pull-right"><span className="glyphicon glyphicon-list" /> List</button>
          </div>
        </div>
        {mapView === true ? <Map /> : <List />}
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
