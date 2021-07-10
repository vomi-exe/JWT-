import React, { useState, useRef } from "react";
import "./Registor.css";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import axios from "axios";
import { Link } from "react-router-dom";

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
  const [city, setCity] = useState("");
  const education = useRef();
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [data, setData] = useState({});
  const [otpstate, setOtpstate] = useState(false);
  const [error, setError] = useState(false);
  const [errorPin, setErrorPin] = useState(false);
  const otp = useRef();

  const cityValue = (res) => {
    setCity(res.data[0].PostOffice[0].District);
    console.log(res.data[0].PostOffice[0].District);
  };
  const countryValue = (res) => {
    setCountry(res.data[0].PostOffice[0].Country);
    console.log(res.data[0].PostOffice[0].Country);
  };
  const regionValue = (res) => {
    setRegion(res.data[0].PostOffice[0].State);
    console.log(res.data[0].PostOffice[0].State);
  };

  const handlePincode = async (event) => {
    if (pincode.current.value > 100000) {
      const res = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode.current.value}`
      );
      console.log(res);
      if (res.status === 200) {
        cityValue(res);
        countryValue(res);
        regionValue(res);
      } else {
        setErrorPin(true);
      }
    } else {
      setErrorPin(true);
    }
  };

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
      city: city,
      state: region,
      country: country,
    };
    setData(data);
    setOtpstate(true);
    const generateOTP = async () => {
      await axios.post("/generateOTP", { mobilenumber: data.mobilenumber });
    };
    generateOTP();
  };

  const handleSubmit = async (e) => {
    const otpvalue = otp.current.value;
    const res = await axios.post("/verify", { otpvalue });
    console.log(res);
    if (res.data === "Verified") {
      const responce = await axios.post("/register", data);
      if (responce.status === 201) {
      }
    } else {
      setError(true);
      e.preventDefault();
    }
  };

  return (
    <div>
      {otpstate ? (
        <div>
          <form action="/">
            <h1>Please Enter the OTP recived</h1>
            <label>Enter OTP:</label>
            <input required ref={otp} type="tel"></input>
            <button type="submit" onClick={handleSubmit}>
              Submit
            </button>
          </form>
          {error && (
            <div>
              {" "}
              OTP is invalid <br /> <Link to="/register">
                Register Again
              </Link>{" "}
            </div>
          )}
        </div>
      ) : (
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
              <input required ref={pincode} type="tel"></input>
              <button type="submit" onClick={handlePincode}>
                Enter
              </button>
              {errorPin && <p>Please enter a valid pin</p>}
            </div>
            <div>
              <label>City:</label>
              <input
                required
                name="city"
                value={city}
                onChange={cityValue}
                type="text"
              ></input>
            </div>
            <div>
              <label>Country:</label>
              <CountryDropdown
                required
                name=""
                className="countrySelect"
                value={country}
                onChange={(val) => setCountry(val) || countryValue}
              />
              <label>State:</label>
              <RegionDropdown
                required
                name=""
                className="regionSelect"
                country={country}
                value={region}
                onChange={(val) => setRegion(val) || regionValue}
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
      )}
    </div>
  );
};
