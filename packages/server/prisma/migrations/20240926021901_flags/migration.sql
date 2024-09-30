/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `Jam` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JamParticipant" (
    "userId" TEXT NOT NULL,
    "jamId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("jamId", "userId"),
    CONSTRAINT "JamParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JamParticipant_jamId_fkey" FOREIGN KEY ("jamId") REFERENCES "Jam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JamParticipant" ("jamId", "userId") SELECT "jamId", "userId" FROM "JamParticipant";
DROP TABLE "JamParticipant";
ALTER TABLE "new_JamParticipant" RENAME TO "JamParticipant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Jam_inviteCode_key" ON "Jam"("inviteCode");
