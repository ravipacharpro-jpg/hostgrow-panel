'use client'
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import '@/lib/firebase-client';
const API = '';
export default function Signup(){
  const auth = getAuth();
  const [name,setN]=useState('');
  const [u,setU]=useState('');
  const [p,setP]=useState('');
  const [msg,setMsg]=useState('');
  const go = async()=>{
    const email = `${u}@local.hostgrow`; // synthetic email for Firebase
    try{
      const cred = await createUserWithEmailAndPassword(auth, email, p);
      await updateProfile(cred.user, { displayName: name });
      // optional: call server to create app user row linked by firebase uid
      setMsg('Account created. Now login.');
    }catch(e:any){ setMsg(String(e)); }
  };
  return <div style={{minHeight:'100vh',background:'#0EA5E9',color:'#fff',padding:24}}>
    <h1>Create HostGrow Account</h1>
    <input placeholder='Name' value={name} onChange={e=>setN(e.target.value)} /><br/>
    <input placeholder='Username' value={u} onChange={e=>setU(e.target.value)} /><br/>
    <input placeholder='Password' type='password' value={p} onChange={e=>setP(e.target.value)} /><br/>
    <button onClick={go}>Create account</button>
    <div>{msg}</div>
  </div>;
}
