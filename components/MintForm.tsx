import { FC, useRef, useState } from "react";
import { Button } from "@mui/material";
import { Paper } from "@mui/material";
import { PublicKey, Umi } from "@metaplex-foundation/umi";
import Input from "@mui/joy/Input";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { mintFromCandyGuard } from "@/utils/candy-machine/createAccount";
import { MintProps } from "@/types/cutomInterface";
import { getVault } from "@/utils/squads";

export const MintForm: FC<MintProps> = ({
  umi,
  candyId,
  collectionId,
  squadId,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>();

  const mintSubmit = async (data: any) => {
    // console.log(data);
    const vault = getVault(squadId);
    if (!vault) throw new Error("not vault account");

    await mintFromCandyGuard(umi, candyId, collectionId, vault);
    // await addMemberToSquad;
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
