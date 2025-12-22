function AudioSection() {
  return (
    <div className="audio-container">
      <audio controls aria-describedby="audio-transcript">
        <source src="/bear.mp3" type="audio/mp3" />
        <source src="/bear.ogg" type="audio/ogg" />
        <p>
          It looks like your browser doesn't support HTML5 audio players. Please read the
          transcript below.
        </p>
      </audio>

      <div id="audio-transcript" className="audio-transcript">
        <h4>Audio Transcript</h4>
        <div className="transcript-content">
          <p>
            <strong>Duration:</strong> Approximately 30 seconds
          </p>
          <p>
            <strong>Content Description:</strong>
          </p>
          <ul>
            <li>
              <strong>0:00-0:10</strong> - Deep, resonant bear vocalizations (low-frequency grunts
              and huffs)
            </li>
            <li>
              <strong>0:10-0:20</strong> - Ambient forest sounds: rustling leaves, gentle wind
              through trees, distant bird calls
            </li>
            <li>
              <strong>0:20-0:30</strong> - Continuation of bear mating calls with increasing
              intensity, accompanied by natural woodland atmosphere
            </li>
          </ul>
          <p>
            <strong>Audio Purpose:</strong> This recording demonstrates typical vocalizations bears
            make during mating season, combined with their natural habitat soundscape.
          </p>
          <p>
            <strong>Note:</strong> These are authentic bear sounds recorded in a wildlife setting,
            representing communication patterns used to attract potential mates.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AudioSection;
