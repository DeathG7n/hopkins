"use client"
import styles from "./page.module.css"
import logo from "../../public/logo-hopkins.jpg"
import Navbar from "@/components/Navbar"

function Page() {
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
