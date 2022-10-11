import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function AuthorForm() {
  const [statusUserById, setStatusUserById] = useState()
  const [dataUserById, setDataUserById] = useState([])
  const [userUpdated, setUserUpdated] = useState([])
  const [statusUpdated, setStatusUpdated] = useState([])
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
        "https://be-psm-mini-library-system.herokuapp.com/author/all"
    );
    setAuthors(res.data);
  }

  async function getFormInput() {
    const res = await axios.get(
        "https://be-psm-mini-library-system.herokuapp.com/author/" +
        params.authorId
    );

    setFormInput(res.data[0]);
  }

  function getUserData() {
    const savedDataUser = localStorage.getItem("user")
    if (savedDataUser) {
      return JSON.parse(savedDataUser)
    } else {
      return {}
    }
  }

  async function getUsersById() {
    try {

      const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/users/profile/byid/"+getUserData().userId,
          {method: "GET"})
      const data = await res.json();
      setStatusUserById(data.status)
      setDataUserById(data.data)
    }catch (err){
      console.log(err)
      alert("There's something wrong. please try again")
    }
  }

  function saveDataTrue(dataUser, statusUser) {
    const formattedDataUserUpdated = JSON.stringify(dataUser)
    const formattedStatusUserUpdated = JSON.stringify(statusUser)

    localStorage.removeItem("user")
    localStorage.removeItem("statusLogin")

    localStorage.setItem("user", formattedDataUserUpdated)
    localStorage.setItem("statusLogin", formattedStatusUserUpdated)

    setUserUpdated(dataUser)
    setStatusUpdated(statusUser)

  }

  function saveDataFalse(dataUser, statusUser) {
    setUserUpdated(dataUser)
    setStatusUpdated(statusUser)
  }

  async function userDeleteScenario(){
    if(statusUserById === true){
      /*console.log("ya data masuk")*/
      const payload = JSON.stringify({
        username: dataUserById.username,
        password: dataUserById.password
      })
      const targetUrl = "https://be-psm-mini-library-system.herokuapp.com/auth/login"
      const method = "POST"
      const res = await fetch(targetUrl, {
        method: method,
        body: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((re) => re.json())

      const respData = res.data
      const respStatus = res.status

      respStatus === true ? saveDataTrue(respData, respStatus)  : saveDataFalse(respData, respStatus)
    }else{
      localStorage.clear()
      navigate("/home")
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    userDeleteScenario()

    if (isEditing) {
      await axios.put(
          "https://be-psm-mini-library-system.herokuapp.com/author/update/" +
          params.authorId,
          formInput
      );
    } else {
      await axios.post(
          "https://be-psm-mini-library-system.herokuapp.com/author/save",
          formInput
      );
    }

    navigate("/author");
  }

  useEffect(() => {
    getAuthors();
    getUsersById()
    if (isEditing) {
      getFormInput();
    }
  }, []);

  return (
      <>
        <div className="card shadow mb-4">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="m-0 font-weight-bold text-primary">Author Form</h6>

            <Link onClick={()=>userDeleteScenario()} to="/author">
              <button className="btn btn-secondary">Back</button>
            </Link>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Author</label>
                <input
                    className="form-control"
                    type="text"
                    value={formInput.authorName}
                    onChange={(event) => handleInput(event, "authorName")}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                    className="form-control"
                    type="text"
                    value={formInput.authorAddress}
                    onChange={(event) => handleInput(event, "authorAddress")}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
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
