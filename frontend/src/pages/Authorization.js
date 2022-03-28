import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import {api} from '../services/API';

class Authorization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',

            error_password: '',
            error_email: '',
            redirect: null
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeLogin = this.onChangeLogin.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();

        let a = api.MakeAuthRequest(this.state.email, this.state.password);
        a
        .then(res => {
            if (!res) return;
            if (res.data['status'] === 'OK') {
                this.setState({'redirect': res.data['role']});
            }})
        .catch(async e => {
            if (e.response.data['status'] === '401') await this.setState({error_password: e.response.data['error']})
            else this.setState({error_password: ''});
            if (e.response.data['status'] === '418') await this.setState({error_email: e.response.data['error']})
            else this.setState({error_email: ''});
        });
    }

    onChangeLogin(event) {
        this.setState({email: event.target.value});
    }

    onChangePassword(event) {
        this.setState({password: event.target.value});
    }

    render() {
        if (this.state.redirect === 'admin') return <Redirect to='/topology'/>
        else if (this.state.redirect === '') return <Redirect to='/main'/>
        return (
            <div className='full-screen background centering'>
                <form className='window' onSubmit={this.onSubmit}>
                    <div className='title title-centering margin-bottom-20'>Welcome!</div>
                    <div className='input margin-bottom-20'>
                        <div className={`input-header ${this.state.error_email && 'error'} margin-bottom-8`}>e-mail{this.state.error_email &&
                        <span className='mini-msg'>{this.state.error_email}</span>}</div>
                        <input className='input-field' onChange={this.onChangeLogin}/>
                    </div>
                    <div className='input margin-bottom-40'>
                        <div className={`input-header ${this.state.error_password && 'error'} margin-bottom-8`}>password{this.state.error_password &&
                        <span className='mini-msg'>{this.state.error_password}</span>}</div>
                        <input type='password' className='input-field' onChange={this.onChangePassword}/>
                    </div>
                    <button className='button button-base margin-bottom-8'>Sign in</button>
                    <div className='mini-text'>Need account? <Link to='/registration'
                                                                           className='link'>Sign up</Link>
                    </div>
                </form>
            </div>
        )
    }
}

export default Authorization;