import { Link } from "react-router-dom"
import BookModel from "../../models/BookModel"

interface checkoutAndReviewProp {
    book: BookModel | undefined,
    mobile: boolean

}


export const CheckoutAndReviewBox = ({ book, mobile }: checkoutAndReviewProp) => {
    return (
        <div className={mobile ? 'card d-flex mt-5 ' : 'container card col-3 d-flex mb-5'}>
            <div className="card-body container">
                <div className="mt-3">
                    <p>
                        <b>0/5 </b>
                        books checked out
                    </p>
                    <hr />
                    {book && book.copiesAvailable && book.copiesAvailable > 0 ?
                        <h4 className='text-success'>Available</h4>
                        : <h4 className='text-danger'>Wait List</h4>
                    }
                    <div className="row">
                        <p className='col-6 lead'>
                            <b>{book?.copies} Copies</b>
                        </p>
                        <p className='col-6 lead'>
                            <b>{book?.copiesAvailable} Available</b>
                        </p>
                    </div>
                </div>
                <Link to='/' className='btn btn-success btn-lg'>Sign in</Link>
                <hr></hr>
                <p className="mt-3">
                    This number can change until placing order has been complete
                </p>
                <p>
                    Sign in to be able to leave a review.
                </p>
            </div>
        </div>

    )
}