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
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "acceptingSolutions" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Jam_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Jam" ("acceptingSolutions", "endTime", "id", "inviteCode", "isDeleted", "lateWindowMinutes", "ownerId", "startTime", "title") SELECT "acceptingSolutions", "endTime", "id", "inviteCode", "isDeleted", "lateWindowMinutes", "ownerId", "startTime", "title" FROM "Jam";
DROP TABLE "Jam";
ALTER TABLE "new_Jam" RENAME TO "Jam";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
