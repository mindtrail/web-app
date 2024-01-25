"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  IconAllData,
  IconChevronRight,
  IconFolders,
  IconHighlight,
  IconIdea,
  IconTag,
} from "../ui/icons/next-icons";

const mockCollections = [
  { name: "Collection 1", url: "/" },
  { name: "UX Collection", url: "/collection/create" },
];

const FAVORITES_URL = "/";
const ALLITEMS_URL = "/history";

const SIDEBAR_BUTTON = cn(buttonVariants({ variant: "sidebar" }));
const OPEN_SIDEBAR_BUTTON = cn(buttonVariants({ variant: "opensidebar" }));
const ACTIVE_SIDEBAR_BUTTON = "text-primary font-semibold hover:text-primary";
const TRIGGER_HEADER_STYLE =
  "flex flex-1 justify-between pl-3 gap-2 cursor-pointer";
const NAV_ITEM_STYLE = "flex flex-col pl-2 py-2 items-stretch";

const OPENSIDEBAR_NAVITEM_STYLE = "pl-2 cursor-pointer text-center";
const NAV_ITEM_CONTENT_STYLE = "flex flex-1 gap-2";

type SidebarFoldersProps = {
  setOpenSecondSidebar: (value: boolean) => void;
  openSecondSidebar: boolean;
  setTitle: (value: string) => void;
  loading: boolean;
  filters: any;
  setSelected: (value: any) => void;
};

const SELECTED_ITEM = {
  FILTERS: 0,
  COLLECTIONS: 1,
  TAGS: 2,
  HIGHLIHTS: 3,
};

// @ts-ignore
export default function FolderItems({
  setOpenSecondSidebar,
  openSecondSidebar,
  setTitle,
  loading,
  setSelected,
}: SidebarFoldersProps) {
  const pathname = usePathname();

  const [filteredCollections, setFilteredCollections] =
    useState<{ name: string; url: string }[]>(mockCollections);

  if (loading) {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col ml-1 items-stretch mt-2">
        <Link
          href={ALLITEMS_URL}
          className={cn(
            openSecondSidebar ? OPEN_SIDEBAR_BUTTON : SIDEBAR_BUTTON,
            pathname === FAVORITES_URL && ACTIVE_SIDEBAR_BUTTON
          )}
        >
          <div className="flex flex-1 gap-4">
            <IconAllData />
            All Items
          </div>
        </Link>
      </div>
      <Separator className="mb-2 mt-2" />
      <div className={NAV_ITEM_STYLE}>
        <div
          className={
            !openSecondSidebar
              ? TRIGGER_HEADER_STYLE
              : OPENSIDEBAR_NAVITEM_STYLE
          }
        >
          <Button
            variant="sidebarSection"
            className="w-full flex items-center whitespace-nowrap overflow-hidden text-ellipsis"
            onClick={() => {
              setTitle("Smart Folders");
              setSelected(SELECTED_ITEM.FILTERS);
              setOpenSecondSidebar(!openSecondSidebar);
            }}
          >
            <div className="flex justify-between w-full">
              <div className={NAV_ITEM_CONTENT_STYLE}>
                <IconIdea />
                <span className="ml-2">Smart Folders</span>
              </div>

              <div className="flex items-center">
                <IconChevronRight />
              </div>
            </div>
          </Button>
        </div>
      </div>

      <div className={NAV_ITEM_STYLE}>
        <div
          className={
            !openSecondSidebar
              ? TRIGGER_HEADER_STYLE
              : OPENSIDEBAR_NAVITEM_STYLE
          }
        >
          <Button
            variant="sidebarSection"
            className="w-full flex items-center whitespace-nowrap overflow-hidden text-ellipsis"
            onClick={() => {
              setTitle("Folders");
              setSelected(SELECTED_ITEM.COLLECTIONS);
              setOpenSecondSidebar(!openSecondSidebar);
            }}
          >
            <div className="flex justify-between w-full">
              <div className={NAV_ITEM_CONTENT_STYLE}>
                <IconFolders />
                <span className="ml-2">Folders</span>
              </div>

              <div className="flex items-center">
                <IconChevronRight />
              </div>
            </div>
          </Button>
        </div>
      </div>
      <div className={NAV_ITEM_STYLE}>
        <div
          className={
            !openSecondSidebar
              ? TRIGGER_HEADER_STYLE
              : OPENSIDEBAR_NAVITEM_STYLE
          }
        >
          <Button
            variant="sidebarSection"
            className="w-full flex items-center whitespace-nowrap overflow-hidden text-ellipsis"
            onClick={() => {
              setTitle("Tags");
              setSelected(SELECTED_ITEM.TAGS);
              setOpenSecondSidebar(!openSecondSidebar);
            }}
          >
            <div className="flex justify-between w-full">
              <div className={NAV_ITEM_CONTENT_STYLE}>
                <IconTag />
                <span className="ml-2">Tags</span>
              </div>

              <div className="flex items-center">
                <IconChevronRight />
              </div>
            </div>
          </Button>
        </div>
      </div>
      <div className={NAV_ITEM_STYLE}>
        <div
          className={
            !openSecondSidebar
              ? TRIGGER_HEADER_STYLE
              : OPENSIDEBAR_NAVITEM_STYLE
          }
        >
          <Button
            variant="sidebarSection"
            className="w-full flex items-center whitespace-nowrap overflow-hidden text-ellipsis"
            onClick={() => {
              setTitle("Highlits");
            }}
          >
            <div className="flex justify-between w-full">
              <div className={NAV_ITEM_CONTENT_STYLE}>
                <IconHighlight />
                <span className="ml-2">Highlits</span>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
