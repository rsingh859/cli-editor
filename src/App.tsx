import "bulmaswatch/superhero/bulmaswatch.min.css";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./state";
import CodeCell from "./components/code-cell";
import TextEditor from "./components/text-editor";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <TextEditor />
      </div>
    </Provider>
  );
}

export default App;
