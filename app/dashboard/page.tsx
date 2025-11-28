'use client'
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import '@/lib/firebase-client';
export default function Dashboard(){
  const [msg,setMsg]=useState('');
  useEffect(()=>{
    (async()=>{
      try{
        const tok = await getAuth().currentUser?.getIdToken();
        const r = await fetch('/api/auth-me',{headers:{Authorization:'Bearer '+tok}});
        const j = await r.json();
        setMsg(JSON.stringify(j,null,2));
      }catch(e:any){ setMsg(String(e)); }
    })();
  },[]);
  return <div style={{minHeight:'100vh',background:'#061013',color:'#EAFEF5',padding:24}}>
    <h1>HostGrow Dashboard</h1>
    <pre>{msg}</pre>
  </div>;
}
