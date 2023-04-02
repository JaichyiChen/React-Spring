import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans"

interface loansModal {
    book: ShelfCurrentLoans;
    mobile: boolean;
}


export const LoansModal = ({ book, mobile }: loansModal) => {
    return (
        <div className='modal fade' id={mobile ? `mobilemodal#${book.book.id}` : `modal${book.book.id}`}
            data-bs-backdrop='static' data-bs-keyboard='false' aria-labelledby='staticBackdropLabel'
            aria-hidden='true' key={book.book.id}>

            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h5 className="modal-title" id='staticBackdropLabel'>
                            Loan Options
                        </h5>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <div className='container'>
                            <div className='mt-3'>
                                <div className="row">
                                    <div className="col-2">
                                        {book.book?.img ? <img src={book.book?.img} alt='book' width='56' height='87'></img> :
                                            <img src={require('../../../Images/BooksImages/book-luv2read-1000.png')} alt='book' width='56' height='87'></img>}
                                    </div>
                                </div>
                                <div className="col-10">
                                    <h6>{book.book.author}</h6>
                                    <h4>{book.book.title}</h4>
                                </div>

                                <hr />
                                {book.daysLeft > 0 && <p className='text-secondary'>
                                    due in {book.daysLeft} days</p>}
                                {book.daysLeft === 0 && <p className='text-success'>
                                    due today
                                </p>}
                                {book.daysLeft < 0 && <p className='text-danger'>past due by {book.daysLeft} days</p>}
                                <div className='list-group mt-3'>
                                    <button data-bs-dismiss='modal' className='list-group-item list-group-item-action' aria-current='true'>
                                        Return Book
                                    </button>
                                    <button data-bs-dismiss='modal' className={book.daysLeft < 0 ? "list-group-item list-group-item-action inactiveLink" : "list-group-item list-group-item-action"}>
                                        {book.daysLeft < 0 ? "Late dues cannot be renewed" : "Renew for 7 days"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type='button' className="btn btn-secondary" data-bs-dismiss='modal'>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}