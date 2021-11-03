import React from "react";
import "./Numbers.css";

const Numbers = (props) => {
  const deleteHandler = (data) => {
    props.deleteHandler(data);
  };

  const updateHandler = (data) => {
    props.updateHandler(data);
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Names</th>
            <th>Numbers</th>
            <th>Setting</th>
          </tr>
        </thead>

        <tbody>
          {props.data.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.phoneNumber}</td>
              <td>
                <button onClick={() => updateHandler(d.id)}>Update</button>
                <button onClick={() => deleteHandler(d.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Numbers;
