/*
  Warnings:

  - You are about to drop the column `revision` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `revision` on the `Like` table. All the data in the column will be lost.
  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `postRevision` on the `UserPost` table. All the data in the column will be lost.
  - Added the required column `postRevisionId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postRevisionId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - The required column `revisionId` was added to the `Post` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `postRevisionId` to the `UserPost` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "postRevisionId" TEXT NOT NULL,
    CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_postId_postRevisionId_fkey" FOREIGN KEY ("postId", "postRevisionId") REFERENCES "Post" ("id", "revisionId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("authorId", "createdAt", "id", "postId", "text") SELECT "authorId", "createdAt", "id", "postId", "text" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE TABLE "new_Like" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "postRevisionId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "postId"),
    CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Like_postId_postRevisionId_fkey" FOREIGN KEY ("postId", "postRevisionId") REFERENCES "Post" ("id", "revisionId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Like" ("postId", "userId") SELECT "postId", "userId" FROM "Like";
DROP TABLE "Like";
ALTER TABLE "new_Like" RENAME TO "Like";
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL,
    "revisionId" TEXT NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "script" TEXT NOT NULL DEFAULT '',
    "authorId" TEXT NOT NULL,
    "jamId" TEXT,

    PRIMARY KEY ("id", "revisionId"),
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_jamId_fkey" FOREIGN KEY ("jamId") REFERENCES "Jam" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorId", "content", "createdAt", "description", "id", "jamId", "published", "revision", "script", "updatedAt") SELECT "authorId", "content", "createdAt", "description", "id", "jamId", "published", "revision", "script", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE TABLE "new_UserPost" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "postRevisionId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "postId"),
    CONSTRAINT "UserPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserPost_postId_postRevisionId_fkey" FOREIGN KEY ("postId", "postRevisionId") REFERENCES "Post" ("id", "revisionId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserPost" ("postId", "userId") SELECT "postId", "userId" FROM "UserPost";
DROP TABLE "UserPost";
ALTER TABLE "new_UserPost" RENAME TO "UserPost";
CREATE TABLE "new_jamPost" (
    "jamId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "postRevision" TEXT NOT NULL,

    PRIMARY KEY ("jamId", "postId"),
    CONSTRAINT "jamPost_jamId_fkey" FOREIGN KEY ("jamId") REFERENCES "Jam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "jamPost_postId_postRevision_fkey" FOREIGN KEY ("postId", "postRevision") REFERENCES "Post" ("id", "revisionId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_jamPost" ("jamId", "postId", "postRevision") SELECT "jamId", "postId", "postRevision" FROM "jamPost";
DROP TABLE "jamPost";
ALTER TABLE "new_jamPost" RENAME TO "jamPost";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
