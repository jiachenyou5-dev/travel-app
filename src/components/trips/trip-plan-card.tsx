import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Coffee, Moon, Sun, UtensilsCrossed, Building2, ShoppingBag } from "lucide-react";

interface TripItem {
  time: string;
  title: string;
  description: string;
  type: string;
}

interface TripDay {
  dayNumber: number;
  items: TripItem[];
}

function typeIcon(type: string) {
  switch (type) {
    case "景点":
      return <Building2 className="w-4 h-4" />;
    case "美食":
      return <UtensilsCrossed className="w-4 h-4" />;
    case "住宿":
      return <Moon className="w-4 h-4" />;
    case "购物":
      return <ShoppingBag className="w-4 h-4" />;
    default:
      return <MapPin className="w-4 h-4" />;
  }
}

function timeIcon(time: string) {
  const hour = parseInt(time.split(":")[0]);
  if (hour < 11) return <Sun className="w-3 h-3" />;
  if (hour < 17) return <Sun className="w-3 h-3" />;
  return <Moon className="w-3 h-3" />;
}

function badgeColor(type: string) {
  switch (type) {
    case "景点":
      return "bg-primary/10 text-primary";
    case "美食":
      return "bg-star/10 text-star-foreground";
    case "住宿":
      return "bg-success/10 text-success-foreground";
    case "购物":
      return "bg-accent/10 text-accent-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function TripPlanCard({ days }: { days: TripDay[] }) {
  return (
    <div className="space-y-6">
      {days.map((day) => (
        <Card key={day.dayNumber}>
          <CardHeader>
            <CardTitle className="text-lg">
              第 {day.dayNumber} 天
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {day.items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-card border flex items-center justify-center">
                      {typeIcon(item.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                        {timeIcon(item.time)}
                        {item.time}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${badgeColor(item.type)}`}
                      >
                        {item.type}
                      </span>
                    </div>
                    <h4 className="font-medium text-foreground text-sm">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
