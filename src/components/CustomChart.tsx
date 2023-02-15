import { LocalFile } from "papaparse";
import useParseLocalCSV from "../hooks/useParseLocalCSV";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { CSVFileData } from "../../typings";
import { format, parse } from "date-fns";
import CustomTooltip from "./CustomTooltip";

type Props = {
  csvFile: LocalFile;
  granularity: string;
};

const handleGranularityChange = (
  granularity: string,
  csvData: CSVFileData[]
): CSVFileData[] => {
  let granularizedData: {
    [name: string]: {
      date: string;
      avg_transfer_value: number;
      transfers_count: number;
    };
  } = {};
  if (granularity === "week") {
    let helperIndex = 0;

    for (let i = 0; i < csvData.length; i++) {
      const date = csvData[i].date;
      const day = date.getDate();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const index =
        month <= 9 ? `${day}/0${month}/${year}` : `${day}/${month}/${year}`;
      if (i % 7 === 0 && i !== 0) {
        helperIndex++;
      }
      if (!granularizedData[helperIndex]) {
        granularizedData[helperIndex] = {
          date: index,
          avg_transfer_value:
            csvData[i].avg_transfer_value * csvData[i].transfers_count,
          transfers_count: csvData[i].transfers_count,
        };
      } else {
        granularizedData[helperIndex].date = index;
        granularizedData[helperIndex].avg_transfer_value +=
          csvData[i].avg_transfer_value * csvData[i].transfers_count;
        granularizedData[helperIndex].transfers_count +=
          csvData[i].transfers_count;
      }
    }

    const data: CSVFileData[] = [];
    Object.values(granularizedData).map((value) => {
      const item: CSVFileData = {
        date: parse(value.date, "dd/MM/yyyy", new Date()),
        avg_transfer_value: value.avg_transfer_value / value.transfers_count,
        transfers_count: value.transfers_count,
      };

      data.push(item);
    });
    return data;
  } else if (granularity === "month") {
    for (let i = 0; i < csvData.length; i++) {
      const date = csvData[i].date;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const index = month <= 9 ? `0${month}/${year}` : `${month}/${year}`;

      if (!granularizedData[index]) {
        granularizedData[index] = {
          date: index,
          avg_transfer_value:
            csvData[i].avg_transfer_value * csvData[i].transfers_count,
          transfers_count: csvData[i].transfers_count,
        };
      } else {
        granularizedData[index].avg_transfer_value +=
          csvData[i].avg_transfer_value * csvData[i].transfers_count;
        granularizedData[index].transfers_count += csvData[i].transfers_count;
      }
    }

    const data: CSVFileData[] = [];
    Object.values(granularizedData).map((value) => {
      const item: CSVFileData = {
        date: parse(value.date, "MM/yyyy", new Date()),
        avg_transfer_value: value.avg_transfer_value / value.transfers_count,
        transfers_count: value.transfers_count,
      };

      data.push(item);
    });
    return data;
  } else {
    return csvData;
  }
};

const CustomChart = ({ csvFile, granularity }: Props) => {
  const csvData = useParseLocalCSV(csvFile);

  const [granularityCSVData, setGranularityCSVData] =
    useState<CSVFileData[]>(csvData);

  const formatXAxis = (tickItem: any) => {
    if (typeof tickItem === "object") {
      try {
        return granularity === "month"
          ? format(tickItem, "MM/yyyy")
          : format(tickItem, "dd/MM/yyyy");
      } catch (error) {
        const date = parse(
          tickItem.toLocaleString(),
          "yyyy-MM-dd'T'HH:mm:ssxxx",
          new Date()
        );
        return format(date, "dd/MM/yyyy");
      }
    } else return tickItem;
  };

  useEffect(() => {
    if (granularity === "day") {
      setGranularityCSVData(csvData);
    } else {
      const granularityChangedData = handleGranularityChange(
        granularity,
        csvData
      );
      setGranularityCSVData(granularityChangedData);
    }
  }, [csvData, granularity]);

  return (
    <>
      <ResponsiveContainer width="80%" height="80%">
        <LineChart
          width={500}
          height={300}
          data={granularityCSVData}
          margin={{
            top: 100,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="date" tickFormatter={formatXAxis} name="Date" />
          <YAxis width={60} type="number" domain={["0", "auto"]} />
          <Legend />
          <Line
            type="monotone"
            dataKey="avg_transfer_value"
            stroke="#8884d8"
            activeDot={{ r: 6 }}
            name="Average Transfer Value"
          />
          <Line
            type="monotone"
            dataKey="transfers_count"
            stroke="#82ca9d"
            activeDot={{ r: 6 }}
            name="Transfer Count"
          />
          <Tooltip content={<CustomTooltip granularity={granularity} />} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default CustomChart;
