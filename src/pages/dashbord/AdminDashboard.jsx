import {Link, Outlet, useNavigate} from "react-router-dom";
import {responses} from "../auth/LoginForm.jsx";

export let personArr = []
export let usernameArr = []
export let roleArr = []
export default function AdminDashboard() {
    let userIdArr = []
    let responsesLogout = []
    const navigate = useNavigate()

    try {
        let message = responses[responses.length - 1].message.toString().split(" ") //
        let indicator = 0;
        if (message.indexOf("Admin") >= 0) {
            indicator += 1;
        }
        if (indicator > 0) {
            personArr.push(responses[responses.length - 1].data.name.toString())
            usernameArr.push(responses[responses.length - 1].data.username.toString())
            roleArr.push(responses[responses.length - 1].data.roleName.toString())
            userIdArr.push(responses[responses.length - 1].data.userId.toString())
            localStorage.setItem("name", personArr[personArr.length - 1].toString())
            localStorage.setItem("uname", usernameArr[usernameArr.length - 1].toString())
            localStorage.setItem("role", roleArr[roleArr.length - 1].toString())
            localStorage.setItem("uId", userIdArr[userIdArr.length - 1].toString())
        }
    } catch (error) {
        personArr.push(localStorage.getItem("name"))
        usernameArr.push(localStorage.getItem("uname"))
        roleArr.push(localStorage.getItem("role"))
        userIdArr.push(localStorage.getItem("uId"))
    }

    async function logout(event) {
        event.preventDefault()
        const targetUrl = "https://be-library-mini-system.herokuapp.com/auth/logout/" + userIdArr[userIdArr.length - 1]
        const method = "POST"
        await fetch(targetUrl, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((re) => re.json()).then((d) => responsesLogout.push(d))
        if (responsesLogout[responsesLogout.length - 1].status.toString() === "true") {
            alert
            (
                responsesLogout[responsesLogout.length - 1].message.toString()
            )
            setTimeout(() => {
                navigate("/")
            }, 5000, navigate("/end"))
        } else {
            responsesLogout[responsesLogout.length - 1].message.toString()
        }
    }

    return <>
        <div className={"app"}>
            <nav>
                <Link to={"/book/list"}>
                    Book List
                </Link>
                &nbsp; &nbsp;
                <Link to={"/register"}>
                    Form Register
                </Link>
                &nbsp; &nbsp;
                <Link to={"/users"}>
                    User List
                </Link>
                &nbsp; &nbsp;
                <Link to={"/roles"}>
                    Role List
                </Link>
                &nbsp; &nbsp;
                <Link to={"/users/" + usernameArr[usernameArr.length - 1]}>
                    Profile
                </Link>
                &nbsp; &nbsp;
                <button className={"btn btn-danger"} onClick={(event) => logout(event)}>Logout</button>
            </nav>
            <h3>
                Welcome in you Dashboard as {roleArr[roleArr.length - 1]}, Hai {personArr[personArr.length - 1]}
            </h3>
            <br/>
            <Outlet/>
        </div>
    </>
}