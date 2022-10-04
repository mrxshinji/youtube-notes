import React, { useState } from "react";
import axios from 'axios';
import "./SectionList.css"

export default function SectionList({isSending, setIsSending, data, setData, currentSession, getData, setCurrentSession, deleteSession}) {
  
  //add bar toggle
  const [addBar, setAddBar] = useState(false)
  function toggleAddBar() {
    setAddBar(prev => !prev)
  }
  
  // Session 
  const [session, setSession] = useState(
    {
      sessionName: "",
      link: "",
    })

  // handle Session Form
  function handleSessionForm(event) {
    const { name, value } = event.target;
    setSession(prev => {
      return {
        ...prev,
        [name]: value
      };
    });
  }

  // add session 
  async function addSession(e) {
    e.preventDefault()
    setIsSending(true)
    await axios.post("http://localhost:3001/add", session).then((res => {
      setCurrentSession(res.data)
      setData([res.data, ...data])
    }))
    setIsSending(false)
    toggleAddBar()
    setSession({sessionName: '', link: ''})
  }



  // Return Sectionlist
    return (
        <header>
            {/* session list map from data */}
            <div className='section-list bg'>
                <nav className='section-bar'>
                    <ul className='section-menu'>
                    { data.map((item, idx) => {
                        return (
                          <div key={idx} className='section-item'>
                            <li className={`${(currentSession._id === item._id) ? "active" : ""}`} >
                              <button type="button" onClick={() => getData(idx)} disabled={isSending}>{idx + 1}. {item.session}</button>
                            </li>
                            <button type='button' disabled={isSending} onClick={deleteSession} id={item._id} className='delete-session'><span className='minus'></span></button>
                          </div>
                        )
                    }) 
                    }
                    </ul>
                </nav>
                {/* form to add new session */}
                {/* TODO VALIDATIOn required */}
                <div className='new-session' style={ {backgroundColor: addBar ? "#39B3C4" : "#288389"}}>
                    <button id="add-session" onClick={toggleAddBar}><span className={`add ${addBar ? "active" : ""}`}></span></button>
                    { addBar && (
                    <form onSubmit={addSession}  >
                        <label htmlFor='session'>Session Name</label>
                        <input autoFocus={`${toggleAddBar}`} autoComplete='false' type='text' name='sessionName' placeholder='Session Name...' onChange={handleSessionForm} value={session.sessionName}/>
                        <label htmlFor='sessionLink'>Youtube Link</label>
                        <input type='text' name='link' placeholder='Paste Youtube URL here...' onChange={handleSessionForm} value={session.link}/>
                        <input type='submit' name="submit" disabled={isSending} value="Add Session" className='add-btn' />
                    </form>
                  )}
                </div>
            </div>
        </header>
    )
}