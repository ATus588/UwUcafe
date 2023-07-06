import React, { useState } from 'react';
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
        <h1 className='text-center'><strong>Nhập thông tin</strong></h1>
        <div className='break-line'></div>
        <div className='register-container'>
          <div className='info-container' >

            <div className="input-field">
              <label>
                <span>Full Name:</span>
                <input id='input-profile' type="text" value={user?.name} onChange={e => setUser({ ...user, name: e.target.value })} placeholder='Full name' />
              </label>
            </div>

            <div className="input-field">
              <label>
                <span>Email:</span>
                <input id='input-profile' type="email" value={user?.email} onChange={e => setUser({ ...user, email: e.target.value })} placeholder='Email' />
              </label>
            </div>

            <div className="input-field">
              <label>
                <span>Phone Number:</span>
                <input id='input-profile' type="tel" value={user?.phone_number} onChange={e => setUser({ ...user, phone_number: e.target.value })} placeholder='Phone number' />
              </label>
            </div>

            <div className="input-field">
              <label>
                <span>Address:</span>
                <input id='input-profile' type="text" value={user?.address} onChange={e => setUser({ ...user, address: e.target.value })} placeholder='Address' />
                <MapPopup onMapClick={handleMapClick} mapLocation={{ latitude: user.latitude || defaultLat, longitude: user.longitude || defaultLng }} />
              </label>
            </div>

            <div className="input-field">
              <label>
                <span>Sex</span>
                <div>
                  <label className='sex-input'>
                    <input type="radio" name="sex" value="male" checked={user?.gender === 1} onChange={() => setUser({ ...user, gender: 1 })} />
                    Male
                  </label>
                  <label className='sex-input'>
                    <input type="radio" name="sex" value="female" checked={user?.gender === 2} onChange={() => setUser({ ...user, gender: 2 })} />
                    Female
                  </label>
                </div>
              </label>
            </div>

            <div className="input-field">
              <label>
                <span>Date of birth</span>
                <div>
                  <select className='date-input' value={user.day} onChange={e => setUser({ ...user, day: e.target.value })}>
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>

                  <select className='date-input' value={user.month} onChange={e => setUser({ ...user, month: e.target.value })}>
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>

                  <select className='date-input' value={user.year} onChange={e => setUser({ ...user, year: e.target.value })}>
                    <option value="">Year</option>
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
            <button onClick={handleSave}>Lưu</button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ProfilePage;
