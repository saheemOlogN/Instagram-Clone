
import Signup from "./components/Signup"
import Signin from "./components/Signin"
import MainLayout from "./components/MainLayout"
import Home from "./components/Home"
import Profile from './components/Profile'
import {createBrowserRouter, RouterProvider} from "react-router-dom"


const browserRouter = createBrowserRouter([
  {
    path:'/',
    element:<MainLayout />,
    children:[
      {
        path:'/',
        element:<Home/>
      },
       {
        path:'/profile/:id',
        element:<Profile />
      },

    ]
  },

  {
    path:'/signin',
    element:<Signin />
  },
   {
    path:'/signup',
    element:<Signup />
  },

])
function App() {
  return (
    <>
    <RouterProvider router = {browserRouter} />
    </>
  )
}

export default App