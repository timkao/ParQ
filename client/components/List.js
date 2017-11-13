import React, { Component } from 'react';
import { connect } from 'react-redux';


export class List extends Component{
  constructor(){
    super();
  }
  render(){
    const {spots} = this.props;
    return (
      <div id="list">
        <ul className="list-group">
          {spots.features.map(spot => {
            return <li key={spot.properties.id} className="list-group-item">{spot.place_name}</li>;
          })}
        </ul>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    spots: state.streetspots,
  };
};

const mapDispatch = null;


export default connect(mapState, mapDispatch)(List);
