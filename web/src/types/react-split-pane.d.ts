declare module 'react-split-pane' {
  import * as React from 'react';
  
  interface SplitPaneProps {
    allowResize?: boolean;
    children?: React.ReactNode;
    className?: string;
    primary?: 'first' | 'second';
    minSize?: number | string;
    maxSize?: number | string;
    defaultSize?: number | string;
    size?: number | string;
    split?: 'vertical' | 'horizontal';
    onDragStarted?: () => void;
    onDragFinished?: () => void;
    onChange?: (size: number) => void;
    style?: React.CSSProperties;
    resizerStyle?: React.CSSProperties;
    paneStyle?: React.CSSProperties;
    pane1Style?: React.CSSProperties;
    pane2Style?: React.CSSProperties;
  }
  
  export default class SplitPane extends React.Component<SplitPaneProps> {}
} 