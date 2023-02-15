import "./App.scss";
import { Routes, Route } from "react-router-dom";
import NavbarComp from "./components/navbar/Navbar.jsx";
import MainPage from "./components/mainPage/MainPage.jsx";
import Profile from "./components/profile/Profile.jsx";
import MyQuizes from "./components/myQuizes/MyQuizes";
import CreateQuiz from "./components/createQuiz/CreateQuiz";
import PageNotFound from "./components/pageNotFound/PageNotFound";
import RequireAuth from "./components/authentication/RequireAuth";
import RequireAdmin from "./components/authentication/RequireAdmin";
import LandingPage from "./components/authentication/LandingPage";
import EditQuiz from "./components/editQuiz/EditQuiz";
import ComingSoon from "./components/comingSoon/ComingSoon";
import AdminPage from "./components/adminPage/AdminPage";
import Navbar from "react-bootstrap/Navbar";

function App() {
  return (
    <div className="page vh-100">
      <Navbar className="navbar d-flex flex-row-reverse">
        <NavbarComp />
      </Navbar>
      <div className="body">
        <Routes>
          <Route index element={<MainPage />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/myquizes"
            element={
              <RequireAuth>
                <MyQuizes />
              </RequireAuth>
            }
          />
          <Route
            path="/quiz/create"
            element={
              <RequireAuth>
                <CreateQuiz />
              </RequireAuth>
            }
          />
          <Route
            path="/quiz/edit/:id"
            element={
              <RequireAuth>
                <EditQuiz />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <RequireAdmin>
                  <AdminPage />
                </RequireAdmin>
              </RequireAuth>
            }
          />
          <Route
            path="/comingsoon"
            element={
              <RequireAuth>
                <ComingSoon />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<LandingPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
