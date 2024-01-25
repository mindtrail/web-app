import { Filter } from "@prisma/client";

declare global {
  type FilterItem = {
    name: string;
    filterId: string;
    criteria: string;
  };

  type FilterData = {
    name: string;
    collectionId: string;
    criteria: string;
  };

  type CreateFilter = {
    userId: string;
    name: string;
  };

  type UpdateFilter = Partial<CreateFilter> & {
    filterId: string;
  };
}
