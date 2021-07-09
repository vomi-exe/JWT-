import React, { useState, useRef } from "react";
import "./Registor.css";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import axios from "axios";

export const Registor = () => {
  const fName = useRef();
  const lName = useRef();
  const email = useRef();
  const password = useRef();
  const passwordConfirm = useRef();
  const mobileNumber = useRef();
  const dateOfBirth = useRef();
  const address = useRef();
  const pincode = useRef();
  const city = useRef();
  const education = useRef();
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = {
      firstname: fName.current.value,
      middlename: "",
      lastname: lName.current.value,
      email: email.current.value,
      password: password.current.value,
      mobilenumber: mobileNumber.current.value,
      dateofbirth: dateOfBirth.current.value,
      education: education.current.value,
      address: address.current.value,
      pincode: pincode.current.value,
      city: city.current.value,
      state: region,
      country: country,
    };
    await axios.post("/register", data);
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form className="formcontainer" action="/">
        <div>
          <label>First Name:</label>
          <input required ref={fName} type="text"></input>
        </div>
        <div>
          <label>Last Name:</label>
          <input required ref={lName} type="text"></input>
        </div>
        <div>
          <label>Email:</label>
          <input required ref={email} type="email"></input>
        </div>
        <div>
          <label>Password:</label>
          <input required ref={password} type="password"></input>
        </div>
        <div>
          <label>Confirm Password:</label>
          <input required ref={passwordConfirm} type="password"></input>
        </div>
        <div>
          <label>Mobile Number:</label>
          <input required ref={mobileNumber} type="number"></input>
        </div>
        <div>
          <label>Date Of Birth:</label>
          <input required ref={dateOfBirth} type="date"></input>
        </div>
        <div>
          <label>Education:</label>
          <input required ref={education} type="text"></input>
        </div>
        <div>
          <label>Address:</label>
          <input required ref={address} type="text"></input>
        </div>
        <div>
          <label>Pincode:</label>
          <input required ref={pincode} type="text"></input>
        </div>
        <div>
          <label>City:</label>
          <input required ref={city} type="text"></input>
        </div>
        <div>
          <label>Country:</label>
          <CountryDropdown
            required
            name=""
            className="countrySelect"
            value={country}
            onChange={(val) => setCountry(val)}
          />
          <label>State:</label>
          <RegionDropdown
            required
            name=""
            className="regionSelect"
            country={country}
            value={region}
            onChange={(val) => setRegion(val)}
          />
        </div>
        <div>
          <label>Attachment:</label>
          <input type="file"></input>
        </div>
        <button type="submit" onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};
