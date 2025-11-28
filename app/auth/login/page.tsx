'use client'
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import '@/lib/firebase-client';
export default function Login(){
  const auth = getAuth();
  const [u,setU]=useState(''); const [p,setP]=useState(''); const [msg,setMsg]=useState('');
  const go = async()=>{
    // Use synthetic email from username
    const email = `${u}@local.hostgrow`;
    try{
      const cred = await signInWithEmailAndPassword(auth, email, p);
      const tok = await cred.user.getIdToken();
      setMsg('Logged in');
      localStorage.setItem('idToken', tok);
      location.href = '/dashboard';
    }catch(e:any){ setMsg(String(e)); }
  };
  return <div style={{minHeight:'100vh',background:'#061013',color:'#EAFEF5',padding:24}}>
    <h1>HostGrow Login</h1>
    <input placeholder='Username' value={u} onChange={e=>setU(e.target.value)} /><br/>
    <input placeholder='Password' type='password' value={p} onChange={e=>setP(e.target.value)} /><br/>
    <button onClick={go}>Sign in</button>
    <div>{msg}</div>
  </div>;
}
