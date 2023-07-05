"use client"

import styles from "../page.module.css"
import Navbar from "@/components/Navbar"
import { useRef, useState } from "react"
import Link from "next/link"
import Popup from "@/components/popup/Popup"

function Page() {
  const [search, setSearch] = useState({})
  const [popup, setPopup] = useState(false)
  const [message, setMessage] = useState(false)
  const id = useRef()
  const handleClick = async () => {
    const res = await fetch(`/api/find/${id?.current?.value}`)
    const body = await res.json()
    setSearch(body)
    setPopup(true)
    if(body){
      setMessage(true)
    } else{
      setMessage(false)
    }
    setTimeout(()=> setPopup(false), 2000)
  }
  
  
  return (
    <div>
        <Navbar/>  
        {popup && <Popup message={message ? "Patient Found" : "Patient Not Found"} error={message}/>}
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