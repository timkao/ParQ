import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteSpotOnServer, updateSpotSize } from '../store';


export class ReportForm extends Component {

  constructor(){
    super()
    this.state = {sizeValue: 'full-size car'}
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(ev) {
    ev.preventDefault();
    this.setState({sizeValue: ev.target.value})
  }

  handleCancel(ev) {
    ev.preventDefault();
    const {cancelReportSpot, reportspot} = this.props;
    cancelReportSpot(reportspot.id);
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const { confirmReportSpot, reportspot} = this.props;
    confirmReportSpot(reportspot.id, this.state.sizeValue);
  }

  render() {
    const { handleChange, handleCancel, handleSubmit } = this;
    const { signs } = this.props;
    return (
      <div id="report-form">
        {
          signs.length > 0 &&
          <div>
            <div>Rules Around the Spot</div>
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
        <form onSubmit={handleSubmit}>
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
            <button>Report</button>
            <button onClick={handleCancel} type="button">Cancel</button>
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
    confirmReportSpot(id, size) {
      dispatch(updateSpotSize(id, size))
      .then( () => {
        ownProps.history.push('/home');
      })
    }
  }
}


export default connect(mapState, mapDispatch)(ReportForm);