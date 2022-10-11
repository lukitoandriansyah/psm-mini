import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { useDebounce } from "use-debounce";
import Spinner from "../../components/Spinner/Spinner";

export default function UserBookList() {
    const [userBooks, setUserBooks] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("")
    const [filteredUserbooks, setFilteredUserbooks] = useState([])
    const [statusUserById, setStatusUserById] = useState()
    const [dataUserById, setDataUserById] = useState([])
    const [userUpdated, setUserUpdated] = useState([])
    const [statusUpdated, setStatusUpdated] = useState([])
    const [searchKeywordDebounced] = useDebounce(searchKeyword, 500)
    const [isLoading, setIsLoading] = useState(true)
    const navigate =  useNavigate()

    async function getUserBookList() {
        const keyword = searchKeyword.length > 0 ? "&q=" + searchKeyword : ""
        try {
            setIsLoading(true)
            const res = await axios.get(
                "https://be-psm-mini-library-system.herokuapp.com/userbook/list-userbook?_expand=userbook" + keyword,
            );

            // console.log(res.data);
            setUserBooks(res.data.sort((a, b) => a.userbookId - b.userbookId));
        } catch (err) {
            setIsLoading(true)
            alert("There's Something Wrong When Catch The Data")
        } finally {
            setIsLoading(false)
        }
    }

    function getUserData() {
        const savedDataUser = localStorage.getItem("user")
        if (savedDataUser) {
            return JSON.parse(savedDataUser)
        } else {
            return {}
        }
    }

    async function getUsersById() {
        try {

            const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/users/profile/byid/"+getUserData().userId,
                {method: "GET"})
            const data = await res.json();
            setStatusUserById(data.status)
            setDataUserById(data.data)
        }catch (err){
            console.log(err)
            alert("There's something wrong. please try again")
        }
    }

    function saveDataTrue(dataUser, statusUser) {
        const formattedDataUserUpdated = JSON.stringify(dataUser)
        const formattedStatusUserUpdated = JSON.stringify(statusUser)

        localStorage.removeItem("user")
        localStorage.removeItem("statusLogin")

        localStorage.setItem("user", formattedDataUserUpdated)
        localStorage.setItem("statusLogin", formattedStatusUserUpdated)

        setUserUpdated(dataUser)
        setStatusUpdated(statusUser)

    }

    function saveDataFalse(dataUser, statusUser) {
        setUserUpdated(dataUser)
        setStatusUpdated(statusUser)
    }

    async function userDeleteScenario(){
        if(statusUserById === true){
            /*console.log("ya data masuk")*/
            const payload = JSON.stringify({
                username: dataUserById.username,
                password: dataUserById.password
            })
            const targetUrl = "https://be-psm-mini-library-system.herokuapp.com/auth/login"
            const method = "POST"
            const res = await fetch(targetUrl, {
                method: method,
                body: payload,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((re) => re.json())

            const respData = res.data
            const respStatus = res.status

            respStatus === true ? saveDataTrue(respData, respStatus)  : saveDataFalse(respData, respStatus)
        }else{
            localStorage.clear()
            navigate("/home")
        }
    }

    function deleteUserBook(userbookId) {
        setIsLoading(true)
        userDeleteScenario()
        for (let x = 0; x < userBooks.length; x++) {
            if (userBooks[x].userbookId === userbookId) {
                if (userBooks[x].returnDate === null) {
                    alert("Delete Failed!!!\nThis Book Still Borrowed Yet")
                } else {
                    axios
                        .delete(
                            "https://be-psm-mini-library-system.herokuapp.com/userbook/delete/" + userbookId
                        )
                        .then(() => {
                            getUserBookList();
                        })
                        .catch((err) => {
                            alert("Delete Failed!!! Data Not Found")
                        })
                        .finally(() => {
                            setIsLoading(false)
                        })
                }
            }
        }
    }

    useEffect(()=>{
        getUsersById()
    },[])

    useEffect(() => {
        getUserBookList();
    }, [searchKeywordDebounced]);

    useEffect(() => {
        if (searchKeyword.length > 0) {
            const filterResult = userBooks.filter((userbook) => {
                function params() {
                    const a = userbook.bookTitle.toLowerCase().includes(searchKeyword.toLocaleLowerCase())
                    const b = userbook.userName.toLowerCase().includes(searchKeyword.toLocaleLowerCase())
                    if (a) { return a }
                    if (b) { return b }
                }
                return params()
            })
            setFilteredUserbooks(filterResult)
        } else {
            setFilteredUserbooks(userBooks)
        }
    }, [searchKeyword, userBooks])
    if (isLoading) return <Spinner />

    return (
        <>
            <div className="card shadow mb-4">
                <div className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                    <ul className={"navbar-nav mr-auto"}>
                        <h6 className="m-0 font-weight-bold text-primary">User Book List</h6>
                    </ul>
                    <form
                        className="d-none d-sm-inline-block form-inline mr-md-3 ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                        <div className="input-group">
                            <input type="text" className="form-control bg-md-white-auth-end border-0 small" placeholder="find userbook"
                                   aria-label="Search" aria-describedby="basic-addon2" value={searchKeyword}
                                   onChange={evt => setSearchKeyword(evt.target.value)} />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button" onClick={()=>userDeleteScenario()}>
                                    <i className="fas fa-search fa-sm"></i>
                                </button>
                            </div>
                        </div>
                    </form>

                    <ul className="navbar-nav md-center">
                        <div className="dropdown no-arrow d-sm-none">
                            <a className="dropdown-toggle" href="#" id="searchDropdown" role="button"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-search fa-fw"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                 aria-labelledby="searchDropdown">
                                <form className="form-inline mr-auto w-100 navbar-search">
                                    <div className="input-group">
                                        <input type="text" className="form-control bg-md-white-auth-end border-0 small" placeholder="find userbook"
                                               aria-label="Search" aria-describedby="basic-addon2" value={searchKeyword}
                                               onChange={evt => setSearchKeyword(evt.target.value)} />
                                        <div className="input-group-append">
                                            <button className="btn btn-primary" type="button" onClick={()=>userDeleteScenario()}>
                                                <i className="fas fa-search fa-sm"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </ul>

                    <ul className={"navbar-nav ml-auto"}>
                        <Link onClick={()=>userDeleteScenario()} to={"/userbook/form"} className="dropdown no-arrow d-sm-none">
                            <button className="btn btn-primary">
                                <strong>+</strong>
                            </button>
                        </Link>
                    </ul>

                    <Link onClick={()=>userDeleteScenario()} to="/userbook/form" className="d-none d-sm-inline-block form-inline mr-0 ml-md-3 my-2 my-md-0 mw-100">
                        <button className="btn btn-primary">Add User Book</button>
                    </Link>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table
                            className="table table-bordered"
                            id="datapenggunabuku"
                            width="100%"
                            cellSpacing="0">
                            <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th>Book Title</th>
                                <th>Username</th>
                                <th>Start Date</th>
                                <th>Due Date</th>
                                <th>Return Date</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUserbooks.map((userBooks, index) => (
                                <tr key={userBooks.userbookId}>
                                    <td key={userBooks.userbookId} scope="row">
                                        {index + 1}
                                    </td>
                                    <td>{userBooks.bookTitle}</td>
                                    <td>{userBooks.userName}</td>
                                    <td>{userBooks.startDate}</td>
                                    <td>{userBooks.dueDate}</td>
                                    <td>{userBooks.returnDate}</td>
                                    <td>
                                        <Link onClick={()=>userDeleteScenario()}
                                              to=
                                                  {"/userbook/form/" + userBooks.userbookId}>
                                            <button className="btn btn-primary"> Edit</button>
                                        </Link>{" "}
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => deleteUserBook(userBooks.userbookId)}>
                                            {" "}
                                            Delete{" "}
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