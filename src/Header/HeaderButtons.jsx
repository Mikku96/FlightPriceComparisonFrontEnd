import { useLocation, useNavigate, matchPath } from "react-router-dom";

import Button from "../Button.jsx";

export default function HeaderButtons({
  setShowLogin,
  currentUser,
  setCurrentUser,
}) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (isComparePage) {
      localStorage.removeItem("flight1");
      localStorage.removeItem("flight2");
    }
    navigate(-1); // navigate to the previous page
  };

  const goToUser = () => {
    navigate("/personalInfo");
  };

  const goToTransport = () => {
    console.log("Not implemented!");
  }

  const goHome = () => {
    navigate("/");
  }

  const logOut = () => {
    console.log("Logging out");
    localStorage.clear();
    setCurrentUser("");
    navigate("/");
  };

  const location = useLocation();
  const isFlightDetails = matchPath("/flightDetails/:uuid", location.pathname);
  const isUserPage = matchPath("/personalInfo", location.pathname);
  const isComparePage = matchPath("/compare", location.pathname);

  return (
    <>
      <div className="h-4/5 mr-3 flex gap-x-1 items-center">
        <Button
          tailWindClass="ml-2 opacity-20"
          buttonName={"Public Transport"}
          runFunction={goToTransport}
          isDisabled = {true}
          type={"button"}
        />
          <Button
          tailWindClass="ml-2"
          buttonName={"Home"}
          runFunction={goHome}
          type={"button"}
        />     
      </div>

      <div className="mr-3 h-full flex gap-x-1 items-center">
        {currentUser && (
          <Button
            tailWindClass=""
            buttonName={currentUser.username}
            runFunction={goToUser}
            type={"button"}
          />
        )}
        {(isFlightDetails || isUserPage || isComparePage) && (
          <Button
            tailWindClass="ml-2"
            buttonName="Back"
            runFunction={handleGoBack}
            type="button"
          />
        )}

        {!currentUser ? (
          <Button
            tailWindClass=""
            buttonName={"Login"}
            runFunction={() => setShowLogin(true)}
            type={"button"}
          />
        ) : (
          <Button
            tailWindClass=""
            buttonName={"Logout"}
            runFunction={logOut}
            type={"button"}
          />
        )}
      </div>
    </>
  );
}
