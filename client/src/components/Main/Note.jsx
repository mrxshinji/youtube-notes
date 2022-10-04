
export default function Note({ editNote, deleteNote, newNote, handleNewNote, addNote, currentNote, handleCurrentNote, isAdd, isEdit, toggleIsAdd, toggleIsEdit }) {




    return (
        <div className='note bg'>
            { !isAdd && !isEdit && (
            <div className="note-area">
                <div className="note-title">
                    <h1>{currentNote.title}</h1>
                    <div className="btns">
                        <button type="button" onClick={toggleIsAdd} className='add-btn' >Add</button>
                        <button type="button" onClick={toggleIsEdit} className='add-btn' >Edit</button>
                        <button type="button" className='add-btn' onClick={deleteNote} >Delete</button>
                    </div>
                </div>
                <hr />
                <div className="note-body">
                    <p>{currentNote.body}</p>
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