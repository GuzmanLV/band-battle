/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `audioUrl` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bandName" TEXT NOT NULL,
    "songName" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Participant" ("bandName", "createdAt", "description", "id", "songName", "thumbnailUrl") SELECT "bandName", "createdAt", "description", "id", "songName", "thumbnailUrl" FROM "Participant";
DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
