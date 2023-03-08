import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar'
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { Routes, Route, Navigate, } from "react-router-dom";
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';

function App() {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navbar></Navbar>
      <div className='flex-grow-1'>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/search" element={<SearchBooksPage />}></Route>
          <Route path='/checkout/:bookId' element={<BookCheckoutPage />}></Route>
          <Route path="*" element={<Navigate to='/'></Navigate>}></Route>

        </Routes>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default App;
