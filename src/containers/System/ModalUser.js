import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: ''
        }
        this.listenToEmitter();
    }
    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: ''
            })
        })
    }
    componentDidMount() {
    }

    toggle = () => {
        this.props.toggleFormParent();
    }

    // handleOnChangInput = (event, id) => {

    //     let copyState = { ...this.state }
    //     copyState[id] = event.target.value
    //     this.setState({
    //         ...copyState
    //     })

    handleOnChangInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrState = ['email', 'password', 'firstName', 'lastName', 'address'];
        for (let i = 0; i < arrState.length; i++) {
            if (!this.state[arrState[i]]) {
                isValid = false;
                alert('Missing parameters: ' + arrState[i]);
                break;
            }
        }
        return isValid;
    }
    handleAddNewUser = () => {
        let check = this.checkValidateInput();
        if (check === true) {
            this.props.createNewUser(this.state);
        }
    }

    render() {
        // console.log(this.props)
        // console.log(this.props.isOpen)
        return (
            <>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={() => this.toggle()}
                    className={'modal-user-container'}
                    size='lg'
                >
                    <ModalHeader toggle={() => this.toggle()} >Create a new user</ModalHeader>
                    <ModalBody>

                        <div className="modal-user-body">
                            <div className="input-container"> <label>Email</label>
                                <input type="email" name='email' value={this.state.email} onChange={(event) => this.handleOnChangInput(event)} />
                            </div>
                            <div className="input-container">
                                <label>Password</label>
                                <input type="password" name='password' value={this.state.password} onChange={(event) => this.handleOnChangInput(event)} />
                            </div>
                            <div className="input-container">
                                <label>First name</label>
                                <input type="firstName" name='firstName' value={this.state.firstName} onChange={(event) => this.handleOnChangInput(event)} />
                            </div>
                            <div className="input-container">
                                <label>Last name</label>
                                <input type="lastName" name='lastName' value={this.state.lastName} onChange={(event) => this.handleOnChangInput(event)} />
                            </div>
                            <div className="input-container max-width-input">
                                <label>Address</label>
                                <input type="address" name='address' value={this.state.address} onChange={(event) => this.handleOnChangInput(event)} />
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter Footer>
                        <Button color="primary" className='px-3' onClick={() => this.handleAddNewUser()}>Add new</Button>{''}
                        <Button color="secondary" className='px-3' onclick={() => this.toggle()}>Close</Button>
                    </ModalFooter>
                </Modal >
            </>

        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
