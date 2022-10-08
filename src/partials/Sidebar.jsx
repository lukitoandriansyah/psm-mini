import {Link, useNavigate} from "react-router-dom";
import {menuList} from "./menu/MenuList.jsx";


export default function Sidebar() {
    let responsesLogoutSideBar= []
    const navigate = useNavigate();

    function getUserData() {
        const savedDataUser = localStorage.getItem("user")
        if (savedDataUser) {
            return JSON.parse(savedDataUser)
        } else {
            return {}
        }
    }

    const menuProfile = [
        {
            title: "Profile",
            icon: "fa-user",
            link: "/users/" + getUserData().username,

        },
    ];
    const menuLogOut = [
        {
            title: "Log Out",
            icon: "fa-power-off",
        },
    ];

    async function logout() {
        const targetUrl
            = "https://be-psm-mini-library-system.herokuapp.com/auth/logout/" + getUserData().userId;
        const method = "POST";
        await fetch(targetUrl, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((re) => re.json())
            .then((d) => responsesLogoutSideBar.push(d));

        if (
            responsesLogoutSideBar[
            responsesLogoutSideBar.length - 1
                ].status.toString() === "true"
        ) {
            alert(
                responsesLogoutSideBar[
                responsesLogoutSideBar.length - 1
                    ].message.toString()
            );

            localStorage.clear()

            setTimeout(
                () => {
                    navigate("/")
                },
                3000,
                navigate("/end")
            );
        } else {
            responsesLogoutSideBar[
            responsesLogoutSideBar.length - 1
                ].message.toString();
        }
    }

    return (
        <>
            <ul
                className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
                id="accordionSidebar"
            >
                {/* <!-- Sidebar - Brand --> */}
                <a
                    className="sidebar-brand d-flex align-items-center justify-content-center"
                >
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-book"></i>
                    </div>
                    <div className="sidebar-brand-text mx-3">PSM Mini Library</div>
                </a>

                {/* <!-- Divider --> */}
                <hr className="sidebar-divider my-0"/>

                {/* <!-- Nav Item - Dashboard --> */}

                {getUserData().roleName === "Admin" ? (
                    <>
                        {menuList.map((menu) => (
                            <li className="nav-item" key={menu.title}>
                                <Link className="nav-link" to={menu.link}>
                                    <i className={"fas fa-fw " + menu.icon}></i>
                                    &nbsp;
                                    <span>{menu.title}</span>
                                </Link>
                            </li>
                        ))}
                        {menuProfile.map((profile) => (
                            <li className="nav-item" key={profile.title}>
                                <Link className="nav-link" to={profile.link} onClick={location.reload}>
                                    <i className={"fas fa-fw " + profile.icon}></i>
                                    &nbsp;
                                    <span>{profile.title}</span>
                                </Link>
                            </li>
                        ))}
                        {menuLogOut.map((logOut) => (
                            <li className="nav-item" key={logOut.title}>
                                <Link className="nav-link" onClick={() => {
                                    logout().then(r => r)}}
                                >
                                    <i className={"fas fa-fw " + logOut.icon}></i>
                                    &nbsp;
                                    <span>{logOut.title}</span>
                                </Link>
                            </li>
                        ))}
                    </>
                ) : (
                    <>
                        <li className="nav-item" key={menuList[0].title}>
                            <Link className="nav-link" to={"/user/dashboard"}>
                                <i className={"fas fa-fw " + menuList[0].icon}></i>
                                &nbsp;
                                <span>{menuList[0].title}</span>
                            </Link>
                        </li>
                        <li className="nav-item" key={menuList[1].title}>
                            <Link className="nav-link" to={menuList[1].link}>
                                <i className={"fas fa-fw " + menuList[1].icon}></i>
                                &nbsp;
                                <span>{menuList[1].title}</span>
                            </Link>
                        </li>
                        <li className="nav-item" key={menuProfile[0].title}>
                            <Link className="nav-link" to={menuProfile[0].link}>
                                <i className={"fas fa-fw " + menuProfile[0].icon}></i>
                                &nbsp;
                                <span>{menuProfile[0].title}</span>
                            </Link>
                        </li>
                        <li className="nav-item" key={menuLogOut[0].title}>
                            <Link className="nav-link" onClick={() => {
                                logout().then(r => r)
                            }}>
                                <i className={"fas fa-fw " + menuLogOut[0].icon}></i>
                                &nbsp;
                                <span>{menuLogOut[0].title}</span>
                            </Link>
                        </li>
                    </>
                )}

                {/* <!-- Divider --> */}
                <hr className="sidebar-divider d-none d-md-block"/>

                {/* <!-- Sidebar Toggler (Sidebar) --> */}
                <div className="text-center d-none d-md-inline">
                    <button
                        className="rounded-circle border-0"
                        id="sidebarToggle"
                    ></button>
                </div>
            </ul>
        </>
    );
}
