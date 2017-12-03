import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchMap, addSpotOnServerGeo, addSpotOnServerMarker, fetchSpots, getHeadingTo, mapDirection, longitude, latitude, takeSpot } from '../store';
import Loader from 'react-loader';
import socket from '../socket';
import mapboxgl from 'mapbox-gl';
import {filterSpots, timeSince, exitBtnCreator, reportSpotBtnCreator, setClasses} from '../helpers';
import SpotInfo from './spot-info';
import reportForm from './report-form';
import LotInfo from './lot-info';


export class Map extends Component {

  constructor() {
    super();
    this.state = {
      loaded: false,
      menuToggle: false
    };
    this.handleAddSpotGeo = this.handleAddSpotGeo.bind(this);
    this.handleAddSpotMarker = this.handleAddSpotMarker.bind(this);
    this.renewSpotsWithMap = this.renewSpotsWithMap.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
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
    document.getElementById('background-image').classList.toggle('blur', true)
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
        //Create exit directions button. See helpers file for more detail
        exitBtnCreator();
        //Create marker creator buttons. See helpers file for more detail
        reportSpotBtnCreator(this.toggleMenu, this.handleAddSpotGeo, this.handleAddSpotMarker);
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
            // create the popup for mapbox
            var popup = new mapboxgl.Popup()
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
              popup.remove();
               //shows exit button by toggling hidden class
              document.querySelector('.directions-btn-exit').classList.toggle('hidden');
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

            //Set react component on/as popup
            popup.setDOMContent(pop);
            //create the marker for mapbox and set out popup on it
            new mapboxgl.Marker(el)
            .setLngLat(spot.geometry.coordinates)
            .setPopup(popup) // sets a popup on this marker
            .addTo(map);
          });
      }

      /* Lot Marker + Popup ================================= */
      if (filter.type.includes('Lot') || filter.type.length < 1 ){
        lots.features && filteredLots.forEach(function(lot) {
          // create the marker element
          var el = document.createElement('div');
          el.className = 'lot';

          // create the popup element
          var pop = document.createElement('div');
          // create the popup for mapbox
          var popup = new mapboxgl.Popup()
          //Find out if lot has open spots or not
          lot.properties.spotsAvailable
            ? pop.className = 'lot-popup fresh'
            : pop.className = 'lot-popup rotten'

          //Turn our popup element into a react component
          //First we create functions for the btns to
          //interact with map
          //we should clean these up and move them in future
          const handleNavigate = () => {
            headTo(lot.properties.id);
            mapDirection.setOrigin([longitude, latitude]);
            mapDirection.setDestination(lot.geometry.coordinates);
            popup.remove();
             //shows exit button by toggling hidden class
            document.querySelector('.directions-btn-exit').classList.toggle('hidden');
          }
            //Create a props object to pass into React.createElement
            let props = { lot, map, handleNavigate }
            ReactDOM.render(
              React.createElement(
                LotInfo, props//passes in spot info as props to the spont component
              ),
              pop
            );

          //Set react component on/as popup
          popup.setDOMContent(pop);
          //create the marker for mapbox and set out popup on it
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
    document.getElementById('background-image').classList.toggle('blur', false)
  }

  handleAddSpotGeo() {
    return this.props.addSpotGeo(this.map, this.props.id, null)
    .then( () => this.props.toReportForm()) //eventually pass in users default vehicle size
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
    .then( () => this.props.toReportForm())
    // this.props.getMap(this);
  }

  renewSpotsWithMap() {
    const { renewSpots, map } = this.props;
    renewSpots(map);
  }
  toggleMenu(){
    this.setState({menuToggle: !this.state.menuToggle}, function(){
    });
    setClasses(this.state.menuToggle);

  }

  render() {
    const {height} = this.props;
    return (
      <div id="map" style={ height ? {height: height} : null}>
        <Loader loaded={this.state.loaded} className="loader" />
        {/* <Route exact path='/home/reportForm' component={reportForm} /> */}
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

const mapDispatch = (dispatch, ownProps) => {
  return {
    getMap(component) {
      const thunk = fetchMap(component);
      dispatch(thunk);
    },
    addSpotGeo(component, id){
      console.log('bout to dispatch')
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
    },
    toReportForm() {
      ownProps.history.push('/home/reportForm');
    }
  };
};

export default withRouter(connect(mapState, mapDispatch)(Map));

/**
 * PROP TYPES
 */
Map.propTypes = {
  email: PropTypes.string
};
