import { useEffect, useState } from "react";
import Button from "../Button.jsx";
import { useNavigate } from "react-router";

export default function CompareButton({
  tailWindClass,
  flight,
  flightOneOrTwo,
  changeFlightOneOrTwo,
}) {
  const [compareButtonText, setCompareButtonText] = useState(
    JSON.stringify({ ...flight, uuid: "" }) === localStorage.getItem("flight1")
      ? "Fligth1"
      : "Compare"
  );

  useEffect(() => {
    if (compareButtonText !== "Compare") {
      changeFlightOneOrTwo(2);
    }
  }, []);

  let navigate = useNavigate();

  function addToCompare() {
    if (compareButtonText !== "Compare") {
      setCompareButtonText("Compare");
      changeFlightOneOrTwo(flightOneOrTwo === 1 ? 2 : 1);
      localStorage.removeItem("flight1");
      return;
    }
    localStorage.setItem(
      `flight${flightOneOrTwo}`,
      JSON.stringify({ ...flight, uuid: "" })
    );
    changeFlightOneOrTwo(flightOneOrTwo === 1 ? 2 : 1);
    setCompareButtonText(`flight${flightOneOrTwo}`);
    if (flightOneOrTwo === 2) {
      navigate(`/compare`);
    }
  }

  return (
    <>
      <Button
        tailWindClass={tailWindClass}
        buttonName={compareButtonText}
        runFunction={addToCompare}
        type={"button"}
      />
    </>
  );
}
