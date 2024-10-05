import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as action from '../../../store/actions';
import './ManageDoctor.scss';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import 'react-markdown-editor-lite/lib/index.css';
import userService from '../../../services/userService';
// import { Select } from 'react-select/dist/Select-fd7cb895.cjs.prod';

import Select from 'react-select';
import { toast } from 'react-toastify';


const mdParser = new MarkdownIt(/* Markdown-it options */);


class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //save to markdown table
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',
            listDoctors: [],
            hasOldData: false,

            //save to doctor_infor table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listSpecialty: [],
            listClinic: [],

            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedSpecialty: '',
            selectedClinic: '',
            nameClinic: '',
            addressClinic: '',
            note: '',
        }
    }
    componentDidMount() {
        this.props.fetchAllDoctor();
        this.props.getAllRequireDoctorInfor();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.allDoctor !== this.props.allDoctor) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctor, 'USERS');
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPrice, resPayment, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic
            })
        }
        if (prevProps.language !== this.props.language) {
            let { resPrice, resPayment, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfor;
            let dataSelect = this.buildDataInputSelect(this.props.allDoctor, 'USERS');
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');
            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic
            })
        }
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                })
            }
            if (type === 'PRICE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi} VND`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if (type === 'PAYMENT' || type === 'PROVINCE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if (type === 'SPECIALTY') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name
                    object.value = item.id;
                    result.push(object);
                })
            }
            if (type === 'CLINIC') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name
                    object.value = item.id;
                    result.push(object);
                })
            }
        }
        return result;
    }
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }

    validatedInput = () => {
        let isValid = true;
        let arrInput = ['selectedOption', 'description', 'contentHTML', 'contentMarkdown', 'selectedPrice',
            'selectedPayment', 'selectedProvince', 'nameClinic', 'addressClinic', 'note', 'selectedSpecialty'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                toast.error('Missing parameter: ' + arrInput[i]);
                isValid = false;
                break;
            }
        }
        return isValid;
    }
    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state;
        if (this.validatedInput() === true) {
            this.props.saveDetailDoctor({
                contentHTML: this.state.contentHTML,
                contentMarkdown: this.state.contentMarkdown,
                description: this.state.description,
                doctorId: this.state.selectedOption.value,
                action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

                selectedPrice: this.state.selectedPrice.value,
                selectedPayment: this.state.selectedPayment.value,
                selectedProvince: this.state.selectedProvince.value,
                nameClinic: this.state.nameClinic,
                addressClinic: this.state.addressClinic,
                note: this.state.note,
                specialtyId: this.state.selectedSpecialty.value,
                clinicId: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : ''
            })
        }

    }
    handleChangeSelected = async (selectedOption) => {
        this.setState({ selectedOption })
        let res = await userService.getDetailInforDoctor(selectedOption.value);
        let { listPrice, listPayment, listProvince, listSpecialty, listClinic } = this.state;
        let selectedPrice = '', selectedPayment = '', selectedProvince = '',
            nameClinic = '', addressClinic = '', note = '', priceId = '', paymentId = '', provinceId = '',
            selectedSpecialty = '', specialtyId = '', selectedClinic = '', clinicId = '';
        if (res.data.Doctor_Infor) {
            nameClinic = res.data.Doctor_Infor.nameClinic;
            addressClinic = res.data.Doctor_Infor.addressClinic;
            note = res.data.Doctor_Infor.note;
            priceId = res.data.Doctor_Infor.priceId;
            paymentId = res.data.Doctor_Infor.paymentId;
            provinceId = res.data.Doctor_Infor.provinceId;
            specialtyId = res.data.Doctor_Infor.specialtyId;
            clinicId = res.data.Doctor_Infor.clinicId;

            selectedPrice = listPrice.find(item => {
                return item && item.value === priceId;
            })
            selectedPayment = listPayment.find(item => {
                return item && item.value === paymentId;
            })
            selectedProvince = listProvince.find(item => {
                return item && item.value === provinceId;
            })
            selectedSpecialty = listSpecialty.find(item => {
                return item && item.value === specialtyId;
            })
            selectedClinic = listClinic.find(item => {
                return item && item.value === clinicId;
            })
        }
        if (res && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown
            this.setState({
                contentMarkdown: markdown.contentMarkdown,
                contentHTML: markdown.contentHTML,
                description: markdown.description,
                hasOldData: true,
                nameClinic: nameClinic,
                addressClinic: addressClinic,
                note: note,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic
            })
        } else {
            this.setState({
                contentMarkdown: '',
                contentHTML: '',
                description: '',
                hasOldData: false,
                nameClinic: '',
                addressClinic: '',
                note: '',
                selectedPrice: '',
                selectedPayment: '',
                selectedProvince: '',
                selectedSpecialty: '',
                selectedClinic: ''
            })
        }
    }
    handleChangeSelectedDoctorInfor = async (selectedOption, name) => {
        let copyState = { ...this.state };
        let nameSelected = name.name;
        copyState[nameSelected] = selectedOption;
        this.setState({
            ...copyState
        })
    }
    handleOnChangeText = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }
    render() {
        let { hasOldData, listPayment, listPrice, listProvince, listDoctors, selectedOption, listSpecialty, listClinic } = this.state;
        let language = this.props.language;
        // console.log('ec', this.props.allRequiredDoctorInfor);
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>
                    <FormattedMessage id='admin.manage-doctor.title' />
                </div>
                <div className='more-infor'>
                    <div className='content-left form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.select-doctor' /></label>
                        <Select
                            value={selectedOption}
                            onChange={this.handleChangeSelected}
                            options={listDoctors}
                            placeholder={<FormattedMessage id='admin.manage-doctor.select-doctor' />} />
                    </div>
                    <div className='content-right form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.intro' /></label>
                        <textarea className='form-control' rows='4'
                            onChange={(event) => this.handleOnChangeText(event, 'description')}
                            value={this.state.description}>
                        </textarea>
                    </div>
                </div>
                <div className='more-infor-extra row'>
                    <div className='select col-4 form-group'>
                        <label> <FormattedMessage id='admin.manage-doctor.price' /> </label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectedDoctorInfor}
                            name="selectedPrice"
                            options={listPrice}
                            placeholder={<FormattedMessage id='admin.manage-doctor.price' />} />
                    </div>

                    <div className='select col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.payment' /> </label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectedDoctorInfor}
                            name="selectedPayment"
                            options={listPayment}
                            placeholder={<FormattedMessage id='admin.manage-doctor.payment' />} />
                    </div>
                    <div className='select col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.province' /> </label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectedDoctorInfor}
                            name="selectedProvince"
                            options={listProvince}
                            placeholder={<FormattedMessage id='admin.manage-doctor.province' />} />
                    </div>
                    <div className='select col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.nameClinic' /> </label>
                        <input className='form-control'
                            value={this.state.nameClinic}
                            onChange={(event) => this.handleOnChangeText(event, 'nameClinic')} />
                    </div>
                    <div className='select col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.addressClinic' /> </label>
                        <input className='form-control'
                            value={this.state.addressClinic}
                            onChange={(event) => this.handleOnChangeText(event, 'addressClinic')} />
                    </div>
                    <div className='select col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.note' /> </label>
                        <input className='form-control'
                            value={this.state.note}
                            onChange={(event) => this.handleOnChangeText(event, 'note')} />
                    </div>
                </div>
                <div className='more-infor-second row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.specialty' /></label>
                        <Select
                            value={this.state.selectedSpecialty}
                            onChange={this.handleChangeSelectedDoctorInfor}
                            name="selectedSpecialty"
                            options={listSpecialty}
                            placeholder={<FormattedMessage id='admin.manage-doctor.specialty' />}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.select-clinic' /></label>
                        <Select
                            value={this.state.selectedClinic}
                            onChange={this.handleChangeSelectedDoctorInfor}
                            name="selectedClinic"
                            options={listClinic}
                            placeholder={<FormattedMessage id='admin.manage-doctor.select-clinic' />}
                        />
                    </div>
                </div>
                <div className='manage-doctor-editor'>
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button className={hasOldData === true ? 'save-content-doctor' : 'create-content-doctor'}
                    onClick={() => this.handleSaveContentMarkdown()}>
                    {hasOldData === true ? <span><FormattedMessage id='admin.manage-doctor.save' /></span> : <span><FormattedMessage id='admin.manage-doctor.add' /></span>}
                </button>
            </div >

        );
    }

}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users,
        allDoctor: state.admin.allDoctor,
        language: state.app.language,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(action.fetchAllDoctor()),
        saveDetailDoctor: (data) => dispatch(action.saveDetailDoctor(data)),
        getAllRequireDoctorInfor: () => dispatch(action.getRequireDoctorInfor()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
