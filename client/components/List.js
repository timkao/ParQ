import React, { Component } from 'react';
import { connect } from 'react-redux';
import {filterSpots, getDrivingDistance, compareByDistance} from '../helpers';
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
    let filteredSpotAndLotsWithDistance = filteredSpotsAndLots.map(spot => {
      const currentPosition = [longitude, latitude];
      return getDrivingDistance(currentPosition, spot.geometry.coordinates)
        .then(distanceObj => {
          spot.distanceFromOrigin = distanceObj;
          return spot;

        })
    });
      Promise.all(filteredSpotAndLotsWithDistance)
      .then((spotsArray) => {
        spotsArray.sort(compareByDistance);
        this.setState({filteredSpotAndLotsWithDistance: spotsArray});
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
            return <li key={`${spot.place_name}-${spot.properties.id}`} className="list-group-item">{spot.place_name}
             <br></br>Distance: {spot.distanceFromOrigin.text}{'   '}Reported: less than a minute ago</li>;
          })}
        </ul>
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
