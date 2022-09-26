import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";

export let responses = [];

export default function LoginForm() {
    const navigate = useNavigate()
    let msg = ""

    const [formInput, setFormInput] = useState({
        username: '',
        password: '',
    })

    function handleInput(event, inputName) {
        const copyFormInput = {...formInput}
        copyFormInput[inputName] = event.target.value
        setFormInput(copyFormInput)
    }

    async function handleSubmit(event) {
        event.preventDefault()
        const payload = JSON.stringify({
            ...formInput
        })
        const targetUrl = "https://be-library-mini-system.herokuapp.com/auth/login"
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
                + "\n" + "name: " + responses[responses.length - 1].data.name.toString()
                + "\n" + "username: " + responses[responses.length - 1].data.username.toString()
                + "\n" + "role: " + responses[responses.length - 1].data.roleName.toString()
            )
            if (responses[responses.length - 1].data.roleName.toString() !== "admin") {
                navigate("/user/dashboard")
            }
            if (responses[responses.length - 1].data.roleName.toString() === "Admin") {
                navigate("/admin/dashboard")
            }
        } else {
            if (formInput.username !== "" && formInput.password !== "") {
                const messageArr = responses[responses.length - 1].message.toString().split(" ");
                if (messageArr.indexOf("Wrong") >= 0) {
                    alert(responses[responses.length - 1].message.toString())
                    msg = responses[responses.length - 1].message.toString();
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
                            <div className="h4 font-weight-bold text-center mb-4">Login to Dashboard</div>
                            <form onSubmit={event => handleSubmit(event)} key={formInput.id}>
                                <div className="form-group text-center mb-4">
                                    <label>Username <br/></label>
                                    <input type={"text"}
                                           value={formInput.username}
                                           required
                                           onChange={event => handleInput(event, "username")}
                                           className={"form-control"}
                                    />
                                </div>
                                <div className="form-group text-center mb-4">
                                    <label>
                                        Password <br/></label>
                                    <input type={"password"}
                                           value={formInput.password}
                                           required
                                           onChange={event => handleInput(event, "password")}
                                           className={"form-control"}
                                    />
                                </div>
                                <div className="form-group text-center mb-4">
                                    <button className="btn btn-primary btn-block rounded-0">Log In</button>
                                </div>
                            </form>
                            <div className="form-group text-center mb-4">
                                <p className={"m-0 font-weight-bold text-primary"}>or</p>
                            </div>
                            <div className="form-group text-center mb-4">
                                <Link to={"/register"}>
                                    <button
                                        className=" text-center mb-4 btn btn-outline-primary btn-block rounded-0">Register
                                    </button>
                                </Link>
                            </div>

                            <div className="text-center text-muted mt-auto">
                                Need help? <span><a href={"https://github.com/groupA-prodemy"}>Contact Us</a></span>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-md-2 col-12"/>
            </div>
        </div>
    </>
}