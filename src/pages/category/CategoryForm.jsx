import axios from "axios";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";

export default function CategoryForm() {
  const navigate = useNavigate();
  const params = useParams();

  const isEditing = params.categoryId;

  const [categories, setCategories] = useState([]);
  const [formInput, setFormInput] = useState({
    categoryName: "",
  });

  function handleInput(event, inputName) {
    const copyFormInput = {...formInput};
    copyFormInput[inputName] = event.target.value;
    setFormInput(copyFormInput);
  }

  async function getCategories() {
    const res = await axios.get(
        "https://be-psm-mini-library-system.herokuapp.com/category/list"
    );

    setCategories(res.data);
  }

  async function getFormInput() {
    const res = await axios.get(
        "https://be-psm-mini-library-system.herokuapp.com/category/list/" +
        params.categoryId
    );

    setFormInput(res.data.data);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isEditing) {
      await axios.put(
          "https://be-psm-mini-library-system.herokuapp.com/category/update/" +
          params.categoryId,
          formInput
      );
    } else {
      await axios.post(
          "https://be-psm-mini-library-system.herokuapp.com/category/add",
          formInput
      );
    }

    navigate("/category/list");
  }

  useEffect(() => {
    getCategories();
    if (isEditing) {
      getFormInput();
    }
  }, []);

  return (
      <>
        <div className="card shadow mb-4">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="m-0 font-weight-bold text-primary">Form Category</h6>

            <Link to="/category/list">
              <button className="btn btn-secondary">Back</button>
            </Link>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <input
                    className="form-control"
                    type="text"
                    value={formInput.categoryName}
                    onChange={(event) => handleInput(event, "categoryName")}
                />
              </div>

              <button className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </>
  );
}
