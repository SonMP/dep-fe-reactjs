import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
class ModalEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: ''
        }

    }

    componentDidMount() {

        let user = this.props.currentUser;
        console.log(user);
        this.setState({
            id: user.id,
            email: user.email,
            password: user.passWord || 'fucking du',
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address
        })
    }

    toggle = () => {
        this.props.toggleFormParent();
    }


    handleOnChangInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleEditUser = async () => {
        try {
            let user = this.state;
            await this.props.editUser(user);
        } catch (e) {
            console.log(e)
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
                    <ModalHeader toggle={() => this.toggle()} >Edit user</ModalHeader>
                    <ModalBody>
                        <div className="modal-user-body">
                            <div className="input-container"> <label>Email</label>
                                <input type="email" name='email' value={this.state.email} onChange={(event) => this.handleOnChangInput(event)} disabled />
                            </div>
                            <div className="input-container">
                                <label>Password</label>
                                <input type="password" name='password' value={this.state.password} onChange={(event) => this.handleOnChangInput(event)} disabled />
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
                        <Button color="primary" className='px-3' onClick={() => this.handleEditUser()}>Save changes</Button>{''}
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
