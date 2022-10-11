import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { useDebounce } from "use-debounce";
import Spinner from "../../components/Spinner/Spinner";

export default function AuthorList() {
  const [authors, setAuthors] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [statusUserById, setStatusUserById] = useState()
  const [dataUserById, setDataUserById] = useState([])
  const [userUpdated, setUserUpdated] = useState([])
  const [statusUpdated, setStatusUpdated] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeywordDebounced] = useDebounce(searchKeyword, 500);
  const navigate =  useNavigate()

  async function getAuthorList() {
    try {
      const keyword = searchKeyword.length > 0 ? "&q=" + searchKeyword : "";
      const res = await fetch(
          "https://be-psm-mini-library-system.herokuapp.com/author/all?_expand=author" +
          keyword,
          { method: "GET" }
      );
      const data = await res.json();
      setAuthors(data.sort((a, b) => a.authorId - b.authorId));
    } catch (err) {
      console.log(err);
      alert("There's something wrong. please try again");
    } finally {
      setIsLoading(false);
    }
  }
  // async function getAuthorList() {
  //   try {
  //     const response = await axios.get(
  //       "https://be-psm-mini-library-system.herokuapp.com/author/all"
  //     );

  //     console.log(response.data);
  //     setAuthors(response.data);
  //   } catch (err) {
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

  function deleteAuthor(id) {
    userDeleteScenario()

    axios
        .delete(
            "https://be-psm-mini-library-system.herokuapp.com/author/delete/" + id
        )
        .then(() => {
          getAuthorList();
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
    getAuthorList();
  }, [searchKeywordDebounced]);

  useEffect(() => {
    if (searchKeyword.length > 0) {
      const filterResult = authors.filter((author) => {
        const a = author.authorName
            .toLowerCase()
            .includes(searchKeyword.toLowerCase());
        return a;
      });
      setFilteredAuthors(filterResult);
    } else {
      setFilteredAuthors(authors);
    }
  }, [searchKeyword, authors]);

  return (
      <>
        <div className="card shadow mb-4">
          <div className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <ul className={"navbar-nav mr-auto"}>
              <h6 className="m-0 font-weight-bold text-primary">Author List</h6>
            </ul>
            <form className="d-none d-sm-inline-block form-inline mr-md-3 ml-md-3 my-2 my-md-0 mw-100 navbar-search">
              <div className="input-group">
                <input
                    type="text"
                    className="form-control bg-md-white-auth-end border-0 small"
                    placeholder="find author"
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
                    author="button"
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
                          placeholder="find author"
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
              <Link onClick={()=>userDeleteScenario()} to={"/author/form"} className="dropdown no-arrow d-sm-none">
                <button className="btn btn-primary">
                  <strong>+</strong>
                </button>
              </Link>
            </ul>

            <Link
                onClick={()=>userDeleteScenario()}
                to={"/author/form"}
                className="d-none d-sm-inline-block form-inline mr-0 ml-md-3 my-2 my-md-0 mw-100"
            >
              <button className="btn btn-primary">Add Author</button>
            </Link>
          </div>

          <div className="card-body">
            {isLoading ? (
                <div className="d-flex justify-content-center">
                  <Spinner />
                </div>
            ) : (
                <div className="table-responsive">
                  <table
                      className="table table-bordered"
                      id="dataTable"
                      width="100%"
                      cellSpacing="0"
                  >
                    <thead>
                    <tr>
                      <th scope="col">No</th>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Phone Number</th>
                      <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredAuthors.map((author, index) => (
                        <tr>
                          <td key={author.authorId} scope="row">
                            {index + 1}
                          </td>
                          <td>{author.authorName}</td>
                          <td>{author.authorAddress}</td>
                          <td>{author.noHp}</td>
                          <td>
                            <Link onClick={()=>userDeleteScenario()} to={"/author/form/" + author.authorId}>
                              <button className="btn btn-primary"> Edit </button>
                            </Link>{" "}
                            <button
                                onClick={() => deleteAuthor(author.authorId)}
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
