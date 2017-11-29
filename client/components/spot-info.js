import React, { Component} from 'react';

// export const SpotInfo  = (props) => {
//     const {time} = props;
//     return ( <p>marker!{<span>`${time}`</span>}</p>)
// }

class SpotInfo extends Component {
  render(){
  const { place_name } = this.props;
    return ( <p>{place_name}stufffff</p>)
  }
}

export default SpotInfo
