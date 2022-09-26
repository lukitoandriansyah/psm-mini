import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";

export default function AddRole() {
    let responses = []
    const navigate = useNavigate()
    const [formInput, setFormInput] = useState({
        roleName: ""
    })

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
        const targetUrl = "https://be-library-mini-system.herokuapp.com/role/save-role"
        const method = "POST"
        await fetch(targetUrl, {
            method: method,
            body: payload,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((re) => re.json()).then((d) => responses.push(d))
        if (responses[responses.length - 1].status.toString() === "true") {
            alert
            (
                responses[responses.length - 1].message.toString()
                + "\n" + "role Id: " + responses[responses.length - 1].data.roleId.toString()
                + "\n" + "role Name: " + responses[responses.length - 1].data.roleName.toString()
            )
            navigate('/roles')
        } else {
            if (formInput.roleName !== "") {
                alert(responses[responses.length - 1].message.toString())
            } else {
                alert("Form must be filled fully")
            }
        }
    }

    function back(event) {
        event.preventDefault()
        history.go(-1)
    }

    return <>
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <div className={"m-0 font-weight-bold text-primary fa fa-arrow-circle-left"}
                     onClick={event => back(event)}>
                    &nbsp;
                    Back
                </div>

                <h6 className="m-0 font-weight-bold text-primary">Form Add Role</h6>

                <Link to={"/roles"}>
                    <button className="btn btn-secondary">
                        Kembali
                    </button>
                </Link>
            </div>

            <div className="card-body">

                <form className="w-50" onSubmit={event => handleSubmit(event)}>
                    <div className="form-group mb-4">
                        <label>Role Name</label>
                        <input
                            type="text"
                            className="form-control"
                            required
                            value={formInput.roleName}
                            onChange={event => handleInput(event, "roleName")}/>
                    </div>

                    <button className="btn btn-primary">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    </>
}