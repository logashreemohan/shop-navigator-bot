import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VoiceAssistantProps {
  onVoiceCommand: (command: string) => void;
  isActive: boolean;
}

export default function VoiceAssistant({ onVoiceCommand, isActive }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          handleVoiceCommand(finalTranscript.trim());
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice recognition error",
          description: "Please try again or check your microphone.",
          variant: "destructive"
        });
      };

      recognitionInstance.onend = () => {
        if (isActive && isListening) {
          // Restart recognition if it should be active
          recognitionInstance.start();
        } else {
          setIsListening(false);
        }
      };

      setRecognition(recognitionInstance);
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSynthesis(window.speechSynthesis);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && recognition && !isListening) {
      startListening();
    } else if (!isActive && recognition && isListening) {
      stopListening();
    }
  }, [isActive]);

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Voice commands for shopping
    if (lowerCommand.includes('add') || lowerCommand.includes('buy')) {
      onVoiceCommand(`add_item:${command}`);
      speak("Item added to your shopping list");
    } else if (lowerCommand.includes('find') || lowerCommand.includes('where')) {
      onVoiceCommand(`find_item:${command}`);
      speak("Let me help you find that item");
    } else if (lowerCommand.includes('checkout') || lowerCommand.includes('pay')) {
      onVoiceCommand(`checkout:${command}`);
      speak("Proceeding to checkout");
    } else if (lowerCommand.includes('list') || lowerCommand.includes('show')) {
      onVoiceCommand(`show_list:${command}`);
      speak("Here's your shopping list");
    } else {
      onVoiceCommand(`general:${command}`);
    }
  };

  const speak = (text: string) => {
    if (!synthesis || !voiceEnabled) return;

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    synthesis.speak(utterance);
  };

  const startListening = () => {
    if (!recognition) {
      toast({
        title: "Voice recognition not supported",
        description: "Please use a supported browser.",
        variant: "destructive"
      });
      return;
    }

    setIsListening(true);
    setTranscript('');
    recognition.start();
    toast({
      title: "Voice assistant activated",
      description: "I'm listening... Say something like 'add milk to list' or 'find bread'",
    });
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
    setTranscript('');
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isSpeaking && synthesis) {
      synthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <Card className="p-4 bg-card border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-success animate-pulse' : 'bg-muted'}`} />
          Voice Assistant
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleVoice}
            className={voiceEnabled ? '' : 'opacity-50'}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Status indicator */}
        <div className="flex items-center justify-between">
          <Badge variant={isListening ? "default" : "secondary"} className="flex items-center gap-2">
            {isListening ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
            {isListening ? 'Listening...' : 'Inactive'}
          </Badge>
          {isSpeaking && (
            <Badge variant="outline" className="flex items-center gap-2">
              <Volume2 className="h-3 w-3" />
              Speaking...
            </Badge>
          )}
        </div>

        {/* Live transcript */}
        {transcript && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium mb-1">You said:</p>
            <p className="text-sm text-muted-foreground italic">"{transcript}"</p>
          </div>
        )}

        {/* Voice commands help */}
        <div className="bg-secondary/20 p-3 rounded-lg">
          <p className="text-sm font-medium mb-2">Try saying:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• "Add milk to my list"</li>
            <li>• "Where can I find bread?"</li>
            <li>• "Show my shopping list"</li>
            <li>• "Proceed to checkout"</li>
          </ul>
        </div>

        {/* Manual controls */}
        <div className="flex gap-2">
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "destructive" : "default"}
            className="flex-1"
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Listening
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}