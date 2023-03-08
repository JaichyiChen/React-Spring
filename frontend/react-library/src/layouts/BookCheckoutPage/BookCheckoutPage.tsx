import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReview";

export const BookCheckoutPage = () => {

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState<string | null>();

    let { bookId } = useParams();


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
    }, [bookId]);

    if (isLoading) {
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
                            <StarsReview rating={1.5} size={32}></StarsReview>
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false}></CheckoutAndReviewBox>
                </div>
                <hr></hr>
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
                        <StarsReview rating={1.5} size={32}></StarsReview>
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true}></CheckoutAndReviewBox>
            </div>
        </div>
    );
}