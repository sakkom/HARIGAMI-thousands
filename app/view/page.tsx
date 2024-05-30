import Paper from "@mui/material/Paper";
import Masonry from "@mui/lab/Masonry";
import { mock } from "@/public/mock";
import AddPaper from "@/components/papers/AddPaper";

export default function Page() {
  return (
    <Masonry columns={5} spacing={1}>
      <AddPaper>Mint!</AddPaper>

      {mock.map((image, index) => (
        <Paper key={index} className="">
          <img src={image} alt="image" />
        </Paper>
      ))}
    </Masonry>
  );
}
