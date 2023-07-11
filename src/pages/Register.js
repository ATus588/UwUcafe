import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import AuthApi from '../services/AuthApi'
import { useTranslation } from 'react-i18next';
import LanguageBtn from '../components/LanguageBtn';


const InputField = ({ label, type, value, onChange }) => {
    return (
        <div className='login-input-item'>
            <label className='login-input-label'>{label}:
            </label>
            <input type={type} value={value} onChange={onChange} required className='login-input-field' />
        </div>
    );
};

const RadioField = ({ label, value, checked, onChange }) => {
    return (
        <div >
            <label className='login-role-item'>
                <input type="radio" value={value} checked={checked} onChange={onChange} className='login-role-radio' />
                {label}
                <span className='login-checkmark'></span>
            </label>
        </div>
    );
};

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('1');

    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (localStorage.getItem('user')) {
            navigate('/');
        }
    })

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await AuthApi.register({
                username,
                password,
                role,
            });
            console.log(response)
            // Handle successful login response
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('access_token', response.access_token);
            navigate('/profile-register');
            window.location.reload()
        } catch (error) {
            // Handle login error
            console.error('Login errorasa:', error);
        }
    };

    return (
        <div>
            <h2 className='login-header'>{t('register.text')}</h2>
            <form onSubmit={handleSubmit} className='login-container'>
                <div className='d-flex justify-content-end' style={{ width: '100%' }}>
                    <LanguageBtn />
                </div>
                <div className='login-role-container'>
                    <RadioField label={t('register.role.store')} value="1" checked={role === '1'} onChange={handleRoleChange} />
                    <RadioField label={t('register.role.user')} value="2" checked={role === '2'} onChange={handleRoleChange} />
                </div>
                <InputField label={t("login.username")} type="username" value={username} onChange={handleUsernameChange} />
                <div className="login-line"></div>
                <InputField label={t("login.password")} type="password" value={password} onChange={handlePasswordChange} />
                <button type="submit" className='login-submit'>{t('register.text')}</button>
                <div style={{ fontSize: '20px' }}>
                    <p>{t('register.have_acc_msg')} <Link to="/login">{t('register.login_msg')}</Link></p>
                </div>
            </form>
            <div>
            </div>
        </div>
    );
};

export default Register;
