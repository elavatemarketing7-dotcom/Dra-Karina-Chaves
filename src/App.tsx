/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  MapPin, 
  Instagram, 
  Play, 
  Pause, 
  ArrowRight, 
  Heart, 
  CheckCircle2,
  Star,
  MessageSquare,
  Lock,
  Compass,
  Volume2,
  VolumeX
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { 
  EXPERT_INFO, 
  QUIZ_QUESTIONS, 
  BEFORE_AFTER_GALLERY, 
  HEART_GALLERY, 
  TRUST_DIFFERENTIALS, 
  CONSULTATION_STEPS, 
  TESTIMONIALS 
} from "./data";

export default function App() {
  // Navigation states
  const [quizOpen, setQuizOpen] = useState(true);
  const [quizStep, setQuizStep] = useState<"gate" | number | "analyzing" | "result">("gate");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  
  // Video playback
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Lightbox
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Auto scroll effect on marquee (visual purposes)
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Scroll to section handler
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Quiz Navigation
  const handleStartQuiz = () => {
    setQuizStep(0);
    setActiveQuestionIdx(0);
  };

  const handleAnswerSelect = (questionId: number, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: option }));
    
    // Automatically move to next question or analyze
    if (activeQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setActiveQuestionIdx(prev => prev + 1);
      }, 300);
    } else {
      // Last question completed - start analyzing transition
      setTimeout(() => {
        setQuizStep("analyzing");
      }, 300);
    }
  };

  const handlePreviousQuestion = () => {
    if (activeQuestionIdx > 0) {
      setActiveQuestionIdx(prev => prev - 1);
    } else {
      setQuizStep("gate");
    }
  };

  // Analyze simulation
  useEffect(() => {
    if (quizStep === "analyzing") {
      const timer = setTimeout(() => {
        setQuizStep("result");
      }, 2200); // 2.2 seconds analysis bar
      return () => clearTimeout(timer);
    }
  }, [quizStep]);

  // Video Sound Toggle
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Autoplay video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true);
      }).catch(err => {
        console.log("Video autoplay blocked by browser, playing muted", err);
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(e => console.log("Muted autoplay also blocked", e));
        }
      });
    }
  }, []);

  // Generate WhatsApp text with Quiz results
  const getWhatsAppQuizLink = () => {
    let summary = `Olá Dra. Karina Chaves! Concluí o Mapeamento Facial Interativo no seu site e fui aprovada como Paciente Ideal. 

📋 *MINHA AVALIAÇÃO:*`;
    
    QUIZ_QUESTIONS.forEach((q) => {
      const ans = selectedAnswers[q.id] || "Não selecionado";
      summary += `\n*• ${q.question}*\n👉 _${ans}_`;
    });

    summary += `\n\nGostaria de enviar minha avaliação e agendar uma consulta personalizada!`;
    return `https://wa.me/${EXPERT_INFO.phoneNumber}?text=${encodeURIComponent(summary)}`;
  };

  const getGeneralWhatsAppLink = () => {
    const text = `Olá Dra. Karina Chaves! Visitei seu site e gostaria de saber mais informações sobre os procedimentos de Harmonização Facial e agendar uma consulta.`;
    return `https://wa.me/${EXPERT_INFO.phoneNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-dark overflow-x-hidden selection:bg-brand-gold-light selection:text-brand-dark">
      
      {/* 1. QUIZ / GATE OVERLAY (STAY OVER MAIN CONTENT UNTIL DISMISSED) */}
      <AnimatePresence>
        {quizOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 overflow-y-auto"
            id="quiz-overlay"
          >
            <div className="relative w-full max-w-sm bg-brand-cream border border-brand-gold/40 rounded-2xl p-4 sm:p-5 shadow-2xl my-auto text-center overflow-hidden">
              
              {/* Top brand header visible throughout quiz */}
              <div className="mb-3 flex flex-col items-center">
                <span className="font-serif italic text-brand-gold text-base tracking-widest uppercase">
                  {EXPERT_INFO.name}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-brand-dark/50 mt-0.5">
                  Exclusividade & Naturalidade
                </span>
              </div>

              {/* FLOATING EXPERT PHOTO IN MINI GOLD FRAME (ALWAYS APPARENT OR START OF QUIZ) */}
              <div className="relative mx-auto mb-3 w-14 h-14 rounded-full border border-brand-gold p-0.5 shadow-md bg-brand-cream-dark overflow-hidden flex items-center justify-center">
                <img 
                  src={EXPERT_INFO.images.hero} 
                  alt="Dra Karina Chaves" 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 bg-brand-gold text-white text-[8px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider leading-none">
                  Dra. Karina
                </div>
              </div>

              {/* CLOSE OVERLAY / SKIP BUTTON */}
              <button 
                onClick={() => setQuizOpen(false)}
                className="absolute top-3 right-3 text-brand-dark/40 hover:text-brand-dark p-1 rounded-full hover:bg-brand-gold/10 transition-colors"
                title="Ir direto para o site"
              >
                <X className="w-5 h-5" />
              </button>

              {/* GATE STEP (Initial option screen) */}
              {quizStep === "gate" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <h2 className="font-serif text-xl sm:text-2xl text-brand-dark leading-tight">
                    Avaliação Facial Personalizada
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-dark/70 leading-relaxed max-w-xs mx-auto">
                    Descubra em menos de 1 minuto se o método exclusivo de rejuvenescimento e harmonização natural da Dra. Karina é o ideal para você.
                  </p>

                  <div className="space-y-2 pt-1">
                    {/* PRIMARY ACTION: START QUIZ */}
                    <button
                      onClick={handleStartQuiz}
                      className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white font-medium py-3 px-4 rounded-xl shadow-md transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 text-sm"
                    >
                      <span>Iniciar Diagnóstico Exclusivo</span>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </button>

                    {/* DIRECT TO WEBSITE */}
                    <button
                      onClick={() => setQuizOpen(false)}
                      className="w-full bg-white hover:bg-brand-cream-dark border border-brand-gold/25 text-brand-dark font-medium py-2.5 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2"
                    >
                      <span>Entrar Direto no Site</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* DIRECT WHATSAPP */}
                    <a
                      href={getGeneralWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[11px] text-brand-gold hover:text-brand-gold-dark underline tracking-wider uppercase font-semibold transition-all pt-1"
                    >
                      Falar por WhatsApp sem compromisso
                    </a>
                  </div>
                </motion.div>
              )}

              {/* ACTIVE QUIZ QUESTIONS */}
              {typeof quizStep === "number" && (
                <motion.div
                  key={quizStep}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="space-y-3.5"
                >
                  {/* Progress Indicators */}
                  <div className="flex items-center justify-between text-[11px] text-brand-dark/50 px-0.5">
                    <button 
                      onClick={handlePreviousQuestion}
                      className="flex items-center gap-0.5 hover:text-brand-dark font-medium transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Voltar
                    </button>
                    <span>Pergunta {activeQuestionIdx + 1} de {QUIZ_QUESTIONS.length}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-brand-cream-dark h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-gold h-full transition-all duration-300 rounded-full"
                      style={{ width: `${((activeQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    />
                  </div>

                  {/* Question */}
                  <h3 className="font-serif text-base sm:text-lg text-brand-dark leading-snug px-1 text-center font-medium">
                    {QUIZ_QUESTIONS[activeQuestionIdx].question}
                  </h3>

                  {/* Touch Optimized Options list */}
                  <div className="space-y-1.5 pt-1">
                    {QUIZ_QUESTIONS[activeQuestionIdx].options.map((option, idx) => {
                      const isSelected = selectedAnswers[QUIZ_QUESTIONS[activeQuestionIdx].id] === option;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSelect(QUIZ_QUESTIONS[activeQuestionIdx].id, option)}
                          className={`w-full text-left py-2.5 px-3 rounded-lg border text-xs sm:text-sm font-normal transition-all duration-200 flex items-center justify-between ${
                            isSelected 
                              ? "bg-brand-gold text-white border-brand-gold shadow-sm"
                              : "bg-white text-brand-dark border-brand-gold/15 hover:border-brand-gold hover:bg-brand-cream-dark"
                          }`}
                        >
                          <span className="pr-2 leading-tight">{option}</span>
                          <span className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? "border-white bg-white text-brand-gold" : "border-brand-gold/20"
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 fill-brand-gold text-white" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ANALYZING STEP */}
              {quizStep === "analyzing" && (
                <div className="py-8 space-y-4 flex flex-col items-center">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 border-3 border-brand-gold/20 rounded-full" />
                    <div className="absolute inset-0 border-3 border-t-brand-gold rounded-full animate-spin" />
                    <Sparkles className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-lg text-brand-dark animate-pulse">Analisando...</h3>
                    <p className="text-[10px] text-brand-dark/50 uppercase tracking-widest">Avaliando compatibilidade com o Método</p>
                  </div>
                  <div className="w-40 bg-brand-cream-dark h-1 rounded-full overflow-hidden mx-auto">
                    <div className="bg-brand-gold h-full animate-[marquee_2s_linear_infinite] w-1/3 rounded-full" />
                  </div>
                </div>
              )}

              {/* RESULT PAGE */}
              {quizStep === "result" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3.5 text-center"
                >
                  <div className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-0.5 animate-bounce">
                    ✨ Perfil Compatível. Você é a Paciente ideal.
                  </div>

                  {/* Sophisticated Result Headline */}
                  <h3 className="font-serif text-sm sm:text-base text-brand-dark leading-snug px-1 font-medium">
                    "Com base nas suas respostas, o Método da Dra. Karina Chaves consegue entregar exatamente a naturalidade e segurança que você procura."
                  </h3>

                  <p className="text-[11px] text-brand-dark/60 leading-relaxed max-w-xs mx-auto">
                    Detectamos alta elegância de simetria facial no seu plano. Para assegurar seu padrão estético, clique abaixo para formalizar seu contato.
                  </p>

                  {/* 3 Grouped action buttons compact and clear */}
                  <div className="space-y-1.5 pt-2">
                    {/* BUTTON 1: ENVIAR AVALIAÇÃO A DRA (WhatsApp formatted) */}
                    <a
                      href={getWhatsAppQuizLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold py-2.5 px-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm animate-pulse hover:animate-none"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>1- Enviar minha avaliação à DRA</span>
                    </a>

                    {/* BUTTON 2: CHAMAR NO WHATSAPP SEM COMPROMISSO */}
                    <a
                      href={getGeneralWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-white hover:bg-brand-cream-dark border border-emerald-500/25 text-emerald-700 font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 text-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                      <span>2- Chamar no WhatsApp Sem Compromisso</span>
                    </a>

                    {/* BUTTON 3: NÃO ENVIAR E CONTINUAR NO SITE */}
                    <button
                      onClick={() => {
                        setQuizOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="w-full bg-transparent hover:bg-brand-gold/10 text-brand-dark/60 hover:text-brand-dark py-1.5 px-3 rounded-lg text-[10px] font-medium tracking-wide transition-colors"
                    >
                      3- NÃO ENVIAR E CONTINUAR NO SITE
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. STICKY TOP TICKER / NAVIGATION RIBBON */}
      <div className="sticky top-0 z-40 bg-brand-dark text-brand-gold-light border-b border-brand-gold/10 shadow-sm overflow-hidden h-11 flex items-center">
        <div className="w-full relative flex items-center">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs font-medium uppercase tracking-widest select-none cursor-pointer">
            {/* Nav Links formatted inside the scrolling band */}
            <span onClick={() => scrollToSection("sobre-mim")} className="hover:text-white transition-colors py-1 px-3 bg-white/5 rounded-full border border-brand-gold/10">
              Dra. Karina Chaves
            </span>
            <span className="text-brand-gold/30">•</span>
            <span onClick={() => scrollToSection("sobre-mim")} className="hover:text-white transition-colors">
              Sobre mim
            </span>
            <span className="text-brand-gold/30">•</span>
            <span onClick={() => scrollToSection("prova-visual")} className="hover:text-white transition-colors">
              Prova Visual (Antes/Depois)
            </span>
            <span className="text-brand-gold/30">•</span>
            <span onClick={() => scrollToSection("harmonizacao-coracao")} className="hover:text-white transition-colors flex items-center gap-1">
              Harmonização de <Heart className="w-3 h-3 text-red-400 fill-red-400 inline" />
            </span>
            <span className="text-brand-gold/30">•</span>
            <span onClick={() => scrollToSection("onde-encontrar")} className="hover:text-white transition-colors">
              Onde nos Encontrar
            </span>
            <span className="text-brand-gold/30">•</span>
            <span onClick={() => scrollToSection("contato")} className="hover:text-white transition-colors">
              Contato
            </span>

            {/* Repetir para o efeito infinito funcionar suavemente */}
            <span className="text-brand-gold/30">•</span>
            <span onClick={() => scrollToSection("sobre-mim")} className="hover:text-white transition-colors py-1 px-3 bg-white/5 rounded-full border border-brand-gold/10">
              Dra. Karina Chaves
            </span>
            <span className="text-brand-gold/30">•</span>
            <span onClick={() => scrollToSection("sobre-mim")} className="hover:text-white transition-colors">
              Sobre mim
            </span>
            <span className="text-brand-gold/30">•</span>
            <span onClick={() => scrollToSection("prova-visual")} className="hover:text-white transition-colors">
              Prova Visual
            </span>
            <span className="text-brand-gold/30">•</span>
            <span onClick={() => scrollToSection("harmonizacao-coracao")} className="hover:text-white transition-colors flex items-center gap-1">
              Harmonização de <Heart className="w-3 h-3 text-red-400 fill-red-400 inline" />
            </span>
            <span className="text-brand-gold/30">•</span>
            <span onClick={() => scrollToSection("onde-encontrar")} className="hover:text-white transition-colors">
              Onde nos Encontrar
            </span>
            <span className="text-brand-gold/30">•</span>
            <span onClick={() => scrollToSection("contato")} className="hover:text-white transition-colors">
              Contato
            </span>
          </div>
        </div>
      </div>

      {/* FLOAT BUTTON FOR QUIZ RESTORATION (IF CLOSED) */}
      {!quizOpen && (
        <button
          onClick={() => {
            setQuizStep("gate");
            setQuizOpen(true);
          }}
          className="fixed bottom-6 right-6 z-40 bg-brand-dark text-brand-gold border border-brand-gold/30 shadow-2xl rounded-full p-4 hover:scale-105 transition-all flex items-center gap-2 hover:bg-brand-dark/95"
        >
          <Sparkles className="w-5 h-5 text-brand-gold animate-bounce" />
          <span className="text-xs font-bold uppercase tracking-widest pr-1">Refazer Diagnóstico</span>
        </button>
      )}

      {/* MAIN WEBSITE WRAPPER */}
      <main className="w-full">
        
        {/* SECTION 1: HERO (FIRST DOBRA) */}
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 md:py-20 bg-gradient-to-b from-brand-cream to-brand-cream-dark">
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* Left/Top Area: Headline Text & CTA */}
            <div className="md:col-span-7 space-y-6 text-center md:text-left order-2 md:order-1">
              <span className="inline-block bg-brand-gold/15 text-brand-gold-dark font-semibold text-xs tracking-widest uppercase px-4 py-2 rounded-full border border-brand-gold/25">
                Harmonização Facial Exclusiva
              </span>
              
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-dark leading-[1.15] tracking-tight">
                Eu sou a <span className="text-brand-gold-dark block sm:inline">{EXPERT_INFO.name}</span>. Ajudo você a recuperar sua juventude com naturalidade.
              </h1>

              <p className="font-sans text-base sm:text-lg text-brand-dark/70 leading-relaxed max-w-xl mx-auto md:mx-0">
                O rejuvenescimento autêntico é sobre recuperar o contorno, o volume e a firmeza perdidos ao longo do tempo, sem descaracterizar seus traços únicos ou parecer artificial.
              </p>

              {/* Botão principal de CTA */}
              <div className="pt-2">
                <a 
                  href={getGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-3 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold text-base py-4.5 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Agendar consulta no whatsapp</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
                <p className="text-xs text-brand-dark/40 tracking-wider uppercase mt-3 font-medium">
                  🔒 sem compromisso • Atendimento Particular Premium
                </p>
              </div>

              {/* Minimalist Trust Signals */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-gold/20 max-w-md mx-auto md:mx-0">
                <div className="text-center md:text-left">
                  <div className="text-xl sm:text-2xl font-serif font-bold text-brand-gold-dark">100%</div>
                  <div className="text-[10px] text-brand-dark/60 uppercase tracking-wider">Naturalidade</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-xl sm:text-2xl font-serif font-bold text-brand-gold-dark">5★</div>
                  <div className="text-[10px] text-brand-dark/60 uppercase tracking-wider">Acompanhamento</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-xl sm:text-2xl font-serif font-bold text-brand-gold-dark">+1.2k</div>
                  <div className="text-[10px] text-brand-dark/60 uppercase tracking-wider">Rostos Cuidados</div>
                </div>
              </div>
            </div>

            {/* Right Area: Expert Main Photo with luxury framing */}
            <div className="md:col-span-5 order-1 md:order-2 flex justify-center">
              <div className="relative w-64 sm:w-72 md:w-80 h-[380px] sm:h-[420px] rounded-t-[140px] rounded-b-3xl border border-brand-gold/30 p-2 shadow-2xl bg-white">
                <div className="absolute inset-2 rounded-t-[132px] rounded-b-[20px] overflow-hidden bg-brand-cream-dark">
                  <img 
                    src={EXPERT_INFO.images.hero} 
                    alt="Dra Karina Chaves Harmonização Facial" 
                    className="w-full h-full object-cover transform hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Visual badge */}
                <div className="absolute -bottom-4 -left-4 bg-brand-dark text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-brand-gold/20 max-w-[180px]">
                  <Award className="w-8 h-8 text-brand-gold shrink-0" />
                  <div className="text-left">
                    <p className="text-[9px] text-brand-gold font-bold uppercase tracking-widest leading-none">MÉTODO EXCLUSIVO</p>
                    <p className="text-xs font-semibold leading-tight mt-1 text-white/90">Dra. Karina Chaves</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: DESTACANDO PROCEDIMENTO (VIDEO + COPY EXCLUSIVA) */}
        <section className="bg-brand-dark text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Subtle gold backdrop lights */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* Left: Beautiful Presentation Video Playback Container */}
            <div className="md:col-span-6 flex flex-col items-center">
              <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-gold/40 bg-black aspect-[9/16] group">
                
                {/* HTML5 Native Video element targeting the imgur MP4 link with autoplay enabled */}
                <video
                  ref={videoRef}
                  src={EXPERT_INFO.videoUrl}
                  className="w-full h-full object-cover"
                  loop
                  autoPlay
                  muted={isMuted}
                  playsInline
                />

                {/* Sleek Sound/Volume Control overlay - Touch optimized */}
                <div className="absolute inset-x-0 bottom-6 flex justify-center px-4 z-10 pointer-events-none">
                  <button 
                    onClick={toggleMute}
                    className="pointer-events-auto bg-brand-gold hover:bg-brand-gold-dark backdrop-blur-md text-white font-semibold text-xs sm:text-sm py-2.5 px-4.5 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 border border-white/20"
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="w-4 h-4 text-white shrink-0" />
                        <span>Ativar Som</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-white shrink-0 animate-pulse" />
                        <span>Silenciar</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Small indicator inside video */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[10px] uppercase tracking-widest text-brand-gold-light pointer-events-none">
                  Procedimento Real
                </div>
              </div>
            </div>

            {/* Right: Persuasive text for presentation */}
            <div className="md:col-span-6 space-y-6 text-center md:text-left">
              <span className="text-brand-gold font-semibold text-xs tracking-widest uppercase block">
                Harmonia em Movimento
              </span>
              
              <h2 className="font-serif text-2xl sm:text-3xl text-brand-cream leading-tight">
                Como funciona a aplicação exclusiva?
              </h2>

              <p className="font-sans text-brand-cream-dark/80 text-sm sm:text-base leading-relaxed">
                Descubra como a beleza pode ser realçada com técnica, sensibilidade e propósito. Resultados naturais e transformadores. Aperte o play e sinta a diferença de ser cuidada por quem entende que sua beleza é única, e merece atenção especial.
              </p>

              <div className="pt-2 space-y-3">
                <div className="flex items-start gap-3 justify-center md:justify-start">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-brand-cream-dark/60 text-left">Respeito estrito às proporções faciais douradas</p>
                </div>
                <div className="flex items-start gap-3 justify-center md:justify-start">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-brand-cream-dark/60 text-left">Materiais reabsorvíveis e certificados internacionalmente</p>
                </div>
                <div className="flex items-start gap-3 justify-center md:justify-start">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-brand-cream-dark/60 text-left">Cuidado humanizado e acompanhamento pós-procedimento</p>
                </div>
              </div>

              <div className="pt-2 text-center md:text-left">
                <a
                  href={getGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light font-semibold text-sm uppercase tracking-wider border-b border-brand-gold/40 pb-1 transition-all"
                >
                  <span>Desejo um resultado como esse no meu rosto</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: BLOCO "QUEM SOU EU" (AUTORIDADE PESSOAL) */}
        <section id="sobre-mim" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-cream-dark relative">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            
            {/* Left: About expert image with premium offset border */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative">
                {/* Offset elegant decorative gold box */}
                <div className="absolute -top-4 -left-4 w-full h-full border-2 border-brand-gold/30 rounded-3xl pointer-events-none" />
                
                <div className="relative w-64 sm:w-72 md:w-80 h-[380px] sm:h-[420px] rounded-3xl overflow-hidden shadow-xl bg-brand-cream border border-brand-gold/15">
                  <img 
                    src={EXPERT_INFO.images.about} 
                    alt="Dra Karina Chaves Autoridade Estética" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white text-left">
                    <p className="text-[10px] text-brand-gold uppercase font-bold tracking-widest">DRA KARINA CHAVES</p>
                    <p className="text-sm font-medium opacity-90 mt-1">Sua beleza em mãos de máxima responsabilidade médica e artística.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Narrative Story */}
            <div className="md:col-span-7 space-y-6 text-center md:text-left">
              <span className="text-brand-gold-dark font-semibold text-xs tracking-widest uppercase block">
                Por Trás do Método
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark leading-tight">
                Ciência, Arte e o Respeito pela sua Identidade Única
              </h2>

              <p className="text-brand-dark/70 text-sm sm:text-base leading-relaxed">
                Sou a <strong>Dra. Karina Chaves</strong>, especialista dedicada em Harmonização Facial em São Paulo. Desenvolvi um método exclusivo focado em rejuvenescimento que foge completamente de padrões artificiais de clínicas comerciais de franquia.
              </p>

              <p className="text-brand-dark/70 text-sm sm:text-base leading-relaxed">
                Acredito que harmonizar não é preencher de forma indiscriminada. É devolver as estruturas de suporte que o tempo desgastou, devolvendo o olhar descansado, o contorno limpo e a pele radiante que você sempre teve.
              </p>

              {/* Bullet Differentiators */}
              <div className="space-y-3 pt-3">
                <div className="flex gap-3 justify-center md:justify-start">
                  <div className="w-6 h-6 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold-dark shrink-0">
                    <Heart className="w-3.5 h-3.5 fill-brand-gold-dark" />
                  </div>
                  <p className="text-xs sm:text-sm text-brand-dark/80 text-left">
                    <strong>Atendimento Sob Medida:</strong> Consultas longas, com planejamento individualizado de acordo com seu perfil.
                  </p>
                </div>
                <div className="flex gap-3 justify-center md:justify-start">
                  <div className="w-6 h-6 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold-dark shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs sm:text-sm text-brand-dark/80 text-left">
                    <strong>Técnicas Menos Invasivas:</strong> Foco em alta performance, conforto anestésico e recuperação rápida.
                  </p>
                </div>
                <div className="flex gap-3 justify-center md:justify-start">
                  <div className="w-6 h-6 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold-dark shrink-0">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs sm:text-sm text-brand-dark/80 text-left">
                    <strong>Localização Premium:</strong> Espaço privativo e seguro em São Paulo, focado em total discrição.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a 
                  href={getGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-dark hover:bg-brand-dark/95 text-white font-medium text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-lg transition-all"
                >
                  <span>Saber mais sobre o meu atendimento</span>
                  <ArrowRight className="w-4 h-4 text-brand-gold" />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4: BLOCO "RESULTADOS REAIS" (PROVA VISUAL ANTES E DEPOIS) */}
        <section id="prova-visual" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-cream relative">
          <div className="max-w-5xl mx-auto text-center space-y-4 mb-12">
            <span className="text-brand-gold-dark font-semibold text-xs tracking-widest uppercase">
              Galeria Exclusiva
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark">
              Resultados de Transformação Real
            </h2>
            <p className="text-brand-dark/60 text-xs sm:text-sm max-w-lg mx-auto">
              Clique em qualquer uma das imagens para visualizar o padrão estético em tela cheia com detalhes de simetria facial.
            </p>
          </div>

          {/* Sliding Carousel of Before and After (ANTES E DEPOIS) */}
          <div className="relative w-full overflow-hidden py-4">
            {/* Elegant Gradient overlays to fade the edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-brand-cream to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-brand-cream to-transparent z-10 pointer-events-none" />
            
            <div className="animate-marquee flex gap-4 select-none">
              {[...BEFORE_AFTER_GALLERY, ...BEFORE_AFTER_GALLERY].map((img, idx) => (
                <div 
                  key={`${img.id}-${idx}`}
                  onClick={() => setLightboxImage(img.url)}
                  className="w-48 h-48 sm:w-64 sm:h-64 shrink-0 relative group rounded-2xl overflow-hidden border border-brand-gold/15 bg-brand-cream-dark cursor-pointer shadow-sm hover:shadow-lg hover:border-brand-gold/40 transition-all duration-300"
                >
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                    <p className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-full border border-white/20">
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Ver Zoom
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-md mx-auto text-center mt-6">
            <p className="text-[10px] text-brand-dark/40 uppercase tracking-widest leading-relaxed">
              ⚠️ Resultados podem variar de pessoa para pessoa. Todos os casos são avaliados individualmente de acordo com a fisionomia e biotipo do paciente.
            </p>
          </div>
        </section>

        {/* SECTION 5: BLOCO "POR QUE CONFIAR EM MIM" */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-cream-dark">
          <div className="max-w-5xl mx-auto text-center space-y-4 mb-12">
            <span className="text-brand-gold-dark font-semibold text-xs tracking-widest uppercase">
              Pilares de Confiança
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark">
              Por que escolher o Método da Dra. Karina?
            </h2>
            <p className="text-brand-dark/60 text-sm max-w-md mx-auto">
              Estabeleço compromisso absoluto com a sua autoestima através de processos seguros e claros.
            </p>
          </div>

          {/* Differentiators Grid */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
            {TRUST_DIFFERENTIALS.map((diff) => {
              // Icon selector mapper
              const renderIcon = () => {
                switch(diff.icon) {
                  case "Sparkles": return <Sparkles className="w-6 h-6 text-brand-gold" />;
                  case "ShieldCheck": return <ShieldCheck className="w-6 h-6 text-brand-gold" />;
                  case "UserCheck": return <UserCheck className="w-6 h-6 text-brand-gold" />;
                  case "Award": return <Award className="w-6 h-6 text-brand-gold" />;
                  default: return <Sparkles className="w-6 h-6 text-brand-gold" />;
                }
              };

              return (
                <div 
                  key={diff.id}
                  className="bg-white p-6 rounded-2xl border border-brand-gold/10 shadow-sm space-y-4 text-center md:text-left hover:border-brand-gold/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-cream-dark flex items-center justify-center mx-auto md:mx-0 shadow-inner">
                    {renderIcon()}
                  </div>
                  <h3 className="font-serif text-lg text-brand-dark font-medium leading-snug">
                    {diff.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-dark/70 leading-relaxed">
                    {diff.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 6: CTA INTERMEDIÁRIO (REPETIR CTA COM FOCO EM OBJEÇÕES) */}
        <section className="bg-brand-dark text-white py-16 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.08)_0%,transparent_100%)] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-cream leading-tight">
              Ainda tem dúvidas se a Harmonização é para você?
            </h2>
            <p className="text-brand-cream-dark/70 text-sm leading-relaxed max-w-lg mx-auto">
              Realizo uma análise minuciosa prévia sem pressões comerciais. Você escolhe apenas o que te fizer sentir segura e confortável.
            </p>
            
            <div className="pt-2">
              <a
                href={getGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-3 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-md"
              >
                <MessageSquare className="w-5 h-5 fill-white text-brand-gold" />
                <span>Conversar direto por WhatsApp</span>
              </a>
              <p className="text-[10px] uppercase tracking-widest text-brand-gold-light mt-3">
                Resposta rápida e humanizada pela equipe da Dra. Karina
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 7: HARMONIZAÇÃO DE <3 (TAB OU GALERIA DE CORAÇÃO DE_VERDADE) */}
        <section id="harmonizacao-coracao" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-cream relative">
          <div className="max-w-5xl mx-auto text-center space-y-4 mb-12">
            <span className="text-brand-gold-dark font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-1.5">
              Harmonização de <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark">
              Momentos de Cuidado Real
            </h2>
            <p className="text-brand-dark/60 text-xs sm:text-sm max-w-lg mx-auto">
              Sessões pensadas no bem-estar extremo de cada paciente, capturando a essência de cuidar com amor.
            </p>
          </div>

          {/* Sliding Carousel of Heart Gallery (💙) */}
          <div className="relative w-full overflow-hidden py-4">
            {/* Elegant Gradient overlays to fade the edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-brand-cream to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-brand-cream to-transparent z-10 pointer-events-none" />
            
            <div className="animate-marquee flex gap-4 select-none">
              {[...HEART_GALLERY, ...HEART_GALLERY].map((img, idx) => (
                <div 
                  key={`${img.id}-${idx}`}
                  onClick={() => setLightboxImage(img.url)}
                  className="w-48 h-48 sm:w-64 sm:h-64 shrink-0 relative group rounded-2xl overflow-hidden border border-brand-gold/15 bg-brand-cream-dark cursor-pointer shadow-sm hover:shadow-lg hover:border-brand-gold/40 transition-all duration-300"
                >
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                    <p className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-full border border-white/20">
                      <Heart className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" /> Ampliar
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8: COMO FUNCIONA A PRIMEIRA CONSULTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-cream-dark">
          <div className="max-w-5xl mx-auto text-center space-y-4 mb-12">
            <span className="text-brand-gold-dark font-semibold text-xs tracking-widest uppercase">
              Sua Jornada
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark">
              Sua Primeira Consulta Estética
            </h2>
            <p className="text-brand-dark/60 text-sm max-w-md mx-auto">
              Simplicidade, total segurança médica e absoluto conforto em três passos descomplicados.
            </p>
          </div>

          {/* Consultation steps */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Elegant connection lines for desktop only */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-brand-gold/30 to-brand-gold/30 z-0 pointer-events-none" />

            {CONSULTATION_STEPS.map((step, idx) => (
              <div 
                key={idx}
                className="relative z-10 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-16 h-16 rounded-full bg-brand-dark text-brand-gold border border-brand-gold/20 flex items-center justify-center font-serif text-xl font-bold shadow-lg">
                  {step.step}
                </div>
                <h3 className="font-serif text-lg font-medium text-brand-dark pt-1">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-dark/70 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 9: DEPOIMENTOS DE PACIENTES */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-cream border-t border-brand-gold/10">
          <div className="max-w-5xl mx-auto text-center space-y-4 mb-12">
            <span className="text-brand-gold-dark font-semibold text-xs tracking-widest uppercase">
              Relatos Espontâneos
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark">
              Quem já viveu o Método Comprova
            </h2>
          </div>

          {/* Testimonial grid */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div 
                key={t.id}
                className="bg-white p-6 rounded-2xl border border-brand-gold/10 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex gap-1 text-brand-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-brand-dark/80 italic leading-relaxed">
                    "{t.text}"
                  </p>
                </div>
                
                <div className="pt-2 border-t border-brand-gold/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-brand-dark">{t.name}</h4>
                    <p className="text-[10px] text-brand-dark/40 uppercase tracking-wider">{t.age}</p>
                  </div>
                  <span className="bg-brand-cream-dark text-brand-gold-dark text-[9px] font-semibold uppercase tracking-wider px-2 py-1 rounded">
                    {t.procedure}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 10: ONDE NOS ENCONTRAR (MAPA DE ENDEREÇO CLÍNICA LÁ EM BAIXO) */}
        <section id="onde-encontrar" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-brand-cream-dark">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* Left address details */}
            <div className="md:col-span-5 space-y-6 text-center md:text-left">
              <span className="text-brand-gold-dark font-semibold text-xs tracking-widest uppercase block">
                Localização e Contato
              </span>
              
              <h2 className="font-serif text-3xl text-brand-dark leading-tight">
                Espaço Privativo no Coração de São Paulo
              </h2>

              <p className="text-brand-dark/70 text-sm sm:text-base leading-relaxed">
                Nosso consultório está localizado em uma das regiões mais seguras e nobres de São Paulo, projetado para oferecer total discrição, silêncio e conforto absoluto durante as suas consultas de rejuvenescimento facial.
              </p>

              {/* Icon markers info */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 justify-center md:justify-start">
                  <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-1" />
                  <div className="text-left">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-brand-dark">Endereço de Atendimento</h4>
                    <p className="text-sm text-brand-dark/80 mt-0.5">São Paulo, SP - Brasil (Bairro Jardins/Itaim Bibi - Privativo)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 justify-center md:justify-start">
                  <Instagram className="w-5 h-5 text-brand-gold shrink-0 mt-1" />
                  <div className="text-left">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-brand-dark">Instagram Oficial</h4>
                    <a 
                      href={EXPERT_INFO.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand-gold hover:text-brand-gold-dark font-semibold underline mt-0.5 block"
                    >
                      @drakarinachaves
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Embedded Interactive Map frame */}
            <div className="md:col-span-7">
              <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-brand-gold/30 shadow-xl bg-white relative">
                
                {/* Embedded dynamic luxury map preview targeting São Paulo SP */}
                <iframe 
                  title="Consultório Dra Karina Chaves"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117021.28291410711!2d-46.73243171891104!3d-23.57018318712396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce597d462f23b1%3A0x258b387796982f09!2zU8OjbyBQYXVsbywgU1A!5e0!3m2!1spt-BR!2sbr!4v1710925000000!5m2!1spt-BR!2sbr" 
                  className="w-full h-full"
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Glassmorphism address float badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-brand-gold/20 flex items-center justify-between shadow-lg text-left">
                  <div>
                    <h5 className="text-[10px] uppercase tracking-widest font-bold text-brand-gold-dark">Agende Sua Visita</h5>
                    <p className="text-xs text-brand-dark/80 font-medium mt-1">Clique para traçar rota de chegada pelo GPS</p>
                  </div>
                  <a
                    href="https://maps.google.com/?q=São+Paulo,+SP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-dark text-white hover:bg-brand-gold transition-colors px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest"
                  >
                    Rotas
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 11: CTA FINAL (DECISÃO) */}
        <section id="contato" className="py-20 px-4 text-center bg-brand-dark text-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(197,168,128,0.15)_0%,transparent_80%)] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <span className="text-brand-gold font-semibold text-xs tracking-widest uppercase block animate-pulse">
              Dê o primeiro passo para sua melhor versão
            </span>
            
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-cream leading-tight">
              Sua beleza merece sensibilidade. Agende sua consulta particular hoje.
            </h2>
            
            <p className="text-brand-cream-dark/70 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              Recupere a fisionomia rejuvenescida e autêntica de forma segura e elegante. Fale diretamente com nossa equipe no canal preferencial de agendamento.
            </p>

            <div className="pt-4 space-y-3">
              <a 
                href={getGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-3 bg-brand-gold hover:bg-brand-gold-dark text-white font-bold text-base py-4.5 px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>CLIQUE AQUI PARA SABER MAIS</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-xs text-brand-gold-light/60 tracking-wider uppercase">
                💬 primeira consulta e avaliação estética sem compromisso
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 12: RODAPÉ SIMPLES */}
        <footer className="bg-brand-dark text-white/50 py-12 px-4 border-t border-brand-gold/10 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Signature Accent Name */}
            <div className="space-y-1">
              <h3 className="font-signature text-4xl sm:text-5xl text-brand-gold tracking-wide">
                {EXPERT_INFO.name}
              </h3>
              <p className="text-xs uppercase tracking-widest text-brand-gold-light mt-1">
                {EXPERT_INFO.profession} • Jardins, São Paulo
              </p>
            </div>

            {/* Terms / Social Links */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-medium tracking-wider uppercase pt-2">
              <a 
                href={EXPERT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-gold transition-colors flex items-center gap-1.5"
              >
                <Instagram className="w-4 h-4 text-brand-gold" />
                <span>Acompanhar no Instagram</span>
              </a>
              <span className="hidden sm:inline text-white/20">|</span>
              <button 
                onClick={() => {
                  setQuizStep("gate");
                  setQuizOpen(true);
                }}
                className="hover:text-brand-gold transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <span>Refazer Avaliação Facial</span>
              </button>
            </div>

            {/* Legal Text */}
            <div className="pt-6 border-t border-white/5 text-[10px] space-y-1 text-white/30">
              <p>© {new Date().getFullYear()} Dra Karina Chaves. Todos os direitos reservados.</p>
              <p>Harmonização Facial e Rejuvenescimento de Alto Padrão em São Paulo, SP - Brasil.</p>
            </div>

          </div>
        </footer>

      </main>

      {/* 3. LIGHTBOX COMPONENT FOR FULL SCREEN GALLERY IMAGE */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8 cursor-zoom-out"
          >
            {/* Close button top right */}
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 text-white hover:text-brand-gold bg-white/5 hover:bg-white/10 p-3 rounded-full border border-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()} // Prevent close on card click
              className="relative max-w-3xl w-full bg-brand-dark/90 border border-brand-gold/30 rounded-3xl p-2 md:p-3 overflow-hidden shadow-2xl"
            >
              <img 
                src={lightboxImage} 
                alt="Aproximação Simétrica" 
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl mx-auto"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-brand-dark/80 backdrop-blur-md p-4 rounded-xl border border-brand-gold/20 text-center">
                <p className="text-xs uppercase tracking-widest text-brand-gold font-bold">
                  Dra Karina Chaves • Harmonização Facial
                </p>
                <p className="text-[10px] text-white/50 mt-1 uppercase tracking-wider">
                  Realce de proporções naturais • São Paulo, SP
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
