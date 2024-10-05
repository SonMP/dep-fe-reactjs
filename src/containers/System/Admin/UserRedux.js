import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import userService from '../../../services/userService';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import * as action from '../../../store/actions';
import './UserRedux.scss';

import lightbox from 'lightbox2';
import TableManageUser from './TableManageUser';
import 'lightbox2/dist/css/lightbox.css';
import 'lightbox2';
lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true
});
class ProductManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImageUrl: '',

            email: '',
            passWord: '',
            firstName: '',
            lastName: '',
            address: '',
            phoneNumber: '',
            gender: '',
            role: '',
            position: '',
            avatar: '',

            action: '',
            userEditId: '',
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
        // try {
        //     let res = await userService.getAllCodeService('gender');
        //     if (res && res.errCode === 0) {
        //         this.setState({
        //             genderArr: res.data
        //         })
        //     }
        // } catch (e) {
        //     console.log(e)
        // }
    }
    componentDidUpdate(prevProps, prevState, snapShot) {
        //render => didUpdate
        //hien tai (this) va qua khu(previous)
        //[] [3]
        //[3] [3]
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let genderRedux = this.props.genderRedux;
            this.setState({
                genderArr: genderRedux,
                gender: genderRedux && genderRedux.length > 0 ? genderRedux[0].keyMap : '',
            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let positionRedux = this.props.positionRedux;
            this.setState({
                positionArr: positionRedux,
                position: positionRedux && positionRedux.length > 0 ? positionRedux[0].keyMap : '',
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let roleRedux = this.props.roleRedux;
            this.setState({
                roleArr: roleRedux,
                role: roleRedux && roleRedux.length > 0 ? roleRedux[0].keyMap : ''
            })
        }
        if (prevProps.listUsers !== this.props.listUsers) {
            let genderRedux = this.props.genderRedux;
            let positionRedux = this.props.positionRedux;
            let roleRedux = this.props.roleRedux;
            this.setState({
                email: '',
                passWord: '',
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                gender: genderRedux && genderRedux.length > 0 ? genderRedux[0].keyMap : '',
                role: roleRedux && roleRedux.length > 0 ? roleRedux[0].keyMap : '',
                position: positionRedux && positionRedux.length > 0 ? positionRedux[0].keyMap : '',
                avatar: '',
                action: CRUD_ACTIONS.CREATE,
                previewImageUrl: ''
            })
        }
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImageUrl: objectUrl,
                avatar: base64
            })
        }
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }

    isValidateInput = () => {
        let isValidate = true;
        let userArr = ['email', 'passWord', 'firstName', 'lastName', 'address', 'phoneNumber'];
        for (let i = 0; i < userArr.length; i++) {
            if (!this.state[userArr[i]]) {
                alert('Missing parameter : ' + userArr[i]);
                isValidate = false;
                break;
            }
        }
        return isValidate;
    }
    handleSaveNewUser = () => {
        let check = this.isValidateInput();
        let { email, passWord, firstName, lastName, address, phoneNumber, role, position, gender, avatar, action, userEditId } = this.state;
        if (check === false) return;
        if (action === CRUD_ACTIONS.CREATE) {
            this.props.createNewUserRedux({
                email: email,
                passWord: passWord,
                firstName: firstName,
                lastName: lastName,
                address: address,
                phoneNumber: phoneNumber,
                gender: gender,
                roleId: role,
                positionId: position,
                image: avatar
            });
        }
        if (action === CRUD_ACTIONS.EDIT) {
            this.props.editUserRedux({
                id: userEditId,
                firstName: firstName,
                lastName: lastName,
                address: address,
                phoneNumber: phoneNumber,
                gender: gender,
                roleId: role,
                positionId: position,
                image: avatar
            })
        }
    }
    handleEditUserFromParent = (user) => {
        // console.log('Check user from parent:', user);
        let imageBase64 = '';
        if (user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary');
        }

        this.setState({
            userEditId: user.id,
            email: user.email,
            passWord: 'HARDCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            role: user.roleId,
            avatar: '',
            position: user.positionId,
            action: CRUD_ACTIONS.EDIT,
            previewImageUrl: imageBase64,
        })
    }
    render() {
        let { genderArr, positionArr, roleArr, previewImageUrl, email, passWord, firstName, lastName, phoneNumber, address, role, position, gender, avatar, action, userEditId } = this.state;
        // console.log('reduxxx check:', this.state.firstName);
        let language = this.props.language;
        let isLoadingGender = this.props.isLoadingGender;
        return (
            <div className='user-redux-container'>
                <div className="title" >
                    UserRedux
                </div>
                <div className='user-redux-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 text-center'>{isLoadingGender === true ? 'Loading gender....' : ''}</div>
                            <div className='col-12'>
                                <label><FormattedMessage id='manage-user.add' /></label>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.email' /></label>
                                <input className='form-control' type='email'
                                    value={email}
                                    onChange={(event) => this.onChangeInput(event, 'email')}
                                    disabled={action === CRUD_ACTIONS.EDIT ? true : false} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.password' /></label>
                                <input className='form-control' type='password'
                                    value={passWord}
                                    onChange={(event) => this.onChangeInput(event, 'passWord')}
                                    disabled={action === CRUD_ACTIONS.EDIT ? true : false} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.first-name' /></label>
                                <input className='form-control' type='text'
                                    value={firstName}
                                    onChange={(event) => this.onChangeInput(event, 'firstName')} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.last-name' /></label>
                                <input className='form-control' type='text'
                                    value={lastName}
                                    onChange={(event) => this.onChangeInput(event, 'lastName')} />
                            </div>
                            <div className='col-3'>
                                <label>   <FormattedMessage id='manage-user.phone-number' /></label>
                                <input className='form-control' type='text'
                                    value={phoneNumber}
                                    onChange={(event) => this.onChangeInput(event, 'phoneNumber')} />
                            </div>
                            <div className='col-9'>
                                <label> <FormattedMessage id='manage-user.address' /></label>
                                <input className='form-control' type='text'
                                    value={address}
                                    onChange={(event) => this.onChangeInput(event, 'address')} />
                            </div>
                            <div className='col-3'>
                                <label> <FormattedMessage id='manage-user.gender' /></label>
                                <select className='form-control'
                                    value={gender}
                                    onChange={(event) => this.onChangeInput(event, 'gender')}>
                                    {genderArr && genderArr.length > 0 &&
                                        genderArr.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}> {language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                            )
                                        })}
                                </select>

                            </div>
                            <div className='col-3'>
                                <label> <FormattedMessage id='manage-user.position' /></label>
                                <select className='form-control'
                                    value={position}
                                    onChange={(event) => this.onChangeInput(event, 'position')}>
                                    {positionArr && positionArr.length > 0 &&
                                        positionArr.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn} </option>
                                            )
                                        })}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label> <FormattedMessage id='manage-user.role' /></label>
                                <select className='form-control'
                                    value={role}
                                    onChange={(event) => this.onChangeInput(event, 'role')}>
                                    {roleArr && roleArr.length > 0 &&
                                        roleArr.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn} </option>
                                            )
                                        })}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.image' /></label>
                                <div className='preview-img-container'>
                                    <input id='previewImg' type='file' hidden
                                        onChange={(event) => this.handleOnChangeImage(event)}
                                    />
                                    <label className='label-upload' htmlFor='previewImg'><FormattedMessage id='manage-user.upload' /> <i class="fa-solid fa-upload"></i></label>
                                    {/* {previewImageUrl && ( */}
                                    <a href={previewImageUrl} data-lightbox="example-set" data-title="My caption">
                                        <div className='preview-image' style={{ backgroundImage: `url(${previewImageUrl})` }}></div>
                                    </a>
                                    {/* )} */}
                                </div>
                            </div>
                            <div className='col-12 mb-3'>
                                <button className={action === CRUD_ACTIONS.EDIT ? 'btn btn-warning' : 'btn btn-primary'} onClick={() => this.handleSaveNewUser()}>
                                    {action === CRUD_ACTIONS.EDIT ? <FormattedMessage id='manage-user.edit' /> : <FormattedMessage id='manage-user.save' />}
                                </button>
                            </div>
                            <div className='col-12 mb-5'>
                                <TableManageUser
                                    handleEditUserFromParent={this.handleEditUserFromParent}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>



        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        isLoadingGender: state.admin.isLoadingGender,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(action.fetchGenderStart()),
        getPositionStart: () => dispatch(action.fetchPositionStart()),
        getRoleStart: () => dispatch(action.fetchRoleStart()),
        createNewUserRedux: (data) => dispatch(action.createNewUserStart(data)),
        editUserRedux: (user) => dispatch(action.editUserStart(user)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductManage);
