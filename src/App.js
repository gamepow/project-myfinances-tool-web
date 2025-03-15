import logo from './logo.svg';
import './App.css';

function MyButton() {

  function handleClick() {
    alert('Button clicked');
  }

  return(
    <button onClick={handleClick}>
      Log In
    </button>
  )
}

function App() {
  return (
    <div className="App">
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}

export default App;
