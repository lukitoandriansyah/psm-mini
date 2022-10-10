import axios from "axios";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";

export default function UserBookForm() {
    const navigate = useNavigate();
    const params = useParams();

    const isEditting = params.userbookId;

    const [bookById, setBookById] = useState([]);
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [userBooks, setUserBooks] = useState([]);
    const [userBookDetail, setUserBookDetail] = useState([]);
    const [formInput, setFormInput] = useState({
        bookId: "",
        userId: "",
        startDate: "",
        dueDate: "",
        returnDate: ""
    })

    function handleInput(event, propName) {
        const copyFormInput = {...formInput};
        copyFormInput[propName] = event.target.value;

        setFormInput(copyFormInput)
    }

    async function getBooks() {
        const res = await axios.get(
            "https://be-psm-mini-library-system.herokuapp.com/book/books"
        );
        setBooks(res.data);
    }

    async function getUsers() {
        const res = await axios.get(
            "https://be-psm-mini-library-system.herokuapp.com/users/list-user"
        );
        setUsers(res.data);
    }

    async function getUserBooks() {
        const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/userbook/list-userbook",
            {method: "GET"})
        const data = await res.json();
        setUserBooks(data);
    }

    async function getUserBookDetail() {
        const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/userbook/" + params.userbookId,
            {method: "GET"})
        const data = await res.json();
        setUserBookDetail(data);
    }

    function userWhoCanBorrow() {
        let arr = []
        for (let x = 0; x < users.length; x++) {
            for (let y = 0; y < userBooks.length; y++) {
                if (users[x].username == userBooks[y].userName) {
                    if (userBooks[y].returnDate == null) {
                        arr.push(userBooks[y].userName)
                    }
                }
            }
        }
        return arr
    }

    localStorage.setItem("usname", userWhoCanBorrow())
    let dataUsBook = localStorage.getItem("usname").split(",")

    function usBookCounter() {
        let counter = 0
        let arrB=[]
        for (let x = 0; x < users.length; x++) {
            for (let y = 0; y< dataUsBook.length; y++){
                if(dataUsBook[y]===users[x].username){
                    counter = counter+1
                    if(counter>=3){
                        arrB.push(dataUsBook[y])
                        counter = 0
                    }
                }
            }
        }
        return arrB
    }
    let setArrB = new Set(usBookCounter())

    async function getFormInput() {
        const res = await axios.get(
            "https://be-psm-mini-library-system.herokuapp.com/userbook/" +
            params.userbookId
        );
        setFormInput(res.data.data);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (isEditting) {
            const payloadUpdateUserBook = {
                bookId: formInput.bookId,
                userId: formInput.userId,
                startDate: formInput.startDate.toString(),
                dueDate: formInput.dueDate.toString(),
                returnDate: formInput.returnDate
            }

            const re = await axios.put(
                "https://be-psm-mini-library-system.herokuapp.com/userbook/update-userbook/" +
                params.userbookId,
                payloadUpdateUserBook
            );

            const res = await axios.get(
                "https://be-psm-mini-library-system.herokuapp.com/book/" +
                payloadUpdateUserBook.bookId
            )
            setBookById(res.data.data)

            if(re.data.data.returnDate !== null){
                const payloadUpdateBookStatus = {
                    bookTitle: res.data.data.bookTitle,
                    bookYear: res.data.data.bookYear,
                    bookStatus: true,
                    publisherId:res.data.data.publisherId,
                    authorId:res.data.data.authorId,
                    categoryId:res.data.data.categoryId
                }
                await axios.put(
                    "https://be-psm-mini-library-system.herokuapp.com/book/update/" + payloadUpdateUserBook.bookId,
                    payloadUpdateBookStatus
                );
            }
            else{

                const payloadUpdateBookStatus = {
                    bookTitle: res.data.data.bookTitle,
                    bookYear: res.data.data.bookYear,
                    bookStatus: false,
                    publisherId:res.data.data.publisherId,
                    authorId:res.data.data.authorId,
                    categoryId:res.data.data.categoryId
                }
                await axios.put(
                    "https://be-psm-mini-library-system.herokuapp.com/book/update/" + payloadUpdateUserBook.bookId,
                    payloadUpdateBookStatus
                );
            }

        } else {
            const payload = {
                bookId: formInput.bookId,
                userId: formInput.userId,
                startDate: formInput.startDate.toString(),
                dueDate: formInput.dueDate.toString(),
                returnDate: formInput.returnDate.toString()
            }

            await axios.post(
                "https://be-psm-mini-library-system.herokuapp.com/userbook/add-userbook",
                payload
            );

            const res = await axios.get(
                "https://be-psm-mini-library-system.herokuapp.com/book/" +
                payload.bookId
            )
            setBookById(res.data.data)

            const payloadUpdateBookStatus = {
                bookTitle: res.data.data.bookTitle,
                bookYear: res.data.data.bookYear,
                bookStatus: false,
                publisherId:res.data.data.publisherId,
                authorId:res.data.data.authorId,
                categoryId:res.data.data.categoryId
            }

            await axios.put(
                "https://be-psm-mini-library-system.herokuapp.com/book/update/" + payload.bookId,
                payloadUpdateBookStatus
            );
        }
        navigate("/userbook/list");
    }

    useEffect(() => {
        getBooks()
        getUsers()
        getUserBooks()
        getUserBookDetail()
        if (isEditting) {
            getFormInput()
        }
    }, [])

    return <>
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Userbook Form</h6>
                <Link to="/userbook/list">
                    <button className="btn btn-secondary">Back</button>
                </Link>
            </div>

            <div>
                <div className="card-body">
                    <form onSubmit={(event) => handleSubmit(event)}>

                        <div className="mb-3">
                            <label className="form-label">Book Title</label>
                            <select
                                className="form-control"
                                value={formInput.bookId}
                                required
                                onChange={(event) => handleInput(event, "bookId")}
                            >
                                <option value={""} disabled></option>
                                {books.map(book =>
                                    book.bookStatus === true ?
                                        <option
                                            value={book.bookId}>
                                            {book.bookTitle}
                                        </option> : <></>
                                )}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">username</label>
                            <select
                                className="form-control"
                                value={formInput.userId}
                                required
                                onChange={(event) => handleInput(event, "userId")}
                            >
                                {isEditting ?
                                    <>
                                        <option value={""} disabled></option>
                                        {users.map(user =>
                                            <option
                                                value={user.userId}>
                                                {user.username}
                                            </option>
                                        )}
                                    </>
                                    :
                                    <>
                                        <option value={""} disabled></option>
                                        {users.map(user =>
                                            setArrB.has(user.username) ?
                                                <></> :
                                                <option
                                                    value={user.userId}>
                                                    {user.username}
                                                </option>
                                        )}
                                        :
                                        <>
                                        </>
                                    </>

                                }
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Start Date</label>
                            <input
                                className="form-control"
                                type="date"
                                required
                                value={formInput.startDate}
                                onChange={(event) => handleInput(event, "startDate")}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Due Date</label>
                            <input
                                className="form-control"
                                type="date"
                                required
                                value={formInput.dueDate}
                                onChange={(event) => handleInput(event, "dueDate")}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Return Date</label>
                            <input
                                className="form-control"
                                type="date"
                                value={formInput.returnDate}
                                onChange={(event) => handleInput(event, "returnDate")}
                            />
                        </div>
                        <div>
                            <button className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}