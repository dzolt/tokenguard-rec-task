import { format } from "date-fns";
import { Card } from "react-bootstrap";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

type Props = TooltipProps<ValueType, NameType> & { granularity: string };

const CustomTooltip = ({ payload, label, active, granularity }: Props) => {
  if (active && payload && payload.length) {
    let formattedDate: string = "";
    if (granularity === "month") {
      formattedDate = format(label, "MM/yyyy");
    } else {
      formattedDate = format(label, "dd/MM/yyyy");
    }
    return (
      <Card className="text-black">
        <p className="text-base text-center">{formattedDate}</p>
        <p>
          <span className="font-bold text-[#8884d8]">{payload[0].name}:</span>{" "}
          {payload[0].value}
        </p>
        <p>
          <span className="font-bold text-[#82ca9d]">{payload[1].name}:</span>{" "}
          {payload[1].value}
        </p>
      </Card>
    );
  }
  return null;
};

export default CustomTooltip;
