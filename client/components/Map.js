import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMap, addSpotOnServer } from '../store';
import Loader from 'react-loader';


export class Map extends Component {

  constructor() {
    super();
    this.state = {
      loaded: false,
    };
    this.handleAddSpotGeo = this.handleAddSpotGeo.bind(this);
  }

  componentDidMount() {
    this.props.getMap(this);
    this.props.onRef(this);
  }

  handleAddSpotGeo() {
    this.props.addSpot(this.map, this.props.id) //eventually pass in users default vehicle size
    // this.props.getMap(this);
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
    spots: state.streetspots
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
