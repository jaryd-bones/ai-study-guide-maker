import AppRouter from "./router/AppRouter.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";

const App = () => {
  return (
    <div className="app-root">
      <Navbar />
      <main>
        <AppRouter />
      </main>
    </div>
  );
}

export default App;
