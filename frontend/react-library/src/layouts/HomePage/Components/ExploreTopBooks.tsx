import { Link } from "react-router-dom"

export const ExploreTopBooks = () => {
    return (
        <div className='p-5 mb-5 bg-dark header'>
            <div className='container-fluid py-5 text-white d-flex justify-content-center align-item-center'>

                <div>
                    <h1 className='display-5 fw-bold'>Find your next adventure</h1>
                    <p className='col-md-8 fs-4'>Where would you like to go</p>
                    <Link to="/search" type="button" className="button btn-primary main-color btn-lg text-white text-decoration-none">Explore top books</Link >
                </div>

            </div>
        </div>
    )
}