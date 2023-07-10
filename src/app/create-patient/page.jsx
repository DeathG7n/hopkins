"use client"

import Head from "next/head"
import styles from "./page.module.css"
import Navbar from "@/components/Navbar"
import React ,{ useState , useEffect} from "react"
import Link from "next/link"
import Popup from "@/components/popup/Popup"


function Page() {
    const [requested, setRequested] = useState([])
    const [form, setForm] = useState({requestedTests: []})
    const [tests, setTests] = useState([])
    const [message, setMessage] = useState("")
    const [res, setRes] = useState(false)
    const [popup, setPopup] = useState(false)
    const [labSearch, setLabSearch] = useState([])
    const [scanSearch, setScanSearch] = useState([])
    const [show, setShow] = useState(false)
    useEffect(()=>{
        async function getTests(){
            const res = await fetch('/api/getAll/tests')
            const body = await res.json()
            setTests(body)
        }
        getTests()
    },[])
    const handleChange = (e)=>{
        const test = e?.target?.name
        const newArray = [...requested]
        if(e.target.type != "checkbox"){
            setForm({
                ...form,
                [e.target.name] : e.target.value,
            })
        }
        if(e.target?.type == "checkbox"){
            if(e.target?.checked == false ){
                const removedItem = newArray.find(i => i == e?.target.name)
                const index = newArray.indexOf(removedItem)
                newArray.splice(index,1)
                setRequested(newArray)
            } else{
                setRequested(requested => [...requested, test])
            } 
        }
    }
    const handleLabSearch = (e) =>{
        e?.target?.value == "" ? setShow(false) : setShow(true)
        const names = tests?.labTests?.map(i => {return i?.name})
        const labs = names?.filter(i => i.toLowerCase()?.includes(e?.target?.value.toLowerCase()))
        setLabSearch(labs)
    }
    const handleScanSearch = (e) =>{
        e?.target?.value == "" ? setShow(false) : setShow(true)
        const names = tests?.scanTests?.map(i => {return i?.name})
        const scans = names?.filter(i => i.toLowerCase()?.includes(e?.target?.value.toLowerCase()))
        setScanSearch(scans)
    }

    async function handleSubmit(){
        const data = {
            name: form?.name,
            age: form?.age,
            gender: form?.gender,
            requestedTests: [...requested],
            labNo: form?.labNo,
            receiptNo: form?.receiptNo,
            referral: form?.referral
        }
        const res = await fetch('/api/create', {
            method: 'POST',
            body: JSON.stringify(data),
        })
        const body = await res.json()
        setRes(res?.ok)
        setPopup(true)
        setMessage(body)
        setTimeout(()=> setPopup(false), 1000)
        res && location.reload(true)
    }
    
  return (
    <div>
        <Navbar/>
        {popup && <Popup message={res ? message : "Patient Not Created"} error={res}/>}
        <form className={styles.form}>
            <section className={styles.details}>
                <span>
                    <label htmlFor="">{"Patient's Name:"} </label>
                    <input type="text" className={styles.name} name="name" onChange={(e)=>handleChange(e)}/>
                </span>
                <span>
                    <label htmlFor="">Age: </label>
                    <input type="number" className={styles.age} name="age" onChange={(e)=>handleChange(e)}/>
                </span>
                <span>
                    <label htmlFor="">Gender: </label>
                    <select name="gender" onChange={(e)=>handleChange(e)}>
                        <option value=""> ...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </span>
                <span>
                    <label htmlFor="">Receipt No: </label>
                    <input type="text" className={styles.receipt} name="receiptNo" onChange={(e)=>handleChange(e)}/>
                </span>
                <span>
                    <label htmlFor="">Lab No: </label>
                    <input type="text" className={styles.receipt} name="labNo" onChange={(e)=>handleChange(e)}/>
                </span>
                <span>
                    <label htmlFor="">Referral: </label>
                    <input type="text" className={styles.name} name="referral" onChange={(e)=>handleChange(e)}/>
                </span>
            </section>
            <div className={styles.div}>
              <section className={styles.tests}>
                    <h3>Select Test</h3>
                    <div className={styles.testbox}>
                        <div className={styles.lab}>
                            <h1>Laboratory</h1>
                            <input className={styles.search} type="search" name="patient" placeholder="Search for test name" onChange={(e)=> handleLabSearch(e)} />
                            {labSearch?.map((item, id) =>{
                                return(
                                    <>
                                        {<span key={id}>
                                            <input type="checkbox" name={item} id={item?.name} onChange={(e)=>handleChange(e)} checked={requested?.includes(item)}/>
                                            <label htmlFor="">{item}</label>
                                        </span>}
                                    </>
                                )
                            })}
                        </div>
                        <div className={styles.lab}>
                            <h1>Scan</h1>
                            <input type="search" name="patient" placeholder="Search for test name" onChange={(e)=> handleScanSearch(e)} className={styles.search}/>
                            {scanSearch?.map((item, id) =>{
                                return(
                                    <>
                                        {<span key={id}>
                                            <input type="checkbox" name={item} id={item?.name} onChange={(e)=>handleChange(e)} checked={requested?.includes(item)}/>
                                            <label htmlFor="">{item}</label>
                                        </span>}
                                    </>
                                )
                            })}
                        </div>
                    </div>
                </section>
                <section className={styles.display}>
                    <h3>Requested Tests</h3>
                    <ul>
                        {requested?.map((item, id)=>{
                            return(
                                <>
                                    <li key={id}>{item}</li>
                                </> 
                            )
                        })}
                    </ul>
                    <span>
                        <div onClick={handleSubmit}>Create New Patient</div>
                    </span>
                    
                </section>  
            </div>
            
        </form>
    </div>
  )
}

export default Page

