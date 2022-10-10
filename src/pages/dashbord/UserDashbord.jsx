import {Link, Outlet, useNavigate} from "react-router-dom";

export default function UserDashboard() {

    function getUserData() {
        const savedDataUser = localStorage.getItem("user")
        if (savedDataUser) {
            return JSON.parse(savedDataUser)
        } else {
            return {}
        }
    }

    return <>
        <div className={"app"}>
            <h3>
                Welcome in your Dashboard as {getUserData().roleName}, Hai {getUserData().name}
            </h3>
            <br/>
            <Outlet/>
        </div>
    </>
}