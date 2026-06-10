-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_attractions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destinationId" TEXT NOT NULL,
    "nameZh" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" TEXT,
    "address" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "ticketPrice" REAL,
    "openingHours" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
    "submittedById" TEXT,
    "reviewNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "attractions_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "attractions_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_attractions" ("address", "createdAt", "description", "destinationId", "id", "isPublished", "latitude", "longitude", "nameEn", "nameZh", "openingHours", "phone", "ticketPrice", "updatedAt", "website") SELECT "address", "createdAt", "description", "destinationId", "id", "isPublished", "latitude", "longitude", "nameEn", "nameZh", "openingHours", "phone", "ticketPrice", "updatedAt", "website" FROM "attractions";
DROP TABLE "attractions";
ALTER TABLE "new_attractions" RENAME TO "attractions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
