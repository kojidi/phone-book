import React, { useEffect, useState } from "react";
import axios from "axios";
import Numbers from "./components/Numbers";
import "./App.css";
import spinner from "./assets/img/spinner.gif";

const App = () => {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [allNumbers, setAllNumbers] = useState([]);
  const [editName, setEditName] = useState("");
  const [editNumber, setEditNumber] = useState("");
  const [editId, setEditId] = useState("");
  const [editAct, setEditAct] = useState(false);
  const [popUpAct, setPopUpAct] = useState(false);
  const [delId, setDelId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorColor, setErrorColor] = useState("#c0392b");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get("https://kojidi.github.io/phone-book/phones").then((response) => {
      setAllNumbers(response.data);
      setLoading(false);
    });
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();
    if (name === "" || number === "") {
      setErrorMessage("Please Fill both Name and Number");
    } else if (number.length !== 11 || isNaN(number)) {
      setErrorMessage("Please Enter a valid Number");
    } else if (allNumbers.find((num) => num.phoneNumber === number)) {
      setErrorMessage("This Number has Entered Before");
    } else {
      setErrorColor("#009432");
      const newPhoneNumber = {
        name: name,
        phoneNumber: number,
        date: new Date().toISOString(),
      };

      axios
        .post("https://kojidi.github.io/phone-book/phones", newPhoneNumber)
        .then((response) => {
          setAllNumbers(allNumbers.concat(response.data));
        });

      setErrorMessage(`New Contact Added !`);
      setTimeout(() => {
        setErrorMessage("");
        setErrorColor("#c0392b");
      }, 3000);
      // setNumLengthErr(false);
      setName("");
      setNumber("");
    }
    // setAllNumbers(allNumbers.concat(newPhoneNumber));
  };

  const editFormHandler = (event) => {
    event.preventDefault();

    const currentNum = allNumbers.find((n) => n.id === editId);

    if (editName === "" || editNumber === "") {
      setErrorMessage("Please Fill both Name and Number");
    } else if (editNumber.length !== 11 || isNaN(editNumber)) {
      setErrorMessage("Please Enter a valid Number");
    } else if (currentNum.phoneNumber === editNumber) {
      setErrorColor("#009432");
      const url = `https://kojidi.github.io/phone-book/phones/${editId}`;
      const editedNumber = allNumbers.find((n) => n.id === editId);
      const changedNumber = {
        ...editedNumber,
        name: editName,
        phoneNumber: editNumber,
      };

      axios
        .put(url, changedNumber)
        .then((res) => {
          // console.log(res);
          setAllNumbers(
            allNumbers.map((num) => (num.id !== editId ? num : res.data))
          );
        })
        .catch((err) => {
          console.log(err);
        });

      setErrorMessage(`Edit has applied !`);
      setTimeout(() => {
        setErrorMessage("");
        setErrorColor("#c0392b");
      }, 3000);

      setEditAct(false);
      setEditId("");
    } else if (allNumbers.find((num) => num.phoneNumber === editNumber)) {
      setErrorMessage("This Number has Entered Before");
    } else {
      setErrorColor("#009432");
      const url = `https://kojidi.github.io/phone-book/phones/${editId}`;
      const editedNumber = allNumbers.find((n) => n.id === editId);
      const changedNumber = {
        ...editedNumber,
        name: editName,
        phoneNumber: editNumber,
      };

      axios
        .put(url, changedNumber)
        .then((res) => {
          // console.log(res);
          setAllNumbers(
            allNumbers.map((num) => (num.id !== editId ? num : res.data))
          );
        })
        .catch((err) => {
          console.log(err);
        });

      setErrorMessage(`Edit has applied !`);
      setTimeout(() => {
        setErrorMessage("");
        setErrorColor("#c0392b");
      }, 3000);

      setEditAct(false);
      setEditId("");
    }
  };

  const showPopUp = () => {
    setPopUpAct(true);
  };

  const popUpYes = () => {
    setErrorColor("#009432");
    axios
      .delete(`https://kojidi.github.io/phone-book/phones/${delId}`)
      .then((res) => {
        // data I think can be res.id
        setAllNumbers(allNumbers.filter((num) => num.id !== delId));
      })
      .catch((err) => {
        console.log(err);
      });
    setErrorMessage(`Contact has deleted !`);
    setTimeout(() => {
      setErrorMessage("");
      setErrorColor("#c0392b");
    }, 3000);
    setPopUpAct(false);
    setDelId(false);
  };

  const popUpCancel = () => {
    setPopUpAct(false);
    setDelId("");
  };

  const deleteHandler = (data) => {
    setErrorMessage("");
    setDelId(data);
    showPopUp();
  };

  const updateHandler = (data) => {
    setErrorMessage("");
    const edit = allNumbers.find((num) => num.id === data);

    setEditName(edit.name);
    setEditNumber(edit.phoneNumber);
    setEditId(edit.id);
    setEditAct(true);
  };

  const nameHandler = (event) => {
    setName(event.target.value);
    setErrorMessage("");
  };

  const numberHandler = (event) => {
    setNumber(event.target.value);
    setErrorMessage("");
  };

  const editNameHandler = (event) => {
    setEditName(event.target.value);
    setErrorMessage("");
  };

  const editNumberHandler = (event) => {
    setEditNumber(event.target.value);
    setErrorMessage("");
  };

  const cancelHandler = () => {
    setEditAct(false);
    setErrorMessage("");
  };

  return (
    <React.Fragment>
      {errorMessage !== "" && (
        <p style={{ backgroundColor: errorColor }} className="num-length-err">
          {errorMessage}
        </p>
      )}

      <div className="app">
        {popUpAct && (
          <div className="delete-popup-container">
            <div className="delete-popup">
              <p>Are you sure ?</p>
              <button className="yes-btn" onClick={popUpYes}>
                Yes
              </button>
              <button className="cancel-btn" onClick={popUpCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}
        {editAct && (
          <div className="update-popup">
            <form className="form" onSubmit={editFormHandler}>
              <label>Name: </label>
              <input onChange={editNameHandler} value={editName} type="text" />
              <label>Enter Phone Number: </label>
              <input
                onChange={editNumberHandler}
                value={editNumber}
                type="tel"
                maxLength="11"
              />
              <button className="submit-btn" type="submit">
                Submit
              </button>
              <button className="cancel-btn" onClick={cancelHandler}>
                Cancel
              </button>
            </form>
          </div>
        )}

        <h1>My Phone Book</h1>
        <form className="form" onSubmit={submitHandler}>
          <label>Name: </label>
          <input onChange={nameHandler} value={name} type="text" />
          <label>Enter Phone Number: </label>
          <input
            onChange={numberHandler}
            value={number}
            type="tel"
            maxLength="11"
          />

          <button type="submit">Add to the book</button>
        </form>
        {loading && (
          <div className="spinner-container">
            <img className="spinner-img" src={spinner} alt="loading" />
          </div>
        )}
        {allNumbers.length !== 0 && (
          <Numbers
            data={allNumbers}
            deleteHandler={deleteHandler}
            updateHandler={updateHandler}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default App;
