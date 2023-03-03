interface paginationProps {
    currentPage: number;
    totalPages: number;
    paginate: any;
}



export const Pagination = ({ currentPage, totalPages, paginate }: paginationProps) => {

    //array used for displaying page numbers for pagination
    const pageNumbers = [];
    //if at first page add the second page and third page (if there are more than 3 pages)
    if (currentPage === 1) {
        pageNumbers.push(currentPage);
        if (currentPage <= currentPage + 1) {
            pageNumbers.push(currentPage + 1);
        }
        if (totalPages >= currentPage + 2) {
            pageNumbers.push(currentPage + 2);
        }
    }
    //if not at pages greater than 3
    //add the two prev pages
    //else we're at 2 add page 1
    else if (currentPage > 1) {
        if (currentPage >= 3) {
            pageNumbers.push(currentPage - 2);
            pageNumbers.push(currentPage - 1);
        }
        else {
            pageNumbers.push(currentPage - 1);
        }
        //then add current page last
        pageNumbers.push(currentPage);

        //if there are two more pages after current page
        //add them
        if (totalPages >= currentPage + 1) {
            pageNumbers.push(currentPage + 1);
        }
        if (totalPages >= currentPage + 2) {
            pageNumbers.push(currentPage + 2);
        }
    }


    return (
        <nav aria-label='...'>
            <ul className='pagination'>
                <li className='page-item' onClick={() => paginate(1)}>
                    <button className='page-link'>
                        First Page
                    </button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} onClick={() => {
                        paginate(number)
                    }} className={'page-item' + (currentPage === number ? " active" : " ")}>
                        <button className='page-link'>{number}</button>
                    </li>
                ))}
                <li className='page-item' onClick={() => paginate(totalPages)}>
                    <button className="page-link">
                        Last Page
                    </button>
                </li>
            </ul>
        </nav>
    )
}