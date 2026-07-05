import React from 'react';

function TrackBlueprint({ prompt, onRestart }) {
  return (
    <div className="panel magenta-glow" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <span className="magenta-text">⚙️ COMPOSITION BLUEPRINT</span>
      </div>
      
      {prompt ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="blueprint-display">
            <div className="blueprint-header">🎵 TRACK BLUEPRINT (PROMPT SUNO AI)</div>
            {prompt}
          </div>
          <button className="restart-btn" onClick={onRestart}>Nova Track</button>
        </div>
      ) : (
        <div className="blueprint-display" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
          Aguardando parâmetros do Mestre Kuro...
        </div>
      )}
    </div>
  );
}

export default TrackBlueprint;
