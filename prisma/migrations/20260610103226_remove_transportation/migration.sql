/*
  Warnings:

  - You are about to drop the column `transportation` on the `destinations` table. All the data in the column will be lost.

*/
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "destinations_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_destinations" ("country", "coverImage", "createdAt", "description", "id", "isPublished", "latitude", "longitude", "nameEn", "nameZh", "province", "reviewNotes", "status", "submittedById", "updatedAt") SELECT "country", "coverImage", "createdAt", "description", "id", "isPublished", "latitude", "longitude", "nameEn", "nameZh", "province", "reviewNotes", "status", "submittedById", "updatedAt" FROM "destinations";
DROP TABLE "destinations";
ALTER TABLE "new_destinations" RENAME TO "destinations";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
