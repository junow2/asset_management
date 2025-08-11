import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function Test() {

  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch('/test/getNow')
      .then(response => response.text())
      .then(message => {
        setMessage(message);
      });
  }, [])

  return (
    <React.Fragment>
      <p> Happy Hacking! </p>

      <p> {message} </p>

    </React.Fragment>
  )


}