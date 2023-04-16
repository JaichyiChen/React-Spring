import { useState, useEffect, useCallback } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchBook } from "./SearchBook";
import axios from "axios";
import { Pagination } from "../Utils/Pagination";

export const SearchBooksPage = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState<string | null>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [booksPerPage, setBooksPerPage] = useState<number>(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [searchUrl, setSearchUrl] = useState<string>('');
    const [categorySelection, setCategorySelection] = useState<string>('Book Category')



    const fetchBook = useCallback(async () => {
        const baseUrl: string = "http://localhost:8080/api/books"
        let url: string = '';

        if (searchUrl === '') {
            url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
        }
        else {
            //needed to fix the bug where if search or selecting category
            //results with more than 1 page will not display new content
            let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`);
            url = baseUrl + searchWithPage;
        }


        try {
            const response = await axios.get(url);

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
        //move to top of page on every rerender
        window.scrollTo(0, 0);
    }, [booksPerPage, currentPage, searchUrl])

    useEffect(() => {

        fetchBook();
    }, [currentPage, fetchBook]);

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


    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === '') {
            setSearchUrl('');
        }
        else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`)
        }
        setCategorySelection("Book category")
    }

    const categoryField = (value: string) => {
        setCurrentPage(1);
        if (value.toLowerCase() === "fe" ||
            value.toLowerCase() === "be" ||
            value.toLowerCase() === "data" ||
            value.toLowerCase() === "devops") {
            setCategorySelection(value);
            setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`)
        }
        else {
            setCategorySelection('All');
            setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`)
        }
    }


    //0th index of first item on each page
    const indexOfLastBook: number = currentPage * booksPerPage;
    //0th index of last item on each page
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    //if the last page has items less booksperpage * last page then display the totalAmount of books
    let lastItem = (booksPerPage * currentPage) <= totalAmountOfBooks ? booksPerPage * currentPage : totalAmountOfBooks;
    //function passed in to change page number and trigger useEffect for rerendering books
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    return (
        <div>
            <div className='container '>
                <div>
                    <div className='row mt-5'>
                        <div className="col-6">
                            <div className='d-flex'>
                                <input className='form-control me-2' type="search" placeholder="search" aria-labelledby="Search"
                                    onChange={e => {
                                        setSearch(e.target.value)
                                    }} />
                                <button className="btn btn-outline-success" onClick={() => {
                                    return searchHandleChange();
                                }}> Search </button>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className='dropdown'>
                                <button className="btn btn-secondary dropdown-toggle" type='button' id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'
                                >
                                    {categorySelection}
                                </button>
                                <ul className='dropdown-menu' aria-labelledby="dropdownMenuButton1">
                                    <li onClick={() => {
                                        return categoryField('All');
                                    }}>
                                        <a className='dropdown-item'>All</a>
                                    </li>
                                    <li onClick={() => {
                                        return categoryField('FE');
                                    }}>
                                        <a className='dropdown-item'>Front End</a>
                                    </li>
                                    <li onClick={() => {
                                        return categoryField('BE');
                                    }}>
                                        <a className='dropdown-item'>Back End</a>
                                    </li>
                                    <li onClick={() => {
                                        return categoryField('Data');
                                    }}>
                                        <a className='dropdown-item'>Data</a>
                                    </li>
                                    <li onClick={() => {
                                        return categoryField('Devops');
                                    }}>
                                        <a className='dropdown-item'>Devops</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {totalAmountOfBooks > 0 ?
                        <>
                            <div className="mt-3">
                                <h5>Number of results: ({totalAmountOfBooks})</h5>
                            </div>
                            <p>
                                {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                            </p>
                        </>
                        : <div className="m-5">
                            <h3>
                                Can't find what you're looking for?
                            </h3>
                            <a href="/" type='button' className='btn main-color btn-md px-4 me-md-2 fw-bold text-white '> Library Services</a>
                        </div>}
                    {books.map((book) => {
                        return <SearchBook book={book} key={book.id}></SearchBook>
                    })}
                    {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}></Pagination>}
                </div>
            </div>
        </div>
    )
}