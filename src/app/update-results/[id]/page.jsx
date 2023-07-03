'use client'

import styles from "./page.module.css"
import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

function Page() {
    const value = useRef()
    const name = useRef()
    const abbr = useRef()
    const type = useRef()
    const [values, setValues] = useState([])
    const [desc, setDesc] = useState([])
    const params = useParams()
    const [patient, setPatient] = useState()
    const [currentTest, setCurrentTest] = useState("Add New")
    const [parameters, setParameters] = useState([])
    const [add, setAdd] = useState(true)
    const [merge, setMerge] = useState(false)
    const [newTest, setNewTest] = useState(false)
    const [form, setForm] = useState({name: currentTest})
    const [mergeForm, setMergeForm] = useState({results: []})
    const [done, setDone] = useState(false)
    const [tests, setTests] = useState([])
    useEffect(()=>{
        async function getTests(){
            const res = await fetch('http://localhost:3000/api/getAll/tests')
            const body = await res.json()
            setTests(body)
        }
        getTests()
    },[])
    useEffect(()=>{
        async function getPatient(){
            const res = await fetch(`http://localhost:3000/api/find/${params?.id}`)
            const body = await res.json()
            setPatient(body)
        }
        getPatient()
    },[])
    useEffect(()=>{
        for (let i = 0; i < tests?.labTests?.length; i++) {
            if (tests?.labTests[i]?.name == currentTest){
                console.log(tests?.labTests[i])
                setParameters(tests?.labTests[i]?.parameters)
            }
        }
        for (let i = 0; i < tests?.scanTests?.length; i++) {
            if (tests?.scanTests[i]?.name == currentTest){
                setParameters(tests?.scanTests[i]?.parameters)
            }
        }
        if(currentTest == "Add New"){
            setAdd(true)
            setMerge(false)
            setNewTest(false)
        } else if(currentTest == "Merge Results"){
            setMerge(true)
            setAdd(false)
            setNewTest(false)
        } else if(currentTest == "Update Test"){
            setAdd(false)
            setMerge(false)
            setNewTest(true)
        } else{
            setAdd(false)
            setMerge(false)
            setNewTest(false)
        }
    },[currentTest, add])

    const toggle = (name)=>{
        setCurrentTest(name)
    }
    const handleChange = (e)=>{
        setForm({
            ...form,
            name: currentTest,
            [e.target.name] : e.target.value,
        })
    }
    const handleMergeChange = (e)=>{
        const newArray = [...mergeForm?.results, e?.target.name]
        setMergeForm({
            ...mergeForm,
            test: name?.current?.value,
            results : [...newArray],
        })
    }
    const handleUpdateChange = (e)=>{
        const newArray = [...mergeForm?.results, e?.target.value]
        setMergeForm({
            ...mergeForm,
            test: newArray[0],
        })
    }
    const updateTest = async() =>{
        setForm({
            ...form,
            name: currentTest
        })
        setDone(true)
        setTimeout(()=> {location.reload(true)}, 3000)
    }
    const addNew = async()=>{
        const res = await fetch(`http://localhost:3000/api/update/tests`, {
            method: 'PUT',
            body: JSON.stringify({
                name: name?.current.value,
                abbr: abbr?.current.value,
                parameters: [...values],
                type: type?.current.value,
                id: patient?.receiptNo
            }),
        })
        setTimeout(()=> {location.reload(true)}, 3000)
    }
    const updateNew = async()=>{
        const res = await fetch(`http://localhost:3000/api/update/tests/name`, {
            method: 'PUT',
            body: JSON.stringify({
                name: mergeForm?.test,
                parameters: [...values],
            }),
        })
        setTimeout(()=> {location.reload(true)}, 3000)
    }
    const mergeResults = async()=>{
        const res = await fetch(`http://localhost:3000/api/update/merge/${patient?.receiptNo}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: name?.current?.value,
                results: [...mergeForm?.results]
            })
        })
        setTimeout(()=> {location.reload(true)}, 3000)
    }
    const updateTests = async()=>{
        const res = await fetch(`http://localhost:3000/api/update/merge/${name?.current?.value}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: name?.current.value,
                parameters: [...values],
                type: type?.current.value,
                id: patient?.receiptNo
            })
        })
        setTimeout(()=> {location.reload(true)}, 3000)
    }
    const addValues = ()=>{
        setValues([...values, value?.current.value])
        value.current.value = ''
        console.log(value?.current.value)
    }
    const addDesc = ()=>{
        setDesc([...desc, value?.current.value])
        value.current.value = ''
        console.log(value?.current.value)
    }
    const removeDesc = (todo) =>{
        const newArray = [...desc]
        const removedItem = newArray.find(i => i == todo)
        const index = newArray.indexOf(removedItem)
        newArray.splice(index,1)
        setValues(newArray)
    }
    const removeValue = (todo) =>{
        const newArray = [...values]
        const removedItem = newArray.find(i => i == todo)
        const index = newArray.indexOf(removedItem)
        newArray.splice(index,1)
        setValues(newArray)
    }
    async function update(){
        const res = await fetch(`http://localhost:3000/api/update/${patient?.receiptNo}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...form,
                description : [...desc]
            }),
        })
        console.log(res)
    }

    useEffect(()=>{
        done && setTimeout(()=> update(), 3000)
    }, [done])
    console.log(mergeForm, values)
  return (
    <div className={styles.container}>
        <nav className={styles.nav}>
            <img src="/logo-hopkins.jpg" alt="logo" />
            <div className={styles.div}>
                <h3>Requested Tests</h3>
                <ol>
                    {patient?.requestedTests?.map((item, id)=>{
                            return(
                                <li key={id} onClick={()=>toggle(item)}>{item}</li>
                            )
                    })}
                    <li onClick={()=>toggle("Add New")}>Add New Test</li>
                    <li onClick={()=>toggle("Merge Results")}>Merge Results</li>
                    <li onClick={()=>toggle("Update Test")}>Update Test</li>
                </ol>
            </div>
        </nav>
        <section className={styles.main}>
            <h1>{currentTest}</h1>
            <form>
                <h3>Patient Details</h3>
                <section className={styles.details}>
                    <div>
                        <label htmlFor="age">Age: </label>
                        <p>{patient?.name}</p>
                    </div>
                    <div>
                        <label htmlFor="age">Age: </label>
                        <p>{patient?.age}</p>
                    </div>
                    <div>
                        <label htmlFor="gender">Gender: </label>
                        <p>{patient?.gender}</p>
                    </div>
                    <div>
                        <label htmlFor="lab_no">Lab No: </label>
                        <p>{patient?.labNo}</p>
                    </div>
                    <div>
                        <label htmlFor="receipt-no">Receipt No: </label>
                        <p>{patient?.receiptNo}</p>
                    </div>
                    <div>
                        <label htmlFor="referral">Referral: </label>
                        <p>{patient?.referral}</p>
                    </div>
                </section>
                <h3>Patient Results</h3>
                {(!add && !merge && !newTest) && <section className={styles.input}>
                    {parameters?.map((item, id)=>{
                           console.log(form)
                            return(
                                <div key={id}>
                                    <label htmlFor="hb">{item?.name}: </label>
                                    <input type="text" name={item?.name} onChange={(e)=>handleChange(e)}/>
                                </div> 
                            )
                        })}
                </section>}
                {(!add && !merge && !newTest) && <h3>Observations</h3>}
                {(!add && !merge && !newTest) && <section className={styles.textarea}>
                    <textarea name="description" id="description" cols="83" rows="10" placeholder="Write your observations... " onChange={(e)=>handleChange(e)}ref={value}></textarea>
                    <div className={styles.button} onClick={addDesc}>Add Description</div>
                    <div className={styles.todo}>
                        {desc?.map((item, id)=>{
                        return(
                            <p key={id} className={styles.todos}>{item}</p>
                        )
                    })}</div>
                </section>}
                {(!add && !merge && !newTest) && <div className={styles.button} onClick={updateTest}>Save Results</div>}
                {add && <section className={styles.input}>
                    <div>
                        <label htmlFor="hb">Test Name: </label>
                        <input type="text" name="name" ref={name}/>
                    </div> 
                    <div>
                        <label htmlFor="hb">Abbr: </label>
                        <input type="text" name="abbr" ref={abbr}/>
                    </div> 
                    <div>
                        <label htmlFor="type">Test Type: </label>
                        <select name="type" id="" ref={type}>
                            <option value="lab">Lab</option>
                            <option value="scan">Scan</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="values">Add Values: </label>
                        <input type="text" name="values" ref={value}/>
                        <span className={styles.button} onClick={addValues}>Add Value</span>
                    </div>   
                    <span className={styles.todo}>
                        {values?.map((item, id)=>{
                            return(
                                <div key={id} className={styles.todos}>
                                    <p >{item}</p>
                                    <div className={styles.todoButton} onClick={()=> removeValue(item)}>Remove</div>
                                </div>
                            )
                        })}
                    </span>
                </section>}
                {merge && <section className={styles.merge}>
                    <div>
                        <label htmlFor="hb">Result Name: </label>
                        <input type="text" name="name" ref={name}/>
                    </div> 
                    <section>
                        {patient?.requestedTests?.map((item,id)=>{
                            return(
                                <div key={id}>
                                    <input type="checkbox" name={item} onChange={(e)=>handleMergeChange(e)}/>
                                    <label htmlFor="hb">{item}</label>
                                </div>
                            )
                        })}
                    </section>
                    <div>
                        <span className={styles.button} onClick={mergeResults}>Merge</span>
                    </div>
                </section>}
                {add && <div className={styles.button} onClick={addNew}>Add New</div>}
                {newTest && <section className={styles.merge}>
                    <section>
                        {patient?.requestedTests?.map((item,id)=>{
                            return(
                                <div key={id}>
                                    <input type="radio" name="test" value={item} onChange={(e)=>handleUpdateChange(e)}/>
                                    <label htmlFor="hb">{item}</label>
                                </div>
                            )
                        })}
                    </section>
                    <div>
                        <label htmlFor="values">Add Values: </label>
                        <input type="text" name="values" ref={value}/>
                        <span className={styles.button} onClick={addValues}>Add Value</span>
                    </div>   
                    <span className={styles.todo}>
                        {values?.map((item, id)=>{
                            return(
                                <div key={id} className={styles.todos}>
                                    <p >{item}</p>
                                    <div className={styles.todoButton} onClick={()=> removeValue(item)}>Remove</div>
                                </div>
                            )
                        })}
                    </span>
                </section>}
                {newTest && <div className={styles.button} onClick={updateNew}>Update Test</div>}
                <Link href={"/create-patient"} className={styles.button}><div>Create Patient</div></Link>
                <Link href={"/find-patient"} className={styles.button}><div>Find Patient</div></Link>
            </form>
        </section>
    </div>
  )
}

export default Page