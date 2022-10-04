import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function PublisherForm() {
  const navigate = useNavigate();
  const params = useParams();

  const isEditing = params.idPublisher;

  const [publishers, setPublishers] = useState([]);
  const [formInput, setFormInput] = useState({
    publisherName: "",
    addressPublisher: "",
  });

  function handleInput(event, propName) {
    const copyFormInput = { ...formInput };
    copyFormInput[propName] = event.target.value;
    setFormInput(copyFormInput);
  }

  async function getPublishers() {
    const res = await axios.get(
        "https://be-psm-mini-library-system.herokuapp.com/publisher/list"
    );

    console.log(res.data);
    setPublishers(res.data);
  }

  async function getFormInput() {
    const res = await axios.get(
        "https://be-psm-mini-library-system.herokuapp.com/publisher/" +
        params.idPublisher
    );

    console.log(res.data);
    setFormInput(res.data[0]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isEditing) {
      await axios.put(
          "https://be-psm-mini-library-system.herokuapp.com/publisher/update/" +
          params.idPublisher,
          formInput
      );
    } else {
      await axios.post(
          "https://be-psm-mini-library-system.herokuapp.com/publisher/save",
          formInput
      );
    }

    navigate("/publisher");
  }

  useEffect(() => {
    getPublishers();
    if (isEditing) {
      getFormInput();
    }
  }, []);

  return (
      <>
        <div class="card shadow mb-4">
          <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Form Penerbit</h6>

            <Link to="/publisher">
              <button className="btn btn-secondary">Kembali</button>
            </Link>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div class="mb-3">
                <label class="form-label">Penerbit</label>
                <input
                    class="form-control"
                    type="text"
                    value={formInput.publisherName}
                    onChange={(event) => handleInput(event, "publisherName")}
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Alamat</label>
                <input
                    class="form-control"
                    type="text"
                    value={formInput.addressPublisher}
                    onChange={(event) => handleInput(event, "addressPublisher")}
                />
              </div>

              <button class="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </>
  );
}
