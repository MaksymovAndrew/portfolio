interface Modifiers {
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
}

// Alt, Ctrl or Cmd: the browser or the system owns the key or the click
export const hasModifier = ({ altKey, ctrlKey, metaKey }: Modifiers): boolean =>
    altKey || ctrlKey || metaKey;
