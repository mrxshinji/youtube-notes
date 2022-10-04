import ReactPlayer from 'react-player/youtube'

export default function Video({ currentSession, isPlaying, playerRef}) {


    return (
        <div className='video bg'>
            <ReactPlayer 
                url={currentSession.link}
                width="80%"
                height="91.3%"
                playing={isPlaying}
                controls={true}
                ref={playerRef}
            />
        </div>
    )
}