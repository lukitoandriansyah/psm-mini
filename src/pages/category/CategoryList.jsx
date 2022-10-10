import React from "react";
import axios from "axios";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

  async function getCategoryList() {
    try {
      const response = await axios.get(
          "https://be-psm-mini-library-system.herokuapp.com/category/list"
      );
      setCategories(response.data.sort((a, b) => a.categoryId - b.categoryId));
    } catch (err) {
      alert("There's error, try again");
    }
  }

  async function deleteCategory(id) {
    const res = await axios.delete("https://be-psm-mini-library-system.herokuapp.com/category/delete/" + id)
    const resp = res.data

    resp.status === false ?
        alert("Delete Failed!!!\nThis data was referenced in book list, change or delete them before delete this.")
        :
        ""
    getCategoryList()
  }

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
      <>
        <div className="card shadow mb-4">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="m-0 font-weight-bold text-primary">List Category</h6>
            <Link to="/category/form">
              <button className="btn btn-primary"> Add Category</button>
            </Link>
          </div>

          <div className="card-body">
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
                  <th>Category</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {categories.map((category, index) => (
                    <tr key={category.categoryId}>
                      <td scope="row">
                        {index + 1}
                      </td>
                      <td>{category.categoryName}</td>
                      <td>
                        <Link to={"/category/form/" + category.categoryId}>
                          <button className="btn btn-primary"> Edit</button>
                        </Link>{" "}
                        <button
                            onClick={() => deleteCategory(category.categoryId)}
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
