import React from 'react';
import './App.css';
import { Switch, Route, Link } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
        <div className="App">
          <Header />
          <Main />
        </div>
    );
  }
}

function Header() {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
    </ul>
  )
}

function Main() {
  return (
    <Switch>
      <Route path="/about" component={About}/>
      <Route exact path="/" component={Home}/>
    </Switch>
  )
}

function Home() {
  return (
    <div className="Home">
      <h1>Home</h1>
    </div>
  )
}

function About() {
  return (
    <div className="About">
      <h1>About</h1>
    </div>
  )
}

export default App;
