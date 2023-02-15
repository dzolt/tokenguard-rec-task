import { useEffect, useState } from "react";
import { parse, LocalFile } from "papaparse";
import { CSVFileData } from "../../typings";
import { format, parse as parseDate } from "date-fns";

const commonConfig = {
  delimiter: ",",
};

const zoneRegex: RegExp = /\+.*/;

const useParseLocalCSV = (csvFile: LocalFile, options?: any) => {
  const [csvFileData, setCsvFileData] = useState<CSVFileData[]>([]);

  useEffect(() => {
    parse<CSVFileData, LocalFile>(csvFile, {
      ...commonConfig,
      ...options,
      header: true,
      skipEmptyLines: true,
      transform: (value: string, field: string) => {
        if (value && field === "date") {
          const dateToParse = value.replace(" ", "T").replace(zoneRegex, "Z");
          const parsedDate = parseDate(
            dateToParse,
            "yyyy-MM-dd'T'HH:mm:ssxxx",
            new Date()
          );

          return parsedDate;
        }
        if (
          value &&
          (field === "avg_transfer_value" || field === "transfers_count")
        ) {
          return Number(value);
        }
        return value;
      },
      complete: (results) => {
        setCsvFileData(results.data);
      },
      error: (error) => alert(error),
    });
  }, [csvFile, options]);

  return csvFileData;
};

export default useParseLocalCSV;
