import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function UserBookForm() {
    const navigate = useNavigate();
    const params = useParams();

    const isEditting = params.userbookId;

    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [userBooks, setUserBooks] = useState([]);
    const [userBookDetail, setUserBookDetail] = useState([]);
    const [formInput, setFormInput] = useState({
        bookId:"",
        userId:"",
        startDate: "",
        dueDate: "",
        returnDate: ""
    })

    function handleInput(event, propName) {
        const copyFormInput = { ...formInput };
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
            { method: "GET" })
        const data = await res.json();
        setUserBooks(data);
    }

    async function getUserBookDetail() {
        const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/userbook/"+params.userbookId,
            { method: "GET" })
        const data = await res.json();
        setUserBookDetail(data);
    }


    async function getFormInput() {
        const res = await axios.get(
            "https://be-psm-mini-library-system.herokuapp.com/userbook/" +
            params.userbookId
        );
        console.log(res.data)
        setFormInput(res.data.data);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const payload = {
            bookId:formInput.bookId,
            userId:formInput.userId,
            startDate:formInput.startDate.toString(),
            dueDate:formInput.dueDate.toString(),
            returnDate:formInput.returnDate.toString()
        }

        if (isEditting) {
            await axios.put(
                "https://be-psm-mini-library-system.herokuapp.com/userbook/update-userbook/" +
                params.userbookId,
                payload

            );
        } else {
            await axios.post(
                "https://be-psm-mini-library-system.herokuapp.com/userbook/add-userbook",
                payload
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
                <h6 className="m-0 font-weight-bold text-primary">Form Pengguna Buku</h6>
                <Link to="/userbook/list">
                    <button className="btn btn-secondary">Kembali</button>
                </Link>
            </div>

            <div>
                <div className="card-body">
                    <form onSubmit={(event) => handleSubmit(event)}>

                        <div className="mb-3">
                            <label className="form-label">Judul Buku</label>
                            <select
                                className="form-control"
                                value={formInput.bookId}
                                required
                                onChange={(event) => handleInput(event, "bookId")}
                            >
                                <option value={""} disabled></option>
                                {books.map(book =>
                                    book.bookStatus === true?
                                        <option
                                            value={book.bookId}>
                                            {book.bookTitle}
                                        </option>:<></>
                                )}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">username Pengguna</label>
                            <select
                                className="form-control"
                                value={formInput.userId}
                                required
                                onChange={(event) => handleInput(event, "userId")}
                            >
                                <option value={""} disabled></option>
                                {users.map(user =>
                                    <option
                                        value={user.userId}>
                                        {user.username}
                                    </option>
                                )}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Tanggal Peminjaman</label>
                            <input
                                className="form-control"
                                type="date"
                                required
                                value={formInput.startDate}
                                onChange={(event) => handleInput(event, "startDate")}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Batas Peminjaman</label>
                            <input
                                className="form-control"
                                type="date"
                                required
                                value={formInput.dueDate}
                                onChange={(event) => handleInput(event, "dueDate")}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Tanggal Pengembalian</label>
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