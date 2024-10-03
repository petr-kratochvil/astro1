import React from "react";
import { deleteBaseDate, getSavedData } from "../utils/LocalStorage";
import { useNavigate } from "react-router-dom";
import { useForceUpdate } from "../utils/useForceUpdate";

export default function SavedDataList() {
  const navigate = useNavigate();
  const savedDataList = getSavedData();
  const forceUpdate = useForceUpdate();

  // TODO: convert saved date (UTC) to current zone to display it properly
   // TODO: use proper time zone based on geolocation
  return (
    <>
      <button style={{ padding: '10px', margin: '10px' }} onClick={() => navigate(`${savedDataList.length}`)}>
        Add new
      </button>
      {savedDataList.map((item, index) => item && (
        <div key={index} style={{ border: "1px solid blue", padding: '10px', margin: '10px' }}>
          <b>{item.name}</b>
          <br />
          <i>{item.day}. {item.month} .{item.year}</i>
          <button onClick={() => navigate(`${index}`)}>Edit</button>
          <button onClick={() => {deleteBaseDate(index); forceUpdate()}}>Delete</button>
        </div>
      ))}
    </>
  );
}
