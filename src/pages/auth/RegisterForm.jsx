import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

let responses = []

export default function RegisterForm() {
    const navigate = useNavigate()
    const [roleList, setRoleList] = useState([])
    const [formInput, setFormInput] = useState({
        name: '',
        username: '',
        password: '',
        roleId: ""
    })

    async function getRoleList() {
        const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/role/list-role",
            {method: "GET"})
        const data = await res.json();
        setRoleList(data);
    }


    function handleInput(event, inputName) {
        const copyFormInput = {...formInput}
        copyFormInput[inputName] = event.target.value
        setFormInput(copyFormInput)
    }

    async function handleSubmit(event) {
        event.preventDefault()
        const payload = JSON.stringify({
            ...formInput,
            roleId: parseInt(formInput.roleId)
        })
        const targetUrl = "https://be-psm-mini-library-system.herokuapp.com/auth/register"
        const method = "POST"
        await fetch(targetUrl, {
            method: method,
            body: payload,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((re) => re.json()).then((d) => responses.push(d))

        if(localStorage.length>0){
            back(event);
        }else{
            if (responses[responses.length - 1].status.toString() === "true") {
                alert
                (
                    responses[responses.length - 1].message.toString()
                    + "\n" + "name: " + responses[responses.length - 1].data.name.toString()
                    + "\n" + "username: " + responses[responses.length - 1].data.username.toString()
                    + "\n" + "password: " + responses[responses.length - 1].data.password.toString()
                    + "\n" + "role Id: " + responses[responses.length - 1].data.roleId.toString()
                    + "\n \n" + "Please login to Continue"
                )
                navigate('/login')
            } else {
                if (formInput.name !== "" && formInput.username !== "" && formInput.password !== "" && formInput.roleId !== "") {
                    const messageArr = responses[responses.length - 1].message.toString().split(" ");
                    if (messageArr.indexOf("data") >= 0 && messageArr.indexOf("exists") >= 0) {
                        alert(responses[responses.length - 1].message.toString())
                    } else {
                        alert(responses[responses.length - 1].message.toString())
                    }
                } else {
                    alert("Form must be filled fully")
                }
            }
        }
    }

    function back(event) {
        event.preventDefault()
        history.go(-1)
    }

    useEffect(() => {
        getRoleList()
    }, [])


    return <>
        <div className="container-auth bg-light-auth">
            <div className="row-2 text-center">
                <div className="col-md-2 col-12"/>
                <div className="col-md-8 col-12">
                    <div
                        className="wrapper-auth bordered-auth bg-md-white-auth d-flex-auth flex-column align-items-between">
                        <div className="form">
                            <div className={"m-0 font-weight-bold text-primary fa fa-arrow-circle-left"}
                                 onClick={event => back(event)}>
                                &nbsp;
                                Back
                            </div>
                            <br/>
                            <br/>
                            <div className="h4 font-weight-bold text-center mb-4">Register</div>
                            <form onSubmit={event => handleSubmit(event)}>
                                <div className="form-group mb-4">
                                    <label>Your Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={formInput.name}
                                        onChange={event => handleInput(event, "name")}/>
                                </div>

                                <div className="form-group mb-4">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={formInput.username}
                                        onChange={event => handleInput(event, "username")}/>
                                </div>

                                <div className="form-group mb-4">
                                    <label>Password</label>
                                    <input
                                        type={"password"}
                                        className="form-control"
                                        required
                                        value={formInput.password}
                                        onChange={event => handleInput(event, "password")}
                                    />
                                </div>

                                <div className="form-group mb-4">
                                    <label>Role Name</label>
                                    <select
                                        className="form-control"
                                        required
                                        value={formInput.roleId}
                                        onChange={event => handleInput(event, "roleId")}>
                                        <option value="" disabled></option>
                                        {roleList.map(listRole =>
                                            <option value={listRole.roleId}>
                                                {listRole.roleName}
                                            </option>
                                        )}
                                    </select>

                                </div>

                                <button className="btn btn-primary">
                                    Register
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-2 col-12"/>
            </div>
        </div>
    </>
}