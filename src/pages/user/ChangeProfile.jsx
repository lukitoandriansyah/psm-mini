import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";

let responses = []
export default function ChangeProfile() {
    const navigate = useNavigate()
    const [formInput, setFormInput] = useState({
        name: '',
        username: '',
        password: '',
        roleId: ""
    })
    const [user, setUser] = useState([])
    const [roleList, setRoleList] = useState([])
    const params = useParams();


    function handleInput(event, inputName) {
        const copyFormInput = {...formInput}
        copyFormInput[inputName] = event.target.value
        setFormInput(copyFormInput)
    }

    async function getRoleList() {
        const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/role/list-role",
            {method: "GET"})
        const data = await res.json();
        setRoleList(data);
    }

    async function getUsers() {
        const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/users/profile/" + params.username,
            {method: "GET"})
        const data = await res.json();
        setUser(data.data);
        setFormInput(data.data)
    }

    function getUserData() {
        const savedDataUser = localStorage.getItem("user")
        if (savedDataUser) {return JSON.parse(savedDataUser)}
        else {return {}}
    }

    async function handleSubmit(event) {
        event.preventDefault()
        const payload = JSON.stringify({...formInput, roleId: parseInt(formInput.roleId)})
        const targetUrl = "https://be-psm-mini-library-system.herokuapp.com/users/update/" + params.userId;
        const method = "PUT"
        await fetch(targetUrl, {method: method, body: payload, headers: {'Content-Type': 'application/json'}})
            .then((re) => re.json()).then((d) => responses.push(d))
        navigation()
    }

    function navigation(){
        if (responses[responses.length - 1].status.toString() === "true") {
            alert(responses[responses.length - 1].message.toString())
            navigate('/users/' + responses[responses.length - 1].data.username.toString())
        } else {
            if (formInput.name !== "" && formInput.username !== "" && formInput.password !== "" && formInput.roleId !== "") {
                const messageArr = responses[responses.length - 1].message.toString().split(" ");
                if (messageArr.indexOf("Id") >= 0 && messageArr.indexOf("found") >= 0) {
                    alert(responses[responses.length - 1].message.toString())
                } else {
                    alert(responses[responses.length - 1].message.toString())
                }
            } else {
                alert("Form must be filled fully")
            }
        }
    }

    function passRequirement(){
        return<>
            {
                getUserData().username === user.username ? <input type={"password"} className="form-control" required value={formInput.password} onChange={event => handleInput(event, "password")}/>
                    :
                    getUserData().roleName === "Admin" ? <input type={"password"} className="form-control" required value={formInput.password} onChange={event => handleInput(event, "password")} disabled/>
                        :
                        <input type={"password"} className="form-control" required value={formInput.password} onChange={event => handleInput(event, "password")}/>
            }
        </>
    }

    function roleRequirement(){
        return<>
            {
                getUserData().roleName === "Admin" ?
                    <select className="form-control" required value={formInput.roleId} onChange={event => handleInput(event, "roleId")}>
                        <option value="" disabled></option>
                        {roleList.map(listRole => <option key={listRole.roleId} value={listRole.roleId}>{listRole.roleName}</option>)}
                    </select>
                    :
                    <select className="form-control" required value={formInput.roleId} onChange={event => handleInput(event, "roleId")} disabled>
                        <option value="" disabled></option>
                        {roleList.map(listRole => <option key={listRole.roleId} value={listRole.roleId}>{listRole.roleName}</option>)}
                    </select>
            }
        </>
    }

    function back(event) {
        event.preventDefault()
        history.go(-1)
    }

    useEffect(() => {
        getRoleList()
    }, [])
    useEffect(() => {
        getUsers()
    }, [])


    return <>
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <div className={"m-0 font-weight-bold text-primary fa fa-arrow-circle-left"} onClick={event => back(event)}>
                    &nbsp;
                    Back
                </div>

                <h6 className="m-0 font-weight-bold text-primary">Form Change Profile</h6>

                <Link to={"/users/" + params.username}>
                    <button className="btn btn-secondary">
                        Back
                    </button>
                </Link>
            </div>

            <div className="card-body">

                <form className="w-50" onSubmit={event => handleSubmit(event)}>
                    <div className="form-group mb-4">
                        <label>Your Name</label>
                        <input type="text" className="form-control" required value={formInput.name} onChange={event => handleInput(event, "name")}/>
                    </div>

                    <div className="form-group mb-4">
                        <label>Username</label>
                        <input type="text" className="form-control" required value={formInput.username} onChange={event => handleInput(event, "username")}/>
                    </div>

                    <div className="form-group mb-4">
                        <label>Password</label>
                        {passRequirement()}
                    </div>

                    <div className="form-group mb-4">
                        <label>Role Name</label>
                        {roleRequirement()}
                    </div>

                    <button className="btn btn-primary">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    </>
}