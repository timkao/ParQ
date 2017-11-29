import React, { Component} from 'react';
import Moment from 'react-moment';
import 'moment-timezone';

class SpotInfo extends Component {
  render(){
  const { spot } = this.props;
  const { createdAt } = spot.properties

  return (
       <div className="">
        <strong>Reported: </strong>
        <Moment fromNow>{createdAt}</Moment>
       </div>
    )
  }
}

export default SpotInfo
