import React, { useState, useEffect, useRef } from 'react';
import { nftData } from '../data/nftData';
import './Chatbot.css';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // For bot typing indicator
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
  let genAI: GoogleGenerativeAI | null = null;
  if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
  } else {
    console.error("Google AI API Key not found. Please set VITE_GOOGLE_AI_API_KEY in your .env file.");
  }

  const model = genAI?.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const generationConfig = {
    temperature: 0.7,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen) {
      setMessages([{ sender: 'bot', text: "Hello! I'm your friendly art and NFT assistant. Ask me about the NFTs, the MUSEO DE ARTE CONTEMPORANEO DE QUINTANA ROO, or how to buy digital art!" }]);
    } else {
      setMessages([]);
      setInput('');
    }
  }, [isOpen]);

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsTyping(true);
    processUserMessage(input);
    setInput('');
  };

  const processUserMessage = async (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    let rawBotResponseText: string = "";
    let potentialNftFromInput: typeof nftData[0] | undefined = undefined;
    let searchStringForNftName = "";

    // Specific pattern match first
    const priceQuerySpecificPattern = /how much is artwork in usd (.*)/i;
    const specificMatch = lowerInput.match(priceQuerySpecificPattern);

    if (specificMatch && specificMatch[1]) {
        searchStringForNftName = specificMatch[1].trim();
    } else {
        // Fallback to broader heuristic if specific pattern doesn't match
        const keywordsToStrip = ["price of", "cost of", "usd price of", "description of", "about", "buy", "how much is", "what is the price of", "tell me about", "artwork", "in usd", "usd", "in", "the", "of", "an", "a", "is"];
        let tempSearchString = lowerInput;
        
        keywordsToStrip.forEach(keyword => {
            // Using a regex with word boundaries for keywords to avoid partial matches within words
            // and 'gi' for global, case-insensitive match
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            tempSearchString = tempSearchString.replace(regex, "");
        });
        searchStringForNftName = tempSearchString.replace(/\s\s+/g, ' ').trim(); // Remove extra spaces
    }

    if (searchStringForNftName) {
        potentialNftFromInput = nftData.find(
            nft => nft.name.toLowerCase().includes(searchStringForNftName) ||
                   searchStringForNftName.includes(nft.name.toLowerCase()) ||
                   nft.symbol.toLowerCase() === searchStringForNftName
        );
    }
    
    if (potentialNftFromInput) {
      const nft = potentialNftFromInput;
      if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('usd') || lowerInput.includes('how much')) {
        rawBotResponseText = `${nft.name} (${nft.symbol}) costs $${nft.usdPrice} USD.`