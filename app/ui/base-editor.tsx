"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import type { PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import dynamic from "next/dynamic";
import type { CSSProperties } from "react";

interface BaseEditorProps {
    initialContent?: PartialBlock[];

    editable?: boolean;

    onChange?: (
        content: PartialBlock[],
    ) => void;

    className?: string;

    minHeight?: string | number;

    formattingToolbar?: boolean;

    sideMenu?: boolean;

    slashMenu?: boolean;
}

function BaseEditorContent({
    initialContent,
    editable = true,
    onChange,
    className = "",
    minHeight = "8rem",
    formattingToolbar,
    sideMenu,
    slashMenu,
}: BaseEditorProps) {
    const editor = useCreateBlockNote({
        initialContent:
            initialContent &&
                initialContent.length > 0
                ? initialContent
                : [
                    {
                        type: "paragraph",
                    },
                ],
    });

    const showFormattingToolbar =
        formattingToolbar ?? editable;

    const showSideMenu =
        sideMenu ?? editable;

    const showSlashMenu =
        slashMenu ?? editable;

    const editorStyle: CSSProperties =
        {
            minHeight:
                typeof minHeight ===
                    "number"
                    ? `${minHeight}px`
                    : minHeight,
        };

    return (
        <div
            className={`overflow-hidden rounded-xl border border-gray-200 bg-white font-(--font-primary) ${className}`}
            style={editorStyle}
        >
            <BlockNoteView
                editor={editor}
                editable={editable}
                theme="light"
                formattingToolbar={
                    showFormattingToolbar
                }
                sideMenu={
                    showSideMenu
                }
                slashMenu={
                    showSlashMenu
                }
                data-editor
                onChange={() => {
                    onChange?.(
                        editor.document,
                    );
                }}
            />
        </div>
    );
}

const BaseEditor = dynamic(
    () =>
        Promise.resolve(
            BaseEditorContent,
        ),
    {
        ssr: false,

        loading: () => (
            <div className="flex min-h-32 items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
                <span className="text-sm text-gray-400">
                    در حال بارگذاری ویرایشگر...
                </span>
            </div>
        ),
    },
);

export default BaseEditor;