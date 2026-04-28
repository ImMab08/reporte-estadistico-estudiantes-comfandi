"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { IconSmartToy, IconUploadFile } from "@/src/shared/icons";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

export function YumbamigoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "¡Hola! Soy Yumbamigo, tu asistente académico. Sube un documento (PDF o Word) y hazme cualquier pregunta sobre él. Estoy aquí para ayudarte."
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const newMessage: Message = { id: Date.now().toString(), role: "user", content: inputValue };
    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "bot",
        content: "Aún no estoy conectado al backend de procesamiento RAG. Por favor integra la API para que pueda procesar tus documentos y responder preguntas reales."
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  }
  
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <section className="size-full bg-slate-50 p-4 flex flex-col overflow-hidden">
      <header className="mb-4 border-b border-border py-3.25 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
            <IconSmartToy className="size-10" /> Yumbamigo
          </h1>
          <p className="text-slate-500 mt-1 mb-1">
            Asistente Académico Inteligente (RAG)
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            alt="Logo Comfandi"
            width={150}
            height={150}
            className="object-contain"
            src="/img/logo/logo_comfandi_blue.svg"
          />
        </div>
      </header>

      <section className="gap-4 flex flex-1 min-h-0 overflow-hidden rounded-xl">
        {/* Main Chat Area */}
        <section className="p-0 w-full min-h-0 overflow-hidden bg-white border border-border rounded-xl flex flex-col relative">
          
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                   {msg.role === 'bot' && <div className="text-xs text-primary font-bold mb-1 flex items-center gap-1"><IconSmartToy width={14} height={14} /> Yumbamigo</div>}
                   {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="bg-slate-100 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                   <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                   <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                 </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-50 border-t border-border mt-auto">
            <div className="flex items-center gap-3 bg-white p-2 rounded-full border border-slate-300 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <button 
                title="Subir documento"
                onClick={() => alert("Función para subir documento: Próximamente se integrará el componente para cargar PDFs/Word hacia el backend RAG.")}
                className="p-2 ml-1 text-slate-400 hover:text-primary transition-colors bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center"
              >
                <IconUploadFile className="size-6" />
              </button>
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pregúntale algo a Yumbamigo sobre tus documentos..." 
                className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 placeholder:text-slate-400 px-2"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-5 py-2.5 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </div>
            <p className="text-xs text-center text-slate-400 mt-3 font-medium">Yumbamigo puede cometer errores. Considera verificar la información importante en los documentos originales.</p>
          </div>

        </section>

        {/* Right Sidebar - Document context / Settings */}
        <aside className="w-80 min-h-0 bg-white border border-border rounded-xl hidden xl:flex flex-col overflow-hidden">
           <div className="p-4 border-b border-border bg-slate-50">
             <h3 className="font-semibold text-slate-700">Contexto Actual</h3>
           </div>
           <div className="p-6 flex-1 flex flex-col items-center justify-center text-center text-slate-500 overflow-hidden">
             <IconUploadFile className="size-16 text-slate-300 mb-4" />
             <p className="text-sm">No hay documentos cargados en esta sesión.</p>
             <p className="text-xs mt-2 text-slate-400">Sube un reporte, currículo o manual para empezar a interactuar.</p>
           </div>
        </aside>
      </section>
    </section>
  );
}
