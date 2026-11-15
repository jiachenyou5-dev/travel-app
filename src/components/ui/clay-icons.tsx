import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ClayIconProps extends HTMLAttributes<HTMLSpanElement> {
  size?: number | string;
  strokeWidth?: number;
  fill?: string;
}

function icon(name: string, column: number, row: number, rotate = 0, asset?: string) {
  function ClayIcon({ className, size, style, strokeWidth, fill, ...props }: ClayIconProps) {
    void strokeWidth;
    void fill;
    const imageStyle: CSSProperties = {
      backgroundImage: `url('${asset || "/images/clay/icons.png"}')`,
      backgroundSize: asset ? "contain" : "600% 600%",
      backgroundPosition: asset ? "center" : `${column * 20}% ${row * 20}%`,
      ...(asset ? { clipPath: "none" } : {}),
      ...(rotate ? { transform: `rotate(${rotate}deg)` } : {}),
      ...(size ? { width: size, height: size } : {}),
      ...style,
    };
    return <span aria-hidden="true" data-clay-icon={name} className={cn("inline-block size-5 shrink-0 bg-no-repeat align-middle", className)} style={imageStyle} {...props} />;
  }
  ClayIcon.displayName = `Clay${name}`;
  return ClayIcon;
}

export const BookOpen = icon("book", 4, 0, 0);
export const Bookmark = icon("bookmark", 4, 5, 0);
export const Building2 = icon("mountain", 1, 5, 0);
export const Calendar = icon("calendar", 4, 1, 0);
export const CalendarPlus = icon("calendar", 4, 1, 0);
export const Check = icon("check", 4, 2, 0);
export const CheckCircle2 = icon("check", 4, 2, 0);
export const CheckIcon = icon("check", 4, 2, 0);
export const ChevronDownIcon = icon("chevron", 1, 2, 90);
export const ChevronLeft = icon("chevron", 1, 2, 180);
export const ChevronRight = icon("chevron", 1, 2, 0);
export const ChevronRightIcon = icon("chevron", 1, 2, 0);
export const ChevronUp = icon("chevron", 1, 2, -90);
export const ChevronUpIcon = icon("chevron", 1, 2, -90);
export const CircleCheckIcon = icon("check", 4, 2, 0);
export const Clock = icon("clock", 1, 3, 0);
export const ExternalLink = icon("arrow", 0, 2, 0);
export const Globe = icon("globe", 2, 1, 0);
export const Heart = icon("heart", 3, 0, 0);
export const Hotel = icon("hotel", 5, 0, 0);
export const ImageIcon = icon("camera", 1, 1, 0);
export const InfoIcon = icon("info", 2, 4, 0);
export const Loader2 = icon("spinner", 4, 4, 0);
export const Loader2Icon = icon("spinner", 4, 4, 0);
export const MapPin = icon("pin", 0, 0, 0);
export const Menu = icon("menu", 1, 4, 0);
export const MessageCircle = icon("message", 4, 3, 0);
export const MessageSquare = icon("message", 4, 3, 0);
export const MessageSquareText = icon("message", 4, 3, 0);
export const Moon = icon("moon", 0, 5, 0);
export const MoreHorizontalIcon = icon("menu", 1, 4, 0);
export const Navigation = icon("compass", 5, 1, 0);
export const OctagonXIcon = icon("close", 3, 2, 0);
export const PenLine = icon("pencil", 0, 3, 0);
export const Pencil = icon("pencil", 0, 3, 0);
export const Phone = icon("phone", 2, 3, 0);
export const Plane = icon("send", 0, 4, 0);
export const Plus = icon("plus", 2, 2, 0);
export const Search = icon("search", 1, 0, 0);
export const Send = icon("send", 0, 4, 0);
export const ShoppingBag = icon("suitcase", 2, 5, 0);
export const Sparkles = icon("compass", 5, 1, 0);
export const Star = icon("star", 2, 0, 0);
export const Sun = icon("sun", 5, 4, 0);
export const Ticket = icon("flag", 3, 5, 0);
export const Trash2 = icon("trash", 5, 2, 0);
export const TriangleAlertIcon = icon("warning", 3, 4, 0);
export const Upload = icon("upload", 5, 3, 0);
export const User = icon("user", 3, 1, 0);
export const Users = icon("user", 3, 1, 0);
export const UtensilsCrossed = icon("food", 0, 1, 0);
export const Wifi = icon("wifi", 3, 3, 0);
export const X = icon("close", 3, 2, 0);
export const XCircle = icon("close", 3, 2, 0);
export const XIcon = icon("close", 3, 2, 0);
export const Compass = icon("compass", 5, 1, 0, "/images/clay/compass.png");
export const ArrowRight = icon("arrow", 0, 2, 0);
export const Mountain = icon("mountain", 1, 5, 0);
export const Luggage = icon("suitcase", 2, 5, 0);
