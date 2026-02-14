import React, { useEffect, useState } from "react";
import Axios from "axios";
import UserListRow from "./UserListRow";
import "./UserList.css";

function UserList() {
  const [arr, setArr] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:5000/eventRoute/user-list")
      .then((res) => {
        if (res.status === 200) setArr(res.data);
        else Promise.reject();
      })
      .catch((err) => alert(err));
  }, []);

  const ListItems = () => {
    return arr.map((val) => {
      // Add a unique key prop for each UserListRow
      return <UserListRow key={val._id} obj={val} />;
    });
  };

  return (
    <table
      className="userDisplayTable"
      style={{
        maxWidth: "60%",
        margin: "50px auto",
        border: "1px solid white",
        borderCollapse: "collapse",
      }}
      cellSpacing="0"
      cellPadding="5"
    >
      <thead>
        <tr>
          <th className="text-center">Username</th>
          <th className="text-center">Full Name</th>
          <th className="text-center">Email</th>
          <th className="text-center">Phone</th>
        </tr>
      </thead>
      <tbody>{ListItems()}</tbody>
    </table>
  );
}

export default UserList;