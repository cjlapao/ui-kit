import React__default from 'react';
import { C as CapsuleBlueprintParameter } from './CapsuleBlueprint-CHSMstOd.js';
export { K as HelpButton } from './CapsuleBlueprint-CHSMstOd.js';

/**
 * MarkdownEditor Component
 * Wraps @uiw/react-md-editor and adds Smart Variable support.
 */
interface MarkdownEditorProps {
    value?: string;
    onChange?: (value: string | undefined) => void;
    height?: number;
    className?: string;
    placeholder?: string;
    readOnly?: boolean;
    preview?: "live" | "edit" | "preview";
    globalParameters?: CapsuleBlueprintParameter[];
    serviceNames?: string[];
    context?: {
        slug?: string;
        enable_https?: boolean;
    };
}
declare const MarkdownEditor: React__default.FC<MarkdownEditorProps>;

export { MarkdownEditor };
