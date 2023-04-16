import { useState, useCallback, useEffect } from "react";
import BookModel from "../../../models/BookModel";
import axios from "axios";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { ChangeQuantityOfBook } from "./ChangQuantityOfBook";

export const ChangeQuantityOfBooks = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState<string | null>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [booksPerPage, setBooksPerPage] = useState<number>(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const [bookDelete, setBookDelete] = useState(false);

    const fetchBook = useCallback(async () => {
        const baseUrl: string = `http://localhost:8080/api/books?page=${currentPage - 1}&size=${booksPerPage}`

        try {
            const response = await axios.get(baseUrl);

            const responseData = response.data._embedded.books;

            const responsePageData = response.data.page;

            setTotalAmountOfBooks(parseInt(responsePageData.totalElements, 10));
            setTotalPages(parseInt(responsePageData.totalPages, 10))

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

    }, [booksPerPage, currentPage,])

    useEffect(() => {
        fetchBook();
    }, [currentPage, fetchBook, bookDelete]);


    //0th index of first item on each page
    const indexOfLastBook: number = currentPage * booksPerPage;
    //0th index of last item on each page
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    //if the last page has items less booksperpage * last page then display the totalAmount of books
    let lastItem = (booksPerPage * currentPage) <= totalAmountOfBooks ? booksPerPage * currentPage : totalAmountOfBooks;
    //function passed in to change page number and trigger useEffect for rerendering books
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    const deleteBook = () => {
        setBookDelete(!bookDelete);
    }



    if (isLoading) {
        return <SpinnerLoading></SpinnerLoading>
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                {httpError}
            </div>
        )
    }
    return (
        <div className='container mt-5'>
            {
                totalAmountOfBooks > 0 ?
                    <>
                        <div className="mt-3">
                            <h3>Number of results : ({totalAmountOfBooks})</h3>
                        </div>
                        <p>{indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items: </p>
                        {
                            books.map(book => (
                                <ChangeQuantityOfBook book={book} key={book.id} deleteBook={deleteBook}></ChangeQuantityOfBook>

                            ))
                        }
                    </>
                    :
                    <h5>Add a book before changin quantity</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}></Pagination>}
        </div>
    )
}