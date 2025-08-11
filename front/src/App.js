import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import Test from './components/Test';
import Home from './components/Home';
import Manage from './components/Manage';
import Payments from './components/Payments';
import PaymentRegister from './components/PaymentRegister';
import Addpayment from './components/Addpayment';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path = {'/'} element={<Home />}></Route>
        <Route path = {'/employee'} element={<Manage />}></Route>
        <Route path = {'/payments'} element={<Payments />}></Route>
        <Route path = {'/test'} element={<Test />}></Route>
        <Route path = {'/add'} element={<Addpayment />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// why??????????????