import React, { useState } from 'react';
import ChatKuro from './components/ChatKuro';
import TrackBlueprint from './components/TrackBlueprint';

function App() {
  const [finalPrompt, setFinalPrompt] = useState("");
  const [chatKey, setChatKey] = useState(0); // Para forçar o re-render do chat ao reiniciar

  const handleBlueprintComplete = (prompt) => {
    setFinalPrompt(prompt);
  };

  const handleRestart = () => {
    setFinalPrompt("");
    setChatKey(prev => prev + 1);
  };

  return (
    <div className="engine-container">
      {/* Esquerda: Chat com Mestre Kuro */}
      <ChatKuro key={chatKey} onComplete={handleBlueprintComplete} />

      {/* Direita: Resultado / Blueprint */}
      <TrackBlueprint prompt={finalPrompt} onRestart={handleRestart} />
    </div>
  );
}

export default App;
