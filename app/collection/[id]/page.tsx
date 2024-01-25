import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/authOptions";
import { getCollectionDbOp } from "@/lib/db/collection";

import { CreateCollection } from "@/components/collection";
import { CollectionListItem } from "@/components/collection/collectionItem";
import { getUserPreferences } from "@/lib/db/preferences";
import { HistoryComponent } from "@/components/history";

export interface EditDSProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: EditDSProps): Promise<Metadata> {
  const session = (await getServerSession(authOptions)) as ExtendedSession;

  if (!session?.user?.id) {
    return {};
  }

  return {
    title: "Chat",
  };
}

export default async function EditDS({ params }: EditDSProps) {
  const session = (await getServerSession(authOptions)) as ExtendedSession;

  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/collection/${params.id}`);
  }

  const userId = session?.user?.id;
  const collectionId = params.id;
  console.time("test");
  const collection = await getCollectionDbOp({ userId, collectionId });
  console.timeEnd("test");

  if (!collection) {
    redirect("/collection?error=not-found");
  }
  
  
  let userPreferences = await getUserPreferences(userId)

  return (
    <>
      {!collection ? (
        <div>Knowledge Base Not Found...</div>
      ) : (
        <>
          <HistoryComponent
            historyMetadata={{name: collection.name, parent: "All items"}}
            userId={userId}
            historyItems={collection.dataSources}
            userPreferences={userPreferences}
          />
        </>
      )}
    </>
  );
}
