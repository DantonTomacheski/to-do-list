import Routes from "./routes";
import "./i18n";
import "./index.css";
console.log("development", import.meta.env.NODE_ENV);
function App() {
  return <Routes />;
}

export default App;
