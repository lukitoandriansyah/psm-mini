import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function CategoryForm() {
  const navigate = useNavigate();
  const params = useParams();

  const isEditing = params.idCategory;

  const [categories, setCategories] = useState([]);
  const [formInput, setFormInput] = useState({
    categoryName: "",
  });

  function handleInput(event, propName) {
    const copyFormInput = { ...formInput };
    copyFormInput[propName] = event.target.value;
    setFormInput(copyFormInput);
  }

  async function getCategories() {
    const res = await axios.get(
      "https://be-library-mini-system.herokuapp.com/category/list"
    );

    console.log(res.data);
    setCategories(res.data);
  }

  async function getFormInput() {
    const res = await axios.get(
      "https://be-library-mini-system.herokuapp.com/category/" +
        params.idCategory
    );

    console.log(res.data);
    setFormInput(res.data);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isEditing) {
      await axios.put(
        "https://be-library-mini-system.herokuapp.com/category/update/" +
          params.idCategory,
        formInput
      );
    } else {
      await axios.post(
        "https:/be-library-mini-system.herokuapp.com/category/add",
        formInput
      );
    }

    navigate("/category");
  }

  useEffect(() => {
    getCategories();
    if (isEditing) {
      getFormInput();
    }
  }, []);

  return (
    <>
      <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 class="m-0 font-weight-bold text-primary">Form Kategori</h6>

          <Link to="/category">
            <button className="btn btn-secondary">Kembali</button>
          </Link>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div class="mb-3">
              <label class="form-label">Kategori</label>
              <input
                class="form-control"
                type="text"
                value={formInput.categoryName}
                onChange={(event) => handleInput(event, "categoryName")}
              />
            </div>

            <button class="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
