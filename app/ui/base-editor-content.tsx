"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import dynamic from "next/dynamic";

import type { PartialBlock } from "@blocknote/core";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

interface BaseEditorContentProps {
  content: PartialBlock[];
}

function BaseEditorContentInner({
  content,
}: BaseEditorContentProps) {
  const editor = useCreateBlockNote({
    initialContent:
      content && content.length > 0
        ? content
        : [{ type: "paragraph" }],
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        editable={false}
        theme="light"
        data-editor
        formattingToolbar={false}
        sideMenu={false}
        slashMenu={false}
      />
    </div>
  );
}

const BaseEditorContent = dynamic(() => Promise.resolve(BaseEditorContentInner),
  {
    ssr: false,
    loading: () => (
      <div className="px-6 py-10 md:px-12">
        <div className="mx-auto max-w-4xl text-sm text-slate-400">
          در حال بارگذاری محتوا...
        </div>
      </div>
    ),
  },
);

export default BaseEditorContent;