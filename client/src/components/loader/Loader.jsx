import React from "react";
import { Spinner } from "react-bootstrap";

export default function Loader() {
  return (
    <div
      style={{ height: "100vh" }}
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <Spinner variant="primary" animation="grow" size="lg" />
    </div>
  );
}
