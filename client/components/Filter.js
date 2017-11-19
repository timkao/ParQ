import React, { Component } from 'react';
import { connect } from 'react-redux';
import {DropdownButton, MenuItem, ButtonGroup, ToggleButtonGroup, ToggleButton, Button} from 'react-bootstrap';

export class Filter extends Component {
  constructor() {
    super();
    this.state = {
      distance: [],
      timeAvailable: [],
      size: [],
      type: []
    };
    this.handleClickClear = this.handleClickClear.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  onChange(name, value){
    this.setState({[name]: value});
  }
  handleClickClear(){
    console.log('clicked');
  }

  render() {
    const { handleClickClear, onChange } = this;
    const {distance, timeAvailable, size, type} = this.state;
    return (
      <DropdownButton id="filter" title={<span className="glyphicon glyphicon-filter" />}>
        <MenuItem header>
          <h5>Distance <small name="distance" onClick={handleClickClear}><a>clear</a></small></h5>
          <ToggleButtonGroup name="distance" value={distance} onChange={(value) => onChange('distance', value)} type="checkbox" className="btn-group-sm">
            <ToggleButton value="<1mi" className="btn btn-default">{'< 1 mi'}</ToggleButton>
            <ToggleButton value="<3mi" className="btn btn-default">{'< 3 mi'}</ToggleButton>
          </ToggleButtonGroup>
        </MenuItem>
        <MenuItem divider />
        <MenuItem header >
        <h5>Time Available <small onClick={handleClickClear}><a>clear</a></small></h5>
          <ToggleButtonGroup value={timeAvailable} onChange={(value) => onChange('timeAvailable', value)} type="checkbox" className="btn-group-sm">
            <ToggleButton value="<5min" className="btn btn-default">{'< 5 min'}</ToggleButton>
            <ToggleButton value="<15min" className="btn btn-default">{'< 15 min'}</ToggleButton>
          </ToggleButtonGroup>
        </MenuItem>
        <MenuItem divider />
        <MenuItem header >
        <h5>Size <small onClick={handleClickClear}><a>clear</a></small></h5>
          <ToggleButtonGroup value={size} onChange={(value) => onChange('size', value)} type="checkbox" className="btn-group-sm">
            <ToggleButton value="compact" className="btn btn-default">{'compact'}</ToggleButton>
            <ToggleButton value="mid-size car" className="btn btn-default">{'mid-size car'}</ToggleButton>
            <ToggleButton value="full-size car" className="btn btn-default">{'full-size car'}</ToggleButton>
            <ToggleButton value="mid-size SUV" className="btn btn-default">{'mid-size SUV'}</ToggleButton>
            <ToggleButton value="full-size SUV" className="btn btn-default">{'full-size SUV'}</ToggleButton>
          </ToggleButtonGroup>
        </MenuItem>
        <MenuItem divider />
        <MenuItem header >
        <h5>Type <small onClick={handleClickClear}><a>clear</a></small></h5>
          <ToggleButtonGroup value={type} onChange={(value) => onChange('type', value)} type="checkbox" className="btn-group-sm">
            <ToggleButton value="Lot" className="btn btn-default">{'Lot'}</ToggleButton>
            <ToggleButton value="Street" className="btn btn-default">{'Street'}</ToggleButton>
          </ToggleButtonGroup>
        </MenuItem>
        <MenuItem divider />
        <MenuItem header>
          <ButtonGroup justified>
            <ButtonGroup><Button className="btn btn-danger btn-sm">Reset</Button></ButtonGroup>
            <ButtonGroup><Button className="btn btn-success btn-sm">Filter</Button></ButtonGroup>
          </ButtonGroup>
        </MenuItem>
      </DropdownButton>
    );
  }
}

const mapState = (state) => {
  return {
    id: state.user.id,
    headingTo: state.headingTo,
    map: state.map
  };
};

const mapDispatch = (dispatch) => {
  return {
    filterSpots() {
    }
  };
};

export default connect(mapState, mapDispatch)(Filter);


