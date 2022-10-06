import axios from "axios";
import React from "react";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export default function UserBookList() {
    const [userBooks, setUserBooks] = useState([]);

    async function getUserBookList() {
        try {
            const res = await axios.get(
                "https://be-psm-mini-library-system.herokuapp.com/userbook/list-userbook"
            );

            console.log(res.data);
            setUserBooks(res.data);
        } catch (err) {
            alert("There's Something Wrong")
        }
    }

    function deleteUserBook(userbookId) {
        for (let x = 0; x < userBooks.length; x++) {
            if (userBooks[x].userbookId === userbookId) {
                if (userBooks[x].returnDate === null) {
                    alert("Delete failed!!!\nThis book still borrowed yet")
                } else {
                    axios
                        .delete(
                            "https://be-psm-mini-library-system.herokuapp.com/userbook/delete/" + userbookId
                        )
                        .then(() => {
                            getUserBookList();
                        })
                        .catch((err) => {
                            console.log(err);
                            alert("Ada Error")
                        });
                }
            }
        }
    }

    useEffect(() => {
        getUserBookList();
    }, []);

    return (
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
                                <th>Judul Buku</th>
                                <th>Username</th>
                                <th>Tanggal Peminjaman</th>
                                <th>Batas Akhir Peminjaman</th>
                                <th>Tanggal Pengembalian</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {userBooks.map((userBooks, index) => (
                                <tr>
                                    <td key={userBooks.userbookId} scope="row">
                                        {index + 1}
                                    </td>
                                    <td>{userBooks.bookTitle}</td>
                                    <td>{userBooks.userName}</td>
                                    <td>{userBooks.startDate}</td>
                                    <td>{userBooks.dueDate}</td>
                                    <td>{userBooks.returnDate}</td>
                                    <td>
                                        <Link to=
                                                  {"/userbook/form/" + userBooks.userbookId}>
                                            <button className="btn btn-primary"> Edit</button>
                                        </Link>{" "}
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => deleteUserBook(userBooks.userbookId)}>
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