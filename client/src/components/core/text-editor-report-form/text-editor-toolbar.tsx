'use client';

import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import { ListDashes as ListDashesIcon } from '@phosphor-icons/react/dist/ssr/ListDashes';
import { ListNumbers as ListNumbersIcon } from '@phosphor-icons/react/dist/ssr/ListNumbers';
import { TextB as TextBIcon } from '@phosphor-icons/react/dist/ssr/TextB';
import { TextItalic as TextItalicIcon } from '@phosphor-icons/react/dist/ssr/TextItalic';
import { TextStrikethrough as TextStrikethroughIcon } from '@phosphor-icons/react/dist/ssr/TextStrikethrough';
import type { Editor } from '@tiptap/react';

import { usePopover } from '@/hooks/use-popover';

export interface TextEditorToolbarProps {
  editor: Editor | null;
}

export function TextEditorToolbar({ editor }: TextEditorToolbarProps): React.JSX.Element {
  const linkPopover = usePopover<HTMLButtonElement>();
  const [link, setLink] = React.useState<string>('');

  return (
    <React.Fragment>
      <Stack
        className="tiptap-toolbar"
        spacing={1}
        sx={{ borderBottom: '1px solid var(--mui-palette-divider)', p: '8px', minHeight: '57px' }}
      >
        {editor ? (
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <ToolbarButton
              active={editor.isActive('bold')}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              onClick={() => {
                editor.chain().focus().toggleBold().run();
              }}
            >
              <TextBIcon />
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive('italic')}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              onClick={() => {
                editor.chain().focus().toggleItalic().run();
              }}
            >
              <TextItalicIcon />
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive('strike')}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              onClick={() => {
                editor.chain().focus().toggleStrike().run();
              }}
            >
              <TextStrikethroughIcon />
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive('bulletList')}
              disabled={!editor.can().chain().focus().toggleBulletList().run()}
              onClick={() => {
                editor.chain().focus().toggleBulletList().run();
              }}
            >
              <ListDashesIcon />
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive('orderedList')}
              disabled={!editor.can().chain().focus().toggleOrderedList().run()}
              onClick={() => {
                editor.chain().focus().toggleOrderedList().run();
              }}
            >
              <ListNumbersIcon />
            </ToolbarButton>
          </Stack>
        ) : null}
      </Stack>
      <Popover
        anchorEl={linkPopover.anchorRef.current}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={() => {
          linkPopover.handleClose();
          setLink('');
        }}
        open={linkPopover.open}
        slotProps={{ paper: { sx: { p: 2 } } }}
      >
        <FormControl>
          <InputLabel>URL</InputLabel>
          <OutlinedInput
            name="url"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setLink(event.target.value);
            }}
            onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key !== 'Enter') {
                return;
              }

              if (link === '') {
                editor?.chain().focus().extendMarkRange('link').unsetLink().run();
                return;
              }

              editor?.chain().focus().setLink({ href: link }).run();
              linkPopover.handleClose();
              setLink('');
            }}
            value={link}
          />
        </FormControl>
      </Popover>
    </React.Fragment>
  );
}

interface ToolbarButtonProps {
  active?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(function ToolbarButton(
  { active, children, disabled, onClick },
  ref
): React.JSX.Element {
  return (
    <IconButton color={active ? 'primary' : 'secondary'} disabled={disabled} onClick={onClick} ref={ref}>
      {children}
    </IconButton>
  );
});
