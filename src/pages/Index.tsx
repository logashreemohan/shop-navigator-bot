import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, ShoppingCart, Map, Smartphone } from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';
import StoreMap from '@/components/StoreMap';
import ShoppingList from '@/components/ShoppingList';

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
  const [activeView, setActiveView] = useState<'map' | 'list' | 'assistant'>('assistant');

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
              <Badge variant="secondary" className="flex items-center gap-1">
                <Smartphone className="h-3 w-3" />
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
          </div>

          {/* Sidebar - Quick Actions & Info */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Items Found</span>
                  <Badge variant="secondary">1/4</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Aisle</span>
                  <Badge variant="outline">Entrance</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estimated Time</span>
                  <Badge variant="secondary">15 min</Badge>
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
                  onClick={() => setActiveView('list')}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Manage List
                </Button>
              </div>
            </Card>

            {/* Features Info */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Features</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <span>Voice-activated AI assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-success" />
                  <span>Real-time navigation</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-accent" />
                  <span>Smart shopping lists</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;