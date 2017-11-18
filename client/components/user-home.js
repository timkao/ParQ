import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { takeSpot, updateSpotsTaken, addSpotOnServer } from '../store';
import socket from '../socket';
import Map from './Map';
import List from './List';

export class UserHome extends Component {

  constructor() {
    super();
    this.state = {
      currentLong: 0,  // this two might not be neccessary
      currentLat: 0,   // this might not be neccessary
      showNotification: {isShow: false, message: ''},
      mapView: true
    };
    this.handleSpotTaken = this.handleSpotTaken.bind(this);
    this.setMapView = this.setMapView.bind(this);
    this.triggerHandleAddSpotGeo = this.triggerHandleAddSpotGeo.bind(this);
    this.triggerHandleAddSpotMarker = this.triggerHandleAddSpotMarker.bind(this);
  }
  triggerHandleAddSpotGeo() {
    //to trigger function in child component from parent using ref
    this.map.handleAddSpotGeo();
  }

  triggerHandleAddSpotMarker(){
    //same as above
    this.map.handleAddSpotMarker();
  }

  componentDidMount() {
    socket.on('notifications', message => {
      this.setState({showNotification: {isShow: true, message: message}});
      setTimeout(() => {
        this.setState({ showNotification: {isShow: false, message: ''}});
      }, 4000);
    });
  }

  componentDidUpdate() {
    const spotsTaken = this.props.spotsTaken;
    if (spotsTaken > 0) {
      this.props.updateUserSpotsTaken(this, spotsTaken)
    }
  }

  handleSpotTaken() {
    if (this.props.headingTo) {
      this.props.occupySpot(this.props.headingTo, this.props.map);
    }
  }

  setMapView(bool){
    this.setState({mapView: bool});
  }

  render() {
    const { email } = this.props;
    const { handleSpotTaken, setMapView, triggerHandleAddSpotGeo, triggerHandleAddSpotMarker } = this;
    const { showNotification, mapView } = this.state;
    return (
      <div className="container">
        <h3>Welcome, {email}</h3>
        <div className="row">
          <div className="col-md-4">
            <button className="btn btn-default" onClick={handleSpotTaken}>Mark Spot Taken</button>
            <button className="btn btn-default" onClick={triggerHandleAddSpotGeo}>Open Spot Here</button>
            <button className="btn btn-default" onClick={triggerHandleAddSpotMarker}>Open Spot at Marker</button>
            {
              showNotification.isShow && <p className="alert alert-warning">{showNotification.message}</p>
            }
          </div>
          <div className="col-md-4 col-md-offset-4">
            <button onClick={() => setMapView(true) } className="btn btn-default pull-right"><span className="glyphicon glyphicon-map-marker" /> Map</button>
            <button onClick={() => setMapView(false) } className="btn btn-default pull-right"><span className="glyphicon glyphicon-list" /> List</button>
          </div>
        </div>
        {mapView === true ? <Map onRef={(ref) => {this.map = ref; }} /> : <List />}
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    id: state.user.id,
    email: state.user.email,
    spotsTaken: state.user.spotsTaken,
    headingTo: state.headingTo,
    map: state.map
  };
};

const mapDispatch = (dispatch) => {
  return {
    occupySpot(id, map) {
      const thunk = takeSpot(id, map);
      dispatch(thunk);
    },
    updateUserSpotsTaken() {
      dispatch(updateSpotsTaken());
    },
    createSpot(component, id){
      dispatch(addSpotOnServer(component, id));
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
