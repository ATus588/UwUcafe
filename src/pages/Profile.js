import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import '../styles/profile.css'
import defaultAvatar from '../images/defaultavatar.jpg'
import apiClient from '../APIclient'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import MapPopup from '../components/MapPopup';

const ProfilePage = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [user, setUser] = useState({});
  const [isAvatarChange, setAvatarChange] = useState(false);
  const initializeState = () => !!localStorage.getItem("access_token");
  const [token, setToken] = useState(initializeState);
  const navigate = useNavigate();
  const defaultLat = 21.004175;
  const defaultLng = 105.843769;
  const { t } = useTranslation();

  useEffect(() => {
    getData()
  }, [])

  async function getData() {
    try {
      const response = await apiClient.get(`/get-profile`);
      const data = response.data.data
      const birthday = data.birthday ? data?.birthday.split('T')[0].split('-').map(item => parseInt(item)) : []
      setUser({
        ...data,
        year: birthday[0],
        month: birthday[1],
        day: birthday[2],
        avatar: data.avatar ? data.avatar : null,
      })
      setPreviewImage(data.avatar);
    } catch (error) {
      console.error(error);
    }
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      toBase64(file)
      setPreviewImage(URL.createObjectURL(file));
      setAvatarChange(true);
    }
  };

  const handleBrowseClick = () => {
    document.getElementById('selectedFile').click();
  };

  const toBase64 = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result)
      setUser({ ...user, avatar: reader.result })
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  const handleSave = async () => {
    if (!isAvatarChange) {
      delete user.avatar;
    }
    const birthday = `${user.year}-${user.month}-${user.day}`
    try {
      const response = await apiClient.post(`/update-profile`, { ...user, birthday })
      if (response.status === 200) {
        toast('Update success!')
        navigate(0)
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
        <div className='user-container'>
          <div className='avatar-container'>
            <div>
              <label>
                <img className='avatar-preview' src={previewImage || defaultAvatar} alt="Avatar Preview" />
                <input type="file" id="selectedFile" style={{ display: 'none' }} onChange={handleAvatarChange} />
              </label>
              <div className='avatar-button' onClick={handleBrowseClick}>
                {t('profile.avatar_change')}
              </div>
              <button className='save-button' onClick={handleSave}>{t('profile.save_button')}</button>
            </div>
          </div>

          <div className='info-container'>
            <div className="input-field">
              <label>
                <span>{t('profile.username')}:</span>
                <input disabled type="text" value={user?.username} onChange={e => setUser({ ...user, username: e.target.value })} placeholder={t('profile.username')} />
              </label>
            </div>

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
                <MapPopup onMapClick={handleMapClick} mapLocation={{ latitude: user.latitude > 1 ? user.latitude : defaultLat, longitude: user.longitude > 1 ? user.longitude : defaultLng }} />
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
          </div>
        </div>
      </div>
    </div >
  );
};

export default ProfilePage;
