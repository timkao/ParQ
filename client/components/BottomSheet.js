import React, { Component } from 'react';
import { connect } from 'react-redux';
import BottomSheet from 'react-bottom-sheet';
import List from './List';

export class BottomSheetComponent extends Component{
  constructor(){
    super();
    this.state = {
      showSheet: false
    };
  }
  componentWillMount() {
    this.setState({
      showSheet: this.props.showSheet
    });
  }
  // componentWillReceiveProps(){
  //   this.setState()
  // }

  render(){
    return (

      <BottomSheet id="bottom-sheet" maxHeight={'20vh'} open={this.state.showSheet} onRequestClose={() => this.setState({ showSheet: false })}>
        <List />
      </BottomSheet>

    );
  }
}

const mapState = (state) => {
  return {
    spots: state.streetspots,
    filter: state.filter,
    lots: state.lots
  };
};

const mapDispatch = null;


export default connect(mapState, mapDispatch)(BottomSheetComponent);
