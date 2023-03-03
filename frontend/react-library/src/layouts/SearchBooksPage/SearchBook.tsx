import BookModel from "../../models/BookModel"

interface bookProps {
    book: BookModel;
}


export const SearchBook = ({ book }: bookProps) => {
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className="row g-0">
                <div className='col-md-2'>
                    {/* desktop */}
                    <div className="d-none d-lg-block">
                        {book.img ?
                            <img src={book.img} width="123" height='196' alt='book'></img> :
                            <img src={require('../../Images/BooksImages/book-luv2read-1000.png')} width="123" height='196' alt='book'></img>}
                    </div>
                </div>
                {/* mobile */}
                <div className="d-lg-none d-flex justify-content-center align-items-center">
                    {book.img ?
                        <img src={book.img} width="123" height='196' alt='book'></img> :
                        <img src={require('../../Images/BooksImages/book-luv2read-1000.png')} width="123" height='196' alt='book'></img>}
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>
                            {book.author}
                            <h4>{book.title}</h4>
                            <p className='card-text'>{book.description}</p>
                        </h5>
                    </div>
                </div>

                <div className="col-md-4 d-flex justify-content-center align-items-center">
                    <a className='btn btn-md main-color text-white' href="/">View Details</a>
                </div>
            </div>
        </div>
    )
}