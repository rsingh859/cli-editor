import 'bulmaswatch/superhero/bulmaswatch.min.css';
import { useEffect, useState, useRef } from "react";
import * as esbuild from "esbuild-wasm";
import "./App.css";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor";

function App() {
  const ref = useRef<any>();
  const iframeRef = useRef<any>();
  const [input, setInput] = useState("");

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.28/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    try {
      iframeRef.current.srcdoc = html;

      const result = await ref.current.build({
        entryPoints: ["index.js"],
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin(), fetchPlugin(input)],
        define: {
          "process.env.NODE_ENV": '"production"',
          global: "window",
        },
      });

      iframeRef.current.contentWindow.postMessage(
        result.outputFiles[0].text,
        "*"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
              console.error(err);
            }            
          }, false);
        </script>
      </body>
    </html>
  `;

  return (
    <div className="App">
      <CodeEditor
        initialValue="const a = 1"
        onChange={(value) => setInput(value)}
      />
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe
        title="preview"
        ref={iframeRef}
        sandbox="allow-scripts"
        srcDoc={html}
      ></iframe>
    </div>
  );
}

export default App;
