import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";

export default function DetailProfileUserBooks() {
    const [user, setUser] = useState([])
    const [userBooks, setUserBooks] = useState([])
    const params = useParams()

    async function getUser() {
        const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/users/profile/" + params.username,
            {method: "GET"})
        const data = await res.json();
        setUser(data.data);
    }

    async function getUserBooks() {
        const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/userbook/list-userbook",
            {method: "GET"})
        const data = await res.json();
        setUserBooks(data);
    }

    function back(event) {
        event.preventDefault()
        history.go(-1)
    }


    useEffect(() => {
        getUserBooks()
    }, [])

    useEffect(() => {
        getUser()
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
                <div className={"table-responsive"}>
                    <table className="table table-bordered"
                           id="dataTable"
                           width="100%"
                           cellSpacing="0">
                        <thead>
                        <tr>
                            <th scope="col">Id User Book</th>
                            <th scope="col">Title</th>
                            <th scope="col">Due Date</th>
                            <th scope="col">Time</th>
                        </tr>
                        </thead>

                        {userBooks.map((userBook, index) =>
                            params.username === userBook.userName ?
                                userBook.returnDate === null ?
                                    <tbody>
                                    <>
                                        <tr key={userBook.userBookId}>
                                            <th scope="row">{userBook.returnDate===null?index:""}</th>
                                            <td>{userBook.bookTitle}</td>
                                            <td>{userBook.dueDate}</td>
                                            <td className={"text-center"}>
                                                {
                                                    new Date(userBook.dueDate).getDate() - new Date().getDate() >= 0 ?
                                                        <h4 className={"btn-outline-success"}>
                                                            {new Date(userBook.dueDate).getDate() - new Date().getDate() + " Days"}
                                                        </h4>
                                                        :
                                                        <h4 className={"btn-outline-danger"}>
                                                            {
                                                                "Due Date Passed " +
                                                                (0 - (new Date(userBook.dueDate).getDate() - new Date().getDate())) +
                                                                " Days"
                                                            }
                                                        </h4>
                                                }
                                            </td>
                                        </tr>
                                    </>
                                    </tbody>
                                    :
                                    <>

                                    </>

                                :
                                <>
                                </>
                        )}
                    </table>
                </div>
            </div>
        </div>
    </>
}