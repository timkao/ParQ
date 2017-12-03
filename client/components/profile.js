import React, { Component } from 'react';
import { connect } from 'react-redux';

const _Profile = (props) => {
  console.log("Checking user on profile component: ", props.user);
  return (
    <div id="profile-all">
      <div className="animated lightSpeedIn" style = {{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}>
        {/* profile image goes here */}
        <img
          src="../../public/images/free-cute-puppy-pictures.jpg"
          alt= "Profile Photo"
          name="aboutme"
          style={{ width: "80%", borderRadius: "50%"}}
          className="img-circle"
        />
        <h3 className="media-heading" style={{color: "white"}}>Abraham</h3>
        {/* reward car imgage goes here */}
        <img src = "../../public/images/bigcar.png" />
        <span className="label label-primary"><strong>Rewards: </strong></span>
        <span className="label label-success">20</span>
        <span className="label label-info">Helped 20 persons find parkings</span>
        <br />
        <span className="label label-primary"><strong>Recieved Help: </strong></span>
        <span className="label label-warning">5</span>
        <span className="label label-info">5 persons helped Abraham find parking spot</span>
      </div>
    </div>
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