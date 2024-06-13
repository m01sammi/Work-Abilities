import React, { useEffect, useState } from 'react'
import searchPng from '../../assets/img/search.png'
import cancelPng from '../../assets/img/cancel.png'
import '../../css/bootstrap-grid.min.css'
import styles from './Interface.module.scss'
import axios from 'axios';
import minusPng from '../../assets/img/minus.png'
import plusPng from '../../assets/img/plus.png'
import selectPng from '../../assets/img/select.png'
import { upload } from '@testing-library/user-event/dist/upload'
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';



const Interface = () => {

    const [isPublic, setIsPublic] = React.useState(true);
    const [isOpen, setIsOpen] = React.useState(true);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [currentImgIndexInput, setCurrentImgIndexInput] = useState(0);
    const imgs = [minusPng, plusPng];
    const imgsInput = [minusPng, plusPng];
    const [showModal, setShowModal] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [showImg, setShowImg] = useState(false);
    const [newUser, setNewUser] = useState({
        lastname: '',
        name: '',
        surname: '',
        birthdate: '',
        idNumber: '',
        address: '',
        sex: '',
        citizenship: '',
        document: '',
        series: ''
    });


    const toggleNavigation = () => {
        setIsPublic(!isPublic);
        changeImg();
      };
    const toggleNavigationInput = () => {
        setIsOpen(!isOpen);
        changeImgInput();
      };


    const changeImg = () => {
        setCurrentImgIndex((currentImgIndex + 1) % imgs.length);
    }
    const changeImgInput = () => {
        setCurrentImgIndexInput((currentImgIndexInput + 1) % imgsInput.length);
    }

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchCriteria, setSearchCriteria] = useState({
        lastname: '',
        name: '',
        surname: '',
        idNumber: ''
    });
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.get('https://6668977cf53957909ff897bc.mockapi.io/work-ability-lists');
          setUsers(response.data);
          setFilteredUsers(response.data);
        } catch (error) {
          console.error('There was an error fetching the users!', error);
        }
      };
  
      fetchUsers();
    }, []);
  
    const handleUserClick = (user) => {
      setSelectedUser(user);
      setShowImg(true);
    };

    const handleAddCitizenCard = () => {
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleAddDocument = () => {
        setShowDocumentModal(true);
    };

    const handleCloseDocumentModal = () => {
        setShowDocumentModal(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewUser({
            ...newUser,
            [name]: value
        });
      };

      const handleSaveUser = async () => {
        const { lastname, name, surname } = newUser;
        const fullname = `${lastname} ${name.charAt(0)}. ${surname.charAt(0)}.`;
        const userToSave = { ...newUser, fullname };

        try {
          const response = await axios.post('https://6668977cf53957909ff897bc.mockapi.io/work-ability-lists', userToSave);
          setUsers([...users, response.data]);
          setFilteredUsers([...users, response.data]);
            setShowModal(false);
            setNewUser({
                lastname: '',
                name: '',
                surname: '',
                birthdate: '',
                idNumber: '',
                address: '',
                sex: '',
                citizenship: '',
                document: '',
                series: '',
                fullname: ''
            });
        } catch (error) {
          console.error('There was an error saving the user!', error);
        }
      };

      const hadleDeleteUser = async () => {
        try {
          await axios.delete(`https://6668977cf53957909ff897bc.mockapi.io/work-ability-lists/${selectedUser.id}`);
          setUsers(users.filter(user => user.id !== selectedUser.id));
          setFilteredUsers(users.filter(user => user.id !== selectedUser.id));
          setSelectedUser(null);
        } catch (error) {
          console.error('There was an error deleting the user!', error);
        }
      };

      const uploadCard = () => {
        const worksheet = XLSX.utils.json_to_sheet(users);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

        saveAs(data, 'users.xlsx');
    };

    const handleSearchChange = (event) => {
        const { name, value } = event.target;
        setSearchCriteria({
            ...searchCriteria,
            [name]: value
        });
    };

    const handleSearch = () => {
        const filtered = users.filter(user => {
            return (
                user.lastname.toLowerCase().includes(searchCriteria.lastname.toLowerCase()) &&
                user.name.toLowerCase().includes(searchCriteria.name.toLowerCase()) &&
                user.surname.toLowerCase().includes(searchCriteria.surname.toLowerCase()) &&
                user.idNumber.toLowerCase().includes(searchCriteria.idNumber.toLowerCase())
            );
        });
        setFilteredUsers(filtered);
    };

    const handleClearSearch = () => {
        setSearchCriteria({
            lastname: '',
            name: '',
            surname: '',
            idNumber: ''
        });
        setFilteredUsers(users);
    };

    
    
  return (
    <>
    <div className={styles.search}>
                <input type="text" name="lastname" placeholder='Фамилия' value={searchCriteria.lastname} onChange={handleSearchChange} />
                <input type="text" name="name" placeholder='Имя' value={searchCriteria.name} onChange={handleSearchChange} />
                <input type="text" name="surname" placeholder='Отчество' value={searchCriteria.surname} onChange={handleSearchChange} />
                <div className={styles.search_block}>
                    <input type="text" name="idNumber" placeholder='id' value={searchCriteria.idNumber} onChange={handleSearchChange} />
                    <div className={styles.search_button1} onClick={handleSearch}><img src={searchPng} alt="search" /><p>Найти</p></div>
                    <div className={styles.search_button2} onClick={handleClearSearch}><img src={cancelPng} alt="cancel" /><p>Очистить</p></div>
                </div>
            </div>
    <div className={styles.interface}>
    <div className='conatainer'>
        <div className='row'>
            <div className='col-12'>
                <div className='col-2'>
                    <div className={styles.list}>
                        <div className={styles.list_line}>
                            <h4>#</h4>
                            <h4>ФИО</h4>
                        </div>
                        {filteredUsers.map((user, index) => (
                                        <div
                                        className={user.id % 2 === 0 ? styles.list_line : styles.list_lineG}
                                            key={user.id}
                                            onClick={() => handleUserClick(user)}
                                        >
                                            <h4>{index + 1}</h4>
                                            <p>{user.fullname}</p>
                                            {selectedUser && selectedUser.id === user.id && (
                                                <img src={selectPng} alt="select" />
                                            )}
                                        </div>
                                    ))}
                    </div>
                    <div className={styles.list}>
                    <button onClick={uploadCard}>Выгрузка списка граждан в XLSX</button>
                    </div>
                </div>
                            {selectedUser ? (
                <div className='col-6'>
                    <div className={styles.info}>
                        <div className={styles.info_general}>
                            <div className={styles.info_general_title}>
                                <h3>Общие сведения</h3>
                            </div>
                            <hr></hr>
                            <div className={styles.info_general_list}>
                            <div className={styles.info_general_list_block}>
                                <div className={styles.info_general_list_block_lineBG}>
                                    <p>Идентификационный номер</p>
                                </div>
                                <div className={styles.info_general_list_block_lineB}>
                                    <p>Фамилия</p>
                                </div>
                                <div className={styles.info_general_list_block_lineBG}>
                                    <p>Имя</p>
                                </div>
                                <div className={styles.info_general_list_block_lineB}>
                                    <p>Отчество</p>
                                </div>
                                <div className={styles.info_general_list_block_lineBG}>
                                    <p>Дата рождения</p>
                                </div>
                            </div>
                                <div className={styles.info_general_list_block}>
                                <div className={styles.info_general_list_block_lineG}>
                                    <p>{selectedUser.idNumber}</p>
                                </div>
                                <div className={styles.info_general_list_block_line}>
                                    <p>{selectedUser.lastname}</p>
                                </div>
                                <div className={styles.info_general_list_block_lineG}>
                                    <p>{selectedUser.name}</p>
                                </div>
                                <div className={styles.info_general_list_block_line}>
                                    <p>{selectedUser.surname}</p>
                                </div>
                                <div className={styles.info_general_list_block_lineG}>
                                    <p>{selectedUser.birthdate}</p>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.info_registration}>
                            <div className={styles.info_registration_title}>
                                    <h3>Регистрация</h3>
                            </div>
                            <hr></hr>
                            <div className={styles.info_registration_list}>
                                {selectedUser ? (
                                    <div className={styles.info_registration_list_line}>
                                    <p>{selectedUser.adress}</p>
                                </div>
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        </div>
                        
                        <div className={styles.info_identification}>
                            <div className={styles.info_identification_title}>
                                    <h3>Сведения об удостоверении личности</h3>
                                    <img src={imgs[currentImgIndex]} onClick={toggleNavigation} alt="logo"/>
                            </div>
                            <hr></hr>
                            <div className={isPublic ? styles.info_identification_list : styles.info_identification_list_close}>
                                {selectedUser ? (
                                    <div className={styles.info_identification_list_block}>
                                    <div className={styles.info_identification_list_block_lineBG}>
                                        <p>Пол</p>
                                    </div>
                                    <div className={styles.info_identification_list_block_line}>
                                        <p>{selectedUser.sex}</p>
                                    </div>
                                    <div className={styles.info_identification_list_block_lineBG}>
                                        <p>Название документа, удостоверяющего личность</p>
                                    </div>
                                    <div className={styles.info_identification_list_block_line}>
                                        <p>{selectedUser.document}</p>
                                    </div>
                                </div>
                                ) : (
                                    <p></p>
                                )}
                                {selectedUser ? (
                                    <div className={styles.info_identification_list_block}>
                                    <div className={styles.info_identification_list_block_lineBG}>
                                        <p>Гражданство (подданство)</p>
                                    </div>
                                    <div className={styles.info_identification_list_block_line}>
                                        <p>{selectedUser.citizenship}</p>
                                    </div>
                                    <div className={styles.info_identification_list_block_lineBG}>
                                        <p>Серия и номер документа</p>
                                    </div>
                                    <div className={styles.info_identification_list_block_line}>
                                        <p>{selectedUser.series}</p>
                                    </div>
                                </div>
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        </div>
                        <div className={styles.info_identification}>
                            <div className={styles.info_identification_title}>
                                    <h3>Заметки</h3>
                                    <img src={imgsInput[currentImgIndexInput]} onClick={toggleNavigationInput} alt="logo"/>
                            </div>
                            <hr></hr>
                            <div className={isOpen ? styles.info_identification_input : styles.info_identification_input_close}>
                                <input type="text" />
                                <div className={styles.info_identification_input_save}><p>Сохранить</p></div>
                            </div>
                        </div>
                    </div>
                </div>
                                ) : (
                                    <p></p>
                                )}
                    {selectedUser ? (
                <div className='col-4'>
                    <div className={styles.sings}>
                        <div className={styles.sings_general}>
                            <div className={styles.sings_general_title}>
                                <h3>Признаки</h3>
                            </div>
                            <hr></hr>
                            <div className={styles.sings_general_list}>
                                <div className={styles.sings_general_list_line}>
                                    <p>Выезд для постоянного проживания</p>
                                </div>
                                <div className={styles.sings_general_list_line}>
                                    <p>Родитель (имеет троих и более детей д0 18 лет)</p>
                                </div>
                                <div className={styles.sings_general_list_line}>
                                    <p>Родитель имеет ребенка до 7 лет</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.sings_other}>
                            <div className={styles.sings_other_title}>
                                    <h3>Признаки</h3>
                            </div>
                            <hr></hr>
                            <div className={styles.sings_other_list}>
                                <div className={styles.sings_other_list_line}>
                                    <p>Возмещает воду</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                         ) : (
                            <p></p>
                        )}
            </div>
        </div>
    </div>
</div>
<div className={styles.block}>
                <div className={selectedUser ? styles.block_buttons : styles.block_button}>
                    {selectedUser ? (
                        <div className={styles.block_buttons_add} onClick={handleAddDocument}><p>Добавить документ</p></div>
                        
                    ) : (
                        <p></p>
                    )}
                    <div className={styles.block_buttons_add} onClick={handleAddCitizenCard}><p>Добавить карточку гражданина</p></div>
                    {selectedUser ? (
                        <div className={styles.block_buttons_add} onClick={hadleDeleteUser}><p>Удалить карточку гражданина</p></div>
                        
                    ) : (
                        <p></p>
                    )}
                </div>
            </div>
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modal_content}>
                    <h3>Добавить карточку гражданина</h3>
                    <input
                        type="text"
                        placeholder="Фамилия"
                        name="lastname"
                        value={newUser.lastname}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        placeholder="Имя"
                        name="name"
                        value={newUser.name}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        placeholder="Отчество"
                        name="surname"
                        value={newUser.surname}
                        onChange={handleInputChange}
                    />
                    <input
                        type="date"
                        placeholder="Дата рождения"
                        name="birthdate"
                        value={newUser.birthdate}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        placeholder="Идентификационный номер"
                        name="idNumber"
                        value={newUser.idNumber}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        placeholder="Регистрация"
                        name="address"
                        value={newUser.address}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        placeholder="Пол"
                        name="sex"
                        value={newUser.sex}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        placeholder="Гражданство (подданство)"
                        name="citizenship"
                        value={newUser.citizenship}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        placeholder="Название документа, удостоверяющего личность"
                        name="document"
                        value={newUser.document}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        placeholder="Серия и номер документа"
                        name="series"
                        value={newUser.series}
                        onChange={handleInputChange}
                    />
                    <button onClick={handleCloseModal}>Закрыть</button>
                    <button onClick={handleSaveUser}>Сохранить</button>
                    </div>
                </div>
            )} 
            {showDocumentModal && (
                <div className={styles.modal}>
                    <div className={styles.modal_content}>
                        <h3>Добавить документ гражданина</h3>
                        <input type="text" placeholder="Тип документа" />
                        <input type="date" placeholder="Дата" />
                        <input type="file" placeholder="Документ"></input>
                        <button onClick={handleCloseDocumentModal}>Закрыть</button>
                        <button>Сохранить</button>
                    </div>
                </div>
            )}  
</>
  )
}

export default Interface