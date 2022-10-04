import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {responses} from "../auth/LoginForm.jsx";

// let responParams = [];

export default function BookForm() {
    const navigate = useNavigate();
    const params = useParams();

    const isEditting = params.bookId;

    const [authors, setAuthors] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [formInput, setFormInput] = useState({
        bookTitle: "",
        bookYear: "",
        bookStatus: "",
        publisherId:"",
        authorId:"",
        categoryId:""
    });

    function handleInput(event, inputName) {
        const copyFormInput = { ...formInput }
        copyFormInput[inputName] = event.target.value
        setFormInput(copyFormInput)
    }

    async function getAuthors() {
        const res = await axios.get(
            "https://be-psm-mini-library-system.herokuapp.com/author/all"
        );
        setAuthors(res.data);
    }

    async function getCategorys() {
        const res = await axios.get(
            "https://be-psm-mini-library-system.herokuapp.com/category/list"
        );
        setCategorys(res.data);
    }

    async function getPublishers() {
        const res = await axios.get(
            "https://be-psm-mini-library-system.herokuapp.com/publisher/list"
        );
        setPublishers(res.data);
    }

    async function getFormInput() {
        const res = await axios.get(
            "https://be-psm-mini-library-system.herokuapp.com/book/" +
            params.bookId
        );

        console.log(res.data)
        setFormInput(res.data.data);

    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (isEditting) {
            await axios.put(
                "https://be-psm-mini-library-system.herokuapp.com/book/update/" + params.bookId,
                formInput
            );
        } else {
            await axios.post(
                "https://be-psm-mini-library-system.herokuapp.com/book/add-book",
                {
                    bookTitle: formInput.bookTitle,
                    bookYear: parseInt(formInput.bookYear),
                    bookStatus: Boolean(formInput.bookStatus),
                    publisherId:parseInt(formInput.publisherId),
                    authorId:parseInt(formInput.authorId),
                    categoryId:parseInt(formInput.categoryId)
                }
            ).then((re)=>console.log(re));
        }
        navigate("/book/list");
    }

    useEffect(() => {
        getCategorys()
        getAuthors()
        getPublishers()
        if (isEditting) {
            getFormInput()
        }
    }, []);

    return <>

        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Form Buku</h6>
                <Link to="/book/list">
                    <button className="btn btn-secondary">Kembali</button>
                </Link>
            </div>

            <div>
                <div className="card-body">
                    <form onSubmit={(event) => handleSubmit(event)}>

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
                            <label className="form-label">Kategori</label>
                            <select
                                className="form-control"
                                value={formInput.categoryId}
                                onChange={(event) => handleInput(event, "categoryId")}
                            >
                                <option value={""} disabled></option>
                                {categorys.map(category =>
                                    <option
                                        value={category.categoryId}>
                                        {category.categoryName}
                                    </option>
                                )}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Author</label>
                            <select
                                className="form-control"
                                value={formInput.authorId}
                                onChange={(event) => handleInput(event, "authorId")}
                            >
                                <option value={""} disabled></option>
                                {authors.map(author =>
                                    <option value={author.authorId}>
                                        {author.authorName}
                                    </option>
                                )}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Publisher</label>
                            <select
                                className="form-control"
                                value={formInput.publisherId}
                                onChange={(event) => handleInput(event, "publisherId")}
                            >
                                <option value={""} disabled></option>
                                {publishers.map(publisher =>
                                    <option value={publisher.idPublisher}>
                                        {publisher.publisherName}
                                    </option>
                                )}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Tahun Terbit</label>
                            <input
                                className="form-control"
                                type="number"
                                value={formInput.bookYear}
                                onChange={(event) => handleInput(event, "bookYear")}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Book Status</label>
                            <br />
                            <select value={formInput.bookStatus} onChange={(event) => handleInput(event, "bookStatus")}>
                                <option value={""} disabled></option>
                                <option value={"true"}>Tersedia</option>
                                <option value={"false"}>Tidak Tersedia</option>
                            </select>
                            <br />
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