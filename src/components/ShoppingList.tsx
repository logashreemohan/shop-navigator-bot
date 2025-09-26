import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, MapPin, ShoppingCart, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  completed: boolean;
  location?: string;
  aisle?: string;
}

interface ShoppingListProps {
  onFindItem: (item: string) => void;
}

const initialItems: ShoppingItem[] = [
  { id: '1', name: 'Milk', quantity: 1, completed: false, location: 'Dairy & Eggs', aisle: 'Aisle 3' },
  { id: '2', name: 'Bread', quantity: 2, completed: false, location: 'Bakery', aisle: 'Aisle 1' },
  { id: '3', name: 'Apples', quantity: 5, completed: true, location: 'Fresh Produce', aisle: 'Aisle 2' },
  { id: '4', name: 'Chicken', quantity: 1, completed: false, location: 'Meat & Seafood', aisle: 'Aisle 4' },
];

export default function ShoppingList({ onFindItem }: ShoppingListProps) {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);

  const addItem = () => {
    if (!newItemName.trim()) return;
    
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      quantity: newItemQuantity,
      completed: false,
    };
    
    setItems(prev => [...prev, newItem]);
    setNewItemName('');
    setNewItemQuantity(1);
    
    toast({
      title: "Item added",
      description: `${newItem.name} has been added to your shopping list.`,
    });
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your shopping list.",
    });
  };

  const findItemLocation = (itemName: string) => {
    onFindItem(itemName);
    toast({
      title: "Finding item",
      description: `Looking for ${itemName} on the store map.`,
    });
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Shopping List
          </h3>
          <Badge variant="secondary">
            {completedCount}/{totalCount} items
          </Badge>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-success h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                item.completed ? 'bg-muted/50' : 'bg-background'
              }`}
            >
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => toggleItem(item.id)}
              />
              
              <div className="flex-1">
                <div className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {item.name}
                  {item.quantity > 1 && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      (×{item.quantity})
                    </span>
                  )}
                </div>
                {item.location && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {item.location} - {item.aisle}
                  </div>
                )}
                {item.completed && (
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span className="text-xs text-success">Completed</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                {!item.completed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => findItemLocation(item.name)}
                    className="h-8 px-2"
                  >
                    <MapPin className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="h-8 px-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add new item..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            className="flex-1"
          />
          <Input
            type="number"
            min="1"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
            className="w-16"
          />
          <Button onClick={addItem} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {totalCount > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            {completedCount === totalCount ? (
              <span className="text-success flex items-center justify-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Shopping complete! 🎉
              </span>
            ) : (
              `${totalCount - completedCount} items remaining`
            )}
          </div>
        )}
      </div>
    </Card>
  );
}