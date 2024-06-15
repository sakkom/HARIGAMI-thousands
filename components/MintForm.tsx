import { FC, useRef, useState } from "react";
import { Button } from "@mui/material";
import { Paper } from "@mui/material";
import { PublicKey } from "@metaplex-foundation/umi";
import Input from "@mui/joy/Input";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

interface HarigamiDashboardProps {
  candyMachineId: PublicKey;
  collectionMint: PublicKey;
}

export const MintPaper = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>();

  const mintSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <>
      <Paper className="animatedBackground aspect-video flex items-center justify-center">
        <form onSubmit={handleSubmit(mintSubmit)}>
          <Input
            {...register("quantity")}
            type="number"
            endDecorator={<Button type="submit">mint</Button>}
            sx={{
              margin: "20%",
              height: "30%",
              "--Input-focusedThickness": "0px",
              border: "black",
              paddingRight: "0px",
              borderRadius: "8px",
            }}
          />
        </form>
      </Paper>
    </>
  );
};
