"use client"
import styles from "./page.module.css"
import logo from "../../public/logo-hopkins.jpg"
import Navbar from "@/components/Navbar"
import { useState, useRef } from "react"
import { useRouter } from 'next/navigation';
import Popup from "@/components/popup/Popup"

function Page() {
  const [popup, setPopup] = useState(false)
  const users = [
    {
      name: "Jared",
      password: "admin",
      admin: true
    },
    {
      name: "Staff",
      password: "staff",
      admin: false
    }
  ]
  const name = useRef()
  const password = useRef()
  const router = useRouter();
  const handleClick = () =>{
    const currentUser = users?.find(i => i?.name == name?.current?.value)
    if(currentUser && currentUser?.password == password?.current?.value){
      localStorage.setItem("admin", currentUser?.admin)
      router.push("/find-patient")
    } else{
      setPopup(true)
      setTimeout(()=> setPopup(false), 2000)
    }
  }
  return (
    <div>
      <Navbar/>
      {popup && <Popup message={"Login Incorrect"} error={false}/>}
      <form className={styles.form}>
        <input type="text" placeholder="Enter your Username" ref={name}/>
        <input type="password" name="password" id="password" placeholder="Enter your password" ref={password}/>
        <div onClick={handleClick}>Log In</div>
      </form>
    </div>
  )
}

export default Page
