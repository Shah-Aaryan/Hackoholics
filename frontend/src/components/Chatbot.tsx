import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockChatData, ChatMessage } from '@/data/mockData';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot = ({ isOpen, onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setMessages([{
        id: 'welcome',
        question: '',
        answer: "Hi! I'm your Eco Assistant 🌱 I can help you with energy-saving tips, carbon footprint insights, and answer questions about your usage patterns. What would you like to know?",
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue('');
    
    // Add user message
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      question: userMessage,
      answer: '',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      // Find relevant response from mock data
      const relevantResponse = mockChatData.find(chat => 
        userMessage.toLowerCase().includes('reduce') ||
        userMessage.toLowerCase().includes('save') ||
        userMessage.toLowerCase().includes('energy')
      ) || mockChatData.find(chat =>
        userMessage.toLowerCase().includes('carbon') ||
        userMessage.toLowerCase().includes('footprint')
      ) || mockChatData.find(chat =>
        userMessage.toLowerCase().includes('tree')
      );

      const botResponse = relevantResponse?.answer || 
        "That's a great question! Based on your current usage patterns, I'd recommend focusing on peak-hour optimization and smart device usage. You're already doing well with 12% lower consumption than your neighbors! Would you like specific tips for your home?";

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        question: '',
        answer: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "How can I reduce my energy bill?",
    "What's my carbon footprint?",
    "Why is my tree not growing?",
    "Best energy-saving tips?"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-eco rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            Eco Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div key={message.id}>
                  {message.question && (
                    <div className="flex justify-end mb-2">
                      <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                        <div className="flex items-start gap-2">
                          <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{message.question}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {message.answer && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3 max-w-[85%]">
                        <div className="flex items-start gap-2">
                          <Bot className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                          <p className="text-sm">{message.answer}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-primary" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-6 py-2">
              <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
              <div className="grid grid-cols-1 gap-1">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-xs h-8"
                    onClick={() => setInputValue(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-6 pt-2 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about energy saving..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="btn-eco"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Chatbot;