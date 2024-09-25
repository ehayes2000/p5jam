/*
  Warnings:

  - Added the required column `acceptingSolutions` to the `Jam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isDeleted` to the `Jam` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Jam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inviteCode" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME NOT NULL,
    "lateWindowMinutes" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,
    "acceptingSolutions" BOOLEAN NOT NULL,
    CONSTRAINT "Jam_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Jam" ("endTime", "id", "inviteCode", "lateWindowMinutes", "ownerId", "startTime", "title") SELECT "endTime", "id", "inviteCode", "lateWindowMinutes", "ownerId", "startTime", "title" FROM "Jam";
DROP TABLE "Jam";
ALTER TABLE "new_Jam" RENAME TO "Jam";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
