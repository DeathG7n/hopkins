"use client"
import styles from "./page.module.css"
import logo from "../../public/logo-hopkins.jpg"
import Navbar from "@/components/Navbar"
import { useEffect } from "react"
import { useRouter } from 'next/navigation';

function Page() {
  const router = useRouter();
  useEffect(()=>{
    router.push("/create-patient")
  })
  return (
    <div>
      <Navbar/>
      <form className={styles.form}>
        <input type="text" placeholder="Enter your Username"/>
        <input type="password" name="password" id="password" placeholder="Enter your password"/>
        <div>Log In</div>
      </form>
    </div>
  )
}

export default Page
