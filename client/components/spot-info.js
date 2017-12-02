import React, { Component} from 'react';
import Moment from 'react-moment';
import 'moment-timezone';

class SpotInfo extends Component {
  render(){
  const { spot, handleTakeSpot } = this.props;
  const { createdAt } = spot.properties

  return (
       <div>
         <div>
          <strong>Reported</strong><br/>
          <span className="time"><Moment fromNow>{createdAt}</Moment></span>
          </div>
          <div className="spot-actions">
          <button className="spot-btn-nav" onClick={handleTakeSpot}>NAVIGATE TO</button>
          <button className="spot-btn-take" onClick={handleTakeSpot}>TAKE SPOT</button>
          </div>
       </div>
    )
  }
}

export default SpotInfo
