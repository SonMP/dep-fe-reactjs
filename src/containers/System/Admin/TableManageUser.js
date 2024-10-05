import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as action from '../../../store/actions';
import './TableManageUser.scss';
import { ListFormat } from 'typescript';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
    console.log('handleEditorChange', html, text);
}

class TableManageUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersRedux: []
        }
    }
    componentDidMount() {
        this.props.fetchUserRedux();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                usersRedux: this.props.listUsers
            })
        }
    }
    handleDeleteUser = (user) => {
        let result = window.confirm("Are you sure you want to delete this user?");
        if (result) {
            this.props.deleteUserRedux(user.id)
        } else {
            console.log('Not delete user');
        }

    }

    handleEditUser = (user) => {
        this.props.handleEditUserFromParent(user);
    }
    render() {
        console.log(this.props.listUsers);
        let { usersRedux } = this.state;
        console.log('check redux userL', usersRedux);
        return (
            <>
                <table id='TableManageUser'>
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>

                        {usersRedux && usersRedux.length > 0 &&
                            usersRedux.map((item, index) => {
                                return (
                                    <tr key={index} className='divClass'>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className='btn-edit' onClick={() => this.handleEditUser(item)} ><i class="fa-solid fa-pencil"></i></button>
                                            <button className='btn-delete' onClick={() => this.handleDeleteUser(item)}><i class="fa-solid fa-trash"></i></button>
                                        </td>

                                    </tr>
                                )
                            })}

                    </tbody>
                </table>
                <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
            </>

        );
    }

}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(action.fetchAllUserStart()),
        deleteUserRedux: (userId) => dispatch(action.deleteUser(userId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
