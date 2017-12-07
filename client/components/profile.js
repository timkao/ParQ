import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hideProfile } from '../store';

const _Profile = (props) => {
  console.log("Checking user on profile component: ", props.user);
  const { user }  = props;
  const { hideProfile } = props;
  return (
    <div id="profile-all">
      <div className="animated lightSpeedIn" style = {{
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}>
        {/* profile image goes here */}
        <img
          src="/public/images/free-cute-puppy-pictures.jpg"
          alt= "Profile Photo"
          name="aboutme"
          style={{ width: "95%", borderRadius: "50%", paddingTop: "10px"}}
          className="img-circle"
        />
        <h3 className="media-heading" style={{color: "white"}}>
          {user.email.split("@")[0].toUpperCase()}
        </h3>
        {/* reward car imgage goes here */}
        <img style= {{width: "10%"}} src = {user.rankCar} alt="Rank Car"/>
        <span className="label label-primary"><strong>Rewards: </strong></span>
        <span className="label label-success">20</span>
        <span className="label label-info">Helped 20 persons find parkings</span>
        <br />
        <span className="label label-primary"><strong>Received Help: </strong></span>
        <span className="label label-warning">5</span>
        <span className="label label-info">5 persons helped Abraham find parking spot</span>
        <button onClick={hideProfile} className="btn btn-warning" style={{marginTop: "1em"}}>
          <img style={{width: "10%"}}src="https://image.flaticon.com/icons/svg/122/122631.svg" alt="Back to Map" />
          Back to Map
        </button>
      </div>
    </div>
  )
}

const mapState = (state) => {
  return {
    user: state.user,
  }
}
const mapDispatch = (dispatch, ownProps) => {
  return {
    hideProfile: ()=>{
      ownProps.history.push('/home');
      // dispatch(hideProfile(false));
    }
  }
}

export default connect(mapState, mapDispatch)(_Profile);
