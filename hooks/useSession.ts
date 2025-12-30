import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";

export function useSession() {
    const  [session, setSession] = useState<any>(null);

    useEffect(() =>{ 
        supabase.auth.getSession().then(({data})  => {
            setSession(data.session);
        })
        const {data: {subscription}, } = supabase.auth.onAuthStateChange((_event, session) =>{
            setSession(session)
        });
        return () => subscription.unsubscribe();
    },[]);

    return session;
}