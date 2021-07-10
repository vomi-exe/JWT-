import "./App.css";
import { Login } from "./components/Login";
import { Panel } from "./components/Panel";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Registor } from "./components/Registor";

function App() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  console.log(user);

  return (
    <Router>
      <Route path="/register" component={Registor}></Route>
      <Route path="/" exact>
        {user ? <Panel user={user} /> : <Login />}
      </Route>
    </Router>
  );
}

export default App;
