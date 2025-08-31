import Prism from "prismjs";
import { useEffect } from "react";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

import "./code-theme.css";

interface Props {
  code: string;
  language: string;
}

const CodeView = ({ code, language }: Props) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <pre className={`p-2 bg-transparent border-none rounded-none m-0 text-xs`}>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
};

export default CodeView;
