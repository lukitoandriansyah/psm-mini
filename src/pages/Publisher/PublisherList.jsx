import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PublisherList() {
  const [publishers, setPublishers] = useState([]);

  async function getPublisherList() {
    try {
      const response = await axios.get(
        "https://be-library-mini-system.herokuapp.com/publisher/list"
      );

      console.log(response.data);
      setPublishers(response.data);
    } catch (err) {
      console.log(err);
      alert("Terjadi Masalah");
    }
  }

  function deletePublisher(id) {
    axios
      .delete(
        "https://be-library-mini-system.herokuapp.com/publisher/delete/" + id
      )
      .then(() => {
        getPublisherList();
      })
      .catch((err) => {
        console.log(err);
        alert("error");
      });
  }

  useEffect(() => {
    getPublisherList();
  }, []);

  return (
    <>
      <div class="card shadow mb-4">
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 class="m-0 font-weight-bold text-primary">Daftar Penerbit</h6>
          <Link to="/publisher/form">
            <button className="btn btn-primary"> Tambah Penerbit </button>
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
                  <th>Penerbit</th>
                  <th>Alamat</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {publishers.map((publisher, index) => (
                  <tr>
                    <td key={publisher.publisherId} scope="row">
                      {index + 1}
                    </td>
                    <td>{publisher.publisherName}</td>
                    <td>{publisher.addressPublisher}</td>
                    <td>
                      <Link to={"/publisher/form/" + publisher.idPublisher}>
                        <button className="btn btn-primary"> Edit </button>
                      </Link>{" "}
                      <button
                        onClick={() => deletePublisher(publisher.idPublisher)}
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
