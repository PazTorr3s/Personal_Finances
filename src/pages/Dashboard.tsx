import FilterBar from "../features/filters/FilterBar";
import SummaryCards from "../features/summary/SummaryCards";
import ListGroup from "../components/dashboard/ListGroup";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
        <FilterBar></FilterBar>
        <SummaryCards></SummaryCards>
        <ListGroup></ListGroup>
    </div>
  );
}
