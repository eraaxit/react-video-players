import React from "react";
import "./Spinner1.scss";

const Spinner1: React.FC = () => {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
export default Spinner1;
