
import Signup from "./components/Signup"
import Signin from "./components/Signin"
import MainLayout from "./components/MainLayout"
import Home from "./components/Home"
import Profile from './components/Profile'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import EditProfile from "./components/EditProfile"
import ChatPage from "./components/ChatPage"
import { io } from "socket.io-client"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setOnlineUsers } from "./redux/chatSlice"
import { setSocket } from "./redux/socketSlice"
import ProtectedRoutes from "./components/ProtectedRoutes"
import { SOCKET_URL } from "./lib/api"

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: '/',
        element: <ProtectedRoutes> <Home /></ProtectedRoutes>
      },
      {
        path: '/profile/:id',
        element: <ProtectedRoutes><Profile /></ProtectedRoutes>
      },
      {
        path: '/account/edit',
        element: <ProtectedRoutes> <EditProfile /></ProtectedRoutes>
      },
      {
        path: '/chat',
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes> 
      },

    ]
  },

  {
    path: '/signin',
    element: <Signin />
  },
  {
    path: '/signup',
    element: <Signup />
  },

])
function App() {
  const { user } = useSelector(store => store.auth)
  const dispatch = useDispatch()
  const socketRef = useRef(null)

  useEffect(() => {
    if (user) {
      const socketio = io(SOCKET_URL, {
        query: {
          userId: user?._id
        },
        withCredentials: true,
        transports: ['websocket']
      });
      socketRef.current = socketio
      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => {
        socketio.close();
        if (socketRef.current === socketio) {
          socketRef.current = null
        }
        dispatch(setSocket(null));
        dispatch(setOnlineUsers([]));
      }
    } else if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null
      dispatch(setSocket(null));
      dispatch(setOnlineUsers([]));
    }
  }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
