import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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
    });

    function handleInput(event, inputName) {
        const copyFormInput = { ...formInput }
        copyFormInput[inputName] = event.target.value
        setFormInput(copyFormInput)
    }

    async function getAuthors() {
        const res = await axios.get(
            "https://be-library-mini-system.herokuapp.com/author/all"
        );
        setAuthors(res.data);
    }

    async function getCategorys() {
        const res = await axios.get(
            "https://be-library-mini-system.herokuapp.com/category/list"
        );
        setCategorys(res.data);
    }

    async function getPublishers() {
        const res = await axios.get(
            "https://be-library-mini-system.herokuapp.com/publisher/list"
        );
        setPublishers(res.data);
    }

    async function getFormInput() {
        // ======= by Id ===========
        // const res = await axios.get(
        //   "https://be-library-mini-system.herokuapp.com/book/" +
        //   params.bookId
        // );

        // console.log(res.data)
        // setFormInput(res.data);

        // ======= data ===========
        setFormInput(JSON.parse(params.bookId));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        //=========== fetch ===========
        // const payload = JSON.stringify({
        //   ...formInput,
        //   bookStatus: Boolean(formInput.bookStatus),
        //   authorId: parseInt(formInput.authorId),
        //   categoryId: parseInt(formInput.categoryId),
        //   publisherId: parseInt(formInput.publisherId),
        // })
        // ======================
        // const targetUrl = "https://be-libray-mini-system.herokuapp.com/book/add-book"
        // const method = "POST"
        // await fetch(targetUrl, {
        //     method: method,
        //     body: payload,
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        // =============================

        if (isEditting) {
            await axios.put(
                "https://be-libray-mini-system.herokuapp.com/book/update/" + params.bookId,
                formInput
            );
        } else {
            await axios.post(
                "https://be-library-mini-system.herokuapp.com/book/add-book",
                formInput
            );
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
                                {categorys.map(categroy =>
                                    <option
                                        value={categroy.categoryId}>
                                        {categroy.categoryName}
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
                                type="text"
                                value={formInput.bookYear}
                                onChange={(event) => handleInput(event, "bookYear")}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Book Status</label>
                            <br />
                            <select onChange={(event) => handleInput(event, "bookStatus")}>
                                <option value={true}>Tersedia</option>
                                <option value={false}>Tidak Tersedia</option>
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