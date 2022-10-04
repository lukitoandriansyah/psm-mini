import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function BookList2() {
    const [books, setBooks] = useState([]);

    async function getBookList() {
        try {
            const res = await axios.get(
                "https://be-psm-mini-library-system.herokuapp.com/book/books"
            );
            console.log(res.data);
            setBooks(res.data);
        } catch (err) {
            alert("Terjadi Kesalahan")
        }
    }

    function deleteBook(id) {
        axios
            .delete(
                "https://be-psm-mini-library-system.herokuapp.com/book/delete/" + id
            )
            .then(() => {
                getBookList();
            })
            .catch((err) => {
                console.log(err);
                alert("Ada Error")
            });
    }

    useEffect(() => {
        getBookList();
    }, []);

    return (
        <>
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">
                        List Buku
                    </h6>
                    <Link to="/book/form">
                        <button className="btn btn-primary">Tambah Buku</button>
                    </Link>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table
                            className="table table-bordered"
                            id="databuku"
                            width="100%"
                            cellSpacing="0">
                            <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th>Judul Buku</th>
                                <th>Kategori</th>
                                <th>Tahun Terbit</th>
                                <th>Author</th>
                                <th>Publisher</th>
                                <th>Status Buku</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {books.map((books, index) => (
                                <tr>
                                    <td key={books.bookId} scope="row">{index + 1}</td>
                                    <td>{books.bookTitle}</td>
                                    <td>{books.categoryName}</td>
                                    <td>{books.bookYear}</td>
                                    <td>{books.authorName}</td>
                                    <td>{books.publisherName}</td>
                                    <td>{books.bookStatus === true ? "Tersedia" : "Dipinjam"}</td>
                                    <td>
                                        <Link to=
                                                  {"/book/form/" + books.bookId}>
                                            <button className="btn btn-primary"> Edit </button>
                                        </Link>{" "}
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => deleteBook(books.bookId)}

                                        >
                                            {" "}
                                            Hapus{" "}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}