import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteSpotOnServer, updateSpotSizeAndPic } from '../store';
import Dropzone from 'react-dropzone';

export class ReportForm extends Component {

  constructor() {
    super()
    this.state = {
      sizeValue: 'full-size car',
      isUpload: false,
      data_uri: '',
      filename: '',
      processing: false,
      pictures: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnDrop = this.handleOnDrop.bind(this);
    this.showUpload = this.showUpload.bind(this);
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
    const { signs, reportspot } = this.props;
    const uploadButton = isUpload ? 'Go Back' : 'Upload Picture (Optional)';

    return (
      <div id="report-form">
        {reportspot.mainStreet &&
          <div id="spot-description" className="spot-location">
            <div className="text-center">
              The Spot is on <strong>{reportspot.mainStreet}</strong>
            </div>
            <div className="text-center">
              Between <strong>{reportspot.crossStreet1}</strong> and <strong>{reportspot.crossStreet2}</strong>
            </div>
          </div>
        }
        {
          signs.length > 0 &&
          <div className="spot-location">
            <label>Rules Around the Spot</label>
            <ul className="list-group">
              {
                signs.map(sign => {
                  return (
                    <li key={sign.id} className="list-group-item">{sign.description}</li>
                  )
                })
              }
            </ul>
          </div>
        }
        <form onSubmit={handleSubmit} className="spot-location">
          <div className="form-group">
            <button className="form-control" onClick={showUpload} type="button">{uploadButton}</button>
            {
              isUpload &&
              <Dropzone id="drop-zone" disabled={processing} onDrop={handleOnDrop} style={{ width: "300px", height: "200px", borderWidth: "2px", borderColor: "rgb(102, 102, 102)", borderStyle: "dashed", borderRadius: "5px", margin: "auto", backgroundSize: "cover", backgroundImage: "url(/public/images/noimage.png)" }} activeStyle={{ width: "200px", height: "200px", borderWidth: "2px", borderColor: "#6c6", borderStyle: "solid", borderRadius: "5px", margin: "auto", backgroundColor: "#eee" }} >
                <p>Try dropping some files here, or click to select files to upload.</p>
              </Dropzone>
            }
          </div>
          <div className="form-group">
            <label htmlFor="size-choice">Space Size</label>
            <select name="size" onChange={handleChange} id="size-choice" className="form-control" value={this.state.sizeValue}>
              <option value='full-size SUV'>Full-Size (SUV)</option>
              <option value='full-size car'>Full-Size (CAR)</option>
              <option value='mid-size car'>Mid-Size (CAR)</option>
              <option value='compact car'>Small-Size (COMPACT)</option>
            </select>
          </div>
          <div className="form-group">
            <button className="form-control">Report (Spot location is accurate)</button>
            <button className="form-control">Report (Spot location is not accurate)</button>
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
    reportspot: state.reportspot
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
    }
  }
}


export default connect(mapState, mapDispatch)(ReportForm);
