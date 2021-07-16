import logo from "./logo.svg";
import {Link} from "react-router-dom";

export function Home(){
  return(
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >

        <Link to="/registro">
          <button variant="outlined">
            Registro
          </button>
        </Link>
      </a>
    </header>
  )
}