import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function AuthorForm() {
  const navigate = useNavigate();
  const params = useParams();

  const isEditing = params.authorId;

  const [authors, setAuthors] = useState([]);
  const [formInput, setFormInput] = useState({
    authorName: "",
    authorAddress: "",
    noHp: "",
  });

  function handleInput(event, propName) {
    const copyFormInput = { ...formInput };
    copyFormInput[propName] = event.target.value;
    setFormInput(copyFormInput);
  }

  async function getAuthors() {
    const res = await axios.get(
      "https://be-library-mini-system.herokuapp.com/author/all"
    );
    setAuthors(res.data);
  }

  async function getFormInput() {
    const res = await axios.get(
      "https://be-library-mini-system.herokuapp.com/author/" + params.authorId
    );

    console.log(res.data);
    setFormInput(res.data);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isEditing) {
      await axios.put(
        "https://be-library-mini-system.herokuapp.com/author/update/" +
          params.authorId,
        formInput
      );
    } else {
      await axios.post(
        "https://be-library-mini-system.herokuapp.com/author/save",
        formInput
      );
    }

    navigate("/author");
  }

  useEffect(() => {
    getAuthors();
    if (isEditing) {
      getFormInput();
    }
  }, []);

  return (
    <>
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">Form Penulis</h6>

          <Link to="/author">
            <button className="btn btn-secondary">Kembali</button>
          </Link>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Penulis</label>
              <input
                className="form-control"
                type="text"
                value={formInput.authorName}
                onChange={(event) => handleInput(event, "authorName")}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Alamat</label>
              <input
                className="form-control"
                type="text"
                value={formInput.authorAddress}
                onChange={(event) => handleInput(event, "authorAddress")}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">No Hp</label>
              <input
                className="form-control"
                type="text"
                value={formInput.noHp}
                onChange={(event) => handleInput(event, "noHp")}
              />
            </div>

            <button className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
