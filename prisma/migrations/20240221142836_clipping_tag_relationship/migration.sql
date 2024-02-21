-- CreateTable
CREATE TABLE "ClippingTag" (
    "clippingId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ClippingTag_pkey" PRIMARY KEY ("clippingId","tagId")
);

-- AddForeignKey
ALTER TABLE "ClippingTag" ADD CONSTRAINT "ClippingTag_clippingId_fkey" FOREIGN KEY ("clippingId") REFERENCES "Clippings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClippingTag" ADD CONSTRAINT "ClippingTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
