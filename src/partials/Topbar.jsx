import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Url} from "./url-BE/Url.jsx";

export default function Topbar() {
    let respLogout= []
    const [statusUserById, setStatusUserById] = useState()
    const [dataUserById, setDataUserById] = useState([])
    const [userUpdated, setUserUpdated] = useState([])
    const [statusUpdated, setStatusUpdated] = useState([])
    const navigate = useNavigate();

    function getUserData() {
        const savedDataUser = localStorage.getItem("user")
        if (savedDataUser) {
            return JSON.parse(savedDataUser)
        } else {
            return {}
        }
    }

    async function getUsersById() {
        try {

            const res = await fetch(Url+"/users/profile/byid/"+getUserData().userId,
                {method: "GET"})
            const data = await res.json();
            setStatusUserById(data.status)
            setDataUserById(data.data)
        }catch (err){
            console.log(err)
            alert("There's something wrong. please try again")
        }
    }

    function saveDataTrue(dataUser, statusUser) {
        const formattedDataUserUpdated = JSON.stringify(dataUser)
        const formattedStatusUserUpdated = JSON.stringify(statusUser)

        localStorage.removeItem("user")
        localStorage.removeItem("statusLogin")

        localStorage.setItem("user", formattedDataUserUpdated)
        localStorage.setItem("statusLogin", formattedStatusUserUpdated)

        setUserUpdated(dataUser)
        setStatusUpdated(statusUser)

    }

    function saveDataFalse(dataUser, statusUser) {
        setUserUpdated(dataUser)
        setStatusUpdated(statusUser)
    }

    async function userDeleteScenario(){
        if(statusUserById === true){
            /*console.log("ya data masuk")*/
            const payload = JSON.stringify({
                username: dataUserById.username,
                password: dataUserById.password
            })
            const targetUrl = Url+"/auth/login"
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

            respStatus === true ? saveDataTrue(respData, respStatus)  : saveDataFalse(respData, respStatus)
        }else{
            localStorage.clear()
            navigate("/home")
        }
    }

    const menuProfile = [{title: "Profile", icon: "fas fa-user fa-sm fa-fw mr-2 text-gray-400", link: "/users/" + getUserData().username,}];
    const menuLogOut = [{title: "Log Out", icon: "fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400",}];

    async function logout() {
        userDeleteScenario()

        const targetUrl = Url+"/auth/logout/" + getUserData().userId;
        const method = "POST";

        await fetch(targetUrl, {method: method, headers: {"Content-Type": "application/json",},})
            .then((re) => re.json())
            .then((d) => respLogout.push(d));

        if (respLogout[respLogout.length - 1].status.toString() === "true") {
            alert(respLogout[respLogout.length - 1].message.toString());
            localStorage.clear()
            setTimeout(() => {navigate("/")}, 5000, navigate("/end"));
        } else {
            respLogout[respLogout.length - 1].message.toString();
        }
    }

    useEffect(()=>{
        getUsersById()
    },[])

    return <>
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

            {/* <!-- Sidebar Toggle (Topbar) --> */}
            {/* <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                <i className="fa fa-bars"></i>
            </button>*/}

            {/* <!-- Topbar Search --> */}
            {/*<form
                className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                <div className="input-group">
                    <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..."
                           aria-label="Search" aria-describedby="basic-addon2"/>
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="button">
                            <i className="fas fa-search fa-sm"></i>
                        </button>
                    </div>
                </div>
            </form>*/}

            {/* <!-- Topbar Navbar --> */}
            <ul className="navbar-nav ml-auto">

                {/* <!-- Nav Item - Search Dropdown (Visible Only XS) --> */}
                {/* <li className="nav-item dropdown no-arrow d-sm-none">
                    <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-search fa-fw"></i>
                    </a>
                     <!-- Dropdown - Messages -->
                    <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                         aria-labelledby="searchDropdown">
                        <form className="form-inline mr-auto w-100 navbar-search">
                            <div className="input-group">
                                <input type="text" className="form-control bg-light border-0 small"
                                       placeholder="Search for..." aria-label="Search"
                                       aria-describedby="basic-addon2"/>
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="button">
                                        <i className="fas fa-search fa-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </li>*/}

                {/* <!-- Nav Item - Alerts --> */}
                {/*<li className="nav-item dropdown no-arrow mx-1">
                    <a className="nav-link dropdown-toggle" id="alertsDropdown"
                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-fw"></i>
                         <!-- Counter - Alerts -->
                        <span className="badge badge-danger badge-counter"></span>
                    </a>
                     <!-- Dropdown - Alerts -->
                </li>

                 <!-- Nav Item - Messages -->
                <li className="nav-item dropdown no-arrow mx-1">
                    <a className="nav-link dropdown-toggle" id="messagesDropdown"
                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-fw"></i>
                         <!-- Counter - Messages -->
                        <span className="badge badge-danger badge-counter"></span>
                    </a>
                     <!-- Dropdown - Messages -->
                </li>
*/}
                <div className="topbar-divider d-none d-sm-block"></div>

                {/* <!-- Nav Item - User Information --> */}
                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">{getUserData().username}</span>
                        <img className="img-profile rounded-circle"
                             src="https://icons.veryicon.com/png/o/miscellaneous/two-color-webpage-small-icon/user-244.png"/>
                    </a>
                    {/* <!-- Dropdown - User Information --> */}
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                         aria-labelledby="userDropdown">
                        <a onClick={()=>userDeleteScenario()} className="dropdown-item" href={"#"+menuProfile[0].link}>
                            <i className={menuProfile[0].icon}></i>
                            {menuProfile[0].title}
                        </a>
                        {/* <a className="dropdown-item" href="#">
                            <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                            Settings
                        </a>
                        <a className="dropdown-item" href="#">
                            <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                            Activity Log
                        </a>*/}
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" onClick={() => {logout().then(r => r)}} data-toggle="modal" role={"button"} data-target="#logoutModal">
                            <i className={menuLogOut[0].icon}></i>
                            {menuLogOut[0].title}
                        </a>
                    </div>
                </li>

            </ul>

        </nav>
    </>
}