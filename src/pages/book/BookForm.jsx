import axios from "axios";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";

export default function BookForm() {
    const navigate = useNavigate();
    const params = useParams();

    const isEditting = params.bookId;

    const [books, setBooks] = useState ([]) ;
    const [formInput, setFormInput] = useState({
        bookTitle : "",
        authorId : "",
        categoryId : "",
        publisherId : "",
        bookYear : "",
        bookStatus : "",
    });

    function handleInput (event, propName) {
        const copyFormInput = {...formInput}
        copyFormInput[inputName] = event.target.value
        setFormInput(copyFormInput)
    }

    async function getBooks () {
        const res = await axios.get(
            "https://be-library-mini-system.herokuapp.com/book/books"
        );

        setBooks(res.data);
    }

    async function getFormInput() {
        const res = await axios.get(
            "https://be-library-mini-system.herokuapp.com/book" + 
            params.bookId
        );

        console.log(res.data);
        setFormInput(res.data);
    }


    async function handleSubmit (event) {
        event.preventDefault();

        if (isEditting) {
            await axios.put(
                "https://be-libray-mini-system.herokuapp.com/book/update/" +
                params.bookId,
                formInput
            );
        } else {
            await axios.post(
                "https://be-library-mini-system.herokuapp.com/book/add-book"
            );
        }

        navigate("/book");
    }

    useEffect(() => {
        getBooks();
        if (isEditting) {
            getFormInput();
        }
    }, []);

    return (
        <>
        <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">Form Penulis</h6>

          <Link to="/book">
            <button className="btn btn-secondary">Kembali</button>
          </Link>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
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
              <input
                className="form-control"
                type="text"
                value={formInput.categoryId}
                onChange={(event) => handleInput(event, "categoryId")}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Author</label>
              <input
                className="form-control"
                type="text"
                value={formInput.authorId}
                onChange={(event) => handleInput(event, "authorId")}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Publisher</label>
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

            <div className="mb-3">
              <label className="form-label">Tersedia</label>
              <input
                className="form-control"
                type="radio"
                value="y"
                onChange={(event) => handleInput(event.target.value, "bookStatus")}
                checked={bookStatus === "y" ? true : false}
              />
            </div>

            <button className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
        </>
    );
}