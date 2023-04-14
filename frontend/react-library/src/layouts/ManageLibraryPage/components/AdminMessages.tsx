import { useOktaAuth } from "@okta/okta-react"
import { useEffect, useState } from 'react';
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import axios from "axios";
import { Pagination } from "../../Utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import AdminMessageRequest from "../../../models/AdminMessageRequest";


export const AdminMessages = () => {

    const { authState } = useOktaAuth();


    //Loading and error state
    const [isLoadingMessages, setIsLoadingMessage] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //Messages endpoint state
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    //Recall useEffect
    const [btnSubmit, setBtnSubmit] = useState(false);

    useEffect(() => {


        const fetchUserMessages = async () => {
            if (authState && authState.isAuthenticated) {
                try {
                    const url = `http://localhost:8080/api/messages/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`

                    const requestOptions = {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                            "Content-Type": "application/json"

                        }
                    }

                    const response = await axios.get(url, requestOptions);
                    const responseData = response.data;

                    setMessages(responseData._embedded.messages);
                    setTotalPages(responseData.page.totalPages)

                } catch (error: any) {
                    setIsLoadingMessage(false);
                    setHttpError(error.message);

                }

                setIsLoadingMessage(false);
            }
        }
        fetchUserMessages();

    }, [authState, currentPage, messagesPerPage, btnSubmit])

    if (isLoadingMessages) {
        return <SpinnerLoading></SpinnerLoading>
    }

    // if (httpError) {
    //     return (
    //         <div className="container m-5">
    //             <p>{httpError}</p>
    //         </div>
    //     )
    // }

    const paginate = (page: number) => setCurrentPage(page);


    const submitResponseToQuestion = async (id: number, response: string) => {

        const url = `http://localhost:8080/api/messages/secure/admin/message`;

        if (authState && authState.isAuthenticated && id !== null && response !== '') {
            const adminRequestModel: AdminMessageRequest = new AdminMessageRequest(id, response);

            const requestOptions = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    "Content-Type": "application/json"
                }
            }

            try {
                const response = await axios.put(url, JSON.stringify(adminRequestModel), requestOptions)
                console.log(response);

            } catch (error: any) {
                setHttpError(error.message)
            }
            setBtnSubmit(!btnSubmit)
        }


    }

    return (
        <div className='mt-3'>
            {messages.length > 0 ?
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map(message => (
                        <AdminMessage message={message} key={message.id} submitResponseToQuestion={submitResponseToQuestion}></AdminMessage>
                    ))}
                </>
                :
                <h5> No pending Q/A</h5>


            }

            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}></Pagination>}

        </div>
    )
}