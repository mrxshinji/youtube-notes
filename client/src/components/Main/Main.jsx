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
                setCurrentNote={setCurrentNote}
                notes={notes}
                setNotes={setNotes}
                isSending={isSending}
                setIsSending={setIsSending}
                currentSession={currentSession}
                playerRef={playerRef}
                togglePlayerOff={togglePlayerOff}
                baseNote={baseNote}
            />
            <NoteList 
                notes={notes}
                setCurrentNote={setCurrentNote}
                playerRef={playerRef}
            />
        </main>
    )
}