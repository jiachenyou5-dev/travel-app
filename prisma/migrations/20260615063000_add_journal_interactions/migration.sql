-- AlterTable: Add region and likeCount to journals
ALTER TABLE "journals" ADD COLUMN "region" TEXT;
ALTER TABLE "journals" ADD COLUMN "likeCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable: JournalLike
CREATE TABLE "journal_likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "journal_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "journal_likes_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "journals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: JournalFavorite
CREATE TABLE "journal_favorites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "journal_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "journal_favorites_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "journals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: JournalComment
CREATE TABLE "journal_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "journal_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "journal_comments_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "journals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex: Unique
CREATE UNIQUE INDEX "journal_likes_userId_journalId_key" ON "journal_likes"("userId", "journalId");
CREATE UNIQUE INDEX "journal_favorites_userId_journalId_key" ON "journal_favorites"("userId", "journalId");
