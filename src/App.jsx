import {Outlet} from 'react-router-dom'

import Footer from "./partials/Footer"
import Sidebar from "./partials/Sidebar"
import Topbar from "./partials/Topbar"
import LoginProvider from "./contexts/LoginProvider.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";

function App() {
    return<div id="wrapper">

        {/* <!-- Sidebar --> */}
        <Sidebar/>
        {/* <!-- End of Sidebar --> */}

        {/* <!-- Content Wrapper --> */}
        <div id="content-wrapper" className="d-flex flex-column">

            {/* <!-- Main Content --> */}
            <div id="content">

                {/* <!-- Topbar --> */}
                <Topbar/>
                {/* <!-- End of Topbar --> */}

                {/* <!-- Begin Page Content --> */}
                <div className="container-fluid">

                    {/* <!-- Page Heading --> */}
                    <Outlet/>

                </div>
                {/* <!-- /.container-fluid --> */}

            </div>
            {/* <!-- End of Main Content --> */}

            {/* <!-- Footer --> */}
            <Footer/>
            {/* <!-- End of Footer --> */}

        </div>
        {/* <!-- End of Content Wrapper --> */}

    </div>
    {/* <!-- End of Page Wrapper --> */}
}

export default App
