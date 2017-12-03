import React, { Component } from 'react';

class LotInfo extends Component {
  render(){
  const { lot, handleNavigate } = this.props;
  const { spotsAvailable } = lot.properties;
  return (
   <div>
     <div>
      <span className={ spotsAvailable ? "lot-available" : "lot-full" }>
        {
          spotsAvailable
          ? "Spots Available"
          : "Lot Full"
        }
       </span>
      </div>
      <div className="lot-actions">
      <button className="lot-btn-nav" onClick={handleNavigate}>NAVIGATE TO</button>
      </div>
   </div>)
  }
}

export default LotInfo
