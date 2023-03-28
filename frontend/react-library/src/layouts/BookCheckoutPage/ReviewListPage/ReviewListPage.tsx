import ReviewModel from "../../../models/ReviewModel";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Review } from "../../Utils/Review";
import { Pagination } from "../../Utils/Pagination";

export const ReviewListPage = () => {
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { bookId } = useParams();

    useEffect(() => {
        const fetchBookReviews = async () => {
            const baseUrl = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1
                }&size=${reviewsPerPage}`;

            try {
                const response = await axios.get(baseUrl);
                console.log(response);
                const responseData = response.data._embedded.reviews;
                setTotalAmountOfReviews(response.data.page.totalElements);
                setTotalPages(response.data.page.totalPages);

                const loadedReviews: ReviewModel[] = [];

                for (const key in responseData) {
                    loadedReviews.push({
                        id: responseData[key].id,
                        userEmail: responseData[key].userEmail,
                        date: responseData[key].date,
                        rating: responseData[key].rating,
                        book_id: responseData[key].bookId,
                        reviewDescription: responseData[key].reviewDescription,
                    });
                }

                setReviews(loadedReviews);
                setIsLoading(false);
            } catch (error: any) {
                setIsLoading(false);
                setHttpError(error.message);
            }
        };

        fetchBookReviews();
    }, [bookId, currentPage, reviewsPerPage]);

    if (isLoading) {
        return (
            <SpinnerLoading></SpinnerLoading>
        )
    }

    if (httpError) {
        <div className="container m-5">
            <p>{httpError}</p>
        </div>
    }

    const indexOfLastReview: number = currentPage * reviewsPerPage;
    const indexOfFirstReviews: number = indexOfLastReview - reviewsPerPage;

    let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ? reviewsPerPage * currentPage : totalAmountOfReviews;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (<div className='container m-5'>

        <div>
            <h3>Comments: ({reviews.length})</h3>
        </div>
        <p>{indexOfFirstReviews + 1} to {lastItem} of {totalAmountOfReviews} items: </p>
        <div className="row">
            {
                reviews.map(review => <Review review={review} key={review.id}></Review>)
            }
        </div>

        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}></Pagination>}
    </div>
    )
};
