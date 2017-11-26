import React, { Component } from 'react';
import { connect } from 'react-redux';
import {filterSpots} from '../helpers';


export class List extends Component{
  constructor(){
    super();
  }
  render(){
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
    return (
      <div id="list">
        <ul className="list-group">
          {filteredSpotsAndLots.map(spot => {
            return <li key={`${spot.place_name}-${spot.properties.id}`} className="list-group-item">{spot.place_name}</li>;
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
