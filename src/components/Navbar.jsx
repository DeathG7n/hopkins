"use-client"

import Link from "next/link"
import styles from "./Navbar.module.css"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"

function Navbar() {
  const [path, setPath] = useState("")
  const [button, setButton] = useState("")
  const pathname = usePathname()
  useEffect(()=>{
      if(pathname == "/find-patient"){
        setPath("/create-patient")
        setButton("Create Patient")
      } else{
          setPath("/find-patient")
          setButton("Find Patient")
      }
  }, [pathname])
  
  return (
    <nav className={styles.nav}>
        <Image src="/logo-hopkins.jpg" alt="" />
        <div>
          <h1>HOPK<span>i</span>NS</h1>
          <h2>DIAGNOSTICS</h2>
        </div>
        <ul>
          <Link href={path}>{button}</Link>
        </ul>
    </nav>
  )
}

export default Navbar