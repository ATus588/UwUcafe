import React from 'react'
import { useEffect, useRef, useState } from 'react'
import '../styles/listStore.css'
import { useTranslation } from 'react-i18next'
import apiClient from '../APIclient'
import RestaurantCard from '../components/RestaurantCard'
import { Link } from 'react-router-dom'

function ListStore() {

    const [restaurants, setRestaurants] = useState([]);
    const { t } = useTranslation()

    async function getRestaurants() {
        try {
            const response = await apiClient.get('/owned-restaurants');
            setRestaurants(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getRestaurants();
    }, [])
    return (
        <div className='list-store-container'>
            <h1 className='list-store-title'>{t('owner.store_list')}</h1>
            <div className="list-store-result">
                {
                    restaurants.map((restaurant) => {
                        return <RestaurantCard restaurant={restaurant} key={restaurant.id} />
                    })
                }
            </div>

            <Link to='./new' style={{ textDecoration: 'none', color: 'black' }}><div className='create-new-store-btn'>{t('owner.add_btn')}</div></Link>
        </div>
    )
}

export default ListStore