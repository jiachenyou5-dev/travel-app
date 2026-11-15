import { DestinationForm } from "@/components/destinations/destination-form";
import { createDestination } from "../actions";

export default function NewDestinationPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-medium tracking-tight text-foreground mb-8">添加目的地</h1>
      <DestinationForm action={createDestination} submitLabel="创建目的地" />
    </div>
  );
}
