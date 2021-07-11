import "./App.css";
import { Login } from "./components/Login";
import { Success } from "./components/Success";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Registor } from "./components/Registor";

function App() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  console.log(user);

  return (
    <Router>
      <Route path="/register">
        <Registor />
      </Route>
      <Route path="/" exact>
        {user ? <Success /> : <Login />}
      </Route>
    </Router>
  );
}

export default App;
