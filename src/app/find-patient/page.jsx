"use client"

import styles from "../page.module.css"
import Navbar from "@/components/Navbar"
import { useRef, useState } from "react"
import Link from "next/link"

function Page() {
  const [search, setSearch] = useState({})
  const id = useRef()
  const handleClick = async () => {
    const res = await fetch(`https://hopkins.vercel.app/api/find/${id?.current?.value}`)
    const body = await res.json()
    setSearch(body)
  }
  
  
  return (
    <div>
        <Navbar/>  
        <form className={styles.form}>
            <input type="search" name="search" id="search" ref={id} placeholder="Search by patient name or receipt no"/>
            <div onClick={handleClick}>Search</div>
        </form> 
        {search?.name && <div className={styles.box}>
          <Link href={`/update-results/${search?.receiptNo}`}>{search?.name}</Link>  
        </div>}
    </div>
  )
}

export default Page