import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
      console.error('Failed to fetch profile:', error)
      setProfile(null)
      return null
    }

    setProfile(data ?? null)
    return data ?? null
  }

  useEffect(() => {
    let mounted = true

    const initialiseAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return

        const u = session?.user ?? null
        setUser(u)

        if (u) await fetchProfile(u.id)
        else setProfile(null)
      } catch (error) {
        console.error('Failed to load auth session:', error)
        if (!mounted) return
        setUser(null)
        setProfile(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initialiseAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        const u = session?.user ?? null
        setUser(u)

        if (u) await fetchProfile(u.id)
        else setProfile(null)
      } catch (error) {
        console.error('Failed during auth state change:', error)
        setProfile(null)
      } finally {
        if (mounted) setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
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
