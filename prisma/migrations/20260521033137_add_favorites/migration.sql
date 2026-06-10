-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "destinationId" TEXT,
    "attractionId" TEXT,
    "restaurantId" TEXT,
    "accommodationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "favorites_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "favorites_attractionId_fkey" FOREIGN KEY ("attractionId") REFERENCES "attractions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "favorites_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "favorites_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
