"use client";

import { Fragment, KeyboardEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Separator } from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  createCollection,
  deleteCollection,
  updateCollection,
} from "@/lib/serverActions/collection";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  IconCancel,
  IconChevronLeft,
  IconDotsVertical,
  IconFolder,
  IconFolderOpen,
  IconSearch,
} from "../ui/icons/next-icons";
import { ScrollArea } from "../ui/scroll-area";

type SecondSidebarProps = {
  title: string;
  items: SidebarItem[];
  setItems: (items: SidebarItem[]) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  pathname: string;
};

const SIDEBAR_BUTTON = cn(buttonVariants({ variant: "sidebar" }));
const NESTED_ITEM_STYLE = cn(SIDEBAR_BUTTON, "pl-2");
const ACTIVE_SIDEBAR_BUTTON = "text-gray font-semibold hover:text-gray ";

export const SecondSidebar: React.FC<SecondSidebarProps> = ({
  title,
  items,
  setItems,
  open,
  setOpen,
  pathname,
}) => {
  const [filteredItems, setFilteredItems] = useState<SidebarItem[]>(items);
  const [searchValue, setSearchValue] = useState("");

  const [showNewItem, setShowNewItem] = useState(false);
  const [nameNewItem, setNameNewItem] = useState("");
  const [loading, setLoading] = useState(false);

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [showMenuForItemId, setShowMenuForItemId] = useState<string | null>(
    null
  );

  // Inside SecondSidebar component
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const onUpdateFolderName = async (id: string, newName: string) => {
    setLoading(true);
    try {
      await updateCollection({
        collectionId: id,
        name: newName,
        description: "",
      });

      const elements = items.map((element) => {
        if (element.id === id) {
          return {
            ...element,
            name: newName,
          };
        }
        return element;
      });
      setFilteredItems(elements);
      setItems(elements);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      // Implement your update logic here
      setIsEditing({ ...isEditing, [id]: false });
    }
  };

  const onDuplicate = (id: string) => {
    // Implement your duplication logic here
  };

  const onDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteCollection({
        collectionId: id,
      });

      const elements = items.filter((element) => element.id !== id);
      setFilteredItems(elements);
      setItems(elements);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const onFilterItems = (value) => {
    const searchitems = items.filter((item: any) => {
      return item.name.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredItems(searchitems);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    fn: Function
  ) => {
    if (event.key === "Enter") {
      fn();
    }
  };

  const onSaveNewItem = async () => {
    setLoading(true);
    try {
      const response = await createCollection({
        name: nameNewItem,
        userId: "",
        description: "",
      });

      if ("id" in response && "name" in response && "description" in response) {
        const item: SidebarItem = response;
        const elements = [
          {
            id: item.id,
            name: item.name,
            description: item.description,
            url: `/collection/${item.id}`,
          },
          ...items,
        ];
        setFilteredItems(elements);
        setItems(elements);
      } else {
        // Handle error case
        const error = response;
        console.error("Error creating item:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setNameNewItem("");
      setShowNewItem(false);
    }
  };

  return (
    <div
      className={`absolute bg-white top-14 flex flex-col flex-shrink-0 overflow-hidden z-10 transition-all duration-3  ease-in-out left-14 ${
        open ? "w-[200px] border-l  border-r " : "w-[0px]"
      }`}
      style={{ height: "calc(100vh - 3.5rem)" }}
    >
      <nav className={`flex flex-col w-full border-r flex-shrink-0 `}>
        <div className="pr-4 pl-2 py-2 border-b flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => setOpen(false)}>
              <IconChevronLeft />
            </button>
            <div className="pl-2">
              <span className="font-semibold">
                {title} ({items.length})
              </span>
            </div>
          </div>
          <DropdownMenu setShowNewItem={setShowNewItem} />
        </div>
        <Separator className="mb-2" />
        <div className="flex w-full items-center mt-2">
          <Input
            id="search"
            className="flex-1 bg-white border-[1px] ml-4 mr-2 disabled:bg-gray-100 disabled:text-gray-400 px-2"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              onFilterItems(e.target.value);
            }}
            placeholder="Search"
          />
          <button
            onClick={() => {
              onFilterItems(searchValue);
            }}
            className="mr-4"
          >
            <IconSearch />
          </button>
        </div>
        <Separator className="my-2" />
        {showNewItem && (
          <div className="mx-2 ml-4 mt-2 pb-2 flex items-center">
            <IconFolder />
            <Input
              id="name"
              className="file:font-normal text-xs ml-2 flex-1 bg-white border-[1px] disabled:bg-gray-100 disabled:text-gray-400"
              value={nameNewItem}
              onChange={(e) => setNameNewItem(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, onSaveNewItem)}
              placeholder="Name"
            />
            <button
              onClick={() => {
                setShowNewItem(false);
                setNameNewItem("");
              }}
              className=""
            >
              <IconCancel />
            </button>
          </div>
        )}
        {loading && (
          <div
            role="status"
            className="h-14 items-center justify-center self-center text-center flex place-content-center"
          >
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
        )}
        {!loading && filteredItems && (
          <ScrollArea className="flex-1 flex flex-col max-h-[80vh] border-r-0 py-1 px-2">
            {filteredItems.map(({ id, name, url }, index) => (
              <>
                {isEditing[id] ? (
                  <div className="mx-3 flex">
                    <input
                      id="name"
                      className="mt-1 block w-full appearance-none rounded-md px-3 py-2 placeholder-gray-400 shadow-sm border focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                      defaultValue={name}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onUpdateFolderName(id, e.target.value);
                        }
                      }}
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setIsEditing({ ...isEditing, [id]: false });
                      }}
                    >
                      <IconCancel />
                    </button>
                  </div>
                ) : (
                  <div
                    key={index}
                    className={cn(
                      pathname === url && "bg-gray-100 rounded-sm	",
                      "p-2 flex justify-between items-center hover:bg-gray-100 rounded-sm "
                    )}
                    onMouseEnter={() => setHoveredItemId(id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                  >
                    <Link
                      href={url || ""}
                      className={cn(
                        NESTED_ITEM_STYLE,
                        pathname === url && ACTIVE_SIDEBAR_BUTTON,
                        "flex items-center gap-2 flex-grow w-[50px] "
                      )}
                    >
                      {pathname === url ? <IconFolderOpen /> : <IconFolder />}
                      <span className="truncate flex-grow">{name}</span>{" "}
                      {/* Apply truncate and flex-grow */}
                    </Link>
                    <div className="flex-shrink-0">
                      {hoveredItemId === id && (
                        <>
                          <button onClick={() => setShowMenuForItemId(id)}>
                            <IconDotsVertical />
                          </button>
                          {showMenuForItemId === id && (
                            <div className="absolute right-0 mt-1 bg-white border rounded shadow z-10">
                              <button
                                onClick={() => {
                                  let isEditingArray = { ...isEditing };
                                  Object.keys(isEditing).forEach((id) => {
                                    if (isEditing[id]) {
                                      isEditingArray = {
                                        ...isEditingArray,
                                        [id]: false,
                                      };
                                    }
                                  });
                                  setIsEditing({
                                    ...isEditingArray,
                                    [id]: true,
                                  });
                                }}
                                className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Rename
                              </button>
                              <button
                                onClick={() => onDuplicate(id)}
                                className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Duplicate
                              </button>
                              <button
                                onClick={() => setConfirmDelete(id)}
                                className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            ))}
          </ScrollArea>
        )}
        {!loading && filteredItems && filteredItems.length === 0 && (
          <div className="h-14 flex items-center justify-center">No items</div>
        )}
        {confirmDelete && (
          <Dialog
            open={confirmDelete && confirmDelete !== null}
            onOpenChange={() => setConfirmDelete(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this folder?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="items-center">
                <Button onClick={() => onDelete(confirmDelete)}>Delete</Button>
                <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </nav>
    </div>
  );
};

const DropdownMenu = ({ setShowNewItem }: { setShowNewItem: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center w-full py-2 text-sm font-medium text-gray-700"
      >
        <IconDotsVertical />
      </button>

      {isOpen && (
        <div className="absolute z-50 right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1 items-center justify-center"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <Button
              onClick={() => {
                setShowNewItem(true);
                setIsOpen(!isOpen);
              }}
              className="block border-b w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              variant="ghost"
            >
              Create new folder
            </Button>
            <Button
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              className="block w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              variant="ghost"
            >
              Show Folders Tutorial
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
