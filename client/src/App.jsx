import './App.css';
import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import SectionList from './components/SectionList/SectionList';
import Main from './components/Main/Main';

function App() {
  // init fetch data
  const [data, setData] = useState([])
  const [apiError, setApiError] = useState(null)
  const [isSending, setIsSending] = useState(false)
  
  // init current data Session ID
  const [currentSession, setCurrentSession] = useState({
    session: '',
    link: '',
    notes: [],
  })

  // mount state and clean mount state
  const mountedRef = useRef(false)
  useEffect(() => {
      mountedRef.current = true;
      return () => (mountedRef.current = false);
  }, [])
    
  // API DATA
  const getData = async (idx) => {
    const res = await axios.get("http://localhost:3001/api").catch(error => {setApiError(error)});
    setData(res.data);
    setCurrentSession(res.data[idx])
  }
  useEffect(() => {
    getData(0);
    
  }, [])

  // delete session
  const deleteSession = useCallback( async (event) => {
    let id = {id: event.currentTarget.id};
    if (isSending) return;
    setIsSending(true);
    await axios.post("http://localhost:3001/delete", id).catch(error => {setApiError(error)});
    setData(items => {
        const filter = items.filter(item => {
          return item._id !== id.id;
        });
        if (!(filter.includes(currentSession))) setCurrentSession(filter[0]);
        return filter;
    });
    setIsSending(false);
  },[isSending, currentSession] );

  //debug
  // console.log(data)
  // console.log(currentSession)
  
  // Error
  console.log(`Error:\n${apiError}`)

  // Return
    if (data === undefined) return <> Still Loading....</>
    return (
      <div className="container">
        <SectionList 
          data={data} 
          getData={getData}
          setData={setData} 
          currentSession={currentSession} 
          setCurrentSession={setCurrentSession} 
          isSending={isSending} 
          setIsSending={setIsSending} 
          deleteSession={deleteSession}  
        />
        <Main 
          currentSession={currentSession} 
          isSending={isSending}
          setIsSending={setIsSending}
          setCurrentSession={setCurrentSession}
        />
      </div>  
    );
}

export default App;
