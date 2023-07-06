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
    const onChangeCrTime = (event) => {
        setStore({ ...store, crowded_time: event.target.value })
    }
    const onChangeCrTimeEnd = (event) => {
        setStore({ ...store, end_crowded_time: event.target.value })
    }
    // const removeItem = (item) => {
    //     let newMenu = store.items.filter(function (i) {
    //         return i !== item
    //     })
    //     setStore({ ...store, items: newMenu })
    // }

    const handleSave = async () => {
        console.log(store)
        try {
            const response = await apiClient.put(`/update_store`, { store })
            if (response.status === 200) {
                toast('Update success!')
                navigate(0)
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
                    <input id="image_input" type="file" hidden />
                    <label htmlFor="image_input" className="flex-container align-content-center camera_button">
                        <img className="camera_icon" src={cameraImg} alt="" />
                        <div className="camera_text">
                            Thay đổi hình ảnh
                        </div>
                    </label>
                    <div className='save-btn' onClick={handleSave}>Save</div>
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
                    </div>
                    {store.total_star && <ShowStar star={store.total_star} total_review={store.view} />}
                    <div className="flex-container space-between">
                        <div className="title">
                            Menu
                        </div>
                        <img src={penImg} style={{ height: '50px', alignSelf: "flex-end" }} alt="" />
                    </div>

                    <div className="divine-line-horizontal">
                    </div>

                    <div className="menu_container">
                        <div className="menu_input_item flex-container space-between">
                            <input id="drink_input" className="custom_input_store" type="text" onChange={(event) => setNewItem({ ...newItem, name: event.target.value })} />
                            <input id="price_input" className="custom_input_store price_input" type="number" onChange={(event) => setNewItem({ ...newItem, price: event.target.value })} />
                            <button className='' onClick={handleAddItem}>Add</button>
                        </div>
                        {
                            store.items && store.items.map((item, index) => {
                                return (
                                    <div className="flex-container space-between menu_item" key={index}>
                                        <div className="drink">
                                            {item.name}
                                        </div>
                                        <div className="price">
                                            {item.price}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="flex-container space-between">
                        <div className="title">
                            Tuỳ chọn
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
                            <input type="checkbox" value={1} onChange={onChangeCheckbox} />
                            <span className="checkmark"></span>
                        </label>
                        <label className="container">
                            <div className="option_text">
                                {t('restaurant.service2')}
                            </div>
                            <input type="checkbox" value={2} onChange={onChangeCheckbox} />
                            <span className="checkmark"></span>
                        </label>
                        <label className="container">
                            <div className="option_text">
                                {t('restaurant.service3')}
                            </div>
                            <input type="checkbox" value={3} onChange={onChangeCheckbox} />
                            <span className="checkmark"></span>
                        </label>
                        <label className="container">
                            <div className="option_text">
                                {t('restaurant.service4')}
                            </div>
                            <input type="checkbox" value={4} onChange={onChangeCheckbox} />
                            <span className="checkmark"></span>
                        </label>
                    </div>

                    <div className="flex-container align-content-center">
                        <div className="time">
                            Khung giờ đông khách
                        </div>
                        {
                            store.crowded_time && <>
                                <input type="text" className="custom_input_store time_input" value={store.crowded_time} onChange={onChangeCrTime} />
                                <input type="text" className="custom_input_store time_input" value={store.crowded_time_end} onChange={onChangeCrTimeEnd} />
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateStore