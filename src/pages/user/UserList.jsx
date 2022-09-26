import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

export default function UserList() {
    const [users, setUsers] = useState([])

    async function getUsers() {
        const res = await fetch("https://be-library-mini-system.herokuapp.com/users/list-user",
            {method: "GET"})
        const data = await res.json();
        setUsers(data);
    }

    function deleteProduct(userId) {
        axios
            .delete("https://be-library-mini-system.herokuapp.com/users/delete/" + userId)
            .then(() => {
                getUsers()
            })
            .catch(err => {
                console.log(err)
                alert('Ada masalah saat memproses data')
            })
    }

    function back(event) {
        event.preventDefault()
        history.go(-1)
    }

    useEffect(() => {
        getUsers()
    }, [])

    return <>
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <div className={"m-0 font-weight-bold text-primary fa fa-arrow-circle-left"}
                     onClick={event => back(event)}>
                    &nbsp;
                    Back
                </div>
                <h6 className="m-0 font-weight-bold text-primary">Daftar User</h6>

                <Link to="/articles/form">
                    <button className="btn btn-primary">
                        Tambah Data
                    </button>
                </Link>
            </div>
            <div className="card-body">
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Username</th>
                        <th scope="col">Rolename</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) =>
                        <tr key={user.userId}>
                            <th scope="row">{index + 1}</th>
                            <td>{user.name}</td>
                            <td>{user.username}</td>
                            <td>{user.roleName}</td>
                            <td>
                                <Link to={"/users/" + user.username}>
                                    <button className="btn btn-primary">view</button>
                                </Link>
                                &nbsp;&nbsp;

                                <button
                                    className="btn btn-danger"
                                    onClick={() => deleteProduct(user.userId)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    </>
}