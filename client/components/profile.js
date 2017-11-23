import React, { Component } from 'react';
import { connect } from 'react-redux';

const _Profile = (props) => {
  console.log("Checking user on profile component: ", props.user);
  return (
    <center>
      <img
        src="https://vignette.wikia.nocookie.net/animal-jam-clans-1/images/7/71/B18831f96720e907c4769168687d7fd1--cat-lovers-adorable-animals.jpg/revision/latest?cb=20170803164432"
        alt= "Profile Photo"
        name="aboutme"
        style={{ width: "40%", border: "1px solid" }}
        className="img-circle image-responsive"
      />
      <h3 className="media-heading">Abraham</h3>
      <span><strong>Rewards: </strong></span>
      <span className="label label-success">20</span>
      <span className="label label-info">Helped 20 persons find parkings</span>
      <br />
      <span><strong>Recieved Help: </strong></span>
      <span className="label label-warning">5</span>
      <span className="label label-info">5 persons helped Abraham find parking spot</span>
    </center>
  )
}

const mapState = (state) => {
  return {
    user: state.user
  }
}
const mapDispatch = (dispatch, ownProps) => {
  return {

  }
}

export default connect(mapState, mapDispatch)(_Profile);
