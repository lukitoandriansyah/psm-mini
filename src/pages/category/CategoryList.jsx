import React from "react";
import axios from "axios";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useDebounce} from "use-debounce";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchKeywordDebounced] = useDebounce(searchKeyword, 500);

  async function getCategoryList() {
    const keyword = searchKeyword.length > 0 ? "&q=" + searchKeyword : "";
    const res = await fetch(
        "https://be-psm-mini-library-system.herokuapp.com/category/list?_expand=category" +
        keyword,
        {method: "GET"}
    );
    const data = await res.json();
    setCategories(data.sort((a, b) => a.categoryId - b.categoryId));
  }

//   async function getCategoryList() {
//     try {
//       const response = await axios.get(
//         "https://be-psm-mini-library-system.herokuapp.com/category/list"
//       );
//       setCategories(response.data.sort((a, b) => a.categoryId - b.categoryId));
//     } catch (err) {
//       alert("There's error, try again");
//     }
//   }

  async function deleteCategory(id) {
    try {
      const res = await axios.delete("https://be-psm-mini-library-system.herokuapp.com/category/delete/" + id)
      const resp =await res.data
      resp.status === false?
          alert("Delete Failed!!! This data was referenced in book list, delete them before delete this"):""
    } catch (err) {
      alert(
          "Delete Failed!!! This data was referenced in book list, delete them before delete this"
      );
    }
    getCategoryList()
  }

  useEffect(() => {
    getCategoryList();
  }, [searchKeywordDebounced]);

  useEffect(() => {
    if (searchKeyword.length > 0) {
      const filterResult = categories.filter((category) => {
        const a = category.categoryName
            .toLowerCase()
            .includes(searchKeyword.toLowerCase());
        return a;
      });
      setFilteredCategories(filterResult);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchKeyword, categories]);

  return (
      <>
        <div class="card shadow mb-4">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Category List</h6>

            <form className="d-none d-sm-inline-block form-inline navbar-search">
              <div className="input-group">
                <input
                    type="text"
                    className="form-control bg-md-white-auth-end border-0 small"
                    placeholder="find category"
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
                {filteredCategories.map((category, index) => (
                    <tr>
                      <td key={category.categoryId} scope="row">
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

//   return (
//     <>
//       <div className="card shadow mb-4">
//         <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
//           <h6 className="m-0 font-weight-bold text-primary">List Category</h6>
//           <Link to="/category/form">
//             <button className="btn btn-primary"> Add Category</button>
//           </Link>
//         </div>

//         <div className="card-body">
//           <div className="table-responsive">
//             <table
//               className="table table-bordered"
//               id="dataTable"
//               width="100%"
//               cellSpacing="0"
//             >
//               <thead>
//                 <tr>
//                   <th scope="col">No</th>
//                   <th>Category</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {categories.map((category, index) => (
//                   <tr key={category.categoryId}>
//                     <td scope="row">{index + 1}</td>
//                     <td>{category.categoryName}</td>
//                     <td>
//                       <Link to={"/category/form/" + category.categoryId}>
//                         <button className="btn btn-primary"> Edit</button>
//                       </Link>{" "}
//                       <button
//                         onClick={() => deleteCategory(category.categoryId)}
//                         className="btn btn-danger"
//                       >
//                         {" "}
//                         Delete{" "}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </>
//   );
}
