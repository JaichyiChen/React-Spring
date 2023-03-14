import React from 'react';
import BookModel from '../../../models/BookModel';
import { Link } from 'react-router-dom';

interface bookProps {
    book: BookModel;
}

export const ReturnBook = ({
    book
}: bookProps) => {
    return (
        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className='text-center'>
                {book.img ? <img src={book.img} width='151' height='233' alt="book"></img>
                    : <img src={require('./../../../Images/BooksImages/book-luv2read-1000.png')} width='151' height='233' alt="book" />}
                <h6 className='mt-2'>{book.title}</h6>
                <p>{book.author}</p>
                <Link className='btn main-color btn-primary text-white' to={`/checkout/${book.id}`}>Reserve</Link>
            </div>
        </div>
    )
}