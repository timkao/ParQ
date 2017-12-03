import React, { Component } from 'react';
import { connect } from 'react-redux';
import {filterSpots, getDrivingDistance, compareByDistance, createImgModal} from '../helpers';
import {longitude, latitude} from '../store';
import Moment from 'react-moment';

export class List extends Component{
  constructor(){
    super();
    this.state = {
      filteredSpotAndLotsWithDistance: []
    }
    this.createSpotsArray = this.createSpotsArray.bind(this);
    this.flyToSpot = this.flyToSpot.bind(this);
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
  componentDidUpdate(prevProps, prevState){
    console.log(prevProps, this.props.spots);
    for (var key in this.props.filter) {
      if (!prevProps.filter[key]){
      this.createSpotsArray();
      }
    }
    if (prevProps.spots.features.length !== this.props.spots.features.length || prevProps.lots.features.length !== this.props.lots.features.length){
      console.log('in func***********');
      this.createSpotsArray();
    }
  }
  flyToSpot(coor){
    this.props.map.flyTo({
      center: coor
    });
  }
  render(){
    const {filteredSpotAndLotsWithDistance} = this.state;
    const {flyToSpot} = this;

    return (

      <div id="list" className="animated slideInUp">
        <ul className="list-group" id="custom-list-group-styles">
          {filteredSpotAndLotsWithDistance.map(spot => {
            return (
              <li key={`${spot.place_name}-${spot.properties.id}`} className="list-group-item">
                <img src={spot.properties.sizeUrl || '/public/images/parkinglot.png'}></img>      <a onClick={() => {createImgModal(spot.properties.images[0])}}><span id="photo-badge" className="badge">See Photo</span></a>
                <h5 className="list-group-item-heading" ><a onClick={() => {flyToSpot(spot.geometry.coordinates)}}>{spot.place_name}</a></h5>
                <br />
                <p className="list-group-item-text">
                  Distance: <span className="badge">{spot.distanceFromOrigin.text}</span>
                  {'   '}
                  Reported: <span className="badge"><Moment fromNow>{spot.properties.createdAt}</Moment></span>

                </p>
              </li>
            );
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
    lots: state.lots,
    map: state.map
  };
};

const mapDispatch = null;


export default connect(mapState, mapDispatch)(List);
