import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReview";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage = () => {

    const { authState } = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState<string | null>();

    let { bookId } = useParams();

    //review state
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState<number>(0);
    const [isLoadingReview, setIsLoadingReview] = useState<boolean>(true);

    const [isReviewLeft, setIsReviewLeft] = useState<boolean>(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState<boolean>(true);

    //Loan book count state
    const [currentLoansCount, setCurrentLoansCount] = useState<number>(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState<boolean>(true);

    //is book checked out
    const [isCheckedOut, setIsCheckedOut] = useState<boolean>(false);
    const [isLoadingBookCheckout, setIsLoadingBookCheckout] = useState<boolean>(true);

    //Fetch books
    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`
            try {

                const response = await axios.get(baseUrl);
                const responseData = response.data;

                const singleBook: BookModel = {
                    id: responseData.id,
                    title: responseData.title,
                    author: responseData.author,
                    description: responseData.description,
                    copies: responseData.copies,
                    copiesAvailable: responseData.copiesAvailable,
                    category: responseData.category,
                    img: responseData.image,
                };
                setBook(singleBook);
                setIsLoading(false);

            } catch (error: any) {
                setIsLoading(false);
                setHttpError(error.message);
            }
        }
        fetchBook();
    }, [bookId, isCheckedOut]);


    //Fetch all book reviews
    useEffect(() => {
        const fetchReview = async () => {
            const baseUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;
            try {
                const response = await axios.get(baseUrl);
                const responseData = response.data._embedded.reviews;

                const loadedReviews: ReviewModel[] = [];

                let weightedStarReviews: number = 0;

                for (const key in responseData) {
                    loadedReviews.push({
                        id: responseData[key].id,
                        userEmail: responseData[key].userEmail,
                        date: responseData[key].date,
                        rating: responseData[key].rating,
                        book_id: responseData[key].bookId,
                        reviewDescription: responseData[key].reviewDescription
                    })
                    weightedStarReviews += responseData[key].rating;
                }
                //round review to nearest 0.5
                if (loadedReviews) {
                    const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2);
                    setTotalStars(round);
                }

                setReviews(loadedReviews);
                setIsLoadingReview(false);

            } catch (error: any) {
                setIsLoadingReview(false);
                setHttpError(error.message);
            }
        }
        fetchReview();
    }, [bookId])

    //Fetch book review for current user
    useEffect(() => {
        const fetchUserReviewBook = async () => {
            if (authState && authState.isAuthenticated) {
                const baseUrl: string = `http://localhost:8080/api/reviews/secure/user/book?bookId=${bookId}`

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': "application/json"
                    }
                }

                try {
                    const reviewResponse = await axios.get(baseUrl, requestOptions);
                    setIsReviewLeft(reviewResponse.data);

                } catch (error: any) {
                    setHttpError(error.message);
                    setIsLoadingUserReview(false);
                }
            }
            setIsLoadingUserReview(false);

        }
        fetchUserReviewBook();
    }, [authState, bookId])

    //Fetch the total loan count for books
    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const baseUrl: string = `http://localhost:8080/api/books/secure/currentLoans/count`
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
                try {
                    const response = await axios.get(baseUrl, requestOptions);
                    setCurrentLoansCount(response.data);

                } catch (error: any) {
                    setIsLoadingCurrentLoansCount(false);
                    setHttpError(error.message);
                }
            }
            setIsLoadingCurrentLoansCount(false);
        }
        fetchUserCurrentLoansCount();
    }, [authState, isCheckedOut])

    //Fetch is book checked out by the current user
    useEffect(() => {
        if (authState && authState.isAuthenticated) {
            const userCheckedOutBook = async () => {
                const baseUrl: string = `http://localhost:8080/api/books/secure/ischeckedout/byuser?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
                try {
                    const bookCheckedout = await axios.get(baseUrl, requestOptions);
                    setIsCheckedOut(bookCheckedout.data);

                } catch (error: any) {
                    setIsLoadingBookCheckout(false);
                    setHttpError(error.message);
                }

            }
            userCheckedOutBook();
        }
        setIsLoadingBookCheckout(false);

    }, [authState, bookId])




    //put method for checking out the book for current user
    const checkoutBook = async () => {
        const baseUrl: string = `http://localhost:8080/api/books/secure/checkout?bookId=${book?.id}`
        if (authState && authState.isAuthenticated) {
            const requestOptions = {
                headers: {
                    method: 'PUT',
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    "Content-Type": "application/json"
                }
            }
            try {
                const response = await axios.put(baseUrl, '', requestOptions);
                console.log(response)
                setIsCheckedOut(true);
            } catch (error: any) {
                console.log(error);
                throw new Error(error.message);
            }
        }
    }

    // method for submitting review
    const submitReview = async (starInput: number, reviewDescription: string) => {
        let bookId: number = 0;
        if (book?.id) {
            bookId = book.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);
        const baseUrl = `http://localhost:8080/api/reviews/secure`

        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                "Content-Type": "application/json"
            },
        }

        try {
            const returnResponse = await axios.post(baseUrl, JSON.stringify(reviewRequestModel), requestOptions);
            setIsReviewLeft(true);
        } catch (error: any) {
            setHttpError(error.message)
        }
    }



    if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckout || isLoadingUserReview) {
        return (
            <SpinnerLoading></SpinnerLoading>
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>${httpError}</p>
            </div>
        )
    }



    return (
        <div>
            {/* desktop */}
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ? <img src={book?.img} alt='book' width='226' height='349'></img>
                            : <img src={require("./../../Images/BooksImages/book-luv2read-1000.png")} alt='book' width='226' height='349'></img>}
                    </div>
                    <div className='container col-4 col-md-4'>
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarsReview rating={totalStars} size={32}></StarsReview>
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount}
                        isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkoutBook={checkoutBook}
                        isReviewLeft={isReviewLeft} submitReview={submitReview}></CheckoutAndReviewBox>
                </div>
                <hr></hr>
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false}></LatestReviews>
            </div>
            {/* mobile */}
            <div className="container d-lg-none mt-5">
                <div className="d-flex justify-content-center align-items-center">
                    {book?.img ? <img src={book?.img} alt='book' width='226' height='349'></img>
                        : <img src={require("./../../Images/BooksImages/book-luv2read-1000.png")} alt='book' width='226' height='349'></img>}
                </div>

                <div className="mt-4 ">
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReview rating={totalStars} size={32}></StarsReview>
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount}
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkoutBook={checkoutBook}
                    isReviewLeft={isReviewLeft} submitReview={submitReview}></CheckoutAndReviewBox>
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true}></LatestReviews>
            </div>


        </div>
    );
}