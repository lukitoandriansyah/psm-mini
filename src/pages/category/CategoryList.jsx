import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

  async function getCategoryList() {
    try {
      const response = await axios.get(
        "https://be-library-mini-system.herokuapp.com/category/list"
      );

      console.log(response.data);
      setCategories(response.data);
    } catch (err) {
      console.log(err);
      alert("Terjadi Masalah");
    }
  }

  function deleteCategory(id) {
    axios
      .delete(
        "https://be-library-mini-system.herokuapp.com/category/delete/" + id
      )
      .then(() => {
        getCategoryList();
      })
      .catch((err) => {
        console.log(err);
        alert("error");
      });
  }

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <>
      <div class="card shadow mb-4">
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 class="m-0 font-weight-bold text-primary">Daftar Kategori</h6>
          <Link to="/category/form">
            <button className="btn btn-primary"> Tambah Kategori </button>
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
                  <th>Kategori</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr>
                    <td key={category.categoryId} scope="row">
                      {index + 1}
                    </td>
                    <td>{category.categoryName}</td>
                    <td>
                      <Link to={"/category/form/" + category.idCategory}>
                        <button className="btn btn-primary"> Edit </button>
                      </Link>{" "}
                      <button
                        onClick={() => deleteCategory(category.idCategory)}
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
