import React, { Component } from 'react';
import { connect } from 'react-redux';
import {filterSpots, drivingDistance} from '../helpers';
import {longitude, latitude} from '../store';

export class List extends Component{
  constructor(){
    super();
    this.state = {
      filteredSpotAndLotsWithDistance: []
    }
    this.createSpotsArray = this.createSpotsArray.bind(this);
  }
  createSpotsArray(){
    const {spots, lots, filter} = this.props;
    let currentFilter = {};
    for (var key in filter){
      if (filter[key].length > 0 && key !== 'type'){
        currentFilter[key] = filter[key];
      }
    }

    let filteredSpots = filterSpots(currentFilter, spots.features);
    let filteredLots = filterSpots(currentFilter, lots.features);
    let filteredSpotsAndLots = [];
    if (filter.type.includes('Lot') || filter.type.length < 1 ){
      filteredSpotsAndLots.push(...filteredLots);
    }
    if (filter.type.includes('Street') || filter.type.length < 1 ){
      filteredSpotsAndLots.push(...filteredSpots);
    }
    // const test = [{coordinates: [-74.0373, 40.748328], place_name: 'BOOBOO', properties: {id: 1}}];
    let filteredSpotAndLotsWithDistance = filteredSpotsAndLots.map(spot => {
      return drivingDistance(longitude, latitude, spot.geometry.coordinates)
      .then( distance => {
        spot.distanceFromOrigin = distance;
        return spot;
      });
    });
    //funcs.reduce((prev, cur) => prev.then(cur), starting_promise);
    // filteredSpotAndLotsWithDistance.reduce((prevPromise, currPromise) =>
    //   prevPromise.then(currPromise));
    Promise.all(filteredSpotAndLotsWithDistance)
    .then( array => {
      this.setState({filteredSpotAndLotsWithDistance: array});
    });
  }
  componentWillMount(){
    this.createSpotsArray();
  }

  render(){
    const {filteredSpotAndLotsWithDistance} = this.state;

    return (

      <div id="list">
        <ul className="list-group">
          {filteredSpotAndLotsWithDistance.map(spot => {
            return <li key={`${spot.place_name}-${spot.properties.id}`} className="list-group-item">{spot.place_name} Distance: {spot.distanceFromOrigin}</li>;
          })}
        </ul>
        <div id="distance"></div>
      </div>

    );
  }
}

const mapState = (state) => {
  return {
    spots: state.streetspots,
    filter: state.filter,
    lots: state.lots
  };
};

const mapDispatch = null;


export default connect(mapState, mapDispatch)(List);
