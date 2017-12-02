import React, { Component } from 'react';
import { connect } from 'react-redux';

const _Profile = (props) => {
  console.log("Checking user on profile component: ", props.user);
  return (
    <div style = {{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center"
    }}>
      <img
        src="../../public/images/free-cute-puppy-pictures.jpg"
        alt= "Profile Photo"
        name="aboutme"
        style={{ width: "95%", borderRadius: "50%"}}
        className="img-circle"
      />
      <h3 className="media-heading" style={{color: "white"}}>Abraham</h3>
      <img src = "../../public/images/bigcar.png" />
      <span className="label label-primary"><strong>Rewards: </strong></span>
      <span className="label label-success">20</span>
      <span className="label label-info">Helped 20 persons find parkings</span>
      <br />
      <span className="label label-primary"><strong>Recieved Help: </strong></span>
      <span className="label label-warning">5</span>
      <span className="label label-info">5 persons helped Abraham find parking spot</span>
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
// image-responsive
// src="https://vignette.wikia.nocookie.net/animal-jam-clans-1/images/7/71/B18831f96720e907c4769168687d7fd1--cat-lovers-adorable-animals.jpg/revision/latest?cb=20170803164432"
// src="https://assets-cdn.github.com/images/modules/open_graph/github-mark.png"
// src="https://vignette.wikia.nocookie.net/animal-jam-clans-1/images/7/71/B18831f96720e907c4769168687d7fd1--cat-lovers-adorable-animals.jpg/revision/latest?cb=20170803164432"