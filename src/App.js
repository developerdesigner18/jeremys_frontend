import { BrowserRouter, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/login/Login';
import Register from './components/register/Register';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </BrowserRouter>
    </div>
  );
}

export default App;
