import { ReturnBook } from "./ReturnBook"
import { useEffect, useState } from 'react';
import axios from "axios";
import BookModel from "../../../models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";

export const Carousel = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState<string | null>();

    //fetch the books from backend to display in carousel
    const fetchBook = async () => {
        const baseUrl: string = "http://localhost:8080/api/books"
        const url: string = `${baseUrl}?page=0&size=9`
        try {

            const response = await axios.get(url);

            const responseData = response.data._embedded.books;

            const bookArray: BookModel[] = [];

            for (const key in responseData) {
                bookArray.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].image,
                })
            }
            setBooks(bookArray);
            setIsLoading(false);

        } catch (error: any) {
            setIsLoading(false);
            setHttpError(error.message);
        }
    }

    useEffect(() => {
        fetchBook();
    }, []);

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
        <div className='container mt-5' style={{ height: 550 }}>
            <div className="homepage-carousel-title">
                <h3>Find your next "I stayed up too late reading" book.</h3>
            </div>
            <div id='carouselExampleControls' className='carousel carousel-dark slide mt-5 d-none d-lg-block' data-bs-interval='false' >
                {/* Desktop */}
                <div className='carousel-inner'>
                    <div className='carousel-item active'>
                        <div className="row d-flex justify-content-center align-items-center">
                            {books.slice(0, 3).map((book) => {
                                return <ReturnBook book={book} key={book.id}></ReturnBook>
                            })}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className="row d-flex justify-content-center align-items-center">
                            {books.slice(3, 6).map((book) => {
                                return <ReturnBook book={book} key={book.id}></ReturnBook>
                            })}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className="row d-flex justify-content-center align-items-center">
                            {books.slice(6, 9).map((book) => {
                                return <ReturnBook book={book} key={book.id}></ReturnBook>
                            })}
                        </div>
                    </div>

                    <button className='carousel-control-prev' type='button' data-bs-target='#carouselExampleControls' data-bs-slide='prev'>
                        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Previous</span>
                    </button>
                    <button className='carousel-control-next' type='button' data-bs-target='#carouselExampleControls' data-bs-slide='next'>
                        <span className='carousel-control-next-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Next</span>
                    </button>
                </div>
            </div>
            {/*Mobile  */}
            <div className='d-lg-none mt-3'>
                <div className=' row d-flex justify-content-center align-item-center'>
                    <ReturnBook book={books[7]} key={books[7].id}></ReturnBook>
                </div>
            </div>
            <div className='homepage-carousel-title mt-3'>
                <Link className='btn btn-outline-secondary btn-lg' to="/search">View More</Link>
            </div>
        </div>
    )
}