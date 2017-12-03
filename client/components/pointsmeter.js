import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

class PointMeter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPoints: props.points
    }
  }

  componentWillReceiveProps(nextProps) {
    const begin = this.props.points;
    const end = nextProps.points;
    d3.selectAll("rect").transition().duration(1500).ease(d3.easeLinear).tween("attr.scale", () => {
      // set interpolator
      const interpolator = d3.interpolateNumber(begin, end);
      return (t) => {
        const newNumber = interpolator(t);
        this.setState({ currentPoints: Math.floor(newNumber) });
      }
    })
  }


  render() {
    const { image, handleGoBack, notification } = this.props;
    const { currentPoints } = this.state;
    const maxWidth = document.getElementById("map").offsetWidth;
    const rectX = document.getElementById("map").offsetLeft;
    const meterWidth = maxWidth - rectX * 2;
    const height = 200;
    const verticalOffset = 10;
    const positionRatio = (currentPoints % 1000) / 1000;
    const rankCarWidth = 40;

    return (
      <div id="meter">
        <svg height={height} width={maxWidth}>
          <rect x="0" y={verticalOffset} height={height - verticalOffset} width={maxWidth} fill="rgba(51, 51, 51, 0.81)" rx="10" ry="10"></rect>
          <text x={rectX * 2} y="90px" fill="#00A0B0" fontSize="20px">
            {notification.length > 0 ? notification.split('!')[0] + '!' : ''}
          </text>
          <text x={rectX * 2} y="110px" fill="#00A0B0" fontSize="20px">
            {notification.length > 0 ? notification.split('!')[1].trim() + '!' : ''}
          </text>
          <image xlinkHref="/public/images/Parq_Logo.png" x={rectX} y="20px" width="100px" />
          <image onClick={handleGoBack} x={maxWidth - 60} y="20px" width="50px" xlinkHref="/public/images/arrows.png" />
          <rect rx="15" ry="15" x={rectX} y={height - 40} height="30px" width={meterWidth} fill="white" ></rect>
          <rect rx="15" ry="15" x={rectX} y={height - 40} height="30px" width={meterWidth * positionRatio} fill="#EDC951" ></rect>
          <image xlinkHref={image} x={positionRatio > 0.1 ? rectX + meterWidth * positionRatio - rankCarWidth : rectX} y={height - 40 - rankCarWidth} width={rankCarWidth} />
          <text x={positionRatio !== 0 ? rectX + meterWidth * positionRatio - rankCarWidth : rectX} y={height - 40 + 20} fill="white" fontSize="15px">{ positionRatio > 0.1 ? currentPoints : null}
          </text>
        </svg>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    image: state.user.rankCar,
    notification: state.notification
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleGoBack() {
      document.getElementById("meter").className = "animated slideOutLeft";
      setTimeout(function () { document.getElementById("meter").style.display = "none" }, 1000);
    }
  }
}


export default connect(mapState, mapDispatch)(PointMeter);
