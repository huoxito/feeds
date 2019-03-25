import React from "react";

export default ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed vh-100 dt w-100 red">
      <span className="dtc v-mid tc">{message}</span>
    </div>
  );
};
