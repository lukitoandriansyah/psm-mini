import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Spinner from "../../components/Spinner/Spinner"

let responses = []
export default function AddRole() {
    let statusCheckerName = true
    const navigate = useNavigate()
    const [roles, setRoles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [formInput, setFormInput] = useState({
        roleName: ""
    })

    async function getUsers() {
        try {
            const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/role/list-role",
                {method: "GET"})
            const data = await res.json();
            setRoles(data.sort((a, b) => a.roleId - b.roleId));
        } catch (err) {
            console.log(err)
            alert("There's something wrong. please try again")
        } finally {
            setIsLoading(false)
        }
    }

    function roleNameChecker(paramsRoleName) {
        for (let role of roles) {
            if (role.roleName.toLowerCase() === paramsRoleName.toLowerCase()) {
                alert("Failed to save data, data was exists")
                statusCheckerName = false
            }
        }
    }

    function handleInput(event, inputName) {
        const copyFormInput = {...formInput}
        copyFormInput[inputName] = event.target.value
        setFormInput(copyFormInput)
    }

    async function handleSubmit(event) {
        event.preventDefault()
        if (formInput.roleName.split(" ").length === 1) {
            const payload = JSON.stringify({
                ...formInput,
                roleName: formInput.roleName.charAt(0).toUpperCase() + formInput.roleName.slice(1).toLowerCase(),
                roleId: parseInt(formInput.roleId)
            })

            roleNameChecker(formInput.roleName.charAt(0).toUpperCase() + formInput.roleName.slice(1).toLowerCase())

            if (statusCheckerName === false) {
                statusCheckerName = true
            } else {
                const targetUrl = "https://be-psm-mini-library-system.herokuapp.com/role/save-role";
                const method = "POST"
                await fetch(targetUrl, {method: method, body: payload, headers: {'Content-Type': 'application/json'}})
                    .then((re) => re.json())
                    .then((d) => responses.push(d))

                if (responses[responses.length - 1].status.toString() === "true") {
                    statusCheckerName = true
                    alert(responses[responses.length - 1].message.toString())
                    navigate('/roles')
                } else {
                    if (formInput.roleName !== "") {
                        const messageArr = responses[responses.length - 1].message.toString().split(" ");
                        messageArr.indexOf("Id") >= 0 && messageArr.indexOf("found") >= 0 ? alert(responses[responses.length - 1].message.toString()) : alert(responses[responses.length - 1].message.toString())
                    } else {
                        alert("Form must be filled fully")
                    }
                }
                statusCheckerName = true
            }
        } else {
            let strRoleName = ""
            for (let inputRoleName of formInput.roleName.split(" ")) {
                strRoleName += inputRoleName.charAt(0).toUpperCase() + inputRoleName.slice(1).toLowerCase() + " "
            }
            const payload = JSON.stringify({
                ...formInput,
                roleName: strRoleName.substring(0, strRoleName.length - 1),
                roleId: parseInt(formInput.roleId)
            })

            roleNameChecker(strRoleName.substring(0, strRoleName.length - 1))

            if (statusCheckerName === false) {
                statusCheckerName = true
            } else {
                const targetUrl = "https://be-psm-mini-library-system.herokuapp.com/role/save-role";
                const method = "POST"
                await fetch(targetUrl, {method: method, body: payload, headers: {'Content-Type': 'application/json'}})
                    .then((re) => re.json())
                    .then((d) => responses.push(d))

                if (responses[responses.length - 1].status.toString() === "true") {
                    statusCheckerName = true
                    alert(responses[responses.length - 1].message.toString())
                    navigate('/roles')
                } else {
                    statusCheckerName = true
                    if (formInput.roleName !== "") {
                        const messageArr = responses[responses.length - 1].message.toString().split(" ");
                        messageArr.indexOf("Id") >= 0 && messageArr.indexOf("found") >= 0 ? alert(responses[responses.length - 1].message.toString()) : alert(responses[responses.length - 1].message.toString())
                    } else {
                        alert("Form must be filled fully")
                    }
                }
            }
        }
    }

    function back(event) {
        event.preventDefault()
        history.go(-1)
    }

    useEffect(() => {
        getUsers()
    }, [])

    return <>
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <div className={"m-0 font-weight-bold text-primary fa fa-arrow-circle-left"}
                     onClick={event => back(event)}>&nbsp;Back
                </div>

                <h6 className="m-0 font-weight-bold text-primary">Form Add Role</h6>

                <Link to={"/roles"}>
                    <button className="btn btn-secondary">Kembali</button>
                </Link>
            </div>

            <div className="card-body">
                {isLoading ?
                    <div className="d-flex justify-content-center">
                        <Spinner/>
                    </div>
                    :
                    <form className="w-50" onSubmit={event => handleSubmit(event)}>
                        <div className="form-group mb-4">
                            <label>Role Name</label>
                            <input type="text" className="form-control" required value={formInput.roleName}
                                   onChange={event => handleInput(event, "roleName")}/>
                        </div>

                        <button className="btn btn-primary">Submit</button>
                    </form>
                }
            </div>
        </div>
    </>
}