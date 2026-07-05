import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { collection, addDoc, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../firebase';

// COLE SUA CHAVE DA API DO GOOGLE GEMINI AQUI
const API_KEY = "COLE_SUA_CHAVE_GEMINI_AQUI"; 
const genAI = new GoogleGenerativeAI(API_KEY);

function ChatKuro({ onComplete }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      loadBrainContext();
    }
  }, []);

  const loadBrainContext = async () => {
    try {
      // Exemplo: carrega os ultimos 5 prompts gerados do "Cérebro" para dar contexto ao Kuro
      // (Em um ambiente real as regras de seguranca do Firestore precisam estar configuradas)
      const q = query(collection(db, "kuro_memory"), orderBy("timestamp", "desc"), limit(5));
      const querySnapshot = await getDocs(q).catch(() => null); // catch no caso do firebase nao estar configurado ainda
      
      let pastKnowledge = "";
      if (querySnapshot) {
         querySnapshot.forEach((doc) => {
            pastKnowledge += doc.data().prompt + "\\n";
         });
      }

      addKuroMessage("Saudações. Eu sou o Mestre Kuro. Meu cérebro está conectado e absorvendo conhecimento da rede. Qual o estilo musical e a vibe da track que vamos criar hoje?");
    } catch (e) {
      console.warn("Firebase não configurado ainda. Rodando em modo local sem memória.");
      addKuroMessage("Saudações. Eu sou o Mestre Kuro. Qual o estilo musical e a vibe da track que vamos criar hoje?");
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const addKuroMessage = (text) => {
    setMessages(prev => [...prev, { sender: 'kuro', text }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { sender: 'user', text }]);
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    
    const userText = input.trim();
    addUserMessage(userText);
    setInput("");
    setIsGenerating(true);

    try {
      if (API_KEY === "COLE_SUA_CHAVE_GEMINI_AQUI") {
        setTimeout(() => {
          addKuroMessage("Aviso: A minha chave da API Gemini não foi configurada no código. Por favor adicione a chave no ChatKuro.jsx para habilitar meu cérebro generativo.");
          setIsGenerating(false);
        }, 1000);
        return;
      }

      // Preparando o modelo generativo
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `Você é o Mestre Kuro, um especialista em engenharia de áudio e produção musical focado em Psytrance, Techno e Eletrônica. 
      O usuário quer criar uma música. Faça perguntas detalhadas sobre andamento (BPM), bassline, sintetizadores e efeitos.
      Se o usuário já deu todos os detalhes necessários (ou parece satisfeito), responda começando EXATAMENTE com a palavra "BLUEPRINT:" seguida de um prompt em inglês detalhado e formatado para a Suno AI.
      Caso contrário, faça apenas mais uma ou duas perguntas para refinar.
      
      Mensagem do usuário: ${userText}`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      if (response.startsWith("BLUEPRINT:")) {
        const finalPrompt = response.replace("BLUEPRINT:", "").trim();
        addKuroMessage("Excelente! Absorvi essas informações. O Blueprint foi gerado e salvo em meu cérebro.");
        
        // Salva no "cérebro"
        try {
          await addDoc(collection(db, "kuro_memory"), {
            prompt: finalPrompt,
            user_input: userText,
            timestamp: new Date()
          });
        } catch(e) {
          console.warn("Erro ao salvar no Firestore (Firebase Config pendente).", e);
        }

        onComplete(finalPrompt);
      } else {
        addKuroMessage(response);
      }

    } catch (error) {
      console.error(error);
      addKuroMessage("Minhas conexões neurais falharam (Erro na API). Verifique as chaves ou tente novamente.");
    }

    setIsGenerating(false);
  };

  return (
    <div className="panel cyan-glow" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <span className="cyan-text">🧠 ASSISTENTE IA: MESTRE KURO (GEMINI)</span>
      </div>
      
      <div className="chat-container" style={{ flexGrow: 1 }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            {msg.sender === 'kuro' ? '🐉 Kuro: ' : '👤 Você: '}<br/>
            {msg.text}
          </div>
        ))}
        {isGenerating && <div className="chat-message kuro">Pensando...</div>}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Fale com o Mestre Kuro..."
          style={{ 
            flexGrow: 1, 
            padding: '10px', 
            background: 'rgba(0,0,0,0.5)', 
            border: '1px solid rgba(0, 243, 255, 0.5)', 
            color: 'white',
            borderRadius: '4px',
            fontFamily: 'inherit'
          }} 
        />
        <button className="chat-btn" onClick={handleSend} disabled={isGenerating}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default ChatKuro;
