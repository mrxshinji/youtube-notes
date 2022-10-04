import axios from "axios";
import { useState } from "react";


export default function Note({ currentNote, setCurrentNote, notes, setNotes, isSending, setIsSending, currentSession, playerRef, togglePlayerOff, baseNote}) {
    
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
        const sessionId = currentSession._id;
        const noteId = currentNote._id;
        setIsSending(true);
        await axios.post("http://localhost:3001/delete/note", {sessionId, noteId}).catch(error => console.log(error))
                    .then(res => {
                        console.log(res.data)
                        setNotes(notes => {
                            const filter = notes.filter(note => note._id !== noteId);
                            if (!(filter.includes(currentNote)) && filter.length !== 0) setCurrentNote(filter[0]);
                            if (filter.length === 0 ) setCurrentNote(baseNote);
                            return filter;
                        });
                    })
        setIsSending(false);
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
                const findIndex = notes.findIndex(el => el._id === currentNote._id);
                notes[findIndex].title = currentNote.title;
                notes[findIndex].body = currentNote.body;
                notes[findIndex].time = time;
                setCurrentNote(notes[findIndex]);
                return notes;
            })

        })
        toggleIsEdit();
    }

    if (currentNote === undefined) {
        return (<>Still Loading....</>);
    };
    return (
        <div className='note bg'>
            { !isAdd && !isEdit && (
            <div className="note-area">
                <div className="note-title">
                    <h1>{currentNote.title}</h1>
                    <div className="btns">
                        <button type="button" disabled={isSending} onClick={toggleIsAdd} className='add-btn' >Add</button>
                        <button type="button" disabled={isSending} onClick={toggleIsEdit} className='add-btn' >Edit</button>
                        <button type="button" disabled={isSending} className='add-btn' onClick={deleteNote} >Delete</button>
                    </div>
                </div>
                <hr />
                <div className="note-body">
                    <p className='wrap'>{currentNote.body}</p>
                </div>
            </div>
            )}
            {/* ADD NOTE FORM */}
            {isAdd && (
            <form className="note-form" onSubmit={addNote}>
                <div className='note-title'>
                    <input type='text' autoFocus name="title" placeholder='Note Title' onChange={handleNewNote} value={newNote.title} />
                    <div className='btns'>
                        <button type="button" onClick={toggleIsAdd} className='add-btn' id='toggler'>Back</button>
                        <button type="submit" className='add-btn' >Add</button>
                    </div>
                </div>
                <textarea name="body" placeholder='Insert your notes here' onChange={handleNewNote} value={newNote.body} />
            </form>
            )}
            {/* EDIT FORM */}
            {isEdit && (
            <form className="note-form" onSubmit={editNote}>
                <div className='note-title'>
                    <input type='text' autoFocus name="title" placeholder='Note Title' onChange={handleCurrentNote} value={currentNote.title} />
                    <div className='btns'>
                        <button type="button" onClick={toggleIsEdit} className='add-btn' id='toggler'>Back</button>
                        <button type="submit" className='add-btn'>Update</button>
                    </div>
                </div>
                <textarea name="body" placeholder='Insert your notes here' onChange={handleCurrentNote} value={currentNote.body} />
            </form>
            )}

        </div>
    )
}