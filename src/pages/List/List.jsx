import React from 'react'
import styles from './List.module.scss'
import { Link } from 'react-router-dom'
import '../../css/bootstrap-grid.min.css'
import searchPng from '../../assets/img/search.png'
import cancelPng from '../../assets/img/cancel.png'
import Interface from '../../components/Interface/Interface'


const List = () => {
  return (
    <>
    <header className={styles.header}>
      <p>Список граждан</p>
      <div className={styles.header_block}>
        <p>Администратор</p>
        <Link to={'/'}><p>Выход</p></Link>
      </div>
    </header>
    <div className={styles.headline}>
        <p>Данные списков трудоспособных граждан</p>   
    </div>
    <Interface/>
    <footer className={styles.footer}>
      <p>База данных сформирована за 4 квартал 23 года</p>
      <p>Техподдрежка: время работы с 9:00 до 18:00</p>
    </footer>
    </>
  )
}

export default List
