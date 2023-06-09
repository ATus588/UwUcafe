import React from 'react'
import '../styles/create_store.css'
import penImg from '../images/pen.png'
import cameraImg from '../images/camera.png'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import apiClient from '../APIclient'
import ShowStar from '../components/showStar'
import MapPopup from '../components/MapPopup';

const Address = ({ address }) => {
    const { t } = useTranslation()
    const addr_num = address.substring(0, address.indexOf(' '));
    const addr_street = address.substring(address.indexOf(' ') + 1);
    return (
        <div style={{ fontSize: '20px' }}>{t('address_text', { addr_num, addr_street })}</div>
    )
}


function CreateStore() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { restaurantId } = useParams()

    const [changeName, setChangeName] = useState(false)
    const [previewImage, setPreviewImage] = useState(null);
    const [isLogoChange, setLogoChange] = useState(false);
    const defaultLat = 21.004175;
    const defaultLng = 105.843769;

    const [store, setStore] = useState({
        name: '',
        address: '',
        crowded_time: '8:00',
        end_crowded_time: '4:00',
        latitute: 21.0045,
        longtitude: 105.0014,
        services: []
    })
    const [newItem, setNewItem] = useState({ name: '', price: '', description: '' })

    const [user, setUser] = useState({})

    async function getData() {
        try {
            const response = await apiClient.get(`/restaurant/${restaurantId}`);
            const data = response.data.data
            console.log(data)
            setStore(data)
            let services = [];
            data.services.forEach(element => {
                services.push(element.id)
            });

            setStore({ ...data, services: services })

            console.log(store);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getData();
        const userJson = localStorage.getItem('user');
        const userP = userJson ? JSON.parse(userJson) : null;
        setUser(userP);
    }, [])

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
            var index = newServices.indexOf(parseInt(value));
            if (index > -1) {
                console.log(newServices)
                newServices.splice(index, 1);
                setStore({ ...store, services: newServices })
            }
        }
    }
    const handleAddItem = (event) => {
        let newMenu = store.items;
        newMenu.push(newItem)
        setStore({ ...store, items: newMenu })
        setNewItem({ name: '', price: '', description: '' })
    }
    const onChangeCrTime = (event) => {
        setStore({ ...store, crowded_time: event.target.value })
    }
    const onChangeCrTimeEnd = (event) => {
        setStore({ ...store, end_crowded_time: event.target.value })
    }
    const removeItem = (index) => {
        let newMenu = store.items;
        newMenu.splice(index, 1);
        setStore({ ...store, items: [...newMenu] })
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

    const handleMapClick = (location) => {
        setStore({ ...store, ...location })
    }

    const handleSave = async () => {
        if (!isLogoChange) {
            delete store.logo;
        }
        console.log(store)
        try {
            const response = await apiClient.put(`/owned-restaurants/${restaurantId}`, { ...store })
            if (response.status === 200) {
                toast('Update success!')
                // navigate(0)
            }
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <>
            <div className="flex-container content_area">
                <div className="cafe_image_container">
                    {store.logo && <img className="image_change" src={store.logo} alt="" />}
                    <input id="image_input" type="file" hidden onChange={handleLogoChange}/>
                    <label htmlFor="image_input" className="flex-container align-content-center camera_button">
                        <img className="camera_icon" src={cameraImg} alt="" />
                        <div className="camera_text">
                            {t('profile.avatar_change')}
                        </div>
                    </label>
                    <div className='save-btn' onClick={handleSave}>{t('profile.save_button')}</div>
                    <div className='save-btn' onClick={() => navigate(`/restaurant/${store.id}/reviews`)} style={{marginTop: '20px'}}>{t('review_btn')}</div>
                </div>

                <div className="divine-line">
                </div>

                <div className="cafe_info_container">
                    <div className="flex-container space-between">
                        {changeName ? <input className='store-name-input' onChange={onChangeName} /> : <div className='cafe_name'>{store.name}</div>}

                        <img src={penImg} style={{ height: '50px', alignSelf: "flex-end" }} alt="" onClick={() => setChangeName(!changeName)} />
                    </div>
                    <div className="flex-container space-between">
                        {changeName ? <input className='store-address-input' onChange={onChangeAddress} /> : <Address address={store.address} />}
                        {changeName ? <MapPopup onMapClick={handleMapClick} mapLocation={{ latitude: store.latitude > 1 ? store.latitude : defaultLat, longitude: store.longitude > 1 ? store.longitude : defaultLng }} /> : <></>}
                    </div>
                    {store.total_star && <ShowStar star={store.total_star} total_review={store.view} />}
                    <div className="flex-container space-between">
                        <div className="title">
                            {t('restaurant.menu')}
                        </div>
                        <img src={penImg} style={{ height: '50px', alignSelf: "flex-end" }} alt="" />
                    </div>

                    <div className="divine-line-horizontal">
                    </div>

                    <div className="menu_container">
                        <div className="menu_input_item flex-container space-between">
                            <input id="drink_input" className="custom_input_store" type="text" onChange={(event) => setNewItem({ ...newItem, name: event.target.value })} value={newItem.name}/>
                            <input id="price_input" className="custom_input_store price_input" onChange={(event) => setNewItem({ ...newItem, price: event.target.value })} value={newItem.price}/>
                            <button className='save-btn' style={{width: '50px'}} onClick={handleAddItem}>{t('add_btn')}</button>
                        </div>
                        {
                            store.items && store.items.map((item, index) => {
                                return (
                                    <div className="flex-container space-between menu_item align-items-center" style={{margin: '20px 0'}} key={index}>
                                        <div className="drink" style={{width: '380px'}}>
                                            {item.name}
                                        </div>
                                        <div className="price">
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

                    <div className="flex-container space-between">
                        <div className="title">
                            {t('services')}
                        </div>
                        <img src={penImg} style={{ height: '50px', alignSelf: "flex-end" }} alt="" />
                    </div>

                    <div className="divine-line-horizontal">
                    </div>

                    <div className="option_container">
                        <label className="container">
                            <div className="option_text">
                                {t('restaurant.service1')}
                            </div>
                            <input checked={store.services.some(item => item == 1)} type="checkbox" value={1} onChange={onChangeCheckbox} />
                            <span className="checkmark"></span>
                        </label>
                        <label className="container">
                            <div className="option_text">
                                {t('restaurant.service2')}
                            </div>
                            <input checked={store.services.some(item => item == 2)} type="checkbox" value={2} onChange={onChangeCheckbox} />
                            <span className="checkmark"></span>
                        </label>
                        <label className="container">
                            <div className="option_text">
                                {t('restaurant.service3')}
                            </div>
                            <input checked={store.services.some(item => item == 3)} type="checkbox" value={3} onChange={onChangeCheckbox} />
                            <span className="checkmark"></span>
                        </label>
                        <label className="container">
                            <div className="option_text">
                                {t('restaurant.service4')}
                            </div>
                            <input checked={store.services.some(item => item == 4)} type="checkbox" value={4} onChange={onChangeCheckbox} />
                            <span className="checkmark"></span>
                        </label>
                    </div>

                    <div className="flex-container align-content-center">
                        <div className="time">
                            {t('restaurant.crowded_time')}
                        </div>
                        {
                            store.crowded_time && <>
                                <input type="text" className="custom_input_store time_input" value={store.crowded_time} onChange={onChangeCrTime} />
                                <input type="text" className="custom_input_store time_input" value={store.end_crowded_time} onChange={onChangeCrTimeEnd} />
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateStore