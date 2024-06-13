import logo from './logo.svg';
import './App.css';
import Authorization from './pages/authorization/Authorization';
import {createBrowserRouter, RouterProvider, Route, Link, Routes, BrowserRouter} from "react-router-dom";
import List from './pages/List/List';


function App() {
  return (
    <Routes>
    <Route path="" element={<Authorization />}/>
    <Route path="list" element={<List/>}/>
  </Routes>
  );
}

export default App;
