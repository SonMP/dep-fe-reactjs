import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageSpecialty.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from '../../../utils';
import userService from '../../../services/userService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: ''
        }
        this.fileInputRef = React.createRef();
    }
    async componentDidMount() {
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }
    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionMarkdown: text,
            descriptionHTML: html
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
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    handleSaveSpecialty = async () => {
        let res = await userService.createNewSpecialty(this.state);
        if (res && res.errCode === 0) {
            toast.success('Add new specialty succeed!');
            this.setState({
                name: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: ''
            })
            this.fileInputRef.current.value = '';
        } else {
            toast.error('Something wrongs.....');
            console.log(res)
        }
    }
    render() {
        let { name, imageBase64, descriptionHTML, descriptionMarkdown } = this.state
        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'>Quản lý chuyên khoa</div>
                <div className='add-new-specialty row'>
                    <div className='col-6 form-group'>
                        <label>Tên chuyên khoa</label>
                        <input className='form-control' type='text' value={name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')} />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Ảnh</label>
                        <input className='form-control' type='file'
                            ref={this.fileInputRef}
                            onChange={(event) => this.handleOnChangeImage(event)} />
                    </div>
                    <div className='col-12 mt-3'>
                        <MdEditor
                            style={{ height: '300px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={descriptionMarkdown}
                        />
                    </div>
                    <div className='btn-save-specialty mt-3'>
                        <button
                            onClick={() => this.handleSaveSpecialty()}>Save</button>
                    </div>
                </div>

            </div>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
