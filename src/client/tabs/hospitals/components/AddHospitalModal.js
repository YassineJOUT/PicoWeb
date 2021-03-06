import React from 'react';
import Modal from '../../../shared/Modal';
import HospitalMap from './HospitalMap';
import { REQUIRED_FIELD } from '../../../constants.json';

export default class AddHospitalModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      latitude: 33.6835,
      longitude: -7.3849,
      mapZoom: 12,
      errors: {}
    };
  }

  createDivClassName = (fieldId) => {
    let className = 'form-group';
    const { errors } = this.state;
    if (errors[fieldId] && errors[fieldId].length > 0) { className += ' has-error'; }
    return className;
  };

  handleNameChange = (event) => {
    this.setState({ name: event.target.value, errors: {} });
  }

  updatePosition = (position) => {
    this.setState({
      latitude: position.latitude,
      longitude: position.longitude,
      mapZoom: position.zoom
    });
  }

  onConfirmModal = () => {
    if (!this.state.name || !this.state.name.trim().length) {
      return this.setState({ errors: { name: REQUIRED_FIELD } });
    }

    const hospitalData = {
      name: this.state.name,
      latitude: this.state.latitude,
      longitude: this.state.longitude
    };

    const { onConfirm } = this.props;

    return onConfirm(hospitalData);
  }

  render() {
    const {
      name, latitude, longitude, errors, mapZoom
    } = this.state;
    const { onClose } = this.props;

    const fields = (
      <React.Fragment>
        <div className={this.createDivClassName('name')}>
          <label htmlFor="name" className="col-sm-2 control-label">
          Hospital name
          </label>
          <div className="col-sm-10">
            <input
              id="name"
              type="text"
              className="form-control"
              value={name}
              onChange={this.handleNameChange}
            />
            {errors.name
                && <span className="help-block">{errors.name}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="position" className="col-sm-2 control-label">
          Hospital position
          </label>
          <div className="col-sm-10">
            <HospitalMap
              latitude={latitude}
              longitude={longitude}
              zoom={mapZoom}
              updatePosition={this.updatePosition}
            />
          </div>
        </div>
      </React.Fragment>
    );

    return (
      <Modal title="Add a hospital" onConfirm={this.onConfirmModal} onClose={onClose} cofirmEnabled>
        <form className="form-horizontal">
          {fields}
        </form>
      </Modal>

    );
  }
}
