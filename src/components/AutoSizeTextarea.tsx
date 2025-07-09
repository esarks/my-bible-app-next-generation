import * as React from "react";

export interface AutoSizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const AutoSizeTextarea = React.forwardRef<HTMLTextAreaElement, AutoSizeTextareaProps>(
  function AutoSizeTextarea({ style, onChange, onInput, ...rest }, ref) {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
    const mergedRef = React.useCallback((node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }
    }, [ref]);

    const resize = React.useCallback(() => {
      const el = innerRef.current;
      if (el) {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      }
    }, []);

    React.useLayoutEffect(() => {
      resize();
    }, [rest.value, resize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      resize();
      onChange?.(e);
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      resize();
      onInput?.(e);
    };

    return (
      <textarea
        {...rest}
        ref={mergedRef}
        onChange={handleChange}
        onInput={handleInput}
        style={{ overflow: "hidden", resize: "none", ...style }}
      />
    );
  }
);

export default AutoSizeTextarea;
