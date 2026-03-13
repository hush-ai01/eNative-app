import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function withTimeout(promise, ms, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms)
    })
  ])
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      throw error
    }

    setProfile(data)
    return data
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await withTimeout(
          supabase.auth.getSession(),
          5000,
          'Session check timed out'
        )
        const u = session?.user ?? null
        setUser(u)

        if (u) {
          fetchProfile(u.id).catch((error) => {
            console.error('Failed to load profile:', error)
            setProfile(null)
          })
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error('Failed to initialize auth state:', error)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null
      setUser(u)

      if (u) {
        fetchProfile(u.id).catch((error) => {
          console.error('Failed to refresh profile:', error)
          setProfile(null)
        })
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = async () => {
    if (user) return await fetchProfile(user.id)
  }

  return { user, profile, loading, signIn, signUp, signOut, refreshProfile }
}
