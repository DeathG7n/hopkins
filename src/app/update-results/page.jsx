'use client'

import styles from "./page.module.css"
import { useEffect, useState, useRef } from "react"
import { useRouter } from 'next/navigation';
import Link from "next/link"
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";

const ReactQuill = dynamic(()=> import('react-quill'), {ssr: false})

function Page() {
    const value = useRef()
    const name = useRef()
    const abbr = useRef()
    const type = useRef()
    const [values, setValues] = useState([])
    const [desc, setDesc] = useState("")
    const [patient, setPatient] = useState()
    const [currentTest, setCurrentTest] = useState("Results")
    const [currentResult, setCurrentResult] = useState({})
    const [parameters, setParameters] = useState([])
    const [result, setResult] = useState(false)
    const [results, setResults] = useState(false)
    const [create, setCreate] = useState(false)
    const [add, setAdd] = useState(true)
    const [merge, setMerge] = useState(false)
    const [newTest, setNewTest] = useState(false)
    const [form, setForm] = useState({name: currentTest})
    const [mergeForm, setMergeForm] = useState({results: []})
    const [done, setDone] = useState(false)
    const [tests, setTests] = useState([])
    const [items, setItems] = useState([])
    const [show, setShow] = useState(false)
    const [testShow, setTestShow] = useState(false)
    const [resultShow, setResultShow] = useState(false)
    useEffect(()=>{
        async function getTests(){
            const res = await fetch('/api/getAll/tests')
            const body = await res.json()
            setTests(body)
        }
        getTests()
    },[])
    useEffect(()=>{
        const id = localStorage.getItem("id")
        async function getPatient(){
            const res = await fetch(`/api/find/${id}`)
            const body = await res.json()
            setPatient(body)
        }
        getPatient()
    },[])
    useEffect(()=>{
        for (let i = 0; i < tests?.labTests?.length; i++) {
            if (tests?.labTests[i]?.name == currentTest){
                setParameters(tests?.labTests[i]?.parameters)
            }
            if (tests?.labTests[i]?.name == currentResult?.name){
                setParameters(tests?.labTests[i]?.parameters)
            }
        }
        for (let i = 0; i < tests?.scanTests?.length; i++) {
            if (tests?.scanTests[i]?.name == currentTest){
                setParameters(tests?.scanTests[i]?.parameters)
            }
            if (tests?.scanTests[i]?.name == currentResult?.name){
                setParameters(tests?.scanTests[i]?.parameters)
            }
        }
        if(currentTest == "Create New"){
            setCreate(true)
            setMerge(false)
            setNewTest(false)
            setResult(false)
            setAdd(false)
            setResults(false)
        } else if(currentTest == "Merge Tests"){
            setMerge(true)
            setCreate(false)
            setNewTest(false)
            setResult(false)
            setAdd(false)
            setResults(false)
        } else if(currentTest == "Update Test"){
            setCreate(false)
            setMerge(false)
            setNewTest(true)
            setResult(false)
            setAdd(false)
            setResults(false)
        } else if(currentTest == "Add"){
            setCreate(false)
            setMerge(false)
            setNewTest(false)
            setResult(false)
            setAdd(true)
            setResults(false)
        } else if(currentTest == "Results"){
            setCreate(false)
            setMerge(false)
            setNewTest(false)
            setResult(false)
            setAdd(false)
            setResults(true)
        } else{
            setCreate(false)
            setMerge(false)
            setNewTest(false)
            setResult(true)
            setAdd(false)
            setResults(false)
        }
    },[currentTest, add, tests?.labTests, tests?.scanTests, currentResult])

    const toggle = (name, no,item)=>{
        if(name == ""){
            setShow(!show)
        } else if(name == "results"){
            setResultShow(!resultShow)
        } else if(name == "tests"){
            setTestShow(!testShow)
        }else{
            setCurrentTest(name)
            localStorage.setItem("receiptNo", no)
            setCurrentResult(item)
        } 
    }
    const handleChange = (e)=>{
        setForm({
            ...form,
            name: currentTest,
            [e.target.name] : e.target.value,
        })
    }
    const handleMergeChange = (e)=>{
        const newArray = [...items]
        if(e.target?.checked == false ){
            const removedItem = newArray.find(i => i == e?.target.name)
            const index = newArray.indexOf(removedItem)
            newArray.splice(index,1)
            setItems(newArray)
        } else{
            setItems(items => [...items, e?.target.name])
        }
        setMergeForm({
            ...mergeForm,
            test: name?.current?.value,
            results : [...items],
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
        const res = await fetch(`/api/update/tests`, {
            method: 'PUT',
            body: JSON.stringify({
                name: name?.current.value,
                abbr: abbr?.current.value,
                parameters: [...values],
                type: type?.current.value,
                id: patient?.receiptNo
            }),
        })
        setTimeout(()=> {location.reload(true)}, 1000)
    }
    const updateNew = async()=>{
        const res = await fetch(`/api/update/tests/name`, {
            method: 'PUT',
            body: JSON.stringify({
                name: mergeForm?.test,
                parameters: [...values],
            }),
        })
        setTimeout(()=> {location.reload(true)}, 1000)
    }
    const mergeResults = async()=>{
        const res = await fetch(`/api/update/merge/${patient?._id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: name?.current?.value,
                results: [...items],
                receiptNo: value?.current?.value
            })
        })
        setTimeout(()=> {location.reload(true)}, 1000)
    }
    const addValues = ()=>{
        setValues([...values, value?.current.value])
        value.current.value = ''
    }
    const addDesc = ()=>{
        setDesc([...desc, value?.current.value])
        value.current.value = ''
    }
    const removeDesc = (todo) =>{
        const newArray = [...desc]
        const removedItem = newArray.find(i => i == todo)
        const index = newArray.indexOf(removedItem)
        newArray.splice(index,1)
        setDesc(newArray)
    }
    const removeValue = (todo) =>{
        const newArray = [...values]
        const removedItem = newArray.find(i => i == todo)
        const index = newArray.indexOf(removedItem)
        newArray.splice(index,1)
        setValues(newArray)
    }
    async function update(){
        const date = new Date()
        const receiptNo = localStorage.getItem("receiptNo")
        const res = await fetch(`/api/update/${patient?._id}`, {
            method: 'PUT',
            body: JSON.stringify({
                results : {
                    ...form,
                    description : desc,
                    createdAt: date.toDateString(),
                },
                receiptNo: receiptNo
            }),
        })
    }

    useEffect(()=>{
        done && setTimeout(()=> update(), 1000)
    }, [done])
  return (
    <div className={styles.container}>
        <nav className={styles.nav}>
            <img src="/logo-hopkins.jpg" alt="logo" />
            <div className={styles.div}>
                <h3>{patient?.name}</h3>
                <ul>
                    <li onClick={()=>toggle("")}>Requested Tests<span>{show ? "-" : "+"}</span></li>
                    {show && <section className={styles?.section}>
                        {patient?.tests?.map((item, id)=>{
                            return(
                                <>
                                    <Tests key={id} item={item} toggle={toggle}/>
                                </> 
                            )
                        })}
                    </section>}
                    <li onClick={()=>toggle("results")}>Results   <span>{resultShow ? "-" : "+"}</span></li>
                    {resultShow && <section className={styles?.section}>
                        {patient?.results?.map((item, id)=>{
                            return(
                                <>
                                    <Result key={id} item={item} toggle={toggle}/>
                                </>
                                
                            )
                        })}
                    </section>}
                    {/* <li onClick={()=>toggle("Create New")}>Create New Test</li> */}
                    <li onClick={()=>toggle("Add")}>Add Test</li>
                    <li onClick={()=>toggle("Merge Tests")}>Merge Tests</li>
                    <li onClick={()=>toggle("Update Test")}>Update Test</li>
                </ul>
            </div>
        </nav>
        <section className={styles.main}>
            <h1>{currentTest}</h1>
            <form>
                <h3>Patient Details</h3>
                <section className={styles.details}>
                    <div>
                        <label htmlFor="age">Name: </label>
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
                        <label htmlFor="referral">Referral: </label>
                        <p>{patient?.referral}</p>
                    </div>
                </section>
                <h3>Patient Results</h3>
                {result && <section className={styles.input}>
                    {parameters?.map((item, id)=>{
                            return(
                                <div key={id}>
                                    <label htmlFor="hb">{item?.name}: </label>
                                    <input type="text" name={item?.name} onChange={(e)=>handleChange(e)}/>
                                </div> 
                            )
                    })}
                </section>}
                {result && <h3>Observations</h3>}
                {result && <section >
                    <ReactQuill theme="snow" value={desc} onChange={setDesc} className={styles.textarea}/>
                </section>}
                {result && <div className={styles.button} onClick={updateTest}>Save Results</div>}
                {results && <Results 
                    currentResult={currentResult}
                    parameters={parameters}
                />}
                {add && <Add 
                    lab={tests?.labTests}
                    scan={tests?.scanTests}
                    patient={patient}
                />}
                {/* {add && <Add/>} */}
                {create && <Create
                    name={name}
                    abbr={abbr}
                    value={value}
                    type={type}
                    values={values}
                    handleClick={addValues}
                    handleRemove={removeValue}
                    handleAdd={addNew}
                />}
                {merge && <Merge 
                    name={name}
                    value={value}
                    patient={patient}
                    handleChange={handleMergeChange}
                    handleClick={mergeResults}
                />}
                {newTest && <Update
                    patient = {patient}
                    value = {value}
                    addValues = {addValues}
                    values = {values}
                    updateNew = {updateNew}
                    handleChange={handleUpdateChange}
                    handleClick={removeValue}
                />}
                <Link href={"/create-patient"} className={styles.button}><div>Create Patient</div></Link>
                <Link href={"/find-patient"} className={styles.button}><div>Find Patient</div></Link>
            </form>
        </section>
    </div>
  )
}

export default Page

export const Tests = ({item, toggle}) => {
    const [show, setShow] = useState(false)
    const handleClick = () =>{
        setShow(!show)
    }
    return(
        <>
            <p onClick={handleClick}>{item?.receiptNo}<span>{show ? "-" : "+"}</span></p>
            {show && <div>
                {item?.requestedTests?.map((test,id)=>{
                    return(
                        <p key={id} onClick={()=>toggle(test, item?.receiptNo)}>{test}</p>
                    )
                })}
            </div> }
        </>
    )
}
export const Result = ({item, toggle}) => {
    const [show, setShow] = useState(false)
    const handleClick = () =>{
        setShow(!show)
    }
    console.log(item)
    return(
        <>
            <p onClick={handleClick}>{item?.receiptNo}<span>{show ? "-" : "+"}</span></p>
            {show && <div>
                {item?.results?.map((result,id)=>{
                    return(
                        <p key={id} onClick={()=>toggle("Results", item?.receiptNo, result)}>{result?.name}<span>{result?.createdAt}</span></p>
                    )
                })}
            </div> }
        </>
    )
}


export const Update = ({patient,value,addValues,values,updateNew, handleChange, handleClick}) => {
    return(
        <>
            <section className={styles.merge}>
                <section>
                    {patient?.tests?.map((item,id)=>{
                        return(
                            <span key={id}>
                                <h4>{item?.receiptNo}</h4>
                                <span>
                                    {item?.requestedTests?.map((test, id)=>{
                                        return(
                                            <div key={id}>
                                                <input type="radio" name="test" value={test} onChange={(e)=>handleChange(e)}/>
                                                <label htmlFor="hb">{test}</label>
                                            </div>
                                        )
                                    })}
                                </span>
                            </span>
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
                                <div className={styles.todoButton} onClick={()=> handleClick(item)}>Remove</div>
                            </div>
                        )
                    })}
                </span>
            </section>
            <div className={styles.button} onClick={updateNew}>Update Test</div>
        </>
    )
}

export const Merge = ({name, patient, handleChange, handleClick, value}) =>{
    return(
        <section className={styles.merge}>
            <div>
                <label htmlFor="hb">Result Name: </label>
                <input type="text" name="name" ref={name}/>
            </div> 
            <div>
                <label htmlFor="hb">Receipt No: </label>
                <input type="text" name="receipt" ref={value}/>
            </div> 
            <section>
                {patient?.tests?.map((item,id)=>{
                    return(
                        <span key={id}>
                            <h4>{item?.receiptNo}</h4>
                            <span>
                                {item?.requestedTests?.map((test, id)=>{
                                    return(
                                        <div key={id}>
                                            <input type="checkbox" name={test} value={test} onChange={(e)=>handleChange(e)}/>
                                            <label htmlFor="hb">{test}</label>
                                        </div>
                                    )
                                })}
                            </span>
                        </span>
                    )
                })}
            </section>
            <div>
                <span className={styles.button} onClick={handleClick}>Merge</span>
            </div>
        </section>

    )
}

export const Add = ({lab, scan, patient}) => {
    const [labSearch, setLabSearch] = useState([])
    const [scanSearch, setScanSearch] = useState([])
    const tests = [...labSearch, ...scanSearch]
    const [requested, setRequested] = useState([])
    const receipt = useRef()
    const handleChange = (e) =>{
        const names = lab?.map(i => {return i?.name})
        const labs = names?.filter(i => i.toLowerCase()?.includes(e?.target?.value.toLowerCase()))
        setLabSearch(labs)
        const items = scan?.map(i => {return i?.name})
        const scans = items?.filter(i => i.toLowerCase()?.includes(e?.target?.value.toLowerCase()))
        setScanSearch(scans)
    }
    const handleAdd = (e)=>{
        const newArray = [...requested]
        if(e.target?.checked == false ){
            const removedItem = newArray.find(i => i == e?.target.name)
            const index = newArray.indexOf(removedItem)
            newArray.splice(index,1)
            setRequested(newArray)
        } else{
            setRequested(requested => [...requested, e?.target.name])
        } 
    }
    const handleSubmit = async(id) =>{
        const data = {
            receiptNo : receipt.current.value,
            requestedTests : [...requested]
        }
        const res = await fetch(`/api/update/result/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
        setTimeout(()=> {location.reload(true)}, 1000)
    }
    return(
        <div>
            <section className={styles.add}>
                <div>
                    <input type="search"  onChange={(e)=>handleChange(e)} placeholder="Search for test" className={styles.search} />
                    <input type="text" placeholder="Add Receipt No" name="receiptNo" className={styles.search} ref={receipt}/>
                </div>
                <main className={styles.tests}>
                    <div className={styles.test}>
                       {tests?.map((item,id)=>{
                            return(
                                <span key={id}>
                                    <input type="checkbox" name={item} id={item?.name} onChange={(e)=>handleAdd(e)} checked={requested?.includes(item)}/>
                                    <label htmlFor="">{item}</label>
                                </span>
                            )
                        })} 
                    </div>
                    <section className={styles.show}>
                        <ul>
                            {requested?.map((item, id)=>{
                                return(
                                    <li key={id}>{item}</li>
                                )
                            })}
                        </ul>
                        <div className={styles.button} onClick={()=> handleSubmit(patient?._id)}>Add Test</div>
                    </section>
                </main>
            </section>
        </div>
    )
}

export const Create = ({name, abbr, type, value,values, handleClick, handleRemove, handleAdd}) => {
    return(
        <>
            <section className={styles.input}>
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
                    <span className={styles.button} onClick={handleClick}>Add Value</span>
                </div>   
                <span className={styles.todo}>
                    {values?.map((item, id)=>{
                        return(
                            <div key={id} className={styles.todos}>
                                <p >{item}</p>
                                <div className={styles.todoButton} onClick={()=> handleRemove(item)}>Remove</div>
                            </div>
                        )
                    })}
                </span>
            </section>
            <div className={styles.button} onClick={handleAdd}>Add New</div>
        </>
    )
}

export const Results = ({parameters, currentResult}) => {
    const admin = localStorage.getItem("admin")
    const router = useRouter();
    const handleClick = (name) =>{
        localStorage.setItem("name", JSON.stringify(name))
        // router.push("/result")
    }
    console.log(currentResult?.description)
    return(
        <section className={styles.input}>
            {currentResult?.createdAt != undefined && <p><span className={styles.span}>Created On</span> : {currentResult?.createdAt}</p>}
            {parameters?.map((item, id)=>{
                const type = currentResult?.[item?.name] != undefined 
                return(
                    <>
                        {type && <div key={id} className={styles.result}>
                            <label htmlFor="hb">{item?.name}: </label>
                        <p>{currentResult?.[item?.name]}</p>
                        </div>}
                    </>
                )
            })}
            {currentResult?.description?.[0] != undefined  ? <h3>Impression</h3> : ""}
            <div>
                {<div dangerouslySetInnerHTML={{ __html: currentResult?.description }} />}
            </div>
            {admin == "true" && <Link href={"/result"} target="_blank" className={styles.button} onClick={()=>handleClick(currentResult)}>Print</Link>}
        </section>
    )
}