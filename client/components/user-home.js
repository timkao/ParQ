import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { takeSpot, updateSpotsTaken, addSpotOnServer, getIsShow, updateUserPoints } from '../store';
import socket from '../socket';
import Map from './Map';
import List from './List';
import Filter from './Filter';
import { Route } from 'react-router-dom';
import reportForm from './report-form';
import PointsMeter from './pointsmeter';
import {Grid, Row, Col} from 'react-bootstrap';

export class UserHome extends Component {

  constructor() {
    super();
    this.state = {
      // currentLong: 0,  // this two might not be neccessary
      // currentLat: 0,   // this might not be neccessary
      showNotification: {isShow: false, message: ''},
      listView: false
    };
    this.handleSpotTaken = this.handleSpotTaken.bind(this);
    this.setListView = this.setListView.bind(this);
    this.triggerHandleAddSpotGeo = this.triggerHandleAddSpotGeo.bind(this);
    this.triggerHandleAddSpotMarker = this.triggerHandleAddSpotMarker.bind(this);
    this.handleTest = this.handleTest.bind(this);
  }

  triggerHandleAddSpotGeo() {
    //to trigger function in child component from parent using ref
    this.map.handleAddSpotGeo()
      .then(() => {
        this.props.toReportForm();
      });
  }

  triggerHandleAddSpotMarker() {
    //same as above
    this.map.handleAddSpotMarker()
      .then(() => {
        this.props.toReportForm();
      });
  }

  componentDidMount() {
    socket.on('notifications', message => {
      //this.props.showMeter();
      const meter = document.getElementById("meter");
      meter.className = "animated slideInRight";
      meter.style.display = "block";
      setTimeout(function () { this.props.gainedPoints() }.bind(this), 1000);

      // update point

      // this.setState({showNotification: {isShow: true, message: message}});
      // setTimeout(() => {
      //   this.setState({ showNotification: {isShow: false, message: ''}});
      // }, 4000);
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

  setListView(bool){
    this.setState({listView: bool});
}

  handleTest() {
    console.log('-----testing only-----');
    //this.props.showMeter();
    const meter = document.getElementById("meter");
    meter.className = "animated slideInRight";
    meter.style.display = "block";
    setTimeout(function () { this.props.gainedPoints(1) }.bind(this), 1000);
  }

  render() {
    const { email, points, isShow, map } = this.props;
    const { handleSpotTaken, setListView, triggerHandleAddSpotGeo, triggerHandleAddSpotMarker, handleTest } = this;
    const { listView } = this.state;
    return (
      <Grid>
        <Row id="map-view-settings" >
          <Col xs={4} sm={4}>
            {/*<button className="btn btn-default" onClick={handleSpotTaken}>Mark Spot Taken</button>*/}
            {/*<button className="btn btn-default" onClick={triggerHandleAddSpotGeo}>Open Spot Here</button>*/}
            {/*<button className="btn btn-default" onClick={triggerHandleAddSpotMarker}>Open Spot at Marker</button>*/}
            {/*<button className="btn btn-default" onClick={handleTest}>Test only</button>*/}
            {
              Object.keys(map).length > 0 ? <PointsMeter points={points} /> : null
            }
            <Filter />
          </Col>
          <Col xs={5} sm={4} className="pull-right">
            <div className="btn-toolbar">
              <button onClick={() => setListView(false) } className="btn btn-default map-view-settings-button btn-sm"><span className="glyphicon glyphicon-map-marker" /> Map</button>
              <button onClick={() => setListView(true) } className="btn btn-default map-view-settings-button btn-sm"><span className="glyphicon glyphicon-list" /> List</button>
            </div>
          </Col>
        </Row>
        <div>
          {listView === true ? <Map height={'40vh'} onRef={(ref) => {this.map = ref;}} /> : <Map onRef={(ref) => {this.map = ref;}} />}

          {listView === true ? <List /> : null}
        </div>
        <Route exact path='/home/reportForm' component={reportForm} />
      </Grid>
    );
  }
}

const mapState = (state) => {
  return {
    id: state.user.id,
    email: state.user.email,
    spotsTaken: state.user.spotsTaken,
    headingTo: state.headingTo,
    map: state.map,
    points: state.user.points,
    isShow: state.isShow
  };
};

const mapDispatch = (dispatch, ownProps) => {
  return {
    occupySpot(id, map) {
      const thunk = takeSpot(id, map);
      dispatch(thunk);
    },
    updateUserSpotsTaken(comp, spots) {
      dispatch(updateSpotsTaken())
        .then(() => {
          // comp.setState({
          //   showNotification: { isShow: true, message: `${spots} spot${spots > 1 ? 's' : ''} you reported ${spots > 1 ? 'are' : 'is'} taken! You earned ${spots * 100} points` }
          // });
          // setTimeout(() => {
          //   comp.setState({ showNotification: { isShow: false, message: '' } });
          // }, 4000);
          const meter = document.getElementById("meter");
          meter.className = "animated slideInRight";
          meter.style.display = "block";
          setTimeout(function () {dispatch(updateUserPoints(spots))}, 1000);
        })
    },
    createSpot(component, id) {
      dispatch(addSpotOnServer(component, id));
    },
    toReportForm() {
      ownProps.history.push('/home/reportForm');
    },
    showMeter() {
      dispatch(getIsShow(true));
    },
    gainedPoints(num) {
      dispatch(updateUserPoints(num));
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
