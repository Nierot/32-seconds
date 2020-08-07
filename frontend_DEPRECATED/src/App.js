import React from 'react';
import './App.css';
import { Switch, Route, Link } from 'react-router-dom';
import AddWordForm from './components/AddWordForm';
import socketIOClient from 'socket.io-client';
import config from './config.json';
const { 'base-uri': BASE_URI, 'socket-io-path': SOCKET_IO } = config;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: undefined,
    }
  }

  async componentDidMount() {
    await this.setState({
      socket: socketIOClient(BASE_URI, { path: SOCKET_IO })
    });
    
    this.state.socket.on('test', data => {
      alert(data);
    })

    this.state.socket.on('error', data => {
      console.log(`SOCKET-IO ERROR: ${data}`);
    })
  }

  render() {
    return (
        <div className="App">
          {/* <Header /> */}
          <Main />
        </div>
    );
  }
}

function Header() {
  return (
    <nav>
      <Link to="/">Home </Link>
      <Link to="/add"> Add Words</Link>
    </nav>
  )
}

function Main() {
  return (
    <Switch>
      <Route path="/" exact component={Home}/>
      <Route path="/add" component={AddWordForm}/>
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