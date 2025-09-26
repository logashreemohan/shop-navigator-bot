import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, ShoppingCart, Map, Smartphone, CreditCard } from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';
import StoreMap from '@/components/StoreMap';
import ShoppingList from '@/components/ShoppingList';
import VoiceAssistant from '@/components/VoiceAssistant';
import PaymentCheckout from '@/components/PaymentCheckout';

// Sample store items data
const storeItems = [
  { name: 'milk', location: 'Dairy & Eggs', aisle: 'Aisle 3' },
  { name: 'bread', location: 'Bakery', aisle: 'Aisle 1' },
  { name: 'apples', location: 'Fresh Produce', aisle: 'Aisle 2' },
  { name: 'chicken', location: 'Meat & Seafood', aisle: 'Aisle 4' },
  { name: 'eggs', location: 'Dairy & Eggs', aisle: 'Aisle 3' },
  { name: 'bananas', location: 'Fresh Produce', aisle: 'Aisle 2' },
  { name: 'cheese', location: 'Dairy & Eggs', aisle: 'Aisle 3' },
  { name: 'tomatoes', location: 'Fresh Produce', aisle: 'Aisle 2' },
  { name: 'ice cream', location: 'Frozen Foods', aisle: 'Aisle 5' },
  { name: 'soda', location: 'Beverages', aisle: 'Aisle 6' },
];

const Index = () => {
  const [highlightedItem, setHighlightedItem] = useState<string>('');
  const [highlightedLocation, setHighlightedLocation] = useState<string>('');
  const [userLocation] = useState({ x: 300, y: 430 }); // Near entrance
  const [activeView, setActiveView] = useState<'map' | 'list' | 'assistant' | 'checkout'>('assistant');
  const [voiceActive, setVoiceActive] = useState(false);
  const [shoppingItems, setShoppingItems] = useState([
    { id: '1', name: 'Milk', quantity: 1, completed: false, price: 4.99 },
    { id: '2', name: 'Bread', quantity: 2, completed: false, price: 3.50 },
    { id: '3', name: 'Apples', quantity: 5, completed: true, price: 6.25 },
    { id: '4', name: 'Chicken', quantity: 1, completed: false, price: 12.99 },
  ]);

  const handleVoiceCommand = (command: string) => {
    const [type, content] = command.split(':');
    
    switch (type) {
      case 'add_item':
        // Extract item name from voice command
        const itemMatch = content.match(/add\s+(.+?)\s+to/i) || content.match(/buy\s+(.+)/i);
        if (itemMatch) {
          const itemName = itemMatch[1];
          const newItem = {
            id: Date.now().toString(),
            name: itemName,
            quantity: 1,
            completed: false,
            price: Math.random() * 10 + 2 // Random price for demo
          };
          setShoppingItems(prev => [...prev, newItem]);
        }
        break;
      case 'find_item':
        const findMatch = content.match(/find\s+(.+)|where.*?(.+)/i);
        if (findMatch) {
          const itemName = findMatch[1] || findMatch[2];
          handleFindItem(itemName);
        }
        break;
      case 'checkout':
        setActiveView('checkout');
        break;
      case 'show_list':
        setActiveView('list');
        break;
      default:
        // Handle general commands through AI assistant
        break;
    }
  };

  const handlePaymentComplete = () => {
    // Reset shopping items and go back to assistant
    setShoppingItems([]);
    setActiveView('assistant');
  };

  const handleNavigateToItem = (item: string, location: string) => {
    setHighlightedItem(item);
    setHighlightedLocation(location);
    setActiveView('map');
  };

  const handleFindItem = (itemName: string) => {
    const item = storeItems.find(i => 
      i.name.toLowerCase().includes(itemName.toLowerCase())
    );
    if (item) {
      handleNavigateToItem(item.name, item.location);
    }
  };

  const handleSectionClick = (section: any) => {
    console.log('Section clicked:', section);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Bot className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">AI Smart Trolley</h1>
                  <p className="text-sm text-muted-foreground">Your intelligent shopping companion</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={voiceActive ? "default" : "outline"}
                size="sm"
                onClick={() => setVoiceActive(!voiceActive)}
                className="flex items-center gap-2"
              >
                <Smartphone className="h-4 w-4" />
                {voiceActive ? 'Voice ON' : 'Voice OFF'}
              </Button>
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                Connected
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <Button
              variant={activeView === 'assistant' ? 'default' : 'ghost'}
              onClick={() => setActiveView('assistant')}
              className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
              data-active={activeView === 'assistant'}
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <Button
              variant={activeView === 'map' ? 'default' : 'ghost'}
              onClick={() => setActiveView('map')}
              className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
              data-active={activeView === 'map'}
            >
              <Map className="h-4 w-4 mr-2" />
              Store Map
            </Button>
            <Button
              variant={activeView === 'list' ? 'default' : 'ghost'}
              onClick={() => setActiveView('list')}
              className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
              data-active={activeView === 'list'}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Shopping List
            </Button>
            <Button
              variant={activeView === 'checkout' ? 'default' : 'ghost'}
              onClick={() => setActiveView('checkout')}
              className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
              data-active={activeView === 'checkout'}
              disabled={shoppingItems.length === 0}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Checkout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Primary View */}
          <div className="lg:col-span-2">
            {activeView === 'assistant' && (
              <AIAssistant
                onNavigateToItem={handleNavigateToItem}
                currentItems={storeItems}
              />
            )}
            {activeView === 'map' && (
              <StoreMap
                highlightedItem={highlightedItem}
                highlightedLocation={highlightedLocation}
                userLocation={userLocation}
                onSectionClick={handleSectionClick}
              />
            )}
            {activeView === 'list' && (
              <ShoppingList onFindItem={handleFindItem} />
            )}
            {activeView === 'checkout' && (
              <PaymentCheckout
                items={shoppingItems.map(item => ({
                  id: item.id,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price
                }))}
                onPaymentComplete={handlePaymentComplete}
                onBack={() => setActiveView('list')}
              />
            )}
          </div>

          {/* Sidebar - Voice Assistant & Quick Actions */}
          <div className="space-y-4">
            {/* Voice Assistant */}
            <VoiceAssistant
              onVoiceCommand={handleVoiceCommand}
              isActive={voiceActive}
            />

            {/* Quick Stats */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Items</span>
                  <Badge variant="secondary">{shoppingItems.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <Badge variant="outline">{shoppingItems.filter(i => i.completed).length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Cost</span>
                  <Badge variant="secondary">
                    ${shoppingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveView('assistant')}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Ask AI Assistant
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveView('map')}
                >
                  <Map className="h-4 w-4 mr-2" />
                  View Store Map
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveView('checkout')}
                  disabled={shoppingItems.length === 0}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;