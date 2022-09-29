import axios from "axios";
import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";

export default function UserBookForm(){
    const navigate = useNavigate();
    const params = useParams();

    const isEditting = params.userBookId;

    const [userBooks, setUserBooks] = useState([]);
    const [formInput, setFormInput] = useState({
        bookTitle: "",
        userName: "",
        bookId: "",
        userId: "",
        startDate: "",
        dueDate: "",
        returnDate: ""
    })

    function handleInput(event, propName) {
        const copyFormInput = {...formInput};
        copyFormInput[propName] = event.target.value;
        setFormInput
    }

    async function getUserBooks(){
        const res = await fetch("https://be-library-mini-system.herokuapp.com/book/books",
            {method:"GET"})
        const data = await res.json();
        setUserBooks(data);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (isEditing) {
            await axios.put(
                "https://be-library-mini-system.herokuapp.com/userbook/update/" +
                params.userbookId,
                formInput
            );
        } else {
            await axios.post(
                "https://be-library-mini-system.herokuapp.com/userbook/add-userbook",
                formInput
            );
        }

        navigate("/userbook/list");
    }

    useEffect(()=>{
        getUserBooks()
    },[])

    return<>
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
                            <label className="form-label">ID Buku</label>
                            <input
                                className="form-control"
                                type="text"
                                value={formInput.bookId}
                                onChange={(event) => handleInput(event, "bookId")}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Judul Buku</label>
                            <input
                                className="form-control"
                                type="text"
                                value={formInput.bookTitle}
                                onChange={(event) => handleInput(event, "bookTitle")}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Kategori ID</label>
                            <input
                                className="form-control"
                                type="text"
                                value={formInput.categoryId}
                                onChange={(event) => handleInput(event, "categoryId")}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Author ID</label>
                            <input
                                className="form-control"
                                type="text"
                                value={formInput.authorId}
                                onChange={(event) => handleInput(event, "authorId")}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Publisher ID</label>
                            <input
                                className="form-control"
                                type="text"
                                value={formInput.publisherId}
                                onChange={(event) => handleInput(event, "publisherId")}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Tahun Terbit</label>
                            <input
                                className="form-control"
                                type="text"
                                value={formInput.bookYear}
                                onChange={(event) => handleInput(event, "bookYear")}
                            />
                        </div>

                        <label className="form-label">Book Status : </label><br />
                        <select onChange={(event) => handleInput(event,"bookStatus")}>
                            <option value={true}>Tersedia</option>
                            <option value={false}>Tidak Tersedia</option>
                        </select>

                        <br/> <br/>
                        <div>
                            <button className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <br/><br/>

        <table width={"100%"} border={"1"}>
            <thead>
            <tr>
                <th>Book Id</th>
                <th>Book Title</th>
                <th>Book Category</th>
                <th>Book Year</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>Book Status</th>
            </tr>
            </thead>
            <tbody>
            {books.map(book=>
                <tr key={book.userbookId}>
                    <td>{book.bookId}</td>
                    <td>{book.bookTitle}</td>
                    <td>{book.categoryName}</td>
                    <td>{book.bookYear}</td>
                    <td>{book.authorName}</td>
                    <td>{book.publisherName}</td>
                    <td>{book.bookStatus === true ? "Tersedia":"Dipinjam"}</td>
                </tr>
            )}
            </tbody>
        </table>

    </>
}