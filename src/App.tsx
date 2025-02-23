
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PollutionMonitor from "./pages/PollutionMonitor";
import DeforestationMonitor from "./pages/DeforestationMonitor";
import Environment from "./pages/Environment";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/pollution" element={<PollutionMonitor />} />
        <Route path="/deforestation" element={<DeforestationMonitor />} />
        <Route path="/environment" element={<Environment />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
