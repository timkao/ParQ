import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteSpotOnServer, updateSpotSizeAndPic, updateUserPoints, getNotification } from '../store';
import Dropzone from 'react-dropzone';
import {getUserLocation} from '../helpers';
import socket from '../socket';

export class ReportForm extends Component {

  constructor() {
    super()
    this.state = {
      sizeValue: 'full-size car',
      isUpload: false,
      processing: false,
      pictures: [],
      meterWidth: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnDrop = this.handleOnDrop.bind(this);
    this.showUpload = this.showUpload.bind(this);
  }

  componentDidMount() {
    // position popup base on Map element
    const mapElement = document.getElementById("map");
    const reportFormElement = document.getElementById("report-form");
    const offset = 7;
    // const ctrlTop = document.getElementsByClassName("mapboxgl-ctrl-top-left")[0].offsetHeight;
    const formLeft = mapElement.offsetLeft + offset;
    const formTop = mapElement.offsetTop + offset;
    const maxWidth = mapElement.offsetWidth - offset - 5;
    reportFormElement.style.top = `${formTop}px`;
    reportFormElement.style.left = `${formLeft}px`;
    reportFormElement.style.maxWidth = `${maxWidth}px`;
  }

  handleChange(ev) {
    ev.preventDefault();
    this.setState({ sizeValue: ev.target.value })
  }

  handleCancel(ev) {
    ev.preventDefault();
    const { cancelReportSpot, reportspot } = this.props;
    cancelReportSpot(reportspot.id);
  }

  handleSubmit(ev) {
    ev.preventDefault();
    // get user location
    // get spot location
    // calculate distance
    // validate WIP

    this.setState({ processing: true });
    const { confirmReportSpot, reportspot } = this.props;
    const { sizeValue, pictures } = this.state;
    if (pictures.length > 0) {
      confirmReportSpot(reportspot.id, sizeValue, pictures);
    } else {
      confirmReportSpot(reportspot.id, sizeValue);
    }
  }

  showUpload(ev) {
    ev.preventDefault();
    const currentStat = this.state.isUpload;
    if (currentStat) {
      this.setState({ isUpload: !currentStat, picturess: [] });
    } else {
      this.setState({ isUpload: !currentStat });
    }
  }

  handleOnDrop(files) {
    files.map(function (file) {
      const reader = new FileReader();
      reader.onload = (upload) => {
        const uploadedFile = {
          data_uri: upload.target.result,
          filename: file.name,
          filetype: file.type
        }
        document.getElementById('drop-zone').style.backgroundImage = `url(${reader.result})`;
        this.setState(prevState => ({ pictures: [...prevState.pictures, uploadedFile] }))
      };
      reader.readAsDataURL(file);
    }, this);
  }

  render() {
    const { handleChange, handleCancel, handleSubmit, showUpload, handleOnDrop } = this;
    const { isUpload, processing } = this.state;
    const { signs, reportspot, createRulesList } = this.props;
    const uploadButton = isUpload ? 'Go Back' : 'Upload Picture (Optional)';
    const { sideGroup, sideA, sideB, fromStreetA, gotoStreetA, fromStreetB, gotoStreetB } = createRulesList(signs);

    return (
      <div id="report-form">
        {reportspot.mainStreet &&
          <div id="spot-description" className="spot-location">
            <div className="text-center">
              on <strong>{reportspot.mainStreet}</strong>
            </div>
            <div className="text-center">
              between <strong>{reportspot.crossStreet1}</strong> and <strong>{reportspot.crossStreet2}</strong>
            </div>
          </div>
        }
        {
          !isUpload && sideA !== '' &&
          <div className="spot-location">
            <div className="row">
              <div className="col-xs-10">Rules from <strong>{fromStreetA}</strong> to <strong>{gotoStreetA}</strong>
              </div>

                <div className="col-xs-2">{sideA == 'undefined' ? '' : sideA}</div>

            </div>
            <ul className="list-group rule-list">
              {
                sideGroup[sideA].map(sign => {
                  return (
                    <li key={sign.id} className="list-group-item">
                      <div>{sign.description} <span className="pull-right" style={{ color: `${sign.color}` }}>{`${sign.distance}ft`}</span></div>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        }
        {
          !isUpload && sideB !== '' &&
          <div className="spot-location">
            <div className="row">
              <div className="col-xs-10">Rules from <strong>{fromStreetB}</strong> to <strong>{gotoStreetB}</strong>
              </div>

                <div className="col-xs-2">{sideB == 'undefined' ? '' : sideB}</div>

            </div>
            <ul className="list-group rule-list">
              {
                sideGroup[sideB].map(sign => {
                  return (
                    <li key={sign.id} className="list-group-item">
                      <div>{sign.description} <span className="pull-right" style={{ color: `${sign.color}` }}>{`${sign.distance}ft`}</span></div>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        }
        <form onSubmit={handleSubmit} className="spot-location">
          <div className="form-group">
            <button id="upload-button" className="form-control" onClick={showUpload} type="button">{uploadButton}</button>
            {
              isUpload &&
              <div className="animated flipInY">
                <Dropzone id="drop-zone" disabled={processing} onDrop={handleOnDrop} style={{ width: "350px", height: "200px", borderWidth: "2px", borderColor: "rgb(102, 102, 102)", borderStyle: "dashed", borderRadius: "5px", margin: "auto", backgroundSize: "contain", backgroundImage: "url(/public/images/noimage.png)", backgroundRepeat: "no-repeat", backgroundPosition: "center" }} activeStyle={{ width: "200px", height: "200px", borderWidth: "2px", borderColor: "#6c6", borderStyle: "solid", borderRadius: "5px", margin: "auto", backgroundColor: "#eee" }} >
                </Dropzone>
                <div className="text-center">Drop Picture in the box, or click to select pictures to upload.</div>
              </div>
            }
          </div>
          <div className="form-group">
            <div>Space Size</div>
            <select name="size" onChange={handleChange} id="size-choice" className="form-control" value={this.state.sizeValue}>
              <option value='full-size SUV'>Full-Size (SUV)</option>
              <option value='full-size car'>Full-Size (CAR)</option>
              <option value='mid-size car'>Mid-Size (CAR)</option>
              <option value='compact car'>Small-Size (COMPACT)</option>
            </select>
          </div>
          <div className="form-group">
            <button className="form-control">Report</button>
            <button className="form-control" onClick={handleCancel} type="button">Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    signs: state.signs,
    reportspot: state.reportspot,
    spotLongitude: state.spotLngLat,
    spotLatitude: state.spotLatitude
  }
};

const mapDispatch = (dispatch, ownProps) => {
  return {
    cancelReportSpot(id) {
      dispatch(deleteSpotOnServer(id))
        .then(() => {
          ownProps.history.push('/home');
        })
    },
    confirmReportSpot(id, size, pictures) {
      dispatch(updateSpotSizeAndPic(id, size, pictures))
        .then(() => {
          ownProps.history.push('/home');
        })
        .then(() => {
          const meter = document.getElementById("meter");
          meter.className = "animated slideInRight";
          meter.style.display = "block";
          dispatch(getNotification('Thanks for Reporting a Space! You got 50 points!'))
          setTimeout(function () {dispatch(updateUserPoints(0.5))}, 1000);
          socket.emit('new-spot-reported');
        })
    },
    createRulesList(signs) {
      const sideGroup = {};
      const colorArray = ['#00A0B0', '#6A4A3C', '#EB6841',
        '#EDC951', '#794371', '#5CD841', '#5B739C'];
      let colorIndex = 0;
      let sideA = '';
      let fromStreetA, gotoStreetA, fromStreetB, gotoStreetB;
      let sideB = '';
      signs.forEach((sign, index) => {
        // make the description more readable
        sign.description = sign.description
          .replace(/ *\([^)]*\) */g, "")
          .replace(/>/g, " ")
          .replace(/</g, " ")
          .replace(/-/g, " ")

        // grouping the signs with same distance by colors
        if (index === 0) {
          sign.color = colorArray[colorIndex];
        } else if (signs[index - 1].distance !== sign.distance) {
          colorIndex++
          sign.color = colorArray[colorIndex];
        } else {
          sign.color = colorArray[colorIndex];
        }

        if (sideGroup[sign.side]) {
          sideGroup[sign.side].push(sign);
        } else {
          sideGroup[sign.side] = [sign];
        }
      })
      const groupkey = Object.keys(sideGroup);
      if (groupkey.length === 1) {
        sideA = groupkey[0];
        fromStreetA = sideGroup[sideA][0].fromStreet;
        gotoStreetA = sideGroup[sideA][0].gotoStreet;
      } else if (groupkey.length === 2) {
        sideA = groupkey[0];
        fromStreetA = sideGroup[sideA][0].fromStreet;
        gotoStreetA = sideGroup[sideA][0].gotoStreet;
        sideB = groupkey[1];
        fromStreetB = sideGroup[sideB][0].fromStreet;
        gotoStreetB = sideGroup[sideB][0].gotoStreet;
      }
      return { sideGroup, sideA, sideB, fromStreetA, gotoStreetA, fromStreetB, gotoStreetB };
    }
  }
}


export default connect(mapState, mapDispatch)(ReportForm);
