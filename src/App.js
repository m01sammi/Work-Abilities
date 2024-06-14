import logo from './logo.svg';
import './App.css';
import Authorization from './pages/authorization/Authorization';
import {createBrowserRouter, RouterProvider, Route, Link, Routes, BrowserRouter} from "react-router-dom";
import List from './pages/List/List';
import Posts from './pages/Posts/Posts';


function App() {
  return (
    <Routes>
    <Route path="" element={<Authorization />}/>
    <Route path="list" element={<List/>}/>
    <Route path="posts" element={<Posts/>}/>
  </Routes>
  );
}

export default App;
