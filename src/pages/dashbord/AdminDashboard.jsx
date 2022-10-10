import {Link, Outlet} from "react-router-dom";

export default function AdminDashboard() {

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
                Welcome in you Dashboard as {getUserData().roleName}, Hai {getUserData().name}
            </h3>
            <br/>
            <Outlet/>
        </div>
        <div className="row">
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    <Link to={"/roles"}>
                                        Role List
                                    </Link>
                                </div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-mars-double fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    <Link to={"/users"}>
                                        User List
                                    </Link>
                                </div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-users fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    <Link to={"/publisher"}>
                                        Publisher
                                    </Link>
                                </div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-id-card fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    <Link to={"/author"}>
                                        Author
                                    </Link>
                                </div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-tag fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}