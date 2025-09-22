import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import User from './components/User';
import Add from './components/Add';
import Edit from './components/Edit';
import SignUp from './components/SignUp';
import Login from './components/Login';

function App() {

  const route = createBrowserRouter([
     {
      path:"/",
      element: <SignUp/>,
    },
    {
      path:"/login",
      element: <Login/>,
    },
    {
      path:"/home",
      element: <User/>,
    },
     {
      path:"/add",
      element: <Add/>,
    },
     {
      path:"/edit/:id",
      element: <Edit/>,
    },
  ])

  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
