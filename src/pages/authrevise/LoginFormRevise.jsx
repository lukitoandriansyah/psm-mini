/*

import {useContext, useState} from "react";
import {AuthContext} from "../../contexts/AuthProvider.jsx";
import {Link} from "react-router-dom";
import axios from "axios";

export default function LoginFormRevise() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    let ctx = useContext(AuthContext)


    async function handleSubmit(event) {
        event.preventDefault()

        const url = 'https://be-library-mini-system.herokuapp.com/auth/login'
        const payload = {username, password}
        const res = await axios.post(url, payload)
        ctx.saveUserData(res.data.data)

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
                            <form onSubmit={event => handleSubmit(event)}>
                                <div className="form-group text-center mb-4">
                                    <label>Username <br/></label>
                                    <input type={"text"}
                                           value={username}
                                           required
                                           onChange={event => setUsername(event.target.value)}
                                           className={"form-control"}
                                    />
                                </div>
                                <div className="form-group text-center mb-4">
                                    <label>
                                        Password <br/></label>
                                    <input type={"password"}
                                           value={password}
                                           required
                                           onChange={event => setPassword(event.target.value)}
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
*/