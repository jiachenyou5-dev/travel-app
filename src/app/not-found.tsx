import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <MapPin className="w-16 h-16 text-muted-foreground/40 mb-4" />
      <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
      <p className="text-muted-foreground mb-8">页面不存在</p>
      <Link href="/">
        <Button>返回首页</Button>
      </Link>
    </div>
  );
}
