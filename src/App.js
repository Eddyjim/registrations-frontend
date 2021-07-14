import logo from './pages/home/logo.svg';
import './App.css';
import {Route, Switch} from "react-router-dom";


import {Home} from './pages/home/home'
import {Registration} from './pages/registration/registration'

function App() {
  return (
    <div className="App">
      <Routing/>
    </div>
  );
}

const Routing = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Home}/>
      <Route exact path='/registration' component={Registration}/>
    </Switch>
  );
}
export default App;
