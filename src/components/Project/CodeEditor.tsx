"use client";

import { CopyMinus, Files, SaveAll } from "lucide-react";
import { useState, useEffect } from "react";
import {
  ControlledTreeEnvironment,
  Tree,
  TreeItem,
  TreeItemIndex,
} from "react-complex-tree";

import Editor from "@monaco-editor/react";
import "react-complex-tree/lib/style-modern.css";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";

/** * Types for the WebContainer template structure
 */
export interface FileNode {
  file: {
    contents: string;
  };
}

export interface DirectoryNode {
  directory: WebContainerTemplate;
}

export type WebContainerTemplate = Record<string, FileNode | DirectoryNode>;

/**
 * Type for the items stored in the Tree
 */
interface CustomTreeItem extends TreeItem {
  index: string;
  canMove: boolean;
  isFolder: boolean;
  children: string[];
  data: string;
  content: string | null;
}

interface TreeData {
  items: Record<string, CustomTreeItem>;
}

const readWebContainerTemplate = (
  template: WebContainerTemplate,
  data: TreeData = { items: {} },
  path: string = "",
): TreeData => {
  for (const [key, value] of Object.entries(template)) {
    const id = path ? `${path}/${key}` : key;
    const isFolder = "directory" in value;

    data.items[id] = {
      index: id,
      canMove: true,
      isFolder,
      children: isFolder
        ? Object.keys((value as DirectoryNode).directory).map(
            (child) => `${id}/${child}`,
          )
        : [],
      data: key,
      content: !isFolder ? (value as FileNode).file?.contents : null,
    };

    if (isFolder) {
      readWebContainerTemplate((value as DirectoryNode).directory, data, id);
    }
  }

  return data;
};

function readTreeTemplate(items: Record<string, CustomTreeItem>) {
  function buildNode(nodeId: string) {
    const node = items[nodeId];

    // If it's a folder → return directory
    if (node.isFolder) {
      const directory: WebContainerTemplate = {};

      node.children.forEach((childId) => {
        const child = items[childId];

        // Use the "content" (or fallback to index) as key name
        const key = child.index.split("/").at(-1) as unknown as string;

        directory[key] = buildNode(childId);
      });

      return { directory };
    }

    // If it's a file → return file with contents
    return {
      file: {
        contents: node.content || "",
      },
    };
  }

  const result: WebContainerTemplate = {};

  // Start from root level children
  items.root.children.forEach((childId) => {
    const child = items[childId];
    const key = child.index.split("/").at(-1) as string;

    result[key] = buildNode(childId);
  });

  return result;
}

interface CodeEditorProps {
  code: WebContainerTemplate;
  projectId: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, projectId }) => {
  const [tree, settree] = useState(
    readWebContainerTemplate({
      root: {
        directory: code,
      },
    }),
  );

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Assuming mutationOptions provides the correct generic types from your TRPC router
  const { mutate: SaveCode, isPending: isSavingCode } = useMutation(
    trpc.project.saveCode.mutationOptions(),
  );

  const [focusedItem, setFocusedItem] = useState<TreeItemIndex | undefined>();
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([]);
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);
  const [Code, setCode] = useState<string>("");

  const [webContainerCode, setwebContainerCode] = useState(
    readTreeTemplate(tree.items),
  );

  useEffect(() => {
    setwebContainerCode(readTreeTemplate(tree.items));
  }, [tree]);

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="rct-dark min-w-sm flex flex-col">
        <button
          onClick={() => {
            setExpandedItems([]);
          }}
          className="ml-auto p-4"
        >
          <CopyMinus size={15} />
        </button>
        <ControlledTreeEnvironment
          items={tree.items}
          getItemTitle={(item) => item.data}
          viewState={{
            ["tree-1"]: {
              focusedItem,
              expandedItems,
              selectedItems,
            },
          }}
          onFocusItem={(item) => setFocusedItem(item.index)}
          onExpandItem={(item) =>
            setExpandedItems([...expandedItems, item.index])
          }
          onCollapseItem={(item) =>
            setExpandedItems(
              expandedItems.filter(
                (expandedItemIndex) => expandedItemIndex !== item.index,
              ),
            )
          }
          onSelectItems={(items) => {
            setSelectedItems(items);

            const selected = items[0];
            const item = tree.items[selected as string];

            if (item && !item.isFolder) {
              setCode(item.content ?? "");
            }
          }}
        >
          <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
        </ControlledTreeEnvironment>
      </div>
      <div style={{ flex: 1, paddingTop: 8, background: "#1e1e1e" }}>
        <div className="h-9 border-b border-white/5 bg-zinc-900/80 flex items-center justify-between px-4 shrink-0">
          <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 flex items-center gap-2">
            <Files size={12} /> Editor
          </span>
          <button
            className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 flex items-center gap-2"
            onClick={() => {
              SaveCode({
                files: JSON.stringify(webContainerCode),
                projectId: projectId,
              });
              queryClient.invalidateQueries({
                queryKey: trpc.project.getProject.queryKey({
                  projectId: projectId,
                }),
              });
            }}
          >
            {isSavingCode && <Spinner />}
            <SaveAll size={12} /> {isSavingCode ? "Saving.." : "Save"}
          </button>
        </div>
        <Editor
          width="100%"
          height="100%"
          language="javascript"
          theme="vs-dark"
          key={selectedItems[0] as string}
          value={Code}
          onChange={(value) => {
            const newValue = value ?? "";

            setCode(newValue ?? "");
            settree((prev) => {
              if (!focusedItem) return prev;

              return {
                ...prev,
                items: {
                  ...prev.items,
                  [focusedItem]: {
                    ...prev.items[focusedItem],
                    content: newValue,
                  },
                },
              };
            });
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
