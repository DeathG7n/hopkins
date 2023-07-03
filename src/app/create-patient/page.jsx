"use client"

import Head from "next/head"
import styles from "./page.module.css"
import Navbar from "@/components/Navbar"
import React ,{ useState , useEffect} from "react"
import { redirect } from "next/navigation"
import Link from "next/link"


function Page() {
    const [requested, setRequested] = useState([])
    const [form, setForm] = useState({requestedTests: []})
    const [update, setUpdate] = useState(false)
    const [tests, setTests] = useState([])
    useEffect(()=>{
        async function getTests(){
            const res = await fetch('http://localhost:3000/api/getAll/tests')
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
    const handleClick = async() =>{
        setForm({
            ...form,
            requestedTests : [...requested],
        })
        setUpdate(true)
    }

    async function create(){
        const res = await fetch('http://localhost:3000/api/create', {
            method: 'POST',
            body: JSON.stringify(form),
        })
        location.reload(true)
    }
    update && setTimeout(()=> create(), 3000)
    
    console.log(requested, form)
    
  return (
    <div>
        <Navbar/>
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
                            <h3>Hormones</h3>
                            {tests?.labTests?.map(item =>{
                                const type = item?.type == "Hormones" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                )
                            })}
                            <h3>Clinical Chemistry</h3>
                            {tests?.labTests?.map(item =>{
                                const type = item?.type == "Clinical Chemistry" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            <h3>Haematology</h3>
                            {tests?.labTests?.map(item =>{
                                const type = item?.type == "Haematology" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            <h3>Microbiology/Parasitology</h3>
                            {tests?.labTests?.map(item =>{
                                const type = item?.type == "Microbiology" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            <h3>Serology</h3>
                            {tests?.labTests?.map(item =>{
                                const type = item?.type == "Serology" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            <h3>Infectious Diseases</h3>
                            {tests?.labTests?.map(item =>{
                                const type = item?.type == "Infectious Diseases" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            <h3>Cytology</h3>
                            {tests?.labTests?.map(item =>{
                                const type = item?.type == "Cytology" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            <h3>Histology</h3>
                            {tests?.labTests?.map(item =>{
                                const type = item?.type == "Histology" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            <h3>Auto-Immune</h3>
                            {tests?.labTests?.map(item =>{
                                const type = item?.type == "Auto-Immune" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            <h3>Tumor Markers</h3>
                            {tests?.labTests?.map(item =>{
                                const type = item?.type == "Tumor Markers" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            <h3>Vitamins</h3>
                            {tests?.labTests?.map(item =>{
                                const type = item?.type == "Vitamins" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            <h3>Profiles/Grouped Tests</h3>
                            {tests?.labTests?.map(item =>{
                                const type = item?.type == "Profiles" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            <h3>Molecular Tests/ DNA</h3>
                            {tests?.labTests?.map(item =>{
                                const type = item?.type == "DNA" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            <h3>Others</h3>
                            {tests?.labTests?.map(item =>{
                                const type = (item?.type == "lab" || item?.type == null) ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            {tests?.scanTests?.map(item =>{
                                const type = item?.type == "scan" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            
                        </div>
                        <div className={styles.lab}>
                            <h1>Scan</h1>
                            <h3>Ultrasound Scans</h3>
                            {tests?.scanTests?.map(item =>{
                                const type = item?.type == "UltraSound" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            <h3>Echocardiography Scan</h3>
                            {tests?.scanTests?.map(item =>{
                                const type = item?.type == "ECG" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            <h3>X-RAYS</h3>
                            {tests?.scanTests?.map(item =>{
                                const type = item?.type == "X-rays" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
                                        </span>}
                                    </>
                                    
                                )
                            })}
                            <h3>Contrast X-RAYS Exams</h3>
                            {tests?.scanTests?.map(item =>{
                                const type = item?.type == "Contrast X-ray" ? true : false
                                return(
                                    <>
                                        {type && <span>
                                            <input type="checkbox" name={item?.name} id={item?.name} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="">{item?.name}</label>
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
                        {requested?.map(item=>{
                            return(
                                <>
                                    <li>{item}</li>
                                </> 
                            )
                        })}
                    </ul>
                    <span>
                        <div onClick={handleClick}>Create New Patient</div>
                    </span>
                    
                </section>  
            </div>
            
        </form>
    </div>
  )
}

export default Page

