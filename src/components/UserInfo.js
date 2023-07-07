import React from 'react'
import UserAvatar from './UserAvatar'
import defaultAvatar from '../images/defaultavatar.jpg'
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function UserInfo() {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    const navigate = useNavigate();
    const { t } = useTranslation()

    const handleLogout = () => {
        // Delete access_token and user from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');

        // Redirect to the home page
        navigate('/')
        window.location.reload();
    };


    return (
        <div className='d-flex'>
            <Link to={`/profile`} style={{ color: 'unset', textDecoration: 'unset' }} className='d-flex'>
                <UserAvatar src={user?.avatar || defaultAvatar} alt="User Avatar" width="40px" height="40px" />
                <span style={{ lineHeight: '40px', marginLeft: '10px', marginRight: '20px', fontSize: '20px' }}>{user?.name}</span>
            </Link>
            {/* <div onClick={() => handleLogout()} className='logout-btn'>{t('logout')}</div> */}
        </div>
    )
}

export default UserInfo