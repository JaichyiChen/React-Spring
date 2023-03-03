import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar'
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';


function App() {
  return (
    <>
      <Navbar></Navbar>
      {/* <HomePage></HomePage> */}
      <SearchBooksPage></SearchBooksPage>
      <Footer></Footer>
    </>
  );
}

export default App;
