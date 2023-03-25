import { Link } from "react-router-dom"
import BookModel from "../../models/BookModel"
import { LeaveAReview } from "../Utils/LeaveAReview"

interface checkoutAndReviewProp {
    book: BookModel | undefined,
    mobile: boolean,
    currentLoansCount: number,
    isAuthenticated: any,
    isCheckedOut: boolean,
    checkoutBook: any,
    isReviewLeft: boolean
    submitReview: any
}


export const CheckoutAndReviewBox = ({ book, mobile, currentLoansCount, isAuthenticated, isCheckedOut, checkoutBook, isReviewLeft, submitReview }: checkoutAndReviewProp) => {

    const buttonRender = () => {
        if (isAuthenticated) {
            if (!isCheckedOut && currentLoansCount < 5) {
                return (<button className='btn btn-success btn-lg' onClick={() => checkoutBook()}>Checkout</button>)
            }
            else if (isCheckedOut) {
                return (<p><b>Book checked out. Enjoy!</b></p>)
            }
            else if (!isCheckedOut) {
                return (<p className='text-danger'>Too many books checked out.</p>)
            }
        }
        return (<Link to={'/login'} className='btn btn-success btn-lg'>Sign in</Link>)
    }

    const reviewRender = () => {
        if (isAuthenticated) {
            if (!isReviewLeft) {
                return (<LeaveAReview submitReview={submitReview}></LeaveAReview>)
            }
            else {
                return (<p><b>Thank you for your review!</b></p>)
            }
        }
        return (<div><hr /><p>Sign in to be able to leave a review</p></div>)
    }


    return (
        <div className={mobile ? 'card d-flex mt-5 ' : 'container card col-3 d-flex mb-5'}>
            <div className="card-body container">
                <div className="mt-3">
                    <p>
                        <b>{currentLoansCount}/5 </b>
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
                {buttonRender()}
                <hr></hr>
                <p className="mt-3">
                    This number can change until placing order has been complete
                </p>
                <p>
                    {reviewRender()}
                </p>
            </div>
        </div>

    )
}