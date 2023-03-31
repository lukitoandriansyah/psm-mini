import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {Url} from "../../partials/url-BE/Url.jsx";

let responses = [];
export default function PublisherForm() {
  const [statusUserById, setStatusUserById] = useState()
  const [dataUserById, setDataUserById] = useState([])
  const [userUpdated, setUserUpdated] = useState([])
  const [statusUpdated, setStatusUpdated] = useState([])
  let statusCheckerName = true;
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
        Url+"/publisher/list"
    );

    setPublishers(res.data);
  }

  async function getFormInput() {
    const res = await axios.get(
        Url+"/publisher/" +
        params.idPublisher
    );

    setFormInput(res.data[0]);
  }

  function publisherNameChecker(paramsPublisherName) {
    for (let publisher of publishers) {
      if (
          publisher.publisherName.toLowerCase() ===
          paramsPublisherName.toLowerCase()
      ) {
        alert("Failed to save data, data was exists");
        statusCheckerName = false;
      }
    }
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

      const res = await fetch(Url+"/users/profile/byid/"+getUserData().userId,
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
      const targetUrl = Url+"/auth/login"
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
      if (formInput.publisherName.split(" ").length === 1) {
        const payload = JSON.stringify({
          ...formInput,
          publisherName:
              formInput.publisherName.charAt(0).toUpperCase() +
              formInput.publisherName.slice(1).toLowerCase(),
          idPublisher: parseInt(formInput.idPublisher),
        });

        publisherNameChecker(
            formInput.publisherName.charAt(0).toUpperCase() +
            formInput.publisherName.slice(1).toLowerCase()
        );

        if (statusCheckerName === false) {
          statusCheckerName = true;
        } else {
          const targetUrl =
              Url+"/publisher/update/" +
              params.idPublisher;
          const method = "PUT";
          await fetch(targetUrl, {
            method: method,
            body: payload,
            headers: { "Content-Type": "application/json" },
          })
              .then((re) => re.json())
              .then((d) => responses.push(d));

          if (responses[responses.length - 1].status.toString() === "true") {
            localStorage.removeItem("tempRoleName");
            alert(responses[responses.length - 1].message.toString());
            navigate("/publisher");
          } else {
            if (formInput.publisherName !== "") {
              const messageArr = responses[responses.length - 1].message
                  .toString()
                  .split(" ");
              messageArr.indexOf("Id") >= 0 && messageArr.indexOf("found") >= 0
                  ? alert(responses[responses.length - 1].message.toString())
                  : alert(responses[responses.length - 1].message.toString());
            } else {
              alert("Form must be filled fully");
            }
          }
          statusCheckerName = true;
        }
      } else {
        let strPublisherName = "";
        for (let inputPublisherName of formInput.publisherName.split(" ")) {
          strPublisherName +=
              inputPublisherName.charAt(0).toUpperCase() +
              inputPublisherName.slice(1).toLowerCase() +
              " ";
        }

        const payload = JSON.stringify({
          ...formInput,
          publisherName: strPublisherName.substring(
              0,
              strPublisherName.length - 1
          ),
          idPublisher: parseInt(formInput.idPublisher),
        });

        publisherNameChecker(
            strPublisherName.substring(0, strPublisherName.length - 1)
        );

        if (statusCheckerName === false) {
          statusCheckerName = true;
        } else {
          const targetUrl =
              Url+"/publisher/update/" +
              params.idPublisher;
          const method = "PUT";
          await fetch(targetUrl, {
            method: method,
            body: payload,
            headers: { "Content-Type": "application/json" },
          })
              .then((re) => re.json())
              .then((d) => responses.push(d));

          if (responses[responses.length - 1].status.toString() === "true") {
            localStorage.removeItem("tempRoleName");
            alert(responses[responses.length - 1].message.toString());
            navigate("/publisher");
          } else {
            if (formInput.publisherName !== "") {
              const messageArr = responses[responses.length - 1].message
                  .toString()
                  .split(" ");
              messageArr.indexOf("Id") >= 0 && messageArr.indexOf("found") >= 0
                  ? alert(responses[responses.length - 1].message.toString())
                  : alert(responses[responses.length - 1].message.toString());
            } else {
              alert("Form must be filled fully");
            }
          }

          statusCheckerName = true;
        }
      }
    } else {
      if (formInput.publisherName.split(" ").length === 1) {
        const payload = JSON.stringify({
          ...formInput,
          publisherName:
              formInput.publisherName.charAt(0).toUpperCase() +
              formInput.publisherName.slice(1).toLowerCase(),
          publisherId: parseInt(formInput.idPublisher),
        });

        publisherNameChecker(
            formInput.publisherName.charAt(0).toUpperCase() +
            formInput.publisherName.slice(1).toLowerCase()
        );
        if (statusCheckerName === false) {
          statusCheckerName = true;
        } else {
          const targetUrl =
              Url+"/publisher/save";
          const method = "POST";
          await fetch(targetUrl, {
            method: method,
            body: payload,
            headers: { "Content-Type": "application/json" },
          })
              .then((re) => re.json())
              .then((d) => responses.push(d));

          if (responses[responses.length - 1].status.toString() === "true") {
            statusCheckerName = true;
            alert(responses[responses.length - 1].message.toString());
            navigate("/publisher");
          } else {
            if (formInput.publisherName !== "") {
              const messageArr = responses[responses.length - 1].message
                  .toString()
                  .split(" ");
              messageArr.indexOf("Id") >= 0 && messageArr.indexOf("found") >= 0
                  ? alert(responses[responses.length - 1].message.toString())
                  : alert(responses[responses.length - 1].message.toString());
            } else {
              alert("Form must be filled fully");
            }
          }
          statusCheckerName = true;
        }
      } else {
        let strPublisherName = "";
        for (let inputPublisherName of formInput.publisherName.split(" ")) {
          strPublisherName +=
              inputPublisherName.charAt(0).toUpperCase() +
              inputPublisherName.slice(1).toLowerCase() +
              " ";
        }
        const payload = JSON.stringify({
          ...formInput,
          publisherName: strPublisherName.substring(
              0,
              strPublisherName.length - 1
          ),
          idPublisher: parseInt(formInput.idPublisher),
        });

        publisherNameChecker(
            strPublisherName.substring(0, strPublisherName.length - 1)
        );

        if (statusCheckerName === false) {
          statusCheckerName = true;
        } else {
          const targetUrl =
              Url+"/publisher/save";
          const method = "POST";
          await fetch(targetUrl, {
            method: method,
            body: payload,
            headers: { "Content-Type": "application/json" },
          })
              .then((re) => re.json())
              .then((d) => responses.push(d));

          if (responses[responses.length - 1].status.toString() === "true") {
            statusCheckerName = true;
            alert(responses[responses.length - 1].message.toString());
            navigate("/publisher");
          } else {
            statusCheckerName = true;
            if (formInput.publisherName !== "") {
              const messageArr = responses[responses.length - 1].message
                  .toString()
                  .split(" ");
              messageArr.indexOf("Id") >= 0 && messageArr.indexOf("found") >= 0
                  ? alert(responses[responses.length - 1].message.toString())
                  : alert(responses[responses.length - 1].message.toString());
            } else {
              alert("Form must be filled fully");
            }
          }
        }
      }
    }
  }

  useEffect(() => {
    getPublishers();
    getUsersById()
    if (isEditing) {
      getFormInput();
    }
  }, []);

  return (
      <>
        <div class="card shadow mb-4">
          <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Publisher Form</h6>

            <Link onClick={()=>userDeleteScenario()} to="/publisher">
              <button className="btn btn-secondary">Back</button>
            </Link>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div class="mb-3">
                <label class="form-label">Publisher</label>
                <input
                    class="form-control"
                    type="text"
                    value={formInput.publisherName}
                    onChange={(event) => handleInput(event, "publisherName")}
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Address</label>
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
