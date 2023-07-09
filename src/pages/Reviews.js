import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/reviews.css';
import apiClient from '../APIclient'
import ShowStar from '../components/showStar'
import UserAvatar from '../components/UserAvatar'
import defaultAvatar from '../images/defaultavatar.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faImage } from '@fortawesome/free-regular-svg-icons'
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'

import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify';
import axios from 'axios';


const Address = ({ address }) => {
    const { t } = useTranslation()
    const addr_num = address.substring(0, address.indexOf(' '));
    const addr_street = address.substring(address.indexOf(' ') + 1);
    return (
        <div className='info-content__address'>{t('address_text', { addr_num, addr_street })}</div>
    )
}

function Reviews() {
    const { t } = useTranslation()
    const { restaurantId } = useParams();
    const [user, setUser] = useState({})
    const [reviews, setReviews] = useState([])
    const [restaurant, setRestaurant] = useState({})
    const [toggleState, setToggleState] = useState(0);
    const [currentPage, setCurrentPage] = useState(1)
    const [orderBy, setOrderBy] = useState('date');
    const [starRating, setStarRating] = useState(0);
    const [reviewContent, setReviewContent] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [hoverStar, setHoverStar] = useState(0);
    const [newStar, setNewStar] = useState(0);

    const userJson = localStorage.getItem('user');
    const currentUser = userJson ? JSON.parse(userJson) : null;

    async function getData() {
        try {
            const response1 = await apiClient.get(`/restaurant/${restaurantId}`);
            const response2 = await apiClient.get(`/restaurant/${restaurantId}/review?order_by=date&per_page=5&current_page=1`)
            setRestaurant(response1.data.data);
            setReviews(response2.data.data);
            console.log(reviews)
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

    //pagination
    const handlePageChange = async (newPage) => {
        try {
            setCurrentPage(newPage)
            const response = await apiClient.get(`/restaurant/${restaurantId}/review?order_by=${orderBy}&per_page=5&current_page=${newPage}`);
            setReviews(response.data.data);
            console.log(reviews)
        } catch (error) {
            console.error(error);
        }
    };

    const starFilter = async (star_rating) => {
        try {
            setStarRating(star_rating)
            if (star_rating > 0) {
                const response = await apiClient.get(`/restaurant/${restaurantId}/review?order_by=${orderBy}&per_page=5&current_page=1&star_rating=${star_rating}`);
                setReviews(response.data.data);
                setCurrentPage(1)
            } else {
                const response = await apiClient.get(`/restaurant/${restaurantId}/review?order_by=${orderBy}&per_page=5&current_page=1`);
                setReviews(response.data.data);
                setCurrentPage(1)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const orderReview = async (order) => {
        setOrderBy(order);
        try {
            if (starRating > 0) {
                const response = await apiClient.get(`/restaurant/${restaurantId}/review?order_by=${order}&per_page=5&current_page=1&star_rating=${starRating}`);
                setReviews(response.data.data);
                setCurrentPage(1)
            } else {
                const response = await apiClient.get(`/restaurant/${restaurantId}/review?order_by=${order}&per_page=5&current_page=1`);
                setReviews(response.data.data);
                setCurrentPage(1)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const toggleTab = (index) => {
        setToggleState(index);
        starFilter(index)
    };

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
            const response = await axios.post(`http://43.207.160.102:8000/api/restaurant/${restaurantId}/review`, formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            window.location.reload();
        } catch (e) {
            toast(e);
        }
      };

      const handleBrowseClick = () => {
        document.getElementById('selectedFile').click();
      };

    return (
        <div className="wrapper">
            <div className="container">
                <div className="box">
                    {/* <!-- Info --> */}
                    <div className="info">
                        <div className="info__image">
                            <img src={restaurant.logo} alt="" className="" />
                        </div>
                        <div className="info-content">
                            <h3 className="info-content__name">{restaurant.name}</h3>
                            {restaurant.address && <Address address={restaurant.address} />}
                            <div className="info-bottom">
                                {restaurant.view && <ShowStar star={restaurant.total_star} total_review={restaurant.view} />}
                            </div>
                        </div>
                    </div>
                    {/* <!-- Preview --> */}
                    <main className="preview">
                        <div className="filter-stars">
                            <h3 className="filter-stars__label">レビュー</h3>
                            <div className="filter-stars__buttons">
                                <div className={toggleState === 0 ? "btn-active" : "btn"} onClick={() => toggleTab(0)}>{t('review.all_filter')}</div>
                                <div className={toggleState === 5 ? "btn-active" : "btn"} onClick={() => toggleTab(5)}>5{t('review.star')}</div>
                                <div className={toggleState === 4 ? "btn-active" : "btn"} onClick={() => toggleTab(4)}>4{t('review.star')}</div>
                                <div className={toggleState === 3 ? "btn-active" : "btn"} onClick={() => toggleTab(3)}>3{t('review.star')}</div>
                                <div className={toggleState === 2 ? "btn-active" : "btn"} onClick={() => toggleTab(2)}>2{t('review.star')}</div>
                                <div className={toggleState === 1 ? "btn-active" : "btn"} onClick={() => toggleTab(1)}>1{t('review.star')}</div>
                            </div>
                        </div>
                        <div className="filter-comment">
                            <label className="select" for="slct">
                                <select id="slct" required="required" value={orderBy} onChange={(e) => orderReview(e.target.value)}>
                                    <option value="" disabled="disabled" selected="selected">
                                        Select option
                                    </option>
                                    <option value="date">1.最も最近の</option>
                                    <option value="star_rating">2.最も評価の</option>
                                </select>
                                <FontAwesomeIcon icon={faArrowDown} style={{ width: '20px', height: '15px' }} />
                            </label>

                        </div>
                        {/* <!-- Comment --> */}
                        <div className="comment-wrapper">
                            <ul className="comment">
                                {reviews.length > 0 && reviews.map((review, index) => {
                                    console.log(review)
                                    return (
                                        <li className="comment-item" key={index}>
                                            <i className="fa-regular fa-circle-user comment-item__avatar"></i>
                                            <div className="comment-content">
                                                <img src={review.user.avatar} style={{borderRadius: '50%'}} className='comment-item__avatar' />
                                                <h3 className="comment-content__user">{review.user.username}</h3>
                                                <div className="comment-content__stars">
                                                    <ShowStar star={review.star_rating} />
                                                </div>
                                                {review.image ? <div className="comment-content__images">
                                                    <img
                                                        src={review.image}
                                                    />
                                                </div> : <></>}
                                                <div className="comment-content__text">
                                                    {review.content}
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div className="pagination-wrapper">
                            {/* <div className="pagination">
                                <button className="pagination__button active">1</button>
                                <button className="pagination__button">2</button>
                                <button className="pagination__button">3</button>
                            </div> */}
                            <div>
                                {
                                    currentPage === 1 && (
                                        <nav aria-label="Page navigation example">
                                            <ul className="pagination">
                                                <li className={"page-item active"}><a className="page-link" href="#" onClick={() => handlePageChange(currentPage)}>{currentPage}</a></li>
                                                <li className="page-item" onClick={() => handlePageChange(currentPage + 1)}><a className="page-link" href="#">{currentPage + 1}</a></li>
                                                <li className="page-item"><a className="page-link" href="#" onClick={() => handlePageChange(currentPage + 2)}>{currentPage + 2}</a></li>
                                            </ul>
                                        </nav>
                                    )
                                }
                            </div>
                            <div>
                                {
                                    currentPage > 1 && (
                                        <nav aria-label="Page navigation example">
                                            <ul className="pagination">
                                                <li className={"page-item"}><a className="page-link" href="#" onClick={() => handlePageChange(currentPage - 1)}>{currentPage - 1}</a></li>
                                                <li className="page-item active" onClick={() => handlePageChange(currentPage)}><a className="page-link" href="#">{currentPage}</a></li>
                                                <li className="page-item"><a className="page-link" href="#" onClick={() => handlePageChange(currentPage + 1)}>{currentPage + 1}</a></li>
                                            </ul>
                                        </nav>
                                    )
                                }
                            </div>
                        </div>
                    </main>
                    <hr></hr>
                    <div>
                        {currentUser ? ( currentUser.role != 1 ? <form className="create-review-container d-flex justify-content-center" onSubmit={handleSubmit}>
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
                                        id="selectedFile"
                                        type="file"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className='d-none'
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
                        </form> : <></>) : <textarea
                                    id="reviewContent"
                                    rows={1}
                                    disabled
                                    placeholder='Login to review'
                                    style={{width: '100%', background: '#dafab0', borderRadius: '40px', resize: 'none', outline: 'none', padding: '10px 20px'}}
                                />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reviews