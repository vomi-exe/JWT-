import React, { useState, useRef } from "react";
import "./Registor.css";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import axios from "axios";
import { Link } from "react-router-dom";
import OtpInput from "react-otp-input";
import { useHistory } from "react-router";

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
  const [otp, setOtp] = useState("");
  const [mobileErr, setMobileErr] = useState(false);
  const history = useHistory();
  const [success, setSuccess] = useState(false);

  const handleOtpChange = (otp) => {
    setOtp(otp);
  };

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
    event.preventDefault();
    if (pincode.current.value.toString().length > 5) {
      const res = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode.current.value}`
      );
      console.log(res);
      if (res.data[0].Status === "Success") {
        setErrorPin(false);
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
    const generateOTP = async () => {
      await axios.post("/generateOTP", {
        email: data.email,
        mobilenumber: data.mobilenumber,
      });
    };
    if (data.mobilenumber.toString().length > 9) {
      generateOTP();
      setMobileErr(false);
    } else {
      setMobileErr(true);
    }
    if (!mobileErr) {
      setOtpstate(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpvalue = otp;
    console.log(otpvalue);
    if (otpvalue.toString().length < 5) {
      setError(true);
    } else {
      const res = await axios.post("/verify", { otpvalue });
      if (res.status === 200) {
        const responce = await axios.post("/register", data);
        if (responce.status === 201) {
          setSuccess(true);
          window.setInterval(history.push("/"), 5000);
        }
      } else {
        setError(true);
        e.preventDefault();
      }
    }
  };

  return (
    <div>
      {otpstate ? (
        <div className="otpcover">
          <form>
            <h1 className="otpheading">Please Enter the OTP recived</h1>

            <OtpInput
              isInputNum
              className="otpinput"
              value={otp}
              onChange={handleOtpChange}
              numInputs={6}
              separator={<span>-</span>}
            />
            <button className="otpbtn" type="submit" onClick={handleSubmit}>
              Submit
            </button>
          </form>
          {error && (
            <div className="otperror">
              {" "}
              OTP is invalid <br />
              <br />
              <Link
                to="/register"
                onClick={() => {
                  setOtpstate(false);
                }}
              >
                Register Again
              </Link>{" "}
            </div>
          )}
          {success && (
            <div style={{ color: "green", marginLeft: "100px" }}>
              SUCCESFULLY REGISTERED!
            </div>
          )}
        </div>
      ) : (
        <div className="cover">
          <h1 className="heading">Sign Up</h1>
          <form className="formcontainer" action="/">
            <div>
              <label>First Name:</label>
              <input
                className="RegisterInput"
                required
                ref={fName}
                type="text"
              ></input>
            </div>
            <div>
              <label>Last Name:</label>
              <input
                className="RegisterInput"
                required
                ref={lName}
                type="text"
              ></input>
            </div>
            <div>
              <label>Email:</label>
              <input
                className="RegisterInput"
                required
                ref={email}
                type="email"
              ></input>
            </div>
            <div>
              <label>Password:</label>
              <input
                className="RegisterInput"
                required
                ref={password}
                type="password"
              ></input>
            </div>
            <div>
              <label>Confirm Password:</label>
              <input
                className="RegisterInput"
                required
                ref={passwordConfirm}
                type="password"
              ></input>
            </div>
            <div>
              <label>Mobile Number:</label>
              <input
                className="RegisterInput"
                required
                ref={mobileNumber}
                type="tel"
              ></input>
              {mobileErr && (
                <div style={{ color: "red" }}>please enter a valid number</div>
              )}
            </div>
            <div>
              <label>Date Of Birth:</label>
              <input
                className="RegisterInput"
                required
                ref={dateOfBirth}
                type="date"
              ></input>
            </div>
            <div>
              <label>Education:</label>
              <input
                className="RegisterInput"
                required
                ref={education}
                type="text"
              ></input>
            </div>
            <div>
              <label>Address:</label>
              <input
                className="RegisterInput"
                required
                ref={address}
                type="text"
              ></input>
            </div>
            <div className="pincode-div">
              <label>Pincode:</label>
              <input
                className="RegisterInput"
                required
                ref={pincode}
                type="tel"
              ></input>
              <button className="pinbtn" type="submit" onClick={handlePincode}>
                Enter
              </button>
              {errorPin && (
                <p style={{ color: "red" }}> Please enter a valid pin</p>
              )}
            </div>
            <div>
              <label>City:</label>
              <p>Enter Pincode to get City</p>
              <input
                className="RegisterInput"
                disabled
                required
                name="city"
                value={city}
                onChange={cityValue}
                type="text"
              ></input>
            </div>
            <div className="add-div">
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
            <button type="submit" className="btn-submit" onClick={onSubmit}>
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
