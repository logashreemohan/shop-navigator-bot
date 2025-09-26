import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, CheckCircle } from 'lucide-react';

interface StoreSection {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  items: string[];
}

interface StoreMapProps {
  highlightedItem?: string;
  highlightedLocation?: string;
  userLocation: { x: number; y: number };
  onSectionClick: (section: StoreSection) => void;
}

const storeSections: StoreSection[] = [
  {
    id: 'produce',
    name: 'Fresh Produce',
    x: 50,
    y: 50,
    width: 150,
    height: 100,
    color: 'success',
    items: ['apples', 'bananas', 'lettuce', 'tomatoes', 'carrots']
  },
  {
    id: 'dairy',
    name: 'Dairy & Eggs',
    x: 250,
    y: 50,
    width: 120,
    height: 100,
    color: 'accent',
    items: ['milk', 'eggs', 'cheese', 'yogurt', 'butter']
  },
  {
    id: 'meat',
    name: 'Meat & Seafood',
    x: 400,
    y: 50,
    width: 120,
    height: 100,
    color: 'destructive',
    items: ['chicken', 'beef', 'fish', 'pork', 'shrimp']
  },
  {
    id: 'bakery',
    name: 'Bakery',
    x: 50,
    y: 200,
    width: 100,
    height: 80,
    color: 'warning',
    items: ['bread', 'cake', 'cookies', 'muffins', 'bagels']
  },
  {
    id: 'frozen',
    name: 'Frozen Foods',
    x: 200,
    y: 200,
    width: 150,
    height: 80,
    color: 'primary',
    items: ['ice cream', 'frozen pizza', 'frozen vegetables', 'frozen meals']
  },
  {
    id: 'beverages',
    name: 'Beverages',
    x: 400,
    y: 200,
    width: 120,
    height: 80,
    color: 'secondary',
    items: ['soda', 'juice', 'water', 'coffee', 'tea']
  },
  {
    id: 'snacks',
    name: 'Snacks & Candy',
    x: 50,
    y: 320,
    width: 120,
    height: 80,
    color: 'accent',
    items: ['chips', 'chocolate', 'nuts', 'crackers', 'popcorn']
  },
  {
    id: 'household',
    name: 'Household',
    x: 220,
    y: 320,
    width: 150,
    height: 80,
    color: 'muted',
    items: ['detergent', 'paper towels', 'toilet paper', 'cleaning supplies']
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    x: 420,
    y: 320,
    width: 100,
    height: 80,
    color: 'success',
    items: ['medicine', 'vitamins', 'first aid', 'personal care']
  }
];

export default function StoreMap({ highlightedItem, highlightedLocation, userLocation, onSectionClick }: StoreMapProps) {
  const [pathPoints, setPathPoints] = useState<{ x: number; y: number }[]>([]);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  useEffect(() => {
    if (highlightedLocation) {
      const section = storeSections.find(s => 
        s.name.toLowerCase().includes(highlightedLocation.toLowerCase()) ||
        s.items.some(item => item.toLowerCase().includes(highlightedItem?.toLowerCase() || ''))
      );
      
      if (section) {
        setHighlightedSection(section.id);
        // Generate path from user location to section
        const targetX = section.x + section.width / 2;
        const targetY = section.y + section.height / 2;
        
        // Simple pathfinding - direct line with waypoints
        const waypoints = generatePath(userLocation, { x: targetX, y: targetY });
        setPathPoints(waypoints);
      }
    } else {
      setHighlightedSection(null);
      setPathPoints([]);
    }
  }, [highlightedLocation, highlightedItem, userLocation]);

  const generatePath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const points = [];
    const steps = 5;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = start.x + (end.x - start.x) * t;
      const y = start.y + (end.y - start.y) * t;
      points.push({ x, y });
    }
    
    return points;
  };

  const getSectionColorClass = (color: string, isHighlighted: boolean) => {
    const opacity = isHighlighted ? '90' : '40';
    const borderOpacity = isHighlighted ? '100' : '60';
    
    switch (color) {
      case 'success':
        return `fill-success/${opacity} stroke-success/${borderOpacity}`;
      case 'accent':
        return `fill-accent/${opacity} stroke-accent/${borderOpacity}`;
      case 'destructive':
        return `fill-destructive/${opacity} stroke-destructive/${borderOpacity}`;
      case 'warning':
        return `fill-warning/${opacity} stroke-warning/${borderOpacity}`;
      case 'primary':
        return `fill-primary/${opacity} stroke-primary/${borderOpacity}`;
      case 'secondary':
        return `fill-secondary/${opacity} stroke-secondary/${borderOpacity}`;
      default:
        return `fill-muted/${opacity} stroke-muted-foreground/${borderOpacity}`;
    }
  };

  return (
    <Card className="h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Store Map
        </h3>
        {highlightedItem && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Navigation className="h-3 w-3" />
            Finding: {highlightedItem}
          </Badge>
        )}
      </div>
      
      <div className="relative bg-background border rounded-lg overflow-hidden" style={{ height: '500px' }}>
        <svg width="100%" height="100%" viewBox="0 0 600 450" className="absolute inset-0">
          {/* Store sections */}
          {storeSections.map((section) => {
            const isHighlighted = highlightedSection === section.id;
            return (
              <g key={section.id}>
                <rect
                  x={section.x}
                  y={section.y}
                  width={section.width}
                  height={section.height}
                  className={`${getSectionColorClass(section.color, isHighlighted)} stroke-2 cursor-pointer transition-all duration-300 hover:opacity-80`}
                  onClick={() => onSectionClick(section)}
                  rx="8"
                />
                <text
                  x={section.x + section.width / 2}
                  y={section.y + section.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground text-sm font-medium pointer-events-none"
                  fontSize="12"
                >
                  {section.name}
                </text>
                {isHighlighted && (
                  <circle
                    cx={section.x + section.width / 2}
                    cy={section.y + section.height / 2}
                    r="8"
                    className="fill-success animate-pulse"
                  />
                )}
              </g>
            );
          })}
          
          {/* Navigation path */}
          {pathPoints.length > 1 && (
            <g>
              <path
                d={`M ${pathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
                className="stroke-success stroke-4 fill-none opacity-80"
                strokeDasharray="8,4"
                strokeLinecap="round"
              />
              {pathPoints.map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  className="fill-success animate-pulse"
                />
              ))}
            </g>
          )}
          
          {/* User location */}
          <g>
            <circle
              cx={userLocation.x}
              cy={userLocation.y}
              r="12"
              className="fill-primary stroke-primary-foreground stroke-2"
            />
            <circle
              cx={userLocation.x}
              cy={userLocation.y}
              r="8"
              className="fill-primary-foreground"
            />
          </g>
          
          {/* Store entrance */}
          <rect
            x="10"
            y="420"
            width="580"
            height="20"
            className="fill-muted stroke-muted-foreground stroke-2"
            rx="4"
          />
          <text
            x="300"
            y="433"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-xs font-medium"
          >
            Store Entrance
          </text>
        </svg>
        
        {/* Legend */}
        <div className="absolute top-4 right-4 bg-card border rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-primary rounded-full border-2 border-primary-foreground"></div>
            <span className="text-xs">Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-success rounded"></div>
            <span className="text-xs">Target Item</span>
          </div>
        </div>
      </div>
    </Card>
  );
}