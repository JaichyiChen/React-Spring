import { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import MessageModel from '../../../models/MessageModel';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import axios from 'axios';
import { Pagination } from '../../Utils/Pagination';



export const Messages = () => {

    const { authState } = useOktaAuth();
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);


    //messages
    const [messages, setMessages] = useState<MessageModel[]>([]);

    //pagination
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (authState && authState?.isAuthenticated) {
                const url = `http://localhost:8080/api/messages/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=${messagesPerPage}`
                const requestOptions = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type": "application/json"
                    }
                }

                try {
                    const response = await axios.get(url, requestOptions);
                    const responseData = response.data;
                    console.log(responseData);
                    setMessages(responseData._embedded.messages);
                    setTotalPages(responseData.page.totalPages);

                } catch (error: any) {
                    setIsLoadingMessages(false);
                    setHttpError(error.message);
                }
                setIsLoadingMessages(false);
            }

            window.scrollTo(0, 0);
        }
        fetchUserMessages();

    }, [authState, currentPage, messagesPerPage])

    if (isLoadingMessages) {
        return (<SpinnerLoading></SpinnerLoading>)
    }
    if (httpError) {
        <div className='container m-5'>
            <p>{httpError}</p>
        </div>
    }

    const paginate = (pageNumber: number) => {
        return setCurrentPage(pageNumber);
    }

    return (
        <div className='mt-2'>
            {messages.length > 0 ?
                <>
                    <h5>Current Q/A:</h5>
                    {messages.map(message => (
                        <div key={message.id}>
                            <div className='card mt-2 shadow p-3 bg-body rounded'>
                                <h5>Case #{message.id}: {message.title}</h5>
                                <h6>{message.userEmail}</h6>
                                <p>{message.question}</p>
                                <hr />
                                <div>
                                    <h5>Response: </h5>
                                    {message.response && message.adminEmail ?
                                        <><h6>{message.adminEmail} (admin)</h6>
                                            <p>{message.response}</p></> :
                                        <p> <i> Pending response from Admin</i></p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </>


                : <h5>All questions you submit will be shown here</h5>}
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}></Pagination>}
        </div>
    )
}