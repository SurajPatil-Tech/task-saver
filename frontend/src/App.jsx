import React from 'react';
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import {Routes,Route} from "react-router-dom";
import PageNotFound from './components/PageNotFound';
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000, }} />
   <Routes>
    <Route path='/' element={<Home></Home>}></Route>
    <Route path='/login' element={<Login></Login>}></Route>
    <Route path='/signup' element={<Signup></Signup>}></Route>
    <Route path='*' element={<PageNotFound></PageNotFound>}></Route>
   </Routes>
    </div>
  );
}

export default App;
