import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { useDebounce } from "use-debounce";
import Spinner from "../../components/Spinner/Spinner";

export default function BookList2() {
    const [books, setBooks] = useState([]);
    const [statusUserById, setStatusUserById] = useState()
    const [dataUserById, setDataUserById] = useState([])
    const [userUpdated, setUserUpdated] = useState([])
    const [statusUpdated, setStatusUpdated] = useState([])
    const [searchKeyword, setSearchKeyword] = useState("")
    const [filteredBooks, setFilteredBooks] = useState([])
    const [searchKeywordDebounced] = useDebounce(searchKeyword, 500)
    const [isLoading, setIsLoading] = useState(true)
    const navigate =  useNavigate()

    async function getBookList() {
        // const keyword = searchKeyword.length > 0 ? "&q=" + searchKeyword : "";
        // const res = await axios.get(
        //     "https://be-psm-mini-library-system.herokuapp.com/book/books?_expand=book" + keyword,
        // );
        // setBooks(data.sort((a, b) => a.bookId - b.bookId));

        try {
            setIsLoading(true)
            const keyword = searchKeyword.length > 0 ? "&q=" + searchKeyword : "";
            const res = await axios.get(
                "https://be-psm-mini-library-system.herokuapp.com/book/books?_expand=book" + keyword,
            );
            setBooks(res.data.sort((a, b) => a.bookId - b.bookId));
        } catch (err) {
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

    function deleteBook(id) {
        userDeleteScenario()
        setIsLoading(true)
        axios
            .delete(
                "https://be-psm-mini-library-system.herokuapp.com/book/delete/" + id
            )
            .then(() => {
                getBookList();
            })
            .catch(() => {
                setIsLoading(true)
                alert(
                    "Delete Failed!!! This Data Was Referenced In UserbookList, Delete Them Before Delete This"
                )
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    useEffect(()=>{
        getUsersById()
    },[])
    useEffect(() => {
        getBookList()
    }, [searchKeywordDebounced]);

    useEffect(() => {
        if (searchKeyword.length > 0) {
            const filterResult = books.filter((book) => {
                function params() {
                    const a = book.bookTitle.toLowerCase().includes(searchKeyword.toLocaleLowerCase())
                    const b = book.bookYear.toString().includes(searchKeyword.toString())
                    const d = book.publisherName.toLowerCase().includes(searchKeyword.toLocaleLowerCase())
                    const e = book.categoryName.toLowerCase().includes(searchKeyword.toLocaleLowerCase())
                    const f = book.authorName.toLowerCase().includes(searchKeyword.toLocaleLowerCase())
                    if (a) { return a }
                    if (b) { return b }
                    if (d) { return d }
                    if (e) { return e }
                    if (f) { return f }
                }
                return params()
            })
            setFilteredBooks(filterResult)
        } else {
            setFilteredBooks(books)
        }
    }, [searchKeyword, books])
    if (isLoading) return <Spinner />

    return (
        <>
            <div className="card shadow mb-4">
                {getUserData().roleName !== "Admin" ?
                    <>
                        <div className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                            <ul className={"navbar-nav mr-auto"}>
                                <h6 className="m-0 font-weight-bold text-primary">Book List</h6>
                            </ul>
                            <form
                                className="d-none d-sm-inline-block form-inline mr-0 ml my-2 my-md-0 mw-100 navbar-search">
                                <div className="input-group">
                                    <input type="text" className="form-control bg-md-white-auth-end border-0 small" placeholder="find book"
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
                                                <input type="text" className="form-control bg-md-white-auth-end border-0 small" placeholder="find book"
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
                        </div>
                    </>
                    :
                    <><div className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                        <ul className={"navbar-nav mr-auto"}>
                            <h6 className="m-0 font-weight-bold text-primary">Book List</h6>
                        </ul>
                        <form
                            className="d-none d-sm-inline-block form-inline mr-md-3 ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                            <div className="input-group">
                                <input type="text" className="form-control bg-md-white-auth-end border-0 small" placeholder="find book"
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
                                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={()=>userDeleteScenario()}>
                                    <i className="fas fa-search fa-fw"></i>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                     aria-labelledby="searchDropdown">
                                    <form className="form-inline mr-auto w-100 navbar-search">
                                        <div className="input-group">
                                            <input type="text" className="form-control bg-md-white-auth-end border-0 small" placeholder="find book"
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
                            <Link onClick={()=>userDeleteScenario()} to={"/book/form"} className="dropdown no-arrow d-sm-none">
                                <button className="btn btn-primary" >
                                    <strong>+</strong>
                                </button>
                            </Link>
                        </ul>

                        {/* <ul className={"navbar-nav ml-auto"}>
                        {getUserData().rolename !== "Admin" ?
                            <></> :
                                <Link to={"/book/form"} className="dropdown no-arrow d-sm-none">
                                    <button className="btn btn-primary">
                                        <strong>+</strong>
                                    </button>
                                </Link>
                        }
                    </ul> */}

                        <ul className={"navbar-nav ml-auto"}>
                            <Link onClick={()=>userDeleteScenario()} to="/book/form" className="d-none d-sm-inline-block form-inline mr-0 ml-md-3 my-2 my-md-0 mw-100">
                                <button className="btn btn-primary">Add Book</button>
                            </Link>
                        </ul>

                        {/* {getUserData().rolename !== "Admin" ?
                        <></> :
                        <ul calssName={"navbar-nav ml-auto"}>
                            <Link to="/book/form" className="d-none d-sm-inline-block form-inline mr-0 ml-md-3 my-2 my-md-0 mw-100">
                                <button className="btn btn-primary">Add Book</button>
                            </Link>
                        </ul>
                    } */}
                    </div>
                    </>
                }

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
                                <th>Book's Title</th>
                                <th>Book's Category</th>
                                <th>Release Date</th>
                                <th>Book's Author</th>
                                <th>Book's Publisher</th>
                                <th>Book' Status</th>
                                {getUserData().roleName !== "Admin" ?
                                    <></> :
                                    <th>Action</th>
                                }

                            </tr>
                            </thead>
                            <tbody>
                            {filteredBooks.map((books, index) => (
                                <tr key={books.bookId}>
                                    <td key={books.bookId} scope="row">{index + 1}</td>
                                    <td>{books.bookTitle}</td>
                                    <td>{books.categoryName}</td>
                                    <td>{books.bookYear}</td>
                                    <td>{books.authorName}</td>
                                    <td>{books.publisherName}</td>
                                    <td>{books.bookStatus === true ? "Tersedia" : "Dipinjam"}</td>
                                    {getUserData().roleName !== "Admin" ?
                                        <></> :
                                        <td>
                                            <Link onClick={()=>userDeleteScenario()}
                                                  to=
                                                      {"/book/form/" + books.bookId}>
                                                <button className="btn btn-primary"> Edit </button>
                                            </Link>{" "}
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => deleteBook(books.bookId)}

                                            >
                                                {" "}
                                                Delete{" "}
                                            </button>
                                        </td>
                                    }

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