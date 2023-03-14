import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar'
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { oktaConfig } from './lib/oktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js'
import { Security, LoginCallback } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';

const oktaAuth = new OktaAuth(oktaConfig);

function App() {

  const navigate = useNavigate();

  const customAuthHandler = () => {
    navigate('/login');
  }

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin), { replace: true })
  }
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
        <Navbar></Navbar>
        <div className='flex-grow-1'>
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/search" element={<SearchBooksPage />}></Route>
            <Route path='/checkout/:bookId' element={<BookCheckoutPage />}></Route>
            <Route path='/login' element={<LoginWidget config={oktaConfig}></LoginWidget>}></Route>
            <Route path='/login/callback' element={<LoginCallback></LoginCallback>}></Route>
            <Route path="*" element={<Navigate to='/'></Navigate>}></Route>
          </Routes>
        </div>
        <Footer></Footer>
      </Security>
    </div>
  );
}

export default App;
