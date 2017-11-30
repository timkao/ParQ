import React, { Component} from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
import { timer, timeSince } from '../helpers';

class SpotInfo extends Component {
  render(){
  const { spot, handleTakeSpot } = this.props;
  const { createdAt } = spot.properties

  return (
       <div>
        <strong>Reported</strong><br/>
        <span className="time"><Moment fromNow>{createdAt}</Moment></span>
        <button onClick={handleTakeSpot}>Add</button>
       </div>
    )
  }
}

export default SpotInfo
