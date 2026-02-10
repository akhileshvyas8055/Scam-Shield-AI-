import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const API_URL = 'http://localhost:5000/api'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [userId, setUserId] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get or create unique device ID
        let id = localStorage.getItem('scam_detector_user_id')
        if (!id) {
            id = uuidv4()
            localStorage.setItem('scam_detector_user_id', id)
        }
        setUserId(id)
        fetchUserStatus(id)
    }, [])

    const fetchUserStatus = async (id = userId) => {
        if (!id) return
        try {
            const res = await axios.get(`${API_URL}/user/${id}/status`)
            setUser(res.data)
        } catch (error) {
            console.error("Failed to fetch user status", error)
        } finally {
            setLoading(false)
        }
    }

    const upgradeMembership = async () => {
        try {
            const res = await axios.post(`${API_URL}/user/${userId}/upgrade`)
            if (res.data.success) {
                setUser(res.data.user)
                return true
            }
        } catch (error) {
            console.error("Upgrade failed", error)
            return false
        }
        return false
    }

    return (
        <UserContext.Provider value={{
            user,
            userId,
            loading,
            refreshUser: () => fetchUserStatus(),
            upgradeMembership
        }}>
            {children}
        </UserContext.Provider>
    )
}
