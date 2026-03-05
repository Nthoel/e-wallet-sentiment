/*
  Warnings:

  - The primary key for the `reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `review_id` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `id` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reviews" RENAME COLUMN "review_id" TO "id";

