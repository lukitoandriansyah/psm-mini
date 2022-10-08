import {Link, Outlet, useNavigate} from "react-router-dom";

export default function AdminDashboard() {

    let responsesLogout = []
    const navigate = useNavigate()

    function getUserData() {
        const savedDataUser = localStorage.getItem("user")
        if (savedDataUser) {
            return JSON.parse(savedDataUser)
        } else {
            return {}
        }
    }

    async function logout(event) {
        const targetUrl = "https://be-psm-mini-library-system.herokuapp.com/auth/logout/" + getUserData().userId
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

            localStorage.clear()

            setTimeout(() => {
                navigate("/")
            }, 3000, navigate("/end"))
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
                <Link to={"/users/" + getUserData().username}>
                    Profile
                </Link>
                &nbsp; &nbsp;
                <button className={"btn btn-danger"} onClick={(event) => {
                    logout(event).then(r => r)
                }}>Logout</button>
            </nav>
            <h3>
                Welcome in you Dashboard as {getUserData().roleName}, Hai {getUserData().name}
            </h3>
            <br/>
            <Outlet/>
        </div>
    </>
}