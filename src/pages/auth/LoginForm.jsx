import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";


export default function LoginForm() {
    const navigate = useNavigate()
    const [user, setUser] = useState([])
    const [status, setStatus] = useState([])
    const [msg, setMsg] = useState([])
    const [formInput, setFormInput] = useState({
        username: '',
        password: '',
    })

    function saveDataLoginTrue(dataUser, statusLoginUser, messageResult) {
        const formattedDataUser = JSON.stringify(dataUser)
        const formattedStatusLoginUser = JSON.stringify(statusLoginUser)
        const formattedMessageResult = JSON.stringify(messageResult)

        localStorage.setItem("user", formattedDataUser)
        localStorage.setItem("statusLogin", formattedStatusLoginUser)
        localStorage.setItem("messageLogin", formattedMessageResult)

        setUser(dataUser)
        setStatus(statusLoginUser)
        setMsg(messageResult)

        navigation()
    }

    function saveDataLoginFalse(dataUser, statusLoginUser, messageResult) {
        setUser(dataUser)
        setStatus(statusLoginUser)
        setMsg(messageResult)

        navigation()
    }

    function getUserData() {
        const savedDataUser = localStorage.getItem("user")
        if (savedDataUser) {
            return JSON.parse(savedDataUser)
        } else {
            return {}
        }
    }

    function getLoginStatus() {
        const savedStatusLogin = localStorage.getItem("statusLogin")
        if (savedStatusLogin) {
            const parsedData = JSON.parse(savedStatusLogin)
            return parsedData
        } else {
            return {}
        }
    }

    function getLoginMessage() {
        const savedMessageLogin = localStorage.getItem("mesageLogin")
        if (savedMessageLogin) {
            const parsedData = JSON.parse(savedMessageLogin)
            return parsedData
        } else {
            return {}
        }
    }

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
        const respMessage = res.message

        respStatus === true ?
            saveDataLoginTrue(respData, respStatus, respMessage)
            :
            saveDataLoginFalse(respData, respStatus, respMessage)
    }

    async function handlingStateNull(){
        const payload = JSON.stringify({
            ...formInput
        })
        const targetUrl = "https://be-psm-mini-library-system.herokuapp.com/auth/login"
        const method = "POST"
        const res = await fetch (targetUrl, {
            method: method,
            body: payload,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((re) => re.json())/*.then((d)=>alert(d.message))*/

        const respData = res.data
        const respStatus = res.status
        const respMessage = res.message

        if(respStatus===true){
            if (respData.roleName.toString() !== "Admin") {
                navigate("/user/dashboard")
            }
            if (respData.roleName.toString() === "Admin") {
                navigate("/admin/dashboard")
            }
        }else{
            alert(respMessage.toString())
        }

    }

    function navigation(){
        if (status.toString() === "true") {

            if (msg.length!=0) {

                if (user.roleName.toString() !== "Admin") {
                    console.log(user.roleName)
                    navigate("/user/dashboard")
                }
                if (user.roleName.toString() === "Admin") {
                    console.log(user.roleName)
                    navigate("/admin/dashboard")
                }
            } else{
                handlingStateNull()
            }

        } else {
            if (formInput.username !== "" && formInput.password !== "") {

                if (msg.length!=0) {
                    msg.toString().split(" ").indexOf("Wrong")!==-1 ?
                        alert(msg)
                        :
                        alert(msg)
                } else{
                    handlingStateNull()
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

    useEffect(()=>{
        getUserData()
        getLoginStatus()
        getLoginMessage()
    },[])

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
                            {
                                localStorage.getItem("user")?
                                    <div className="form-group text-center mb-4">
                                        {
                                            getUserData().roleName==="Admin"?
                                                <Link to={"/admin/dashboard"}>
                                                    <button
                                                        className=" text-center mb-4 btn btn-success btn-block rounded-0">Continue to Dashboard
                                                    </button>
                                                </Link>
                                                :
                                                <Link to={"/user/dashboard"}>
                                                    <button
                                                        className=" text-center mb-4 btn btn-success btn-block rounded-0">Continue to Dashboard
                                                    </button>
                                                </Link>
                                        }
                                    </div>
                                    :
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
                            }
                            {
                                localStorage.getItem("user")?
                                    <></>
                                    :
                                    <div className="form-group text-center mb-4">
                                        <p className={"m-0 font-weight-bold text-primary"}>or</p>
                                    </div>
                            }
                            {
                                localStorage.getItem("user")?
                                    <></>
                                    :
                                    <div className="form-group text-center mb-4">
                                        <Link to={"/register"}>
                                            <button
                                                className=" text-center mb-4 btn btn-outline-primary btn-block rounded-0">Register
                                            </button>
                                        </Link>
                                    </div>
                            }
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