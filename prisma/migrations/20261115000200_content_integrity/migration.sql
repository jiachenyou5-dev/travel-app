-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_accommodations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destinationId" TEXT NOT NULL,
    "nameZh" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" TEXT,
    "address" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "accommodationType" TEXT,
    "priceRange" TEXT,
    "starRating" INTEGER,
    "amenities" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
    "submittedById" TEXT,
    "reviewNotes" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "accommodations_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "accommodations_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_accommodations" ("accommodationType", "address", "amenities", "createdAt", "description", "destinationId", "id", "isPublished", "latitude", "longitude", "nameEn", "nameZh", "phone", "priceRange", "starRating", "updatedAt", "website") SELECT "accommodationType", "address", "amenities", "createdAt", "description", "destinationId", "id", "isPublished", "latitude", "longitude", "nameEn", "nameZh", "phone", "priceRange", "starRating", "updatedAt", "website" FROM "accommodations";
DROP TABLE "accommodations";
ALTER TABLE "new_accommodations" RENAME TO "accommodations";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_destinationId_key" ON "favorites"("userId", "destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_attractionId_key" ON "favorites"("userId", "attractionId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_restaurantId_key" ON "favorites"("userId", "restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_accommodationId_key" ON "favorites"("userId", "accommodationId");
