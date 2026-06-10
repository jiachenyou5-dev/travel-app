import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RestaurantForm } from "@/components/destinations/restaurant-form";
import { updateRestaurant } from "../../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditRestaurantPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: { destination: { select: { nameZh: true } } },
  });

  if (!restaurant) notFound();

  const boundAction = updateRestaurant.bind(null, restaurantId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">编辑餐厅</h1>
      <p className="text-muted-foreground mb-8">
        所属目的地：{restaurant.destination.nameZh}
      </p>

      <Card>
        <CardHeader>
          <CardTitle>餐厅信息</CardTitle>
        </CardHeader>
        <CardContent>
          <RestaurantForm
            action={boundAction}
            defaultValues={{
              nameZh: restaurant.nameZh,
              nameEn: restaurant.nameEn || "",
              description: restaurant.description || "",
              address: restaurant.address || "",
              cuisineType: restaurant.cuisineType || "",
              priceRange: restaurant.priceRange || "",
              openingHours: restaurant.openingHours || "",
              website: restaurant.website || "",
              phone: restaurant.phone || "",
              latitude: restaurant.latitude ?? undefined,
              longitude: restaurant.longitude ?? undefined,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
