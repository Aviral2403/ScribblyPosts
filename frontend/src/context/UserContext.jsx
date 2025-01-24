/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { URL } from "../url";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext({})

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    // console.log("Initial token check:", !!token)
    
    if (token) {
      getUser(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const getUser = async (token) => {
    try {
      // console.log("Attempting to refetch user with token:", token)
      
      const res = await axios.get(`${URL}/api/auth/refetch`, {
        params: { token },
        withCredentials: true
      })

      // console.log("Full refetch response:", res.data)

      // Modify validation to check for more flexible user data
      if (res.data && (res.data._id || res.data.id)) {
        // Normalize the user object
        const userData = {
          _id: res.data._id || res.data.id,
          username: res.data.username,
          email: res.data.email
        }
        
        setUser(userData)
        // console.log("User successfully retrieved:", userData.username)
      } else {
        console.warn("Invalid user data received")
        throw new Error("Invalid user data")
      }
    }
    catch (err) {
      console.error("Detailed refetch error:", err)
      
      // More specific error handling
      if (err.response) {
        // The request was made and the server responded with a status code
        console.error("Server responded with error:", err.response.data)
        
        // If unauthorized or token invalid, clear token and redirect
        if (err.response.status === 401 || err.response.status === 403) {
          localStorage.removeItem('token')
          setUser(null)
          navigate('/login')
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request)
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", err.message)
      }

      // Always clear token and user on error
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      isLoading
    }}>
      {children}
    </UserContext.Provider>
  )
}
