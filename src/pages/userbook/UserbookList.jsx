import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserBookList() {
    const [ userBooks, setUserBooks] = useState([]);

    async function getUserBookList() {
        try {
            const res = await axios.get(
                "https://be-library-mini-system.herokuapp.com/userbook/list-userbook"
            );

            console.log(res.data);
            setUserBooks(res.data);
        } catch (err) {
            alert("Terjadi Kesalahan")
        }
    }

    function deleteUserBook(id) {
        axios
        .delete (
            "https://be-library-mini-system.herokuapp.com/userbook/delete/" + id
        )
        .then(() => {
            getUserBookList();
        })
        .catch((err) => {
            console.log(err);
            alert("Ada Error")
        });
    }

    useEffect(() => {
        getUserBookList();
    }, []);

    return(
        <>
        <div class="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 class="m-0 font-weight-bold text-primary">
                    List Pengguna Buku
                </h6>
                    <Link to="/userbook/form">
                        <button className="btn btn-primary">Tambah Pengguna Buku</button>
                    </Link>
            </div>

            <div class="card-body">
                <div class="table-responsive">
                    <table
                    class="table table-bordered"
                    id="datapenggunabuku"
                    width="100%"
                    cellspacing="0">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th>Id Pengguna Buku</th>
                                <th>Id Buku</th>
                                <th>Judul Buku</th>
                                <th>Id Pengguna</th>
                                <th>Username</th>
                                <th>Tanggal Peminjaman</th>
                                <th>Tanggal Akhir Peminjaman</th>
                                <th>Tanggal Pengembalian</th>
                            </tr>
                        </thead>
                        <tbody>
                         {userBooks.map((userBooks, index) => (
                           <tr>
                             <td key={userBooks.userBookId} scope="row">
                                 {index + 1}
                             </td>
                    
                                <td>{userBooks.userBookId}</td>
                                    <td>{userBooks.bookTitle}</td>
                                    <td>{userBooks.bookId}</td>
                                    <td>{userBooks.bookTitle}</td>
                                    <td>{userBooks.userId}</td>
                                    <td>{userBooks.username}</td>
                                    <td>{userBooks.startDate}</td>
                                    <td>{userBooks.dueDate}</td>
                                    <td>{userBooks.returnDate}</td>
                                <td>
                                <Link to={"/userbook/form/" + userBooks.userBookId}>
                                    <button className="btn btn-primary"> Edit </button>
                                </Link>{" "}
                                <button
                                    onClick={() => deleteBook(userBooks.userBookId)}
                                    className="btn btn-danger"
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