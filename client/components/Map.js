import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMap, addSpotOnServer, fetchSpots } from '../store';
import Loader from 'react-loader';
import socket from '../socket';

export class Map extends Component {

  constructor() {
    super();
    this.state = {
      loaded: false,
    };
    this.handleAddSpotGeo = this.handleAddSpotGeo.bind(this);
    this.renewSpotsWihMap = this.renewSpotsWihMap.bind(this);
  }

  componentDidMount() {
    this.props.getMap(this);
    this.props.onRef(this);
    socket.on('A Spot Taken', () => {
      this.renewSpotsWihMap();
    })
  }

  handleAddSpotGeo() {
    this.props.addSpot(this.map, this.props.id) //eventually pass in users default vehicle size
    // this.props.getMap(this);
  }

  renewSpotsWihMap() {
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
