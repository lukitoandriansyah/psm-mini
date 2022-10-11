import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { useDebounce } from "use-debounce";
import Spinner from "../../components/Spinner/Spinner";

export default function PublisherList() {
    const [publishers, setPublishers] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusUserById, setStatusUserById] = useState()
    const [dataUserById, setDataUserById] = useState([])
    const [userUpdated, setUserUpdated] = useState([])
    const [statusUpdated, setStatusUpdated] = useState([])
    const [filteredPublishers, setFilteredPublishers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKeywordDebounced] = useDebounce(searchKeyword, 500);
    const navigate =  useNavigate()

    async function getPublisherList() {
        const keyword = searchKeyword.length > 0 ? "&q=" + searchKeyword : "";
        try {
            const res = await fetch(
                "https://be-psm-mini-library-system.herokuapp.com/publisher/list?_expand=publisher" +
                keyword,
                { method: "GET" }
            );
            const data = await res.json();
            setPublishers(data.sort((a, b) => a.idPublisher - b.idPublisher));
        } catch (err) {
            console.log(err);
            alert("There's something wrong. please try again");
        } finally {
            setIsLoading(false);
        }
    }

    // async function getPublisherList() {
    //   try {
    //     const response = await axios.get(
    //       "https://be-psm-mini-library-system.herokuapp.com/publisher/list"
    //     );

    //     console.log(response.data);
    //     setPublishers(response.data);
    //   } catch (err) {
    //     console.log(err);
    //     alert("Terjadi Masalah");
    //   }
    // }

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

    function deletePublisher(id) {
        userDeleteScenario()
        axios
            .delete(
                "https://be-psm-mini-library-system.herokuapp.com/publisher/delete/" +
                id
            )
            .then(() => {
                getPublisherList();
            })
            .catch((err) => {
                console.log(err);
                alert(
                    "Delete Failed!!! This data was referenced in book list, delete them before delete this"
                );
            });
    }

    useEffect(()=>{
        getUsersById()
    },[])

    useEffect(() => {
        getPublisherList();
    }, [searchKeywordDebounced]);

    useEffect(() => {
        if (searchKeyword.length > 0) {
            const filterResult = publishers.filter((publisher) => {
                const a = publisher.publisherName
                    .toLowerCase()
                    .includes(searchKeyword.toLowerCase());
                return a;
            });
            setFilteredPublishers(filterResult);
        } else {
            setFilteredPublishers(publishers);
        }
    }, [searchKeyword, publishers]);

    return (
        <>
            <div className="card shadow mb-4">
                <div className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                    <ul className={"navbar-nav mr-auto"}>
                        <h6 className="m-0 font-weight-bold text-primary">
                            Publisher List
                        </h6>
                    </ul>
                    <form className="d-none d-sm-inline-block form-inline mr-md-3 ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control bg-md-white-auth-end border-0 small"
                                placeholder="find publisher"
                                aria-label="Search"
                                aria-describedby="basic-addon2"
                                value={searchKeyword}
                                onChange={(evt) => setSearchKeyword(evt.target.value)}
                            />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button" onClick={()=>userDeleteScenario()}>
                                    <i className="fas fa-search fa-sm"></i>
                                </button>
                            </div>
                        </div>
                    </form>

                    <ul className="navbar-nav md-center">
                        <div className="dropdown no-arrow d-sm-none">
                            <a
                                className="dropdown-toggle"
                                href="#"
                                id="searchDropdown"
                                publisher="button"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <i className="fas fa-search fa-fw"></i>
                            </a>
                            <div
                                className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                aria-labelledby="searchDropdown"
                            >
                                <form className="form-inline mr-auto w-100 navbar-search">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control bg-md-white-auth-end border-0 small"
                                            placeholder="find publisher"
                                            aria-label="Search"
                                            aria-describedby="basic-addon2"
                                            value={searchKeyword}
                                            onChange={(evt) => setSearchKeyword(evt.target.value)}
                                        />
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
                        <Link onClick={()=>userDeleteScenario()}
                              to={"/publisher/form"}
                              className="dropdown no-arrow d-sm-none"
                        >
                            <button onClick={()=>userDeleteScenario()} className="btn btn-primary">
                                <strong>+</strong>
                            </button>
                        </Link>
                    </ul>

                    <Link onClick={()=>userDeleteScenario()}
                          to={"/publisher/form"}
                          className="d-none d-sm-inline-block form-inline mr-0 ml-md-3 my-2 my-md-0 mw-100"
                    >
                        <button onClick={()=>userDeleteScenario()} className="btn btn-primary">Add Publisher</button>
                    </Link>
                </div>

                <div class="card-body">
                    {isLoading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner />
                        </div>
                    ) : (
                        <div class="table-responsive">
                            <table
                                class="table table-bordered"
                                id="dataTable"
                                width="100%"
                                cellspacing="0"
                            >
                                <thead>
                                <tr>
                                    <th scope="col">No</th>
                                    <th>Publisher Name</th>
                                    <th>Address</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredPublishers.map((publisher, index) => (
                                    <tr>
                                        <td key={publisher.publisherId} scope="row">
                                            {index + 1}
                                        </td>
                                        <td>{publisher.publisherName}</td>
                                        <td>{publisher.addressPublisher}</td>
                                        <td>
                                            <Link onClick={()=> userDeleteScenario()} to={"/publisher/form/" + publisher.idPublisher}>
                                                <button className="btn btn-primary"> Edit </button>
                                            </Link>{" "}
                                            <button
                                                onClick={() => deletePublisher(publisher.idPublisher)}
                                                className="btn btn-danger"
                                            >
                                                {" "}
                                                Delete{" "}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
