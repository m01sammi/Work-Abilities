import React, { useState } from 'react';
import styles from './Authorization.module.scss';
import lockPng from '../../assets/img/lock.png';
import openlockPng from '../../assets/img/open-lock.png';
import { Link } from 'react-router-dom';

const Authorization = () => {
  
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const [currentLockIndex, setCurrentLockIndex] = useState(0);
    const locks = [lockPng, openlockPng];

    const changeLock = () => {
        setCurrentLockIndex((currentLockIndex + 1) % locks.length);
        togglePasswordVisibility();
    }

  return (
    <div className={styles.auth}>
      <h1>База данных</h1>
      <div className={styles.auth_form}>
        <p>Введите логин и пароль для входа в систему</p>
        <div className={styles.auth_form_inputs}>
            <input type="text" placeholder='Введите логин' />
            <input 
              type={passwordVisible ? 'text' : 'password'} 
              placeholder='Введите пароль' 
            />
            <img 
              src={locks[currentLockIndex]} 
              alt="lock" 
              onClick={changeLock} 
            />
        </div>
        <div className={styles.auth_form_button}>
            <Link to={'/list'}><p>Войти</p></Link>
        </div>
      </div>
    </div>
  );
}

export default Authorization;
