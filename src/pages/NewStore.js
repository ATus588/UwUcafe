import React from 'react'
import '../styles/create_store.css'
import penImg from '../images/pen.png'
import cameraImg from '../images/camera.png'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import apiClient from '../APIclient'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function NewStore() {
    const navigate = useNavigate()

    const { t } = useTranslation()

    const [store, setStore] = useState({
        name: '',
        address: '',
        crowded_time: '8:00',
        end_crowded_time: '4:00',
        latitute: 21.0045,
        longtitude: 105.0014,
        items: [],
        services: []
    })


    const [newItem, setNewItem] = useState({ name: '', price: '', description: '' })

    const [user, setUser] = useState({})
    const [previewImage, setPreviewImage] = useState(null);
    const [isLogoChange, setLogoChange] = useState(false);

    const onChangeName = (event) => {
        setStore({ ...store, name: event.target.value })
    }

    const onChangeAddress = (event) => {
        setStore({ ...store, address: event.target.value })
    }
    const onChangeCheckbox = (event) => {
        const { checked, value } = event.target
        let newServices = store.services
        if (checked) {
            if (value == '1') {
                newServices.push(1)
            }
            if (value == '2') {
                newServices.push(2)
            }
            if (value == '3') {
                newServices.push(3)
            }
            if (value == '4') {
                newServices.push(4)
            }
            setStore({ ...store, services: newServices })
        } else {
            var index = newServices.indexOf(value);
            if (index > -1) {
                newServices.splice(index, 1);
                setStore({ ...store, services: newServices })
            }
        }
    }
    const handleAddItem = () => {
        let newMenu = store.items;

        newMenu.push(newItem)

        setStore({ ...store, items: newMenu })
        setNewItem({ name: '', price: '', description: '' })
    }
    const removeItem = (index) => {
        let newMenu = store.items;
        newMenu.splice(index, 1);
        setStore({ ...store, items: [...newMenu] })
    }

    const onChangeCrTime = (event) => {
        setStore({ ...store, crowded_time: event.target.value })
    }
    const onChangeCrTimeEnd = (event) => {
        setStore({ ...store, end_crowded_time: event.target.value })
    }
    const toBase64 = (file) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          console.log(reader.result)
          setStore({ ...store, logo: reader.result })
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      }

    const handleLogoChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            toBase64(file)
            setPreviewImage(URL.createObjectURL(file));
            setLogoChange(true);
        }
    };


    const handleSave = async () => {
        if (!isLogoChange) {
            delete store.logo;
        }
        try {
            const response = await apiClient.post(`/create-store`, { ...store })
            if (response.status === 200) {
                toast('Create success!')
                navigate('/owner/restaurant')
            }
        } catch (e) {
            console.log(e)
        }
    };
    return (
        <>
            <div class="flex-container content_area">
                <div class="cafe_image_container">
                    <img className="image_change" src='https://img.lovepik.com/free-png/20211109/lovepik-store-icon-png-image_400680314_wh1200.png' alt="" />
                    <input id="image_input" type="file" hidden onChange={handleLogoChange}/>
                    <label for="image_input" class="flex-container align-content-center camera_button">
                        <img class="camera_icon" src={cameraImg} alt="" />
                        <div class="camera_text">
                            {t('profile.avatar_change')}
                        </div>
                    </label>
                    <div className='save-btn' onClick={() => handleSave()}>Save</div>
                </div>

                <div class="divine-line">
                </div>

                <div class="cafe_info_container">
                    <div class="flex-container space-between">
                        <input className='store-name-input' onChange={onChangeName} />
                        <img src={penImg} style={{ height: '50px', alignSelf: "flex-end" }} alt="" />
                    </div>
                    <div class="flex-container space-between">
                        <input className='store-address-input' onChange={onChangeAddress} />
                    </div>
                    <div class="flex-container space-between">
                        <div class="title">
                            {t('restaurant.menu')}
                        </div>
                        <img src={penImg} style={{ height: '50px', alignSelf: "flex-end" }} alt="" />
                    </div>

                    <div class="divine-line-horizontal">
                    </div>

                    <div class="menu_container">
                        <div class="menu_input_item flex-container space-between">
                            <input id="drink_input" class="custom_input_store" type="text" onChange={(event) => setNewItem({ ...newItem, name: event.target.value })} value={newItem.name} />
                            <input id="price_input" class="custom_input_store price_input" onChange={(event) => setNewItem({ ...newItem, price: event.target.value })} value={newItem.price} />
                            <button className="save-btn" style={{width: '50px'}} onClick={handleAddItem}>{t('add_btn')}</button>
                        </div>
                        {
                            store.items && store.items.map((item, index) => {
                                return (
                                    <div class="flex-container space-between menu_item" key={index}>
                                        <div class="drink">
                                            {item.name}
                                        </div>
                                        <div class="price">
                                            {item.price}
                                        </div>
                                        <button className="save-btn" style={{width: '50px', height: '43px'}} onClick={() => removeItem(index)}>
                                            {t('remove_btn')}
                                        </button>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div class="flex-container space-between">
                        <div class="title">
                            {t('services')}
                        </div>
                        <img src={penImg} style={{ height: '50px', alignSelf: "flex-end" }} alt="" />
                    </div>

                    <div class="divine-line-horizontal">
                    </div>

                    <div class="option_container">
                        <label class="container">
                            <div class="option_text">
                                {t('restaurant.service1')}
                            </div>
                            <input type="checkbox" value={1} onChange={onChangeCheckbox} />
                            <span class="checkmark"></span>
                        </label>
                        <label class="container">
                            <div class="option_text">
                                {t('restaurant.service2')}
                            </div>
                            <input type="checkbox" value={2} onChange={onChangeCheckbox} />
                            <span class="checkmark"></span>
                        </label>
                        <label class="container">
                            <div class="option_text">
                                {t('restaurant.service3')}
                            </div>
                            <input type="checkbox" value={3} onChange={onChangeCheckbox} />
                            <span class="checkmark"></span>
                        </label>
                        <label class="container">
                            <div class="option_text">
                                {t('restaurant.service4')}
                            </div>
                            <input type="checkbox" value={4} onChange={onChangeCheckbox} />
                            <span class="checkmark"></span>
                        </label>
                    </div>

                    <div class="flex-container align-content-center">
                        <div class="time">
                            {t('restaurant.crowded_time')}
                        </div>
                        {
                            store.crowded_time && <>
                                <input type="text" class="custom_input_store time_input" value={store.crowded_time} onChange={onChangeCrTime} />
                                <input type="text" class="custom_input_store time_input" value={store.end_crowded_time} onChange={onChangeCrTimeEnd} />
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewStore