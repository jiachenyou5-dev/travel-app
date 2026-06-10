-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_destinations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameZh" TEXT NOT NULL,
    "nameEn" TEXT,
    "province" TEXT,
    "description" TEXT,
    "coverImage" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "country" TEXT NOT NULL DEFAULT '中国',
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
    "submittedById" TEXT,
    "reviewNotes" TEXT,
    "transportation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "destinations_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_destinations" ("country", "coverImage", "createdAt", "description", "id", "isPublished", "latitude", "longitude", "nameEn", "nameZh", "province", "transportation", "updatedAt") SELECT "country", "coverImage", "createdAt", "description", "id", "isPublished", "latitude", "longitude", "nameEn", "nameZh", "province", "transportation", "updatedAt" FROM "destinations";
DROP TABLE "destinations";
ALTER TABLE "new_destinations" RENAME TO "destinations";
CREATE TABLE "new_restaurants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destinationId" TEXT NOT NULL,
    "nameZh" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" TEXT,
    "address" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "cuisineType" TEXT,
    "priceRange" TEXT,
    "openingHours" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
    "submittedById" TEXT,
    "reviewNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "restaurants_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "restaurants_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_restaurants" ("address", "createdAt", "cuisineType", "description", "destinationId", "id", "isPublished", "latitude", "longitude", "nameEn", "nameZh", "openingHours", "phone", "priceRange", "updatedAt", "website") SELECT "address", "createdAt", "cuisineType", "description", "destinationId", "id", "isPublished", "latitude", "longitude", "nameEn", "nameZh", "openingHours", "phone", "priceRange", "updatedAt", "website" FROM "restaurants";
DROP TABLE "restaurants";
ALTER TABLE "new_restaurants" RENAME TO "restaurants";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
