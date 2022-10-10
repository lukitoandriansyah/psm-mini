import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import {useDebounce} from "use-debounce";

export default function UserList() {
    const [users, setUsers] = useState([])
    const [userBooks, setUserBooks] = useState([])
    const [searchKeyword, setSearchKeyword] = useState('')
    const [filteredUsers, setFilteredUsers] = useState([])
    const [searchKeywordDebounced] = useDebounce(searchKeyword, 500)


    async function getUsers() {
        const keyword = searchKeyword.length > 0
            ? '&q=' + searchKeyword
            : ''
        const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/users/list-user?_expand=user" + keyword,
            {method: "GET"})
        const data = await res.json();
        setUsers(data.sort((a,b)=>a.userId-b.userId));
    }

    async function getUserBooks() {
        const res = await fetch("https://be-library-mini-system.herokuapp.com/userbook/list-userbook",
            {method: "GET"})
        const data = await res.json();
        setUserBooks(data.sort((a,b)=>a.userbookId-b.userbookId));
    }

    async function deleteData(userId) {
        const res = await axios.delete("https://be-psm-mini-library-system.herokuapp.com/users/delete/" + userId)
        const resp = res.data

        resp.status === false ?
            alert("Delete Failed!!!\nThis data was referenced in user book list, delete them before delete this.")
            :
            ""
        getUsers()
    }

    function back(event) {
        event.preventDefault()
        history.go(-1)
    }

    useEffect(() => {
        getUsers()
        getUserBooks()
    }, [searchKeywordDebounced])

    useEffect(() => {
        if (searchKeyword.length > 0) {
            const filterResult = users.filter((user) => {
                function params(){
                    const a = user.roleName.toLowerCase().includes(searchKeyword.toLowerCase())
                    const b = user.name.toLowerCase().includes(searchKeyword.toLowerCase())
                    const c = user.username.toLowerCase().includes(searchKeyword.toLowerCase())
                    if(a){return a}
                    if(b){return b}
                    if(c){return c}
                }
                return params()

            })
            setFilteredUsers(filterResult)
        } else {
            setFilteredUsers(users)
        }
    }, [searchKeyword, users])

    return <>
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                {/*<div className={"m-0 font-weight-bold text-primary fa fa-arrow-circle-left"}
                     onClick={event => back(event)}>
                    &nbsp;
                    Back
                </div>*/}
                <h6 className="m-0 font-weight-bold text-primary">List User</h6>

                <form
                    className="d-none d-sm-inline-block form-inline navbar-search">
                    <div className="input-group">
                        <input type="text" className="form-control bg-md-white-auth-end border-0 small" placeholder="find user"
                               aria-label="Search" aria-describedby="basic-addon2" value={searchKeyword}
                               onChange={evt => setSearchKeyword(evt.target.value)}/>
                        <div className="input-group-append">
                            <button className="btn btn-primary" type="button">
                                <i className="fas fa-search fa-sm"></i>
                            </button>
                        </div>
                    </div>
                </form>

                <Link to="/register">
                    <button className="btn btn-primary">
                        Add User
                    </button>
                </Link>
            </div>
            <div className="card-body">
                <div className={"table-responsive"}>
                    <table className="table table-bordered"
                           id="dataTable"
                           width="100%"
                           cellSpacing="0">
                        <thead>
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">Name</th>
                            <th scope="col">Username</th>
                            <th scope="col">Role</th>
                            <th scope="col">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map((user, index) =>
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
                                        onClick={() => deleteData(user.userId)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
}