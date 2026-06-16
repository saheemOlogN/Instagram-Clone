
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

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/profile/:id',
        element: <Profile />
      },
      {
        path: '/account/edit',
        element: <EditProfile />
      },
      {
        path: '/chat',
        element: <ChatPage />
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
      const socketHost = window.location.hostname || 'localhost'
      const socketio = io(`http://${socketHost}:8000`, {
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
