import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

function ShowStar({ star, total_review }) {
    const { t } = useTranslation()

    switch (star) {
        case 1:
            return (<>
                <div>
                    <FontAwesomeIcon icon={faStarSolid} style={{ color: "#fbff00", }} />
                    <FontAwesomeIcon icon={faStar} className='star-icon-home' />
                    <FontAwesomeIcon icon={faStar} className='star-icon-home' />
                    <FontAwesomeIcon icon={faStar} className='star-icon-home' />
                    <FontAwesomeIcon icon={faStar} className='star-icon-home' />
                    <span style={{ width: '50px', display: 'inline-block' }}></span>
                    {/* {total_review && <span>{t('review_count', { total_review })}</span>} */}
                </div>
            </>);
        case 2:
            return (<>
                <div>
                    <FontAwesomeIcon icon={faStarSolid} style={{ color: "#fbff00", }} />
                    <FontAwesomeIcon icon={faStarSolid} style={{ color: "#fbff00", }} />
                    <FontAwesomeIcon icon={faStar} className='star-icon-home' />
                    <FontAwesomeIcon icon={faStar} className='star-icon-home' />
                    <FontAwesomeIcon icon={faStar} className='star-icon-home' />
                    <span style={{ width: '50px', display: 'inline-block' }}></span>
                    {/* {total_review && <span>{t('review_count', { total_review })}</span>} */}
                </div>
            </>);
        case 3:
            return (<>
                <div>
                    <FontAwesomeIcon icon={faStarSolid} style={{ color: "#fbff00", }} />
                    <FontAwesomeIcon icon={faStarSolid} style={{ color: "#fbff00", }} />
                    <FontAwesomeIcon icon={faStarSolid} style={{ color: "#fbff00", }} />
                    <FontAwesomeIcon icon={faStar} className='star-icon-home' />
                    <FontAwesomeIcon icon={faStar} className='star-icon-home' />
                    <span style={{ width: '50px', display: 'inline-block' }}></span>
                    {/* {total_review && <span>{t('review_count', { total_review })}</span>} */}
                </div>
            </>);
        case 4:
            return (<>
                <div>
                    <FontAwesomeIcon icon={faStarSolid} style={{ color: "#fbff00", }} />
                    <FontAwesomeIcon icon={faStarSolid} style={{ color: "#fbff00", }} />
                    <FontAwesomeIcon icon={faStarSolid} style={{ color: "#fbff00", }} />
                    <FontAwesomeIcon icon={faStarSolid} style={{ color: "#fbff00", }} />
                    <FontAwesomeIcon icon={faStar} className='star-icon-home' />
                    <span style={{ width: '50px', display: 'inline-block' }}></span>
                    {/* {total_review && <span>{t('review_count', { total_review })}</span>} */}
                </div>
            </>);
        case 5:
            return (<>
                <div>
                    <FontAwesomeIcon icon={faStarSolid} style={{ color: "#fbff00", }} />
                    <FontAwesomeIcon icon={faStarSolid} style={{ color: "#fbff00", }} />
                    <FontAwesomeIcon icon={faStarSolid} style={{ color: "#fbff00", }} />
                    <FontAwesomeIcon icon={faStarSolid} style={{ color: "#fbff00", }} />
                    <FontAwesomeIcon icon={faStarSolid} style={{ color: "#fbff00", }} />
                    <span style={{ width: '50px', display: 'inline-block' }}></span>
                    {/* {total_review && <span>{t('review_count', { total_review })}</span>} */}
                </div>
            </>);
        default:
            return <></>
    }

}

export default ShowStar