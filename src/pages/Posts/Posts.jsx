import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './Posts.module.scss';
import { Link } from 'react-router-dom';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('https://jsonplaceholder.org/posts');
                setPosts(response.data);
            } catch (error) {
                console.log('There was an error fetching the posts!', error);
            }
        };

        fetchPosts();
    }, []);

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // Get page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(posts.length / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <>
        <header className={style.header}>
        <Link to={'/list'}><p>Список граждан</p></Link>
      <div className={style.header_block}>
        <Link to={'/posts'}><p>Посты</p></Link>
        <p>Администратор</p>
        <Link to={'/'}><p>Выход</p></Link>
      </div>
    </header>
        <div className={style.posts}>
            <h1>Posts</h1>
            <div className={style.posts_container}>
                {currentPosts.map(post => (
                    <div className={style.posts_block} key={post.id}>
                        <div className={style.posts_block_content}>
                            <h2>{post.title}</h2>
                            <img src={post.image} alt='' />
                            <h3>{post.content}</h3>
                            <p>{post.status}</p>
                            <p>{post.publishedAt}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className={style.posts_pagination}>
                <div className={style.posts_pagination_block}>
                    <button
                        onClick={() => paginate(1)}
                        disabled={currentPage === 1}
                    >
                        <h3>First</h3> 
                    </button>
                    {pageNumbers.map(number => (
                        <div className={`${style.posts_pagination_block_button} ${currentPage === number     ? style.posts_pagination_block_buttonSelected : ''}`}>
                            <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={currentPage === number ? 'active' : ''}
                        >
                            <h3>{number}</h3>
                        </button>
                        </div>
                    ))}
                    <button
                        onClick={() => paginate(pageNumbers.length)}
                        disabled={currentPage === pageNumbers.length}
                    >
                        <h3>Last</h3>
                    </button>
                </div>
                <div className={style.posts_pagination_block}>
                    
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <h3>Previous</h3>
                    </button>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === pageNumbers.length}
                    >
                        <h3>Next</h3>
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

export default Posts;
