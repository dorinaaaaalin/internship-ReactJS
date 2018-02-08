import React from 'react'
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router'
import { config } from '../config/config'
import auth from '../utils/auth'
import utils from '../utils/utils'
import webservice from '../services/webservice'
import { LogoSm, BetaTag } from '../components/Assets'

var style = require('../css/registration.useable.css');
var style2 = require('../css/requestinvite.useable.css');

class RequestInvite extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedGender: null,
			errors: [],
			requestInviteSuccessful: false
		};

		this._handleInputMobileOnChange = this._handleInputMobileOnChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
	}

	componentWillMount () {
		style.use();
		style2.use();
	}

	componentWillUnmount () {
		style.unuse();
		style2.unuse();
	}

	isError (err) {
		for (let i=0; i<this.state.errors.length; i++) {
			if (this.state.errors[i].error === err) return 'error';
		}
		return '';
	}

	validateForm () {
		let valid = true;
		let errorFields = [];
		
		if (!this.inputName.value.trim()) {
			valid = false;
			errorFields.push({ error: 'name', errorDesc:'Invalid name' });
		}

		if (!this.inputEmail.value.trim()) {
			valid = false;
			errorFields.push({ error: 'email', errorDesc:'Invalid email' });
		}

		if (!this.inputMobile.value.trim()) {
			valid = false;
			errorFields.push({ error: 'mobile', errorDesc:'Invalid mobile number' });
		}

		/*if (!this.inputDOB.value.trim()) {
			valid = false;
			errorFields.push({ error: 'dob', errorDesc:'This is a mandory field' });
		}*/

		this.setState({errors:errorFields});
		return valid;
	}

	/*_handleGenderChange: function (e) {
		this.setState({
			selectedGender: e.target.value
		});
	}*/

	_handleInputMobileOnChange (e) {
		e.preventDefault();
		e.target.value = utils.removeNonNumbers(e.target.value);
	}

	_handleSubmit (e) {
		e.preventDefault();
		printLog('validate form');
		if (this.validateForm()) {
			printLog('validated, submit form');

			let postParams = {
				//name: utils.removeExcessWhiteSpaces(this.inputLastName.value + ' ' + this.inputFirstName.value),
				name: utils.removeExcessWhiteSpaces(this.inputName.value),
				//gender: this.state.selectedGender,
				email: this.inputEmail.value.trim(),
				//dob: this.inputDOB.value,
				mobile: this.inputMobile.value.trim(),
				fromwhere: this.inputFromWhere.value.trim()
				//icNum: utils.removeExcessWhiteSpaces(this.inputICNum.value),
				//passportNum: utils.removeExcessWhiteSpaces(this.inputPassportNum.value),
				//permanentAddress: utils.removeExcessWhiteSpaces(this.inputAddressPermanent.value),
				//residentialAddress: utils.removeExcessWhiteSpaces(this.inputAddressResidential.value),
				//officeAddress: utils.removeExcessWhiteSpaces(this.inputAddressOffice.value)
			};

			webservice.webServiceCall(config.webServiceHost + config.webservice.requestInvite, postParams, (res) => {
				if (res && res.result.code == 'OK' && res.data && res.data.uid) {
					this.setState ({ requestInviteSuccessful: true });
				} else {
					//response error
					printLog('request for invite error');
				}
			});
		}
	}

	render() {
		var children = React.Children.map(this.props.children, (child) => {
			return React.cloneElement(child, {
				auth: this.props.auth
			})
		}, this)

		if (this.state.requestInviteSuccessful) {
			return (
				<div className="container-fluid">
					<h1>Thank you</h1>
					<br/>
					<p>We have received your request for the invitation, stay tuned, we will be contacting you shortly!</p>
					<br/>
					<br/>
				</div>
			)
		}	

		return (

			<div className="container-fluid">
				<div className="beta-container"><BetaTag/></div>
				<div className="logo-container">
					<LogoSm logoFill="#fff"/>
				</div>
				<h2>申请 GoGo 私家秘书服务</h2>
				<h5>我们将在 2 个工作日内对申请者进行电话联系。</h5>
				<form onSubmit={this._handleSubmit}>
					
					<div className="form-group has-danger">
						<label htmlFor="input-Name">联系人姓名 Your name *</label>
						<input ref={(ref) => this.inputName = ref} type="text" className={'form-control ' + this.isError('name')} id="input-Name" placeholder="联系人姓名 Your name" title="Invalid name" defaultValue=""/>
					</div>
					<div className="form-group has-danger">
						<label htmlFor="input-MobileNum">联系人手机 Your mobile number *</label>
						<input ref={(ref) => this.inputMobile = ref} type="tel" className={'form-control ' + this.isError('mobile')} id="input-MobileNum" placeholder="联系人手机 Your mobile number" title="Invalid mobile number" onChange={this._handleInputMobileOnChange} defaultValue=""/>
					</div>
					<div className="form-group has-danger">
						<label htmlFor="input-Email">联系人邮箱 Your email address *</label>
						<input ref={(ref) => this.inputEmail = ref} type="email" className={'form-control ' + this.isError('email')} id="input-Email" placeholder="联系人邮箱 Your email address" aria-describedby="emailHelp" pattern={utils.emailRegex} title="Invalid email address" defaultValue=""/>
					</div>
					<div className="form-group has-danger">
						<label htmlFor="input-FromWhere">从哪里获知 GoGo 的服务 How did you found out about GoGo</label>
						<input ref={(ref) => this.inputFromWhere = ref} type="text" className="form-control" id="input-FromWhere" placeholder="从哪里获知 GoGo 的服务" aria-describedby="fromWhereHelp" title="How did you found out about GoGo" defaultValue=""/>
					</div>
					
					<div className="form-group cta">
						<button type="submit" className="btn btn-primary">提交 Submit</button>
					</div>
					<div className="text-center"><small>咨询请联系微信客服／官方邮箱：<a href={'mailto:' + config.gogo.enquiryEmail} target="_blank">{config.gogo.enquiryEmail}</a></small></div>
				</form>
			</div>

		);
	}
}

RequestInvite.propTypes = {
	
};

RequestInvite.defaultProps = {
	
};

module.exports = RequestInvite;