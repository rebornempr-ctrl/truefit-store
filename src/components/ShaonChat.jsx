import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function getSmartReply(text, name) {
  const n = name ? `, ${name}` : "";
  const l = text.toLowerCase();

  if (
    l.includes("don't need") || l.includes("dont need") ||
    l.includes("not now") || l.includes("i'm fine") || l.includes("im fine") ||
    l.includes("will come") || l.includes("if i need") ||
    l.includes("leave me") || l.includes("no thanks") || l.includes("no thank") ||
    l.includes("later") || l.includes("just looking") || l.includes("browsing")
  ) {
    return {
      text: `No problem${n}! 😊 Take your time — I'll be right here whenever you need me. Happy browsing! 🛍️`,
      choices: null,
    };
  }
  if (l.includes("thank") || l.includes("shukriya") || l.includes("dhonnobad")) {
    return { text: `You're so welcome${n}! 😊 Anything else I can help you with?`, choices: [{ id: "quiz", label: "🎯 Find my perfect fit" }, { id: "quality", label: "💎 Tell me about quality" }] };
  }
  if (l.includes("hello") || l.includes("hi") || l.includes("hey") || l.includes("salam")) {
    return { text: `Hey${n}! 👋 Great to see you at TrueFit! What can I help you with today?`, choices: [{ id: "quiz", label: "🎯 Find my perfect fit" }, { id: "browse", label: "🛍️ I'm just browsing" }, { id: "quality", label: "🤔 Is TrueFit worth it?" }] };
  }
  if (l.includes("price") || l.includes("cost") || l.includes("taka") || l.includes("bdt") || l.includes("cheap") || l.includes("budget")) {
    return { text: `Great question${n}! 💰 TrueFit is priced for real people — premium quality without the imported brand markup. You get more value than any fast fashion brand.`, choices: [{ id: "shopnow", label: "🛒 Let me shop now" }, { id: "compare", label: "📊 Compare with other brands" }] };
  }
  if (l.includes("quality") || l.includes("original") || l.includes("fake") || l.includes("worth") || l.includes("good")) {
    return { text: `${name ? name + ", " : ""}TrueFit uses premium stitching and real fabric that outlasts fast fashion by 2x. Same quality as big brands, half the price — and you're supporting a Bangladeshi brand 🇧🇩`, choices: [{ id: "shopnow", label: "✅ Alright, I'm in!" }, { id: "compare", label: "📊 Compare more" }] };
  }
  if (l.includes("size") || l.includes("fit") || l.includes("xl") || l.includes("small") || l.includes("medium") || l.includes("large")) {
    return { text: `TrueFit sizing is true to size${n} 📏 XS to 3XL available. If you're between sizes, go one up — our cuts are slightly slim.`, choices: [{ id: "small", label: "XS / S" }, { id: "medium", label: "M / L" }, { id: "large", label: "XL / XXL" }] };
  }
  if (l.includes("return") || l.includes("refund") || l.includes("exchange")) {
    return { text: `Your satisfaction matters${n} 🤝 If something isn't right, reach out on WhatsApp and we'll sort it out — no corporate runaround.`, choices: [{ id: "shopnow", label: "✅ That's fair, let me shop" }] };
  }
  if (l.includes("compare") || l.includes("zara") || l.includes("hm") || l.includes("shein") || l.includes("other brand")) {
    return { text: `Real talk${n} 💯 H&M, Zara, Shein — look good in photos but fade fast. TrueFit is local, quality-controlled, and you support Bangladesh 🇧🇩`, choices: [{ id: "shopnow", label: "✅ I'm convinced, let me shop!" }] };
  }
  if (l.includes("gift") || l.includes("present")) {
    return { text: `Gifting from TrueFit is a great idea${n}! 🎁 Clean packaging, premium feel — the person receiving it will love it!`, choices: [{ id: "shopnow", label: "🛒 Browse for gifts" }, { id: "size", label: "📏 Help with sizing" }] };
  }
  if (l.includes("shop") || l.includes("buy") || l.includes("purchase") || l.includes("want") || l.includes("show me")) {
    return { text: `Let's go${n}! 🔥 Heading to the shop right now!`, choices: [{ id: "shopnow", label: "🛒 Take me to shop" }] };
  }
  if (l.includes("casual") || l.includes("street") || l.includes("everyday")) {
    return { text: `Casual streetwear is TrueFit's strongest line${n} 🔥 Clean fits, minimal logos, premium cotton. The kind of outfit that looks effortless.`, choices: [{ id: "shopnow", label: "🛒 Show me" }] };
  }
  if (l.includes("sport") || l.includes("gym") || l.includes("active") || l.includes("workout")) {
    return { text: `Our active line is built for movement${n} 💪 Breathable, flexible, still looks clean outside the gym!`, choices: [{ id: "shopnow", label: "🛒 Show me" }] };
  }
  return {
    text: `I got you${n}! 😊 Here's what I can help you with 👇`,
    choices: [{ id: "quiz", label: "🎯 Find my perfect fit" }, { id: "quality", label: "💎 Quality & trust" }, { id: "price", label: "💰 Pricing" }, { id: "size", label: "📏 Sizing help" }],
  };
}

const FLOWS = {
  quiz_q1: { text: "Let's find your perfect fit! 🎯 Quick style quiz — Question 1: What's your vibe?", choices: [{ id: "quiz_chill", label: "😎 Chill & relaxed" }, { id: "quiz_bold", label: "🔥 Bold & statement" }, { id: "quiz_clean", label: "✨ Clean & minimal" }] },
  quiz_chill: { text: "Love it! Chill vibes 😎 Question 2: Where are you mostly wearing this?", choices: [{ id: "quiz_chill_street", label: "🏙️ Street / everyday" }, { id: "quiz_chill_home", label: "🏠 Casual / home hangout" }, { id: "quiz_chill_gym", label: "🏃 Gym / active" }] },
  quiz_bold: { text: "Bold taste! 🔥 Question 2: Where are you mostly wearing this?", choices: [{ id: "quiz_bold_street", label: "🏙️ Street / flex" }, { id: "quiz_bold_event", label: "🎉 Events / occasions" }, { id: "quiz_bold_work", label: "💼 Work / smart casual" }] },
  quiz_clean: { text: "Clean and sharp — great taste ✨ Question 2: Where are you mostly wearing this?", choices: [{ id: "quiz_clean_work", label: "💼 Work / professional" }, { id: "quiz_clean_daily", label: "☀️ Daily wear" }, { id: "quiz_clean_event", label: "🎉 Special occasions" }] },
  quiz_chill_street: { text: "Your perfect fit is our Oversized Streetwear Collection 🏙️ Relaxed cuts, premium cotton, clean colorways. You'll look effortlessly cool every day.", choices: [{ id: "shopnow", label: "🛒 Show me now!" }] },
  quiz_chill_home: { text: "Your vibe matches our Comfort Essentials perfectly 🏠 Super soft fabric, relaxed fit — clothes you never want to take off.", choices: [{ id: "shopnow", label: "🛒 I want these!" }] },
  quiz_chill_gym: { text: "Check out our Active Chill Line 🏃 Moves with you, looks clean off the gym floor too!", choices: [{ id: "shopnow", label: "🛒 Let's go!" }] },
  quiz_bold_street: { text: "You need our Statement Streetwear 🔥 Bold graphics, premium fits — pieces that make people stop and look.", choices: [{ id: "shopnow", label: "🛒 I need these!" }] },
  quiz_bold_event: { text: "Our Premium Event Collection is made for you 🎉 Sharp, bold, memorable — you'll be the best dressed every time.", choices: [{ id: "shopnow", label: "🛒 Show me!" }] },
  quiz_bold_work: { text: "Our Smart Bold Collection hits different at work 💼 Structured but with personality — the kind of fit that gets noticed.", choices: [{ id: "shopnow", label: "🛒 Perfect, let me see!" }] },
  quiz_clean_work: { text: "Our Clean Professional Line is exactly your style ✨ Minimal, sharp, premium — you'll look polished without trying.", choices: [{ id: "shopnow", label: "🛒 These are mine!" }] },
  quiz_clean_daily: { text: "Our Minimal Daily Collection is perfect for you ☀️ Clean cuts, neutral tones — looks good with everything.", choices: [{ id: "shopnow", label: "🛒 Let me see!" }] },
  quiz_clean_event: { text: "Our Refined Event Pieces were made for your taste 🎉 Sleek, minimal, sharp — you'll stand out by looking perfectly put together.", choices: [{ id: "shopnow", label: "🛒 I want these!" }] },
  browse: { text: "No worries, take your time 😊 Most people who 'just browse' TrueFit end up finding something they love. What style catches your eye?", choices: [{ id: "quiz_chill", label: "😎 Casual / relaxed" }, { id: "quiz_bold", label: "🔥 Bold / statement" }, { id: "quiz_clean", label: "✨ Clean / minimal" }, { id: "quality", label: "💰 Tell me about quality first" }] },
  quality: { text: "Real talk 💯 TrueFit uses premium stitching and real fabric that lasts 2x longer than fast fashion. Same quality as big brands, half the price — and you're supporting Bangladesh 🇧🇩", choices: [{ id: "shopnow", label: "✅ Alright, I'm in!" }, { id: "compare", label: "📊 Compare with other brands" }, { id: "quiz", label: "🎯 Help me find my fit" }] },
  compare: { text: "H&M, Zara, Shein — look great in photos but fade after 5 washes 💀 TrueFit is local, quality-controlled, and every piece is checked before it reaches you 🇧🇩", choices: [{ id: "shopnow", label: "✅ Convinced! Let me shop" }] },
  size: { text: "TrueFit sizing is true to size 📏 XS to 3XL available. If you're between sizes, go one up — our cuts are slightly slim. What's your usual size?", choices: [{ id: "small", label: "XS / S" }, { id: "medium", label: "M / L" }, { id: "large", label: "XL / XXL" }] },
  small: { text: "XS/S fits are true to size at TrueFit — maybe even slightly generous 😊 You'll be comfortable without it looking baggy.", choices: [{ id: "shopnow", label: "🛒 Let's go shopping!" }] },
  medium: { text: "M/L is our most popular size 🔥 Everything is designed with this fit as the base so you'll always look great.", choices: [{ id: "shopnow", label: "🛒 Let's go!" }] },
  large: { text: "XL/XXL is available across all collections 💪 We design for real body types, not just mannequins.", choices: [{ id: "shopnow", label: "🛒 Show me!" }] },
  price: { text: "TrueFit pricing is fair and honest 💰 Premium quality without the imported price tag. Built for real people.", choices: [{ id: "shopnow", label: "🛒 Let me shop now" }, { id: "quiz", label: "🎯 Help me find my fit" }] },
  shopnow: { text: "Amazing choice! 🔥 Head to our Shop and find your perfect fit. Happy shopping!", choices: [{ id: "quiz", label: "🔄 Retake style quiz" }, { id: "size", label: "📏 Size question" }], action: "shop" },
};

export default function ShaonChat({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [autoBubble, setAutoBubble] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const [stage, setStage] = useState("ask_name");
  const [customerName, setCustomerName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [freeText, setFreeText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (bubbleDismissed) return;
    const t = setTimeout(() => setAutoBubble(true), 3000);
    return () => clearTimeout(t);
  }, [bubbleDismissed]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const openChat = () => {
    setIsOpen(true);
    setAutoBubble(false);
    if (stage === "ask_name" && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([{ from: "shaon", text: "Hey! 👋 Welcome to TrueFit! I'm Shaon, your personal style assistant.\n\nWhat's your name? 😊", choices: null }]);
      }, 900);
    }
  };

  const dismissBubble = (e) => { e.stopPropagation(); setAutoBubble(false); setBubbleDismissed(true); };

  const submitName = () => {
    const n = (stage === "ask_name" ? nameInput : freeText).trim();
    if (!n) return;
    setCustomerName(n);
    setNameInput(""); setFreeText("");
    setMessages((prev) => [...prev, { from: "user", text: n }]);
    setStage("chat");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setCurrentNode("greeting_named");
      setMessages((prev) => [...prev, { from: "shaon", text: `Hey ${n}! 😊 Great to meet you! I'm Shaon, your personal style assistant at TrueFit. What can I do for you today?`, choices: [{ id: "quiz", label: "🎯 Find my perfect fit" }, { id: "browse", label: "🛍️ Just browsing" }, { id: "quality", label: "🤔 Is TrueFit worth it?" }, { id: "size", label: "📏 Size help" }] }]);
    }, 800);
  };

  const handleChoice = (choiceId) => {
    const allChoices = messages.slice().reverse().find(m => m.choices)?.choices || [];
    const chosen = allChoices.find((c) => c.id === choiceId);
    if (!chosen) return;
    setMessages((prev) => [...prev.map((m) => ({ ...m, choices: null })), { from: "user", text: chosen.label }]);
    const next = choiceId === "quiz" ? FLOWS.quiz_q1 : FLOWS[choiceId];
    if (!next) return;
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setCurrentNode(choiceId === "quiz" ? "quiz_q1" : choiceId);
      let text = next.text;
      if (customerName && Math.random() > 0.6 && !text.includes(customerName)) {
        text = text.replace("!", `, ${customerName}!`);
      }
      setMessages((prev) => [...prev, { from: "shaon", text, choices: next.choices, action: next.action }]);
      if (next.action === "shop" && onNavigate) setTimeout(() => onNavigate("/shop"), 1500);
    }, 700 + Math.random() * 400);
  };

  const handleFreeText = () => {
    const txt = freeText.trim();
    if (!txt) return;
    if (stage === "ask_name") { submitName(); return; }
    setFreeText("");
    setMessages((prev) => [...prev.map((m) => ({ ...m, choices: null })), { from: "user", text: txt }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply = getSmartReply(txt, customerName);
      setCurrentNode(null);
      setMessages((prev) => [...prev, { from: "shaon", text: reply.text, choices: reply.choices }]);
    }, 600 + Math.random() * 500);
  };

  return (
    <>
      <div className="sh-trigger">
        <AnimatePresence>
          {autoBubble && !isOpen && (
            <motion.div className="sh-auto-bubble" initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}>
              <span>Hey! Need help finding your fit? 😊</span>
              <button className="sh-bubble-close" onClick={dismissBubble}>✕</button>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div className="sh-btn" onClick={openChat} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}>
          <span style={{ fontSize: "1.5rem" }}>{isOpen ? "✕" : "🧑‍💼"}</span>
          {!isOpen && <span className="sh-dot" />}
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="sh-window" initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.96 }} transition={{ type: "spring", damping: 22 }}>
            <div className="sh-header">
              <div className="sh-header-left">
                <div className="sh-avatar">🧑‍💼</div>
                <div>
                  <div className="sh-name">Shaon {customerName ? `× ${customerName}` : ""}</div>
                  <div className="sh-status">● Online — TrueFit Style Assistant</div>
                </div>
              </div>
              <button className="sh-close" onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <div className="sh-messages">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    {msg.from === "shaon" ? (
                      <div className="sh-row">
                        <div className="sh-av-sm">🧑‍💼</div>
                        <div>
                          <div className="sh-msg sh-bot">{msg.text}</div>
                          {msg.choices && (
                            <div className="sh-choices">
                              {msg.choices.map((c) => (
                                <motion.button key={c.id} className="sh-choice" onClick={() => handleChoice(c.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>{c.label}</motion.button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="sh-row sh-row-user">
                        <div className="sh-msg sh-user">{msg.text}</div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <motion.div className="sh-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="sh-av-sm">🧑‍💼</div>
                  <div className="sh-msg sh-bot sh-typing"><span /><span /><span /></div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="sh-input-row">
              <input
                className="sh-input"
                placeholder={stage === "ask_name" ? "Type your name..." : "Type anything..."}
                value={stage === "ask_name" ? nameInput : freeText}
                onChange={(e) => stage === "ask_name" ? setNameInput(e.target.value) : setFreeText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (stage === "ask_name" ? submitName() : handleFreeText())}
              />
              <motion.button className="sh-send" onClick={stage === "ask_name" ? submitName : handleFreeText} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>➤</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .sh-trigger{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;gap:10px;}
        .sh-auto-bubble{background:#1a1a1a;color:#fff;padding:10px 36px 10px 16px;border-radius:20px 20px 4px 20px;font-size:.84rem;box-shadow:0 4px 20px rgba(0,0,0,.2);position:relative;max-width:220px;line-height:1.4;}
        .sh-bubble-close{position:absolute;top:6px;right:10px;background:none;border:none;color:#fff;cursor:pointer;font-size:.8rem;opacity:.7;}
        .sh-btn{width:58px;height:58px;border-radius:50%;background:#c8102e;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 20px rgba(200,16,46,.4);position:relative;}
        .sh-dot{position:absolute;top:4px;right:4px;width:12px;height:12px;background:#22c55e;border-radius:50%;border:2px solid #fff;}
        .sh-window{position:fixed;bottom:96px;right:24px;width:340px;max-height:540px;background:#fff;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.2);display:flex;flex-direction:column;overflow:hidden;z-index:9998;}
        .sh-header{background:#1a1a1a;color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;}
        .sh-header-left{display:flex;align-items:center;gap:10px;}
        .sh-avatar{font-size:1.6rem;background:#c8102e;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
        .sh-name{font-weight:700;font-size:.9rem;}
        .sh-status{font-size:.7rem;color:#22c55e;}
        .sh-close{background:none;border:none;color:#fff;cursor:pointer;font-size:1rem;opacity:.7;}
        .sh-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:#f9f9f9;}
        .sh-row{display:flex;align-items:flex-start;gap:8px;}
        .sh-row-user{flex-direction:row-reverse;}
        .sh-av-sm{font-size:1.2rem;flex-shrink:0;margin-top:2px;}
        .sh-msg{padding:10px 14px;border-radius:16px;font-size:.84rem;line-height:1.5;max-width:220px;white-space:pre-line;}
        .sh-bot{background:#fff;color:#1a1a1a;border-bottom-left-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.08);}
        .sh-user{background:#c8102e;color:#fff;border-bottom-right-radius:4px;max-width:200px;}
        .sh-choices{display:flex;flex-direction:column;gap:6px;margin-top:8px;}
        .sh-choice{background:#fff;border:1.5px solid #e5e7eb;border-radius:10px;padding:8px 12px;font-size:.79rem;cursor:pointer;text-align:left;color:#1a1a1a;transition:all .2s;}
        .sh-choice:hover{border-color:#c8102e;background:#fff5f6;color:#c8102e;}
        .sh-typing{display:flex;gap:4px;align-items:center;padding:12px 16px;}
        .sh-typing span{width:7px;height:7px;background:#c8102e;border-radius:50%;animation:shbounce 1.2s infinite;}
        .sh-typing span:nth-child(2){animation-delay:.2s;}
        .sh-typing span:nth-child(3){animation-delay:.4s;}
        @keyframes shbounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
        .sh-input-row{padding:12px;background:#fff;border-top:1px solid #f0f0f0;display:flex;gap:8px;}
        .sh-input{flex:1;border:1.5px solid #e5e7eb;border-radius:10px;padding:9px 12px;font-size:.83rem;outline:none;transition:border .2s;}
        .sh-input:focus{border-color:#c8102e;}
        .sh-send{background:#c8102e;color:#fff;border:none;border-radius:10px;padding:0 14px;cursor:pointer;font-size:1rem;}
        @media(max-width:400px){.sh-window{width:calc(100vw - 32px);right:16px;}}
      `}</style>
    </>
  );
}
