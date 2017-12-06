import React, { Component} from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
import { createImgModal } from '../helpers';

class SpotInfo extends Component {
  render(){
  const { spot, handleTakeSpot, handleNavigate } = this.props;
  const { images, createdAt } = spot.properties;
  const imgSrc = images[0] || null;

  return (
       <div>
         <div>
          <strong>Reported</strong><br />
          <span className="time"><Moment fromNow>{createdAt}</Moment></span>
          </div>
          <div className="spot-actions">
            <button className="spot-btn-img" onClick={() => createImgModal(imgSrc)}><span className="glyphicon glyphicon-picture" aria-hidden="true" />SEE IMAGE</button>
            <button className="spot-btn-nav" onClick={handleNavigate}><span className="glyphicon glyphicon-road" aria-hidden="true" />NAVIGATE TO</button>
          </div>
          <div className="spot-actions">
            <button className="spot-btn-take" onClick={handleTakeSpot}><span className="glyphicon glyphicon-thumbs-up" aria-hidden="true" />TAKE SPOT</button>
          </div>
       </div>
    )
  }
}

export default SpotInfo
