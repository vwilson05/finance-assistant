import React, { useState, useEffect, useRef } from 'react';
import { chatService, ChatMessage } from '../../services/chatService';
import './Chat.css';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        const history = await chatService.getChatHistory();
        
        if (history && history.length > 0) {
          setMessages(history);
        } else {
          // Default welcome message if no history
          setMessages([
            {
              id: '1',
              role: 'assistant',
              content: 'Hello! I\'m your AI financial advisor. How can I help you today?',
              createdAt: new Date(),
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
        setError('Failed to load chat history. Please try again later.');
        
        // Set default message on error
        setMessages([
          {
            id: '1',
            role: 'assistant',
            content: 'Hello! I\'m your AI financial advisor. How can I help you today?',
            createdAt: new Date(),
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: userInput,
      createdAt: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Send message to API
      const response = await chatService.sendMessage(userInput);
      
      // Check if the response includes a function call
      if (response.functionCall) {
        // Add the assistant message with the function call
        setMessages(prevMessages => [...prevMessages, response]);
        
        // Execute the function call
        try {
          const functionResult = await chatService.executeFunctionCall({
            name: response.functionCall.name,
            arguments: response.functionCall.arguments
          });
          
          // Update the message with the function result
          setMessages(prevMessages => {
            const updatedMessages = [...prevMessages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            
            if (lastMessage.functionCall) {
              lastMessage.functionCall.result = functionResult;
            }
            
            return updatedMessages;
          });
          
          // Send a follow-up message with the function result
          const followUpResponse = await chatService.sendMessage(
            `Function ${response.functionCall.name} executed with result: ${JSON.stringify(functionResult)}`
          );
          
          // Add the follow-up response to the chat
          setMessages(prevMessages => [...prevMessages, followUpResponse]);
        } catch (functionError) {
          console.error('Failed to execute function call:', functionError);
          
          // Add error message for function call
          const functionErrorMessage: ChatMessage = {
            role: 'system',
            content: `Failed to execute function ${response.functionCall.name}. Please try again later.`,
            createdAt: new Date(),
          };
          
          setMessages(prevMessages => [...prevMessages, functionErrorMessage]);
        }
      } else {
        // Add assistant response to chat (no function call)
        setMessages(prevMessages => [...prevMessages, response]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again later.');
      
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'system',
        content: 'Sorry, there was an error processing your request. Please try again later.',
        createdAt: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = async () => {
    try {
      setIsLoading(true);
      await chatService.clearHistory();
      
      // Clear messages locally
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Chat history cleared. How can I help you today?',
          createdAt: new Date(),
        }
      ]);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      setError('Failed to clear chat history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h1>AI Financial Advisor</h1>
        <button 
          className="clear-history-button" 
          onClick={handleClearHistory}
          disabled={isLoading}
        >
          Clear History
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div 
              key={message.id || index} 
              className={`message ${message.role}`}
            >
              <div className="message-content">
                {message.content}
                
                {/* Display function call if present */}
                {message.functionCall && (
                  <div className="function-call">
                    <div className="function-name">
                      Function: {message.functionCall.name}
                    </div>
                    <div className="function-arguments">
                      Arguments: {message.functionCall.arguments}
                    </div>
                    {message.functionCall.result && (
                      <div className="function-result">
                        Result: {JSON.stringify(message.functionCall.result)}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {message.createdAt && (
                <div className="message-timestamp">
                  {new Date(message.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message assistant loading">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="input-container">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your financial advisor a question..."
            rows={3}
            disabled={isLoading}
          />
          <button 
            className="send-button" 
            onClick={handleSendMessage}
            disabled={isLoading || !userInput.trim()}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
      
      <div className="chat-suggestions">
        <h3>Suggested Questions</h3>
        <div className="suggestions-container">
          <button 
            className="suggestion-button"
            onClick={() => setUserInput('How should I allocate my investment portfolio?')}
            disabled={isLoading}
          >
            How should I allocate my investment portfolio?
          </button>
          <button 
            className="suggestion-button"
            onClick={() => setUserInput('What\'s the best strategy for paying off my debt?')}
            disabled={isLoading}
          >
            What's the best strategy for paying off my debt?
          </button>
          <button 
            className="suggestion-button"
            onClick={() => setUserInput('How much should I save for retirement?')}
            disabled={isLoading}
          >
            How much should I save for retirement?
          </button>
          <button 
            className="suggestion-button"
            onClick={() => setUserInput('Should I invest in real estate?')}
            disabled={isLoading}
          >
            Should I invest in real estate?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat; 