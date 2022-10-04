import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";

let responses = []
export default function ChangeRole() {
    const navigate = useNavigate()
    const [formInput, setFormInput] = useState({
        roleName: ""
    })
    const params = useParams();

    function handleInput(event, inputName) {
        const copyFormInput = {...formInput}
        copyFormInput[inputName] = event.target.value
        setFormInput(copyFormInput)
    }

    async function roleById() {
        const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/role/"+params.roleId,
            {method: "GET"})
        const data = await res.json();
        setFormInput(data.data);
    }

    async function handleSubmit(event) {
        event.preventDefault()
        const payload = JSON.stringify({
            ...formInput,
            roleId: parseInt(formInput.roleId)
        })
        const targetUrl = "https://be-psm-mini-library-system.herokuapp.com/role/update/" + params.roleId;
        const method = "PUT"
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
            )
            navigate('/roles')
        } else {
            if (formInput.roleName !== "") {
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

    function back(event) {
        event.preventDefault()
        history.go(-1)
    }

    useEffect(() => {
        roleById()
    }, [])


    return <>
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <div className={"m-0 font-weight-bold text-primary fa fa-arrow-circle-left"}
                     onClick={event => back(event)}>
                    &nbsp;
                    Back
                </div>

                <h6 className="m-0 font-weight-bold text-primary">Form Change Role</h6>

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
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    </>
}