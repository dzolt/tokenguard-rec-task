import { useState } from "react";
import { LocalFile } from "papaparse";
import CustomChart from "./components/CustomChart";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { Dropdown, DropdownButton } from "react-bootstrap";

function App() {
  const [csvFile, setCsvFile] = useState<LocalFile | null>(null);
  const [granluarity, setGranularity] = useState<string>("day");

  return (
    <div className="text-white flex w-full h-screen flex-col items-center justify-center bg-slate-700">
      <input
        type="file"
        id="fileInput"
        name="fileInput"
        accept=".csv"
        onChange={(e) => setCsvFile(e.target.files![0])}
      />

      <div>
        <DropdownButton id="dropdown-basic-button" title="Choose Granularity">
          <Dropdown.Item as="button" onClick={() => setGranularity("day")}>
            1 day
          </Dropdown.Item>
          <Dropdown.Item as="button" onClick={() => setGranularity("week")}>
            1 week
          </Dropdown.Item>
          <Dropdown.Item as="button" onClick={() => setGranularity("month")}>
            1 month
          </Dropdown.Item>
        </DropdownButton>
        Current Granularity: <span>1 {granluarity}</span>
      </div>

      {csvFile ? (
        <CustomChart csvFile={csvFile} granularity={granluarity} />
      ) : (
        <div>Upload a file. No data to display currently.</div>
      )}
    </div>
  );
}

export default App;
