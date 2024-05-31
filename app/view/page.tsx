import Paper from "@mui/material/Paper";
import Masonry from "@mui/lab/Masonry";
import { mock } from "@/public/mock";
import LinkPaper from "@/components/LinkPaper";

//May 30 memo
//children: Arrayでcomponentsに整形する。(getProgramAccouns時)
export default function Page() {
  return (
    <div>
      <Masonry columns={5} spacing={1}>
        <LinkPaper content="Mint!" link="/mint" />

        {mock.map((image, index) => (
          <Paper key={index} className="">
            <img src={image} alt="image" />
          </Paper>
        ))}
      </Masonry>
    </div>
  );
}
