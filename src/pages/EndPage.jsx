import {Outlet} from "react-router-dom";

export default function EndPage() {
    let count = 5;
    setInterval(
        function () {
            count--;
            count > 0 ? document.getElementById("time").innerHTML = count : " "
        }, 1000);

    return <>
        <div className="container-auth-end">
            <div className="row-2-end text-center">
                <div className="col-md-2 col-12"/>
                <div className="col-md-8 col-12">
                    <div
                        className="wrapper-auth-end bordered-auth-end bg-md-white-auth-end d-flex-auth flex-column align-items-between">
                        <div className="form">
                            <div className="book-end">
                                <span className="page-end turn-end"></span>
                                <span className="page-end turn-end"></span>
                                <span className="page-end turn-end"></span>
                                <span className="page-end turn-end"></span>
                                <span className="page-end turn-end"></span>
                                <span className="page-end turn-end">
                                    <div className="text-center">
                                        <div className={"app"} id={"home"}>
                                            <h5>Thanks for Visit</h5>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button className={"btn btn-lg"} id={"time"}>{count}</button>
                                    </div>
                                </span>
                                <span className="cover-book-end"></span>
                                <span className="page-end"></span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 col-12"/>
                </div>
            </div>
        </div>
    </>
}