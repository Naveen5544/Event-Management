import React, { useEffect, useState } from "react";
import UserListRow from "./UserListRow";
import { getUserList } from "../../api";
import "./UserList.css";

function UserList() {
  const [arr, setArr] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    getUserList(token)
      .then((res) => {
        if (res.status === 200) setArr(res.data);
        else Promise.reject();
      })
      .catch((err) => {
        console.error("API Error:", err);
        alert(err.response?.data?.error || "Error fetching users");
      });
  }, [token]);

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