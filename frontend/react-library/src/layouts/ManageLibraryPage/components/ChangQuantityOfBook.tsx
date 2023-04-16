import { useOktaAuth } from "@okta/okta-react";
import BookModel from "../../../models/BookModel"
import { useState, useEffect } from "react";
import axios from "axios";


interface bookProp {
    book: BookModel;
    deleteBook: any;
}

export const ChangeQuantityOfBook = ({ book, deleteBook }: bookProp) => {

    const [quantity, setQuantity] = useState(0);
    const [remaining, setRemaining] = useState(0);

    const { authState } = useOktaAuth();

    useEffect(() => {

        const fetchBookInstate = () => {
            book.copies ? setQuantity(book.copies) : setQuantity(0);
            book.copiesAvailable ? setRemaining(book.copiesAvailable) : setRemaining(0);
        }

        fetchBookInstate();

    }, [book.copies, book.copiesAvailable])


    const increaseQuantity = async () => {

        const url = `http://localhost:8080/api/admin/secure/increase/book/quantity?bookId=${book.id}`

        const requstOptions = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                "Content-Type": "application/json"
            }
        }

        try {
            const response = await axios.put(url, '', requstOptions);
            setQuantity(quantity + 1);
            setRemaining(remaining + 1);

        } catch (error) {
            throw new Error("Something went wrong")

        }


    }

    const decreaseQuantity = async () => {

        const url = `http://localhost:8080/api/admin/secure/decrease/book/quantity?bookId=${book.id}`

        const requstOptions = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                "Content-Type": "application/json"
            }
        }

        try {
            const response = await axios.put(url, '', requstOptions);
            setQuantity(quantity - 1);
            setRemaining(remaining - 1);

        } catch (error) {
            throw new Error("Something went wrong")

        }


    }

    const deleteBookFunction = async () => {
        const url = `http://localhost:8080/api/admin/secure/delete/book?bookId=${book.id}`

        const requstOptions = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                "Content-Type": "application/json"
            }
        }

        try {
            const response = await axios.delete(url, requstOptions);
            deleteBook();

        } catch (error) {
            throw new Error("Something went wrong")

        }

    }


    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className="row g-0">
                <div className="col-md-2">
                    <div className="d-none d-lg-block">
                        {book.img ? <img src={book.img} width="123" height="196" alt="book"></img>
                            : <img src={require('./../../../Images/BooksImages/book-luv2read-1000.png')} height="196" alt="book"></img>}
                    </div>
                    <div className="d-lg-none d-flex justify-content-center align-items-center">
                        {book.img ? <img src={book.img} width="123" height="196" alt="book"></img>
                            : <img src={require('./../../../Images/BooksImages/book-luv2read-1000.png')} height="196" alt="book"></img>}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card-body">
                        <h5 className="card-title">{book.author}</h5>
                        <h4>{book.title}</h4>
                        <p className="card-text">{book.description}</p>
                    </div>
                </div>
                <div className="mt-3 col-md-4">
                    <div className="d-flex justify-content-center align-items-center">
                        <p>Total Quantity: <b>{quantity}</b></p>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <p>Books Remaining: <b>{remaining}</b></p>
                    </div>
                </div>
                <div className='mt-3 col-md-1'>
                    <div className="d-flex justify-content">
                        <button className="m-1 btn btn-danger" onClick={deleteBookFunction}>Delete</button>
                    </div>
                </div>
                <button className="m1 btn btn-md main-color text-white" onClick={increaseQuantity}>Add Quantity</button>
                <button className="m1 btn btn-md btn-warning" onClick={decreaseQuantity} >Decrease Quantity</button>
            </div>
        </div>
    )

}