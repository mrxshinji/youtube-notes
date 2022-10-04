import Video from './Video'
import "./Main.css";
import { useState, useRef, useEffect } from 'react';
import Note from './Note';
import axios from 'axios';
import NoteList from './NoteList';


export default function Main({currentSession, isSending, setIsSending}) {
    // Video play state
    const [isPlaying, setIsPlaying] = useState(false)
    // Video Player Reference
    const playerRef = useRef(null)
    
    // toggle player
    function togglePlayerOff() {
        setIsPlaying(false)
    }

    // State for list of notes
    const [notes, setNotes] = useState([])
    // State for current notes
    const [currentNote, setCurrentNote] = useState({})
    const baseNote = {
        title: 'No new note yet',
        body: 'No note yet',
        time: 0,
    }

    const getNote = () =>  {
        let getNotes = currentSession.notes.reverse()
        setNotes(getNotes);
        getNotes.length > 0 ? setCurrentNote(getNotes[0]) : setCurrentNote(baseNote);
    }

    // get notes from currentSession
    useEffect(() => {
        if (Object.keys(currentSession).length !== 0) {
            getNote();
        }
        return () => {
            if (!currentSession) console.log("Loading...");
        }
    },[currentSession])

    // handle  current note
    function handleCurrentNote(e) {
        const { name, value } = e.target;
        setCurrentNote(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    // new note
    const [newNote, setNewNote] = useState({
        title: '',
        body: '',
    })
    // handle new note
    function handleNewNote(e) {
        const { name, value} = e.target;
        setNewNote(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    // state of is Edit or is Add
    const [isAdd, setIsAdd] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    
    function toggleIsAdd() {
        setIsSending(prev => !prev)
        setIsAdd(prev => !prev)
    };

    function toggleIsEdit() {
        setIsSending(prev => !prev)
        setIsEdit(prev => !prev)
    };

    // add new note 
    async function addNote(event) {
        event.preventDefault();
        togglePlayerOff()
        const time = Math.floor(playerRef.current.getCurrentTime());
        const sessionId = currentSession._id
        setIsSending(true)
        await axios.post("http://localhost:3001/add/note", {...newNote, time, sessionId}).catch(error => console.log(error))
                    .then(res => {
                        setCurrentNote(res.data);
                        setNotes([res.data, ...notes]);
                    })
        setNewNote({title: '', body: ''})
        toggleIsAdd();
    }

    // delete new note
    async function deleteNote(event) {
        event.preventDefault();
        const sessionId = currentSession._id
        const noteId = currentNote._id
        setIsSending(true)
        await axios.post("http://localhost:3001/delete/note", {sessionId, noteId}).catch(error => console.log(error))
                    .then(res => {
                        console.log(res.data)
                        setNotes(notes => {
                            const filter = notes.filter(note => note._id !== noteId)
                            if (!(filter.includes(currentNote)) && filter.length !== 0) setCurrentNote(filter[0]);
                            if (filter.length === 0 ) setCurrentNote(baseNote);
                            return filter;
                    });
        })
        setIsSending(false)
    }

    // edit note 
    async function editNote(event) {
        event.preventDefault()
        togglePlayerOff()
        const time = Math.floor(playerRef.current.getCurrentTime());
        const sessionId = currentSession._id;
        setIsSending(true);
        await axios.post("http://localhost:3001/update/note", {...currentNote, time, sessionId}).catch(error => console.log(error))
        .then(res => {
            console.log(res.data)
            setNotes(notes => {
                const findIndex = notes.findIndex(el => el._id === currentNote._id)
                notes[findIndex].title = currentNote.title;
                notes[findIndex].body = currentNote.body;
                notes[findIndex].time = time;
                setCurrentNote(notes[findIndex])
                return notes;
            })

        })
        toggleIsEdit();
    }
  
    // return main
    if (currentNote === undefined) {
        return <>Still Loading....</>
    }
    return (
        <main>
            <Video 
                currentSession={currentSession} 
                isPlaying={isPlaying} 
                playerRef={playerRef}
                currentNote={currentNote}
            />
            <Note 
                currentNote={currentNote}
                handleCurrentNote={handleCurrentNote}
                setIsSending={setIsSending}
                newNote={newNote}
                handleNewNote={handleNewNote}
                isAdd={isAdd}
                toggleIsAdd={toggleIsAdd}
                isEdit={isEdit}
                toggleIsEdit={toggleIsEdit}
                addNote={addNote}
                deleteNote={deleteNote}
                editNote={editNote}
            />
            <NoteList 
                notes={notes}
                setCurrentNote={setCurrentNote}
                playerRef={playerRef}
            />
        </main>
    )
}