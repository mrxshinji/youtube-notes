

export default function NoteList({ notes, setCurrentNote, playerRef}) {

    function thisNote(note) {
        setCurrentNote(note)
        playerRef.current.seekTo(note.time, 'seconds')
    }

    return (
        <div className='note-list bg'>
            <ul className='noteList-menu'>
                {
                    notes.map((note, idx) => {
                        return (
                            <li key={idx}>
                                <button type='button' onClick={() => {thisNote(note)}}>{note.title}</button>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}