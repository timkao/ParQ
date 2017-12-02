import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMap, addSpotOnServerGeo, addSpotOnServerMarker, fetchSpots, getHeadingTo, mapDirection, longitude, latitude, takeSpot } from '../store';
import Loader from 'react-loader';
import socket from '../socket';
import mapboxgl from 'mapbox-gl';
import {filterSpots, timeSince} from '../helpers';
import SpotInfo from './spot-info';


export class Map extends Component {

  constructor() {
    super();
    this.state = {
      loaded: false,
    };
    this.handleAddSpotGeo = this.handleAddSpotGeo.bind(this);
    this.renewSpotsWithMap = this.renewSpotsWithMap.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this);
    this.props.getMap(this);
    socket.on('A Spot Taken', () => {
      this.renewSpotsWithMap();
    });
    socket.on('A New Spot', () => {
      this.renewSpotsWithMap();
    })
    socket.on('Update Spots', ()=> {
      this.renewSpotsWithMap();
    })

    //Removes class from body node (outside of our React app)
    //to remove body defined background image
    document.body.classList.toggle('login-body', false)
  }

  componentDidUpdate(prevProps, prevState){
    const { spots, map, headTo, lots, filter, occupySpot} = this.props;
    // remove existing marker (we can optimize it later)
    if (this.state.loaded === true && spots.features){
      const currentMarkers = document.getElementsByClassName('marker');
      const currentLots = document.getElementsByClassName('lot');
      while (currentMarkers.length > 0 ) {
        currentMarkers[0].remove();
      }
      while (currentLots.length > 0) {
        currentLots[0].remove();
      }
      let currentFilter = {};
      for (var key in filter){
        if (filter[key].length > 0 && key !== 'type'){
          currentFilter[key] = filter[key];
        }
      }

    let filteredSpots = filterSpots(currentFilter, spots.features);
    let filteredLots = filterSpots(currentFilter, lots.features);

      //Create a source & layer from our streetspots
      //Check to see if source & layer exist from inital load
      map.on('load', function(){
        let exists = map.getSource('streetspots')
        if (exists) {
          //Source exists, eenewing the data
          map.getSource('streetspots').setData(spots)
        } else {
          map.addSource('streetspots', {
              "type": "geojson",
              "data": spots
            })
            //Add a layer on the map
            map.addLayer({
              id: 'streetspots',
              type: 'symbol',
              // Add a GeoJSON source containing place coordinates and information.
              source: "streetspots"
            });
        }
      })

      /* Streetspot Marker + Popup ================= */
      if (filter.type.includes('Street') || filter.type.length < 1 ){
        spots.features &&
        filteredSpots.forEach(function(spot) {
            // create the marker element
            var el = document.createElement('div');
            el.className = 'marker';
            // add picture base on car size
            el.style.backgroundImage = `url(${spot.properties.sizeUrl})`;

            //create the popup element
            var pop = document.createElement('div');
            //Find out how fresh the spot is and apply appropriate background color
            timeSince(spot.properties.createdAt, 'min') < 10
              ? pop.className = 'spot-popup fresh'
              : pop.className = 'spot-popup rotten'

            //Turn our popup element into a react component
            //First we create functions for the btns to
            //interact with map
            //we should clean these up and move them in future
            const handleNavigate = () => {
              headTo(spot.properties.id);
              mapDirection.setOrigin([longitude, latitude]);
              mapDirection.setDestination(spot.geometry.coordinates);
            }
            const handleTakeSpot = () => {
              occupySpot(spot.properties.id, map)
            }
            //Crreate a props object to pass into React.createElement
            let props = { spot, map, handleTakeSpot, handleNavigate }
            ReactDOM.render(
              React.createElement(
                SpotInfo, props//passes in spot info as props to the spont component
              ),
              pop
            );

            // create the popup for mapbox
            var popup = new mapboxgl.Popup()
            .setDOMContent(pop);
            // create the marker for mapbox and set out popup on it
            new mapboxgl.Marker(el)
            .setLngLat(spot.geometry.coordinates)
            .setPopup(popup) // sets a popup on this marker
            .addTo(map);
          });
      }

      if (filter.type.includes('Lot') || filter.type.length < 1 ){
        lots.features && filteredLots.forEach(function(lot) {
          // create the marker element
          var el = document.createElement('div');
          el.className = 'lot';
          // add event listener
          el.addEventListener('click', () => {
            headTo(lot.properties.id);
            mapDirection.setOrigin([longitude, latitude]);
            mapDirection.setDestination(lot.geometry.coordinates);
          });
          // create the popup
          var popup = new mapboxgl.Popup()
          .setHTML(`<div>${lot.place_name}</div>`);
          //create the marker
          new mapboxgl.Marker(el)
          .setLngLat(lot.geometry.coordinates)
          .setPopup(popup) // sets a popup on this marker
          .addTo(map);
        });
      }
      const getUserLocationBtn = document.getElementsByClassName('mapboxgl-ctrl-geolocate')[0];
      if (this.state.loaded){
        if (getUserLocationBtn.getAttribute('aria-pressed') === 'false'){
        getUserLocationBtn.click();
        }
      }
    }
  }

  componentWillUnmount(){
    //Brings back our full-page login background image
    document.body.classList.toggle('login-body', true)
  }

  componentWillUnmount(){
    //Brings back our full-page login background image
    document.body.classList.toggle('login-body', true)
  }

  handleAddSpotGeo() {
    return this.props.addSpotGeo(this.map, this.props.id, null) //eventually pass in users default vehicle size
    // this.props.getMap(this);
  }

  handleAddSpotMarker(){
    //location of marker is returned by the .getSource function below
    this.setState({loaded: false});
    let spot = {
      longitude: this.map.getSource('createdPoint')._data.features[0].geometry.coordinates[0],
      latitude: this.map.getSource('createdPoint')._data.features[0].geometry.coordinates[1],
    }
    return this.props.addSpotMarker(this.map, this.props.id, null, spot)
    .then( () => {
      //Remove click marker once created
      let marker = this.map.getStyle().layers.find((layer) => layer.id === 'createdPoint')
      this.map.removeLayer(marker.id)
      this.map.removeSource(marker.id)
      //Update state
      this.setState({loaded: true});
    }) //eventually pass in users default vehicle size
    // this.props.getMap(this);
  }

  renewSpotsWithMap() {
    const { renewSpots, map } = this.props;
    renewSpots(map);
  }

  render() {
    const {height} = this.props;
    return (
      <div id="map" style={ height ? {height: height} : null}>
        <Loader loaded={this.state.loaded} className="loader" />
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    id: state.user.id,
    spots: state.streetspots,
    map: state.map,
    lots: state.lots,
    filter: state.filter
  };
};

const mapDispatch = (dispatch) => {
  return {
    getMap(component) {
      const thunk = fetchMap(component);
      dispatch(thunk);
    },
    addSpotGeo(component, id){
      // add return for promise chain
      return dispatch(addSpotOnServerGeo(component, id));
    },
    addSpotMarker(component, id, defaultVehicle, spot){
      // add return for promise chain
      return dispatch(addSpotOnServerMarker(component, id, defaultVehicle, spot))
    },
    renewSpots() {
      dispatch(fetchSpots());
    },
    headTo(spotId){
      dispatch(getHeadingTo(spotId));
    },
    occupySpot(id, map) {
      const thunk = takeSpot(id, map);
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
