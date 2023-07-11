import React from 'react'
import defaulImage from '../images/defaultavatar.jpg'
import { useTranslation } from 'react-i18next';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import Star from './showStar';

function RestaurantCard({ restaurant }) {

    const { t } = useTranslation()

    const { name, address, total_star, logo, id } = restaurant;

    const addr_num = address.substring(0, address.indexOf(' '));
    const addr_street = address.substring(address.indexOf(' ') + 1);

    const user = JSON.parse(localStorage.getItem('user'))
    return (
        <div className="restaurant-card">
            <img src={logo ? logo : defaulImage} alt={`beautiful ${name}`} className='res-img-home' />
            <div>
                <div>{`${name}`}</div>
                <div>{t('address_text', { addr_num, addr_street })}</div>
                <Star star={total_star} />
            </div>
            <Link to={ (user && user.role == 1 && user.restaurants?.findIndex(item => item.id === id) > -1) ? `/owner/restaurant/${id}` : `/restaurant/${id}`} style={{ textAlign: 'end' }}>
                <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
            </Link>
        </div>
    )
}

export default RestaurantCard