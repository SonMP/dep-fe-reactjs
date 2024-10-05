import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import '@fortawesome/fontawesome-free/css/all.min.css';
import * as actions from "../../store/actions";
// import { KeyCodeUtils, LanguageUtils } from "../utils";

import './Login.scss';
import { values } from 'lodash';
// import userService from '../../services/userService';
import userService from '../../services/userService';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errMessage: '',
            isShowPassword: false
        }
    }
    handleOnChangeInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleOnClickLogin = async () => {
        this.setState({
            errMessage: '',
        })
        // console.log('username:', this.state.username, 'password:', this.state.password)
        try {
            let data = await userService.handleLoginService(this.state.username, this.state.password);
            if (data && data.errCode != 0) {
                this.setState({
                    errMessage: data.message
                })
            }
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user);
                console.log('login succeed!')
            }
        } catch (error) {
            console.log(error)
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }
    }
    handleShowHide = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleOnClickLogin();
        }
    }
    render() {

        return (
            <>
                <div className='login-background'>
                    <div className='login-container'>
                        <div className='login-content row'>
                            <div className='col-12 text-login'>Login</div>
                            <div className='col-12 form-group login-input'>
                                <label>User name</label>
                                <input type='text'
                                    placeholder='Enter your username'
                                    className='form-control'
                                    value={this.username}
                                    onChange={(event) => this.handleOnChangeInput(event)}
                                    name='username' />
                            </div>
                            <div className='col-12 form-group login-input'>
                                <label>Password</label>
                                <div className='custom-input-password'>
                                    <input type={this.state.isShowPassword ? 'text' : 'password'}
                                        placeholder='Enter your password'
                                        className='form-control'
                                        value={this.password}
                                        onChange={(event) => this.handleOnChangeInput(event)}
                                        name='password'
                                        onKeyDown={(event) => this.handleKeyDown(event)} />
                                    <span
                                        onClick={() => this.handleShowHide()}>
                                        <i className={this.state.isShowPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                                    </span>

                                </div>
                                <div className='col-12 mt-3' style={{ color: 'red' }}>
                                    {this.state.errMessage}
                                </div>
                            </div>
                            <div className='col-12'>
                                <button className='btn-login'
                                    onClick={() => this.handleOnClickLogin()}>
                                    Login
                                </button>
                            </div>

                            <div className='col-12'>
                                <span className='forgot-password'>Forgot your password?</span>
                            </div>
                            <div className='col-12 text-center mt-3'>
                                <span className=''> Or login with:</span>
                            </div>
                            <div className='col-12 social-login'>
                                <i class="fa-brands fa-google-plus-g google"></i>
                                <i class="fa-brands fa-facebook-f facebook"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </>

        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // adminLoginSuccess: (adminInfo) => dispatch(actions.adminLoginSuccess(adminInfo)),
        // adminLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
