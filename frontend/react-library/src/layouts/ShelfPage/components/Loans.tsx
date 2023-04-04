import { useOktaAuth } from "@okta/okta-react"
import { useState, useEffect } from "react";
import axios from "axios";
import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { LoansModal } from "./LoansModal";


export const Loans = () => {

    const { authState } = useOktaAuth();
    const [httpError, setHttpError] = useState(null);

    //current loans state
    const [currentLoans, setCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
    const [checkout, setCheckout] = useState(false);

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            const baseUrl = `http://localhost:8080/api/books/secure/currentLoans`
            if (authState && authState.isAuthenticated) {
                try {
                    const requestOptions = {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                            'Content-Type': "application/json"
                        }
                    }
                    const response = await axios.get(baseUrl, requestOptions);
                    const shelfCurerentLoansData = response.data;

                    setCurrentLoans(shelfCurerentLoansData);
                    setIsLoadingUserLoans(false);

                } catch (error: any) {
                    setIsLoadingUserLoans(false);
                    setHttpError(error.message);
                }
                window.scrollTo(0, 0);
            }
        }
        fetchUserCurrentLoans();
    }, [authState, checkout])

    if (isLoadingUserLoans) {
        return (<SpinnerLoading></SpinnerLoading>)
    }

    if (httpError) {
        return (<div className='container m-5'>
            <p>${httpError}</p>
        </div>)
    }

    const returnBook = async (bookId: number) => {
        const url = `http://localhost:8080/api/books/secure/return?bookId=${bookId}`
        const requestOptions = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': "application/json"
            }
        }
        try {
            const response = await axios.put(url, '', requestOptions);

        } catch (error: any) {
            throw new Error("Something went wrong")
        }
        setCheckout(!checkout);
    }

    const renewLoan = async (bookId: number) => {
        const url = `http://localhost:8080/api/books/secure/renew/loan?bookId=${bookId}`
        const requestOptions = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': "application/json"
            }
        }
        try {
            const response = await axios.put(url, '', requestOptions);

        } catch (error: any) {
            throw new Error("Something went wrong")
        }
    }

    return (
        <div>
            {/* Desktop */}
            <div className='d-none d-lg-block mt-2'>
                {currentLoans.length > 0 ?
                    <>
                        <h5>Current Loans:</h5>
                        {currentLoans.map(currentLoan => <div key={currentLoan.book.id}>

                            <div className='row mt-3 mb-3 '>
                                <div className='col-4 col-md-4 container'>
                                    {currentLoan.book?.img ?
                                        <img src={currentLoan.book?.img} width='226' height='349' alt='book' /> :
                                        <img src={require('../../../Images/BooksImages/book-luv2read-1000.png')} width='226' height='349' alt='book' />}
                                </div>
                                <div className='card col-3 col-md-3 container d-flex'>
                                    <div className='card-body'>
                                        <div className='mt-3'>
                                            <h4>Loan Options</h4>
                                            {currentLoan.daysLeft > 0 && <p className='text-secondary'>
                                                due in {currentLoan.daysLeft} days</p>}
                                            {currentLoan.daysLeft === 0 && <p className='text-success'>
                                                due today
                                            </p>}
                                            {currentLoan.daysLeft < 0 && <p className='text-danger'>past due by {currentLoan.daysLeft} days</p>}

                                            <div className="list-group mt-3">
                                                <button className='list-group-item list-group-item-action' aria-current="true" data-bs-toggle='modal' data-bs-target={`#modal${currentLoan.book.id}`}>
                                                    Manage Loan
                                                </button>
                                                <Link to={'/search'} className='list-group-item list-group-item-action'>Search more books</Link>
                                            </div>
                                        </div>
                                        <hr />
                                        <p className='mt-3'>Help others find their adventure by reviewing your loan</p>
                                        <Link className='btn btn-primary' to={`/checkout/${currentLoan.book.id}`}>Leave a review</Link>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <LoansModal book={currentLoan} mobile={false} returnBook={returnBook} renewLoan={renewLoan}></LoansModal>
                        </div>)}

                    </> : <>
                        <h3 className='mt-3'>Currently no loans</h3>
                        <Link className='btn btn-primary' to={`/search`}>Search for new book</Link>

                    </>}


            </div>



            {/* Mobile */}
            <div className='d-lg-none container mt-2'>
                {currentLoans.length > 0 ?
                    <>
                        <h5 className='mb-3'>Current Loans:</h5>
                        {currentLoans.map(currentLoan => <div key={currentLoan.book.id}>


                            <div className='d-flex justify-content-center align-items-center'>
                                {currentLoan.book?.img ?
                                    <img src={currentLoan.book?.img} width='226' height='349' alt='book' /> :
                                    <img src={require('../../../Images/BooksImages/book-luv2read-1000.png')} width='226' height='349' alt='book' />}
                            </div>
                            <div className='card d-flex mt-5 mb-3'>
                                <div className='card-body container'>
                                    <div className='mt-3'>
                                        <h4>Loan Options</h4>
                                        {currentLoan.daysLeft > 0 && <p className='text-secondary'>
                                            due in {currentLoan.daysLeft} days</p>}
                                        {currentLoan.daysLeft === 0 && <p className='text-success'>
                                            due today
                                        </p>}
                                        {currentLoan.daysLeft < 0 && <p className='text-danger'>past due by {currentLoan.daysLeft} days</p>}

                                        <div className="list-group mt-3">
                                            <button className='list-group-item list-group-item-action' aria-current="true" data-bs-toggle='modal' data-bs-target={`#mobilemodal${currentLoan.book.id}`}>
                                                Manage Loan
                                            </button>
                                            <Link to={'/search'} className='list-group-item list-group-item-action'>Search more books</Link>
                                        </div>
                                    </div>
                                    <hr />
                                    <p className='mt-3'>Help others find their adventure by reviewing your loan</p>
                                    <Link className='btn btn-primary' to={`/checkout/${currentLoan.book.id}`}>Leave a review</Link>
                                </div>
                            </div>
                            <hr />
                            <LoansModal book={currentLoan} mobile={true} returnBook={returnBook} renewLoan={renewLoan}></LoansModal>
                        </div>)}
                    </> : <>
                        <h3 className='mt-3'>Currently no loans</h3>
                        <Link className='btn btn-primary' to={`/search`}>Search for new book</Link>

                    </>}


            </div>
        </div>
    )
}