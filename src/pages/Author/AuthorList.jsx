import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AuthorList() {
  const [authors, setAuthors] = useState([]);

  async function getAuthorList() {
    try {
      const response = await axios.get(
          "https://be-psm-mini-library-system.herokuapp.com/author/all"
      );

      console.log(response.data);
      setAuthors(response.data);
    } catch (err) {
      alert("Terjadi Masalah");
    }
  }

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
          alert("Error woi");
        });
  }

  useEffect(() => {
    getAuthorList();
  }, []);

  return (
      <>
        <div class="card shadow mb-4">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Daftar Penulis</h6>
            <Link to="/author/form">
              <button className="btn btn-primary"> Tambah Penulis </button>
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
                  <th>Nama</th>
                  <th>Alamat</th>
                  <th>No Hp</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {authors.map((author, index) => (
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
  );
}
