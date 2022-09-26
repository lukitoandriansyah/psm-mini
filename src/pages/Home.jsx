import {Link, Outlet} from "react-router-dom";

export default function Home() {
    return <>
        <div className="container-auth bg-light-auth">
            <div className={"card-header-home-1"}>
                <div className="text-center">
                    <div className={"app"} id={"home"}>
                        <h3 id={"title-home"}>Welcome in PSM</h3>
                    </div>
                </div>
            </div>
            <div className={"card-header-home-2"}>
                <div className="text-center">
                    <div className={"app"} id={"home"}>
                        <h1>Mini Library System Management</h1>
                    </div>
                </div>
            </div>
            <div className={"card-body"}>
                <div className="text-center">
                    <img className={"img-profile"}
                         src={"https://media.getredy.id/images/users/12168/15039894701611635740.png"}/>
                </div>
            </div>
            <div className={"sticky-footer"}>
                <div className="text-center">
                    <div className={"app"} id={"home"}>
                        <Link to={"/register"}>
                            <button className="text-center mb-4 btn btn-secondary">Register</button>
                        </Link>

                        &nbsp; &nbsp;

                        <Link to={"/login"}>
                            <button className="text-center mb-4 btn btn-primary">Login</button>
                        </Link>
                    </div>
                </div>
            </div>
            <Outlet/>
        </div>

    </>
}