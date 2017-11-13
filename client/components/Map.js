import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMap } from '../store';
import Loader from 'react-loader';


export class Map extends Component {

  constructor() {
    super();
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    this.props.getMap(this);
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
    spots: state.streetspots,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getMap(component) {
      const thunk = fetchMap(component);
      dispatch(thunk);
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
