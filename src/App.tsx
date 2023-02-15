import { useState } from "react";
import { LocalFile } from "papaparse";
import CustomChart from "./components/CustomChart";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { DateRangePicker, RangeKeyDict, Range } from "react-date-range";

function App() {
  const [csvFile, setCsvFile] = useState<LocalFile | null>(null);
  const [granluarity, setGranularity] = useState<string>("day");
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const handleSelect = (ranges: RangeKeyDict) => {
    setDateRange({ ...dateRange, ...ranges.selection });
  };

  return (
    <div className="text-white flex w-full h-screen flex-col items-center justify-center p-8">
      <div className="flex justify-between w-full">
        <input
          type="file"
          id="fileInput"
          name="fileInput"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files![0])}
        />

        <DateRangePicker
          className="text-black"
          ranges={[dateRange]}
          onChange={handleSelect}
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
      </div>

      {csvFile ? (
        <CustomChart
          csvFile={csvFile}
          granularity={granluarity}
          dateRange={dateRange}
        />
      ) : (
        <div>Upload a file. No data to display currently.</div>
      )}
    </div>
  );
}

export default App;
