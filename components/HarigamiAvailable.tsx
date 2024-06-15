import { FC } from "react";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { ScrambleText } from "./ScrambleText";

interface HarigamiAvailableProps {
  itemsAvailable_num: number;
  itemsLoaded: number;
  itemsRedeemed_num: number;
}

export const HarigamiAvailable: FC<HarigamiAvailableProps> = ({
  itemsAvailable_num,
  itemsLoaded,
  itemsRedeemed_num,
}) => {
  if (itemsAvailable_num !== itemsLoaded)
    throw new Error("Error 補充されていない");

  const harigamiAvailable = itemsLoaded - itemsRedeemed_num;

  return (
    <div className="flex items-end">
      <LocalPrintshopOutlinedIcon fontSize={"large"} />

      <ScrambleText
        textInput={harigamiAvailable.toString()}
        variant="h6"
        scramble={25}
      />
    </div>
  );
};
