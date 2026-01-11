import FilterBar from "../features/filters/FilterBar";
import AnalysisGraphics from "../components/analysis/Graphics";

export default function Analysis() {
  return (
    <div className="analysis">
      <FilterBar></FilterBar>
      <AnalysisGraphics></AnalysisGraphics>
    </div>
  );
}
