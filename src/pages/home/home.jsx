import { useEffect } from 'react'
import ProjectPosterCard from '../../components/cards/cards'
import { supabase } from '../../services/supabase'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/authSlice'



export default function Home() {
    const dispatch = useDispatch()

    useEffect(() => {
        const storedUser = localStorage.getItem('authUser')
        if (storedUser) {
            dispatch(setUser(JSON.parse(storedUser)))
        } else {
            const checkUser = async () => {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    dispatch(setUser(user))
                    localStorage.setItem('authUser', JSON.stringify(user))
                }
            }
            checkUser()
        }
    }, [dispatch])

    return (<ProjectPosterCard />)
}


