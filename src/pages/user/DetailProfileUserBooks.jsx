import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Spinner from "../../components/Spinner/Spinner.jsx";
import {v4} from "uuid"

export default function DetailProfileUserBooks() {
    const [userBooks, setUserBooks] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const params = useParams()

    async function getUserBooks() {
        try {
            const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/userbook/list-userbook",
                {method: "GET"})
            const data = await res.json();
            setUserBooks(data);
        }catch (err){
            console.log(err)
            alert("There's something wrong. please try again")
        }finally {
            setIsLoading(false)
        }
    }

    function dueDate(paramDueDate){
        return<>
            {
                new Date(paramDueDate.dueDate).getDate() - new Date().getDate() >= 0 ? <h4 className={"btn-outline-success"}>{new Date(paramDueDate.dueDate).getDate() - new Date().getDate() + " Days"}</h4>
                    :
                    <h4 className={"btn-outline-danger"}>{"Due Date Passed " + (0 - (new Date(paramDueDate.dueDate).getDate() - new Date().getDate())) + " Days"}</h4>
            }
        </>
    }

    function listDetailsUserBook(){
        return<>
            {
                userBooks.map((uBook) => params.username === uBook.userName ? uBook.returnDate === null ?
                        <tbody><tr key={uBook.id}><td>{uBook.bookTitle}</td><td>{uBook.dueDate}</td><td className={"text-center"}>{dueDate(uBook)}</td></tr></tbody>
                        :
                        <></>
                    :
                    <></>
                )}
        </>
    }

    function back(event) {
        event.preventDefault()
        history.go(-1)
    }


    useEffect(() => {
        getUserBooks()
    }, [])


    return <>
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <div className={"m-0 font-weight-bold text-primary fa fa-arrow-circle-left"}
                     onClick={event => back(event)}>
                    &nbsp;
                    Back
                </div>
                <h6 className="m-0 font-weight-bold text-primary">List Your Books Not returned</h6>
            </div>
            <div className="card-body">
                {isLoading?
                    <div className="d-flex justify-content-center">
                        <Spinner />
                    </div>
                    :
                    <div className={"table-responsive"}>
                        <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                            <thead>
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">Due Date</th>
                                <th scope="col">Time</th>
                            </tr>
                            </thead>
                            {listDetailsUserBook()}
                        </table>
                    </div>
                }
            </div>
        </div>
    </>
}