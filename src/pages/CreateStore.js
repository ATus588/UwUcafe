import React from 'react'
import '../styles/create_store.css'
import penImg from '../images/pen.png'
import cameraImg from '../images/camera.png'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import apiClient from '../APIclient'
import ShowStar from '../components/showStar'

const Address = ({ address }) => {
    const { t } = useTranslation()
    const addr_num = address.substring(0, address.indexOf(' '));
    const addr_street = address.substring(address.indexOf(' ') + 1);
    return (
        <div style={{ fontSize: '20px' }}>{t('address_text', { addr_num, addr_street })}</div>
    )
}


function CreateStore() {

    const { t } = useTranslation()
    const { restaurantId } = useParams()

    const [changeName, setChangeName] = useState(false)

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
        console.log(store)
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
            newServices.push(value)
            setStore({ ...store, services: newServices })
        } else {
            var index = newServices.indexOf(value);
            if (index > -1) {
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
    const removeItem = (item) => {
        let newMenu = store.items.filter(function (i) {
            return i !== item
        })
        setStore({ ...store, items: newMenu })
    }

    function onSubmit(event) {
        console.log(store);

    }

    return (
        <>
            <div class="flex-container content_area">
                <div class="cafe_image_container">
                    {store.logo && <img class="image_change" src={store.logo} alt="" />}
                    <input id="image_input" type="file" hidden />
                    <label for="image_input" class="flex-container align-content-center camera_button">
                        <img class="camera_icon" src={cameraImg} alt="" />
                        <div class="camera_text">
                            Thay đổi hình ảnh
                        </div>
                    </label>
                    <div className='save-btn' onClick={() => onSubmit()}>Save</div>
                </div>

                <div class="divine-line">
                </div>

                <div class="cafe_info_container">
                    <div class="flex-container space-between">
                        {changeName ? <input className='store-name-input' onChange={onChangeName} /> : <div className='cafe_name'>{store.name}</div>}

                        <img src={penImg} style={{ height: '50px', alignSelf: "flex-end" }} alt="" onClick={() => setChangeName(!changeName)} />
                    </div>
                    <div class="flex-container space-between">
                        {changeName ? <input className='store-address-input' onChange={onChangeAddress} /> : <Address address={store.address} />}
                    </div>
                    {store.total_star && <ShowStar star={store.total_star} total_review={store.view} />}
                    <div class="flex-container space-between">
                        <div class="title">
                            Menu
                        </div>
                        <img src={penImg} style={{ height: '50px', alignSelf: "flex-end" }} alt="" />
                    </div>

                    <div class="divine-line-horizontal">
                    </div>

                    <div class="menu_container">
                        <div class="menu_input_item flex-container space-between">
                            <input id="drink_input" class="custom_input_store" type="text" onChange={(event) => setNewItem({ ...newItem, name: event.target.value })} />
                            <input id="price_input" class="custom_input_store price_input" type="number" onChange={(event) => setNewItem({ ...newItem, price: event.target.value })} />
                            <button className='' onClick={handleAddItem}>Add</button>
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
                                        <div onClick={removeItem(item)}>
                                            remove
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div class="flex-container space-between">
                        <div class="title">
                            Tuỳ chọn
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
                            Khung giờ đông khách
                        </div>
                        {
                            store.crowded_time && <>
                                <input type="text" class="custom_input_store time_input" value={store.crowded_time} />
                                <input type="text" class="custom_input_store time_input" value={store.crowded_time_end} />
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateStore