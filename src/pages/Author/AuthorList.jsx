import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";

export default function AuthorList() {
  const [authors, setAuthors] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [searchKeywordDebounced] = useDebounce(searchKeyword, 500);

  async function getAuthorList() {
    const keyword = searchKeyword.length > 0 ? "&q=" + searchKeyword : "";
    const res = await fetch(
        "https://be-psm-mini-library-system.herokuapp.com/author/all?_expand=author" +
        keyword,
        { method: "GET" }
    );
    const data = await res.json();
    setAuthors(data.sort((a, b) => a.authorId - b.authorId));
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

  function deleteAuthor(id) {
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
        <div class="card shadow mb-4">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Author List</h6>

            <form className="d-none d-sm-inline-block form-inline navbar-search">
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
                  <button className="btn btn-primary" type="button">
                    <i className="fas fa-search fa-sm"></i>
                  </button>
                </div>
              </div>
            </form>

            <Link to="/author/form">
              <button className="btn btn-primary"> Add Author </button>
            </Link>
          </div>

          <div class="card-body">
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
                        <Link to={"/author/form/" + author.authorId}>
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
          </div>
        </div>
      </>
  );
}
