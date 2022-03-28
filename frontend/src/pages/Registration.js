import React, {Component} from 'react';
import {api} from '../services/API';
import {Link} from 'react-router-dom';
import NotFound from './NotFound';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            password: '',

            error_email: '',
            error_name: '',
            error_password: ''
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    checkFields() {
        let check = 0;
        if (this.state.email.match('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]') != null) {
            this.setState({error_email: ''});
        } else {
            this.setState({error_email: 'Введите e-mail в формате "thonk@au.team".'});
            check++;
        }
        if (this.state.name.match('^[А-Я][А-Яа-я\\-]{1,}\\s[А-Я][А-Яа-я]{1,}\\s[А-Я][А-Яа-я]{1,}$') != null) {
            this.setState({error_name: ''});
        } else {
            this.setState({error_name: 'Введите ФИО в формате "Фамилия Имя Отчество" (Каждое слово должно начинаться с заглавной буквы и состоять из русских букв).'});
            check++;
        }
        if (this.state.password.length >= 8 && this.state.password.length <= 64) {
            this.setState({error_password: ''});
        } else {
            this.setState({error_password: 'Длина пароля должна быть от 8 до 64 символов.'});
            check++;
        }
        return check === 0;
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.checkFields()) {
            let promise = api.MakeRegRequest(this.state.email, this.state.password, this.state.name);
            promise.then(res => console.log(res.data['status']));
        }
    }

    onChangeEmail(event) {
        this.setState({email: event.target.value});
    }

    onChangeName(event) {
        this.setState({name: event.target.value});
    }

    onChangePassword(event) {
        this.setState({password: event.target.value});
    }

    render() {
        return (<NotFound/>);
        // return (
        //     <div className='full-screen background centering'>
        //         <form className='window' onSubmit={this.onSubmit}>
        //             <div className='title title-centering margin-bottom-20'>Добро пожаловать!</div>
        //             <div className='input margin-bottom-20'>
        //                 <div
        //                     className={`input-header ${this.state.error_email && 'error'} margin-bottom-8`}>e-mail{this.state.error_email &&
        //                 <span className='mini-msg'>{this.state.error_email}</span>}</div>
        //                 <input className='input-field' value={this.state.email} onChange={this.onChangeEmail}/>
        //             </div>
        //             <div className='input margin-bottom-20'>
        //                 <div
        //                     className={`input-header ${this.state.error_name && 'error'} margin-bottom-8`}>фио{this.state.error_name &&
        //                 <span className='mini-msg'>{this.state.error_name}</span>}</div>
        //                 <input className='input-field' value={this.state.name} onChange={this.onChangeName}/>
        //             </div>
        //             <div className='input margin-bottom-40'>
        //                 <div
        //                     className={`input-header ${this.state.error_password && 'error'} margin-bottom-8`}>пароль{this.state.error_password &&
        //                 <span className='mini-msg'>{this.state.error_password}</span>}</div>
        //                 <input type='password' className='input-field' value={this.state.password}
        //                        onChange={this.onChangePassword}/>
        //             </div>
        //             <button className='button button-base margin-bottom-8'>Продолжить</button>
        //             <div className='mini-text'>Есть учетная запись? <Link to='/authorization'
        //                                                                   className='link'>Авторизоваться</Link></div>
        //         </form>
        //     </div>
        // );
    }
}

export default Registration;
