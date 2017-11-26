import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';

class LoadImage extends Component {
  constructor() {
    super()
    this.state = {
      data_uri: '',
      filename: '',
      processing: false,
      files: []
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnDrop = this.handleOnDrop.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    // const _this = this;
    this.setState({
      processing: true
    });

    // axios.post('/api/FileUpload', { files: this.state.files })
    //   .then(res => res.data)
    //   .then(function (res) {
    //     _this.props.dispatch(updateProductImage(_this.props.productId, res.fileUrls))
    //     _this.setState({
    //       processing: false
    //     });
    //   });
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
        console.log(uploadedFile)
        this.setState(prevState => ({ files: [...prevState.files, uploadedFile] }))
      };

      reader.readAsDataURL(file);
    }, this);
  }

  render() {
    let processing;
    let uploaded;
    const { handleSubmit, handleOnDrop } = this

    if (this.state.uploaded_uri) {
      uploaded = (
        <div>
          <h4>Image uploaded!</h4>
        </div>
      );
    }

    if (this.state.processing) {
      processing = "Processing image, hang tight";
    }

    return (
      <div className='row' >
        <div className='col-sm-12'>
          <label>Upload an image</label>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Dropzone disabled={processing ? true : false} onDrop={handleOnDrop} style={{ width: "200px", height: "200px", borderWidth: "2px", borderColor: "rgb(102, 102, 102)", borderStyle: "dashed", borderRadius: "5px", margin: "auto" }} activeStyle={{ width: "200px", height: "200px", borderWidth: "2px", borderColor: "#6c6", borderStyle: "solid", borderRadius: "5px", margin: "auto", backgroundColor: "#eee" }} >
              <p>Try dropping some files here, or click to select files to upload.</p>
            </Dropzone>
            <input disabled={processing ? "disabled" : false} className='btn btn-primary' type="submit" value="Upload" /><br />
            {processing}
            {uploaded}
          </form>
        </div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {

  }
}

const mapDispatch = (dispatch) => {
  return {

  }
}

export default connect(mapState, mapDispatch)(LoadImage);
