import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'
import '../styles/profile.css'
import apiClient from '../APIclient'
import { toast } from 'react-toastify';
import MapPopup from '../components/MapPopup';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    location: null,
    gender: 1,
    day: 1,
    month: 1,
    year: 2001,
  });
  const defaultLat = 21.004175;
  const defaultLng = 105.843769;
  const { t } = useTranslation();

  const handleSave = async () => {
    try {
      console.log(user);
      const response = await apiClient.post(`/update-profile`, { ...user })
      console.log(response)
      if (response.status === 200) {
        toast('Update success!')
        navigate('/')
      }
    } catch (e) {
      console.log(e)
    }
  };

  const handleMapClick = (location) => {
    setUser({ ...user, ...location })
  }

  return (
    <div>
      <div className='profile-container'>
        <h1 className='text-center'><strong>{t('profile.title')}</strong></h1>
        <div className='break-line'></div>
        <div className='register-container'>
          <div className='info-container' >

            <div className="input-field">
              <label>
                <span>{t('profile.name')}:</span>
                <input type="text" value={user?.name} onChange={e => setUser({ ...user, name: e.target.value })} placeholder={t('profile.name')} />
              </label>
            </div>

            <div className="input-field">
              <label>
                <span>{t('profile.email')}:</span>
                <input type="email" value={user?.email} onChange={e => setUser({ ...user, email: e.target.value })} placeholder={t('profile.email')} />
              </label>
            </div>

            <div className="input-field">
              <label>
                <span>{t('profile.phone_number')}:</span>
                <input type="tel" value={user?.phone_number} onChange={e => setUser({ ...user, phone_number: e.target.value })} placeholder={t('profile.phone_number')} />
              </label>
            </div>

            <div className="input-field">
              <label>
                <span>{t('profile.address')}:</span>
                <input type="text" value={user?.address} onChange={e => setUser({ ...user, address: e.target.value })} placeholder={t('profile.address')} />
                <MapPopup onMapClick={handleMapClick} mapLocation={{ latitude: user.latitude || defaultLat, longitude: user.longitude || defaultLng }} />
              </label>
            </div>

            <div className="input-field">
              <label>
                <span>{t('profile.gender')}</span>
                <div>
                  <label className='sex-input'>
                    <input type="radio" name="sex" value="male" checked={user?.gender === 1} onChange={() => setUser({ ...user, gender: 1 })} />
                    {t('profile.male')}
                  </label>
                  <label className='sex-input'>
                    <input type="radio" name="sex" value="female" checked={user?.gender === 2} onChange={() => setUser({ ...user, gender: 2 })} />
                    {t('profile.female')}
                  </label>
                </div>
              </label>
            </div>

            <div className="input-field">
              <label>
                <span>{t('profile.birthday')}</span>
                <div>
                  <select className='date-input' value={user.day} onChange={e => setUser({ ...user, day: e.target.value })}>
                    <option value="">{t('profile.day')}</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>

                  <select className='date-input' value={user.month} onChange={e => setUser({ ...user, month: e.target.value })}>
                    <option value="">{t('profile.month')}</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>

                  <select className='date-input' value={user.year} onChange={e => setUser({ ...user, year: e.target.value })}>
                    <option value="">{t('profile.year')}</option>
                    {Array.from({ length: 100 }, (_, i) => {
                      const currentYear = new Date().getFullYear();
                      const yearValue = currentYear - i;
                      return (
                        <option key={yearValue} value={yearValue}>
                          {yearValue}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </label>
            </div>
            <div className='d-flex justify-content-center'>
              <button style={{ padding: '5px 20px', border: '2px solid black', borderRadius: '25px', background: '#dafab0' }} onClick={handleSave}>{t('profile.save_button')}</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ProfilePage;
