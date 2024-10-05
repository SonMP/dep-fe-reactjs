import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import userService from '../../services/userService';
import ModalUser from './ModalUser';
import { Alert } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import ModalEditUser from './ModalEditUser';

class UserManage extends Component {

    /** life cycle
     *   Run component:
     * 1.run constructor -> init state
     * 2.Render
     * 3.Did mount -> set state
     * 4.Render(re-render)
     */
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: []
        }
    }

    async componentDidMount() {
        this.getAllUser();
    }
    getAllUser = async () => {
        let response = await userService.getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            })
        }
    }
    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true
        })

    }
    toggleShowModalUser = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        })
    }

    toggleShowModalEditUser = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser
        })
    }
    createNewUser = async (data) => {
        try {
            let response = await userService.createNewUserService(data);
            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllUser();
                this.setState({
                    isOpenModalUser: false
                })
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            }
        } catch (e) {
            console.log(e)
        }
    }

    handleDeleteUser = async (user) => {
        try {
            let response = await userService.deleteUserService(user.id)
            if (response && response.errCode !== 0) {
                alert(response.errMessage)
            } else {
                await this.getAllUser();
            }
        } catch (e) {
            console.log(e)
        }
    }

    handleEditUser = (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user
        })
    }
    doEditUser = async (user) => {
        try {

            let userEdit = await userService.editUserService(user);
            if (userEdit.errCode == 0) {
                this.setState({
                    isOpenModalEditUser: false,
                })
                this.getAllUser();
            }
        } catch (e) {
            console.log(e)
        }

    }
    render() {
        let arrUsers = this.state.arrUsers;
        console.log(arrUsers);
        return (
            <div className='user-container'>
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFormParent={this.toggleShowModalUser}
                    createNewUser={this.createNewUser}
                />
                {this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleFormParent={this.toggleShowModalEditUser}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}
                    />
                }
                <div className="title text-center">Manage users</div>
                <div className='mx-1'>
                    <button className='btn btn-primary px-3'
                        onClick={() => this.handleAddNewUser()}
                    > <i class="fa-solid fa-plus"></i> Add new user</button>
                </div>
                <div className='user-table mt-4 mx-1'>
                    <table id='customers'>
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                            {arrUsers && arrUsers.map((item, index) => {
                                return (
                                    <tr className='divClass' key={index}>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className='btn-edit' onClick={() => this.handleEditUser(item)}><i class="fa-solid fa-pencil"></i></button>
                                            <button className='btn-delete' onClick={() => this.handleDeleteUser(item)}><i class="fa-solid fa-trash"></i></button>
                                        </td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                </div>
            </div>


        );
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
