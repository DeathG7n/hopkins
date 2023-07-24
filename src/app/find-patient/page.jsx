"use client"

import styles from "./page.module.css"
import Navbar from "@/components/Navbar"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Popup from "@/components/popup/Popup"

function Page() {
  const [search, setSearch] = useState([])
  const [patients, setPatients] = useState([])
  const [popup, setPopup] = useState(false)
  const [message, setMessage] = useState(false)

  useEffect(()=>{
    const findAll = async() => {
      const res = await fetch(`/api/find`)
      const body = await res.json()
      setSearch(body)
    }
    findAll()
  },[])
  const handleSearch = (e) =>{
    const names = search?.map(i => {return i?.name})
    const patients = search?.filter(i => i?.name.toLowerCase()?.includes(e?.target?.value.toLowerCase()))
    setPatients(patients)
  }
  const handleClick = (id) => {
    localStorage.setItem("id", id)
  }
  
  
  return (
    <div>
      <Navbar/>  
      {popup && <Popup message={message ? "Patient Found" : "Patient Not Found"} error={message}/>}
      <form className={styles.form}>
          <input type="search" name="search" id="search"  placeholder="Search by patient name or receipt no" onChange={handleSearch}/>
      </form> 
      <div className={styles.box}>
        {patients?.map((item, id) => {
          return(
            <Link href={`/update-results`} key={id} onClick={() => handleClick(item?._id)}>{item?.name}</Link> 
          )
        })}
      </div>
      {search?.name && <div className={styles.box}>
        <Link href={`/update-results/${search?.receiptNo}`}>{search?.name}</Link>  
      </div>}
    </div>
  )
}

export default Page