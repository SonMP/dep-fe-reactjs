import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './RemedyModal.scss';
import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from 'reactstrap';
import { CommonUtils } from '../../../utils';
import { toast } from 'react-toastify';

class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imageBase64: ''
        }
    }
    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }

    }
    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }
    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];

        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            })
        }
    }
    handleSendRemedy = () => {
        this.props.sendRemedy(this.state);
    }
    render() {
        let { isOpenModal, closeModal, dataModal, sendRemedy } = this.props;

        return (
            <>
                <Modal
                    isOpen={isOpenModal}
                    className={'booking-modal-container'}
                    size='lg'
                    centered
                >
                    <div className="booking-modal-header">
                        <span className='left'>Gửi hóa đơn </span>
                        <span className='right' onClick={closeModal}><i className='fas fa-times'></i></span>
                    </div>
                    <ModalBody>

                        <div className="row">
                            <div className="col-6 form-group">
                                <label>Email bệnh nhân</label>
                                <input className='form-control' type="email" defaultValue={this.state.email}
                                    onChange={(event) => this.handleOnChangeEmail(event)} />
                            </div>
                            <div className="col-6 form-group">
                                <label>Chọn file đơn thuốc</label>
                                <input type="file" className='form-control-file'
                                    onChange={(event) => this.handleOnChangeImage(event)} />
                            </div>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.handleSendRemedy()}>Send</Button>
                        <Button color="secondary" onClick={closeModal}>Cancel</Button>
                    </ModalFooter>
                </Modal >
            </>

        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
