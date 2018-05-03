import React from "react";

export default ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="dib pa2 red">
      <span className="lh-title ml3">{message}</span>
    </div>
  );
};
