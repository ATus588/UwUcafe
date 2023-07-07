import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import apiClient from '../APIclient'

import History from '../components/searchHistory'
import RestaurantCard from '../components/RestaurantCard'
import PopupStar from '../components/PopupStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faRotateRight } from '@fortawesome/free-solid-svg-icons'

const district_list = [
    'BaDinh_dis', 'HoanKiem_dis', 'TayHo_dis', 'LongBien_dis', 'CauGiay_dis'
]
// const district_list_trans = [
//     'バーディン地区', 'ホアンキエム地区', 'タイホー地区', 'ロンビエン地区', 'カウザイ地区', 'ドングダ地区', 'ハイバチュン地区', 'ホアングマイ地区', 'タンスアン地区', 'ハドン地区'
// ]

function Home() {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [toggleState, setToggleState] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5; // Assuming 10 items per page

    const toggleTab = (index) => {
        setToggleState(index);
    };

    // fetch data
    const [restaurants, setRestaurants] = useState([]);
    const [total, setTotal] = useState(0);

    async function getRestaurants() {
        try {
            const response = await apiClient.get('/restaurant', { params: 
                {
                    per_page: perPage,
                    current_page: 1,
                } 
            });
            setRestaurants(response.data);
            setTotal(total + response.data.length);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getRestaurants();
    }, [])

    //form handler
    const [values, setValues] = useState({
        name: '',
        district: '',
        service: '',
        star_rating: '',
        is_crowded: null,
        current_page: currentPage,
        per_page: perPage,
    })

    async function SearchRes(values) {
        //fetch newdata
        try {
            const response = await apiClient.get('/restaurant', { params: values });
            setRestaurants(response.data);
            setTotal(response.data.length);
        } catch (error) {
            console.error(error);
        }
        //add history
        if (values.name !== '') {
            const h = localStorage.getItem('searchHistory') || '';
            const H = h.split('+')
            if (H.includes(values.name) === false) {
                if (h.length === 0) localStorage.setItem('searchHistory', values.name)
                else localStorage.setItem('searchHistory', `${h}+${values.name}`)
            }
        }
        setOpen(false)
        console.log(values)
        console.log('Submit form');
    }

    const handlePageChange = async (newPage) => {
        try {
            setCurrentPage(newPage)
            const response = await apiClient.get('/restaurant', { params: {...values, current_page: newPage} });
            setRestaurants(response.data);
            setTotal(response.data.length);
        } catch (error) {
            console.error(error);
        }
        //add history
        if (values.name !== '') {
            const h = localStorage.getItem('searchHistory') || '';
            const H = h.split('+')
            if (H.includes(values.name) === false) {
                if (h.length === 0) localStorage.setItem('searchHistory', values.name)
                else localStorage.setItem('searchHistory', `${h}+${values.name}`)
            }
        }
        setOpen(false)
        console.log(values)
        console.log('Submit form');
      };

    const onSubmit = event => {
        event.preventDefault();
        SearchRes(values);
    }

    const onChangeText = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    }

    const onChangeRating = (event) => {
        const { checked, value } = event.target
        if (checked) {
            values.star_rating = values.star_rating + `${value},`;
            setValues({ ...values })
        } else {
            values.star_rating = values.star_rating.replace(`${value},`, '')
        }
    }
    const onChangeDistrict = (event) => {
        const { checked, value } = event.target
        if (checked) {
            values.district = values.district + `${value},`;
            setValues({ ...values })
        } else {
            values.district = values.district.replace(`${value},`, '')
        }
    }
    const onChangeService = (event) => {
        const { checked, value } = event.target
        if (checked) {
            values.service = values.service + `${value},`;
            setValues({ ...values })
        } else {
            values.service = values.service.replace(`${value},`, '')
        }
    }
    const onChangeCrowded = (event) => {
        const { checked, value } = event.target
        if (checked) {
            if (value === '1') values.is_crowded = false
            if (value === '2') values.is_crowded = true
            setValues({ ...values })
        }
    }

    function removeOption() {
        setValues({
            name: '',
            district: '',
            service: '',
            star_rating: '',
            is_crowded: null
        })
        const checkboxs = document.querySelectorAll('.myCheckbox')
        checkboxs.forEach(checkbox => {
            checkbox.checked = false
        })
    }

    //click out to hide history
    const historyRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (!historyRef.current.contains(e.target)) {
                setShowHistory(false);
            }
        }
        document.addEventListener("mousedown", handler)

        return () => {
            document.removeEventListener("mousedown", handler)
        }
    })

    //set name callback in history component 
    function setName(name) {
        values.name = name;
        setValues({ ...values })
    }
    return (
        <>
            <div className="homepage-container">
                <div className="search-container">
                    <div className="search-left">
                        <div className="search-text">{t('search_text')}</div>
                        <button className="option-btn" onClick={() => setOpen(!open)}>{t('services')}</button>
                    </div>
                    <div className="search-right" ref={historyRef}>
                        <form onSubmit={onSubmit} autoComplete='off'>
                            <input type='textinput' name='name' value={values.name} onChange={onChangeText} className='search-bar' onClick={() => setShowHistory(true)} id='searchBar' />
                            <button type='submit' className='search-btn'>
                                <FontAwesomeIcon icon={faSearch} className='search-btn-icon' />
                            </button>

                            {/* the filter popup */}
                            <div className={open ? 'option-form' : 'tab-content-inactive'}>
                                <div className="option-popup-header">{t('filter')}</div>
                                <div className='popup-inside-container'>
                                    <div>
                                        <div className="tab-container">
                                            <div>
                                                <div className={toggleState === 1 ? "tab" : "tab-inactive"} onClick={() => toggleTab(1)}>{t('location')}</div>
                                                <div className={toggleState === 2 ? "tab" : "tab-inactive"} onClick={() => toggleTab(2)}>{t('rating')}</div>
                                                <div className={toggleState === 3 ? "tab" : "tab-inactive"} onClick={() => toggleTab(3)}>{t('service')}</div>
                                                <div className={toggleState === 4 ? "tab" : "tab-inactive"} onClick={() => toggleTab(4)}>{t('is_crowded')}</div>
                                            </div>
                                            <div className={toggleState === 1 ? "tab-content" : "tab-content-inactive"}>
                                                {
                                                    district_list.map((dis, index) => {
                                                        return (
                                                            <div className="district-checkbox-home" key={index}>
                                                                <label className="myLabel" htmlFor={'district-home' + index}>{t(dis)}
                                                                    <input type="checkbox" value={index + 1} onChange={onChangeDistrict} name='district' id={'district-home' + index} className="myCheckbox" />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            <div className={toggleState === 2 ? "tab-content" : "tab-content-inactive"}>
                                                <label className="myLabel" htmlFor="star5">
                                                    <PopupStar className='show-star-home' star={5} />
                                                    <input type="checkbox" value='5' onChange={onChangeRating} name='star-rating' id="star5" className="myCheckbox" />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="myLabel" htmlFor="star4">
                                                    <PopupStar className='show-star-home' star={4} />
                                                    <input type="checkbox" value='4' onChange={onChangeRating} name='star-rating' id="star4" className="myCheckbox" />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="myLabel" htmlFor="star3">
                                                    <PopupStar className='show-star-home' star={3} />
                                                    <input type="checkbox" value='3' onChange={onChangeRating} name='star-rating' id="star3" className="myCheckbox" />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="myLabel" htmlFor="star2">
                                                    <PopupStar className='show-star-home' star={2} />
                                                    <input type="checkbox" value='2' onChange={onChangeRating} name='star-rating' id="star2" className="myCheckbox" />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="myLabel" htmlFor="star1">
                                                    <PopupStar className='show-star-home' star={1} />
                                                    <input type="checkbox" value='1' onChange={onChangeRating} name='star-rating' id="star1" className="myCheckbox" />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                            <div className={toggleState === 3 ? "tab-content" : "tab-content-inactive"}>
                                                <label className="myLabel" htmlFor='service1'>{t('aircon')}
                                                    <input type="checkbox" value="1" onChange={onChangeService} name='service' id='service1' className="myCheckbox" />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="myLabel" htmlFor='service2'>{t('smoking_room')}
                                                    <input type="checkbox" value="2" onChange={onChangeService} name='service' id='service2' className="myCheckbox" />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="myLabel" htmlFor='service3'>{t('parking_lot')}
                                                    <input type="checkbox" value="3" onChange={onChangeService} name='service' id='service3' className="myCheckbox" />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="myLabel" htmlFor='service4'>{t('toilet')}
                                                    <input type="checkbox" value="4" onChange={onChangeService} name='service' id='service4' className="myCheckbox" />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                            <div className={toggleState === 4 ? "tab-content" : "tab-content-inactive"}>
                                                <label className="myLabel" htmlFor='is_crowded'>{t('is_crowded_false')}
                                                    <input type="radio" value="1" onChange={onChangeCrowded} name='status' id='is_crowded' className="myCheckbox" />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="myLabel" htmlFor='not_crowded'>{t('is_crowded_true')}
                                                    <input type="radio" value="2" onChange={onChangeCrowded} name='status' id='not_crowded' className="myCheckbox" />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>

                                        </div>
                                        <div className="button-container">
                                            <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} type='button' onClick={removeOption}>
                                                <FontAwesomeIcon icon={faRotateRight} rotation={270} style={{ height: '30px', color: '#7b7aaf' }} />
                                            </button>
                                            <button className='option-popup-btn' onClick={() => setOpen(false)} type='button'>{t('cancel')}</button>
                                            <button type='submit' className='option-popup-btn'>{t('confirm_filter')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </form>
                        {showHistory && <History setName={setName} />}
                    </div>
                </div >
                {/* total result and show the result */}
                < div className="total-result" > {t('total_text', { total })}</div >
                <div className="result-container">
                    {
                        restaurants.map((restaurant) => {
                            return <RestaurantCard restaurant={restaurant} key={restaurant.id} />
                        })
                    }
                </div>
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

            </div >
        </>
    )
}

export default Home