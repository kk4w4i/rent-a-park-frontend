import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CustomerListing from "./pages/CustomerListing"
import { useAuthContext } from "./context/AuthContext";
// import NotFound from "./pages/NotFound"
import URLS from "./urls"

export default function Router() {
  const { user } = useAuthContext();

  console.log("Router user:", user);
  
  return (
    <BrowserRouter>
      <Routes>
          <Route path={URLS.HOME} element={<Home />} />
          <Route path={URLS.PROFILE} element={user ? <Profile /> : <></>} />
          <Route path={URLS.SIGNIN} element={<SignIn />} />
          <Route path={URLS.SIGNUP} element={<SignUp />} />
          <Route path={URLS.LISTING} element={<CustomerListing />} />
          {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
};