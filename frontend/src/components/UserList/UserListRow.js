import React from "react";
import PropTypes from "prop-types";  // ✅ Correct import
import Axios from "axios";

function UserListRow({ obj }) {  // ✅ Destructure directly from props
    const { _id, username, fullName, email, phone } = obj; // Removed unused variables

    const handleClick = () => {
        Axios.all([
            Axios.delete(`http://localhost:5000/eventRoute/delete-user/${_id}`)
                .then((res) => {
                    if (res.status === 200) {
                        alert("Record deleted successfully");
                        window.location.reload();
                    } else {
                        return Promise.reject();
                    }
                })
                .catch((err) => alert(err)),

            Axios.get("http://localhost:5000/eventRoute/event-list")
                .then((eventResponse) => {
                    if (eventResponse.status === 200) {
                        const collectedEvents = eventResponse.data;
                        collectedEvents.forEach((eventData) => {
                            eventData.registeredUsers = eventData.registeredUsers.filter(
                                (user) => user.username !== username
                            );

                            Axios.put(`http://localhost:5000/eventRoute/update-event/${eventData._id}`, eventData)
                                .then((updateResponse) => {
                                    if (updateResponse.status === 200) {
                                        console.log("Event details updated");
                                    } else {
                                        return Promise.reject();
                                    }
                                })
                                .catch((updateError) => alert(updateError));
                        });
                    }
                }),
        ]);
    };

    return (
        <tr>
            <td>{username}</td>
            <td>{fullName}</td>
            <td>{email}</td>
            <td>{phone}</td>
            <td className="d-flex justify-content-center">
                <button onClick={handleClick} className="btn delete-button">
                    Delete
                </button>
            </td>
        </tr>
    );
}

// ✅ Add PropTypes validation
UserListRow.propTypes = {
    obj: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
    }).isRequired,
};

export default UserListRow;
