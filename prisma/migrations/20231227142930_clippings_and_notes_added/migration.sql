-- AlterTable
ALTER TABLE "Tags" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Clippings" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "externalResources" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clippings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSourceClipping" (
    "dataSourceId" TEXT NOT NULL,
    "clippingId" TEXT NOT NULL,

    CONSTRAINT "DataSourceClipping_pkey" PRIMARY KEY ("dataSourceId","clippingId")
);

-- CreateTable
CREATE TABLE "Notes" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSourceNote" (
    "dataSourceId" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,

    CONSTRAINT "DataSourceNote_pkey" PRIMARY KEY ("dataSourceId","noteId")
);

-- CreateTable
CREATE TABLE "CollectionNote" (
    "collectionId" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,

    CONSTRAINT "CollectionNote_pkey" PRIMARY KEY ("collectionId","noteId")
);

-- AddForeignKey
ALTER TABLE "DataSourceClipping" ADD CONSTRAINT "DataSourceClipping_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "DataSources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSourceClipping" ADD CONSTRAINT "DataSourceClipping_clippingId_fkey" FOREIGN KEY ("clippingId") REFERENCES "Clippings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSourceNote" ADD CONSTRAINT "DataSourceNote_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "DataSources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSourceNote" ADD CONSTRAINT "DataSourceNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionNote" ADD CONSTRAINT "CollectionNote_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionNote" ADD CONSTRAINT "CollectionNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
