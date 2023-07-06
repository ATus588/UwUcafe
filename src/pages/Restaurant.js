import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../APIclient'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck, faSquare } from '@fortawesome/free-regular-svg-icons'
import { faStar, faImage } from '@fortawesome/free-regular-svg-icons'
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
import Star from '../components/showStar';
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import UserAvatar from '../components/UserAvatar'
import defaultAvatar from '../images/defaultavatar.jpg'
import axios from 'axios'
import { toast } from 'react-toastify'

const Address = ({ address }) => {
    const { t } = useTranslation()
    const addr_num = address.substring(0, address.indexOf(' '));
    const addr_street = address.substring(address.indexOf(' ') + 1);
    return (
        <div style={{ fontSize: '20px' }}>{t('address_text', { addr_num, addr_street })}</div>
    )
}

function Restaurant() {
    const { t } = useTranslation()
    const { restaurantId } = useParams();

    const [data, setData] = useState({});
    const [user, setUser] = useState({});
    const [reviewContent, setReviewContent] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [hoverStar, setHoverStar] = useState(0);
    const [newStar, setNewStar] = useState(0);
    const navigate = useNavigate();

    async function getData() {
        try {
            const response = await apiClient.get(`/restaurant/${restaurantId}`);
            console.log(response.data.data)
            setData(response.data.data);
            console.log(data);
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

    const convertToCurrency = (value) => {
        const formatter = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        });
        return formatter.format(value);
      }
    
      const handleContentChange = (e) => {
        setReviewContent(e.target.value);
      };
    
      const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
    
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newStar) {
            toast('Rating required');
            return
        }
    
        // Create a FormData object to send the form data
        const formData = new FormData();
        formData.append('star_rating', newStar);
        formData.append('content', reviewContent);
        if (selectedImage) {
            formData.append('image', selectedImage);
        }
        try {
            const response = await axios.post(`http://18.179.201.202:8000/api/restaurant/${restaurantId}/review`, formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            navigate(`/restaurant/${restaurantId}/reviews`)
        } catch (e) {
            toast(e);
        }
      };

      const handleBrowseClick = () => {
        document.getElementById('selectedFile').click();
      };

    return (
        <div className='res_detail_outer_container' >
            <div className='res-detail-container'>
                <div className="res-detail-left">
                    <img src={data.logo} alt={`${data.address}`} className="res-detail-img" />
                    <div className='res-detail-service-container'>
                        {/* {
                            data.services && data.services.map((service, index) => {
                                return (
                                    <>
                                        <div key={index} className='res-detail-service'>
                                            <FontAwesomeIcon icon={faSquareCheck} />
                                            <div>{t(`${service.name}`)}</div>
                                        </div>
                                    </>
                                )
                            })
                        } */}
                        {
                            data.services && <div>
                                <div className='res-detail-service d-flex justify-content-between'>
                                    <div><strong>{t(`air_condition`)}</strong></div>
                                    <FontAwesomeIcon icon={data.services.findIndex(item => item.id == 1) > -1 ? faSquareCheck : faSquare} />
                                </div>
                                <hr></hr>
                                <div className='res-detail-service d-flex justify-content-between'>
                                    <div>{t(`toilet`)}</div>
                                    <FontAwesomeIcon icon={data.services.findIndex(item => item.id == 2) > -1 ? faSquareCheck : faSquare} />
                                </div>
                                <div className='res-detail-service d-flex justify-content-between'>
                                    <div>{t(`parking_slot`)}</div>
                                    <FontAwesomeIcon icon={data.services.findIndex(item => item.id == 3) > -1 ? faSquareCheck : faSquare} />
                                </div>
                                <div className='res-detail-service d-flex justify-content-between'>
                                    <div>{t(`wifi`)}</div>
                                    <FontAwesomeIcon icon={data.services.findIndex(item => item.id == 4) > -1 ? faSquareCheck : faSquare} />
                                </div>
                            </div>
                        }
                    </div>
                    <div className='res-detail-crowdedtime'>
                        <div>{t('restaurant.crowded_time')} {`${data.crowded_time} ~ ${data.end_crowded_time}`}</div>
                        <div className='d-flex' style={{alignItems: 'end'}}><span className='d-inline' style={{marginRight: '15px'}}>{t('restaurant.now')}: </span><span className='res-detail-green-status'></span></div>
                    </div>
                </div>
                <div className="res-detail-right">
                    <div className='res-detail-info'>
                        <h1 style={{ fontSize: '60px' }}>{data.name}</h1>
                        {data.address && <Address address={data.address} />}
                        <Star star={data.total_star} />
                    </div>
                    <div>
                        <div className="res-detail-title">{t('restaurant.menu')}</div>
                        <div className='res-detail-menu-container'>
                            {data.items && data.items.map((item, index) => {
                                return (
                                    <>
                                        <div key={index} className="res-detail-menu-item">
                                            <div>{item.name}</div>
                                            <dir>{convertToCurrency(item.price)}</dir>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                        <div className="res-detail-title">{t('restaurant.rating')}</div>
                        {
                            user ?
                            <form style={{marginTop: '20px'}} className="create-review-container d-flex justify-content-center" onSubmit={handleSubmit}>
                            <UserAvatar src={user?.avatar || defaultAvatar} alt="User Avatar" width="50px" height="50px" />
                            <div style={{marginLeft: '15px'}}>
                                <div className='d-flex'>
                                    <div className="rating-container" style={{marginBottom: '10px'}}>
                                        <FontAwesomeIcon size="xl" icon={hoverStar >= 1 || newStar >= 1 ? faStarSolid : faStar} onMouseEnter={() => setHoverStar(1)} onMouseLeave={() => setHoverStar(0)} onClick={() => setNewStar(1)} />
                                        <FontAwesomeIcon size="xl" icon={hoverStar >= 2 || newStar >= 2 ? faStarSolid : faStar} onMouseEnter={() => setHoverStar(2)} onMouseLeave={() => setHoverStar(0)} onClick={() => setNewStar(2)} />
                                        <FontAwesomeIcon size="xl" icon={hoverStar >= 3 || newStar >= 3 ? faStarSolid : faStar} onMouseEnter={() => setHoverStar(3)} onMouseLeave={() => setHoverStar(0)} onClick={() => setNewStar(3)} />
                                        <FontAwesomeIcon size="xl" icon={hoverStar >= 4 || newStar >= 4 ? faStarSolid : faStar} onMouseEnter={() => setHoverStar(4)} onMouseLeave={() => setHoverStar(0)} onClick={() => setNewStar(4)} />
                                        <FontAwesomeIcon size="xl" icon={hoverStar >= 5 || newStar >= 5 ? faStarSolid : faStar} onMouseEnter={() => setHoverStar(5)} onMouseLeave={() => setHoverStar(0)} onClick={() => setNewStar(5)} />
                                    </div>
                                    <FontAwesomeIcon style={{marginLeft: '25px', cursor: 'pointer'}} size="xl" icon={faImage} onClick={() => handleBrowseClick()} />
                                    <input
                                        type="file"
                                        id="selectedFile"
                                        className='d-none'
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                    <div style={{marginLeft: '25px'}}>{selectedImage && selectedImage.name}</div>
                                </div>
                                <textarea
                                    id="reviewContent"
                                    value={reviewContent}
                                    onChange={handleContentChange}
                                    rows={1}
                                    required
                                    style={{width: '770px', background: '#dafab0', borderRadius: '40px', resize: 'none', outline: 'none', padding: '10px 20px'}}
                                />
                            </div>
                            <div><button type="submit" style={{border: '2px solid black', borderRadius: '30px', background: '#cdced0', padding: '10px 20px', margin: '0 0 5px 15px'}}>投稿</button></div>
                        </form> :
                        <textarea
                            id="reviewContent"
                            rows={1}
                            disabled
                            placeholder='Login to review'
                            style={{width: '100%', marginTop: '15px', background: '#dafab0', borderRadius: '40px', resize: 'none', outline: 'none', padding: '10px 20px'}}
                        />
                        }
                        <Link to={`/restaurant/${restaurantId}/reviews`} style={{ color: 'black', fontWeight: 'bold', fontSize: '20px' }}>{t('restaurant.see_review')}</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Restaurant