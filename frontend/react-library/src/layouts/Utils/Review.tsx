import ReviewModel from "../../models/ReviewModel"
import { StarsReview } from "./StarsReview";

interface reviewProp {
    review: ReviewModel;
}

export const Review = ({ review }: reviewProp) => {

    const date = new Date(review.date);

    const longMonth = date.toLocaleString('en-us', { month: 'long' });
    const dateDay = date.getDate();
    const dateYear = date.getFullYear();

    //creating date string from backend and formatting it
    const dateRender = longMonth + ' ' + dateDay + ', ' + dateYear;
    return (
        <div className='col-sm-8 col-md-8'>
            <h5>{review.userEmail}</h5>
            <div className='row'>
                <div className='col'>
                    {dateRender}
                </div>
                <div className='col'>
                    <StarsReview rating={review.rating} size={16}></StarsReview>
                </div>
            </div>
            <div className='mt-2'>
                <p>{review.reviewDescription}</p>
            </div>
            <hr />
        </div>
    )
}