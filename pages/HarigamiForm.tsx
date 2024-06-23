"use client";

import React, { useContext, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Button,
  Input,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { PreviewPaper } from "@/components/PreviewPaper";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWallet } from "@solana/wallet-adapter-react";
import { createHarigamiVersion } from "@/action/createVersion";
import { UmiContext } from "@/context/UmiProvider";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useRouter } from "next/navigation";
import LinearProgress from "@mui/material/LinearProgress";

const HarigamiInputsSchema = z.object({
  coverImage: z.any().refine(
    (files) => {
      if (typeof window !== "undefined" && files instanceof FileList) {
        return files.length > 0;
      }
      return false;
    },
    {
      message: "Cover image is required",
    },
  ),
  title: z.string().min(1, { message: "Title is required zod" }),
  // genre: z.string(),
  quantity: z.coerce
    .number()
    .min(1, "Quantity is required and must be greater than 0"),
});

export type HarigamiInputs = z.infer<typeof HarigamiInputsSchema>;

export const HarigamiForm: React.FC = () => {
  const [progress, setProgress] = useState<number>(0);

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
  };

  const router = useRouter();
  const umi = useContext(UmiContext);
  const wallet = useWallet();
  const creator = wallet.publicKey;
  // if (!creator) throw new Error("not found creator pubKey");

  const umiIdentity = umi.use(walletAdapterIdentity(wallet));

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm<HarigamiInputs>({ resolver: zodResolver(HarigamiInputsSchema) });

  const onSubmit: SubmitHandler<HarigamiInputs> = async (data) => {
    if (creator) {
      await createHarigamiVersion(umiIdentity, data, creator, updateProgress);
      setTimeout(() => {
        router.push("/collection");
      }, 200);
    }
  };

  return (
    <>
      {creator ? (
        <div className="m-10 ">
          {progress > 0 && (
            <div className="my-5">
              <Typography variant="h6">waiting...</Typography>
              <LinearProgress variant="determinate" value={progress} />
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <PreviewPaper register={register} watch={watch} errors={errors} />

            <div className="flex flex-col gap-5 m-10">
              <Input
                variant="standard"
                label="Name"
                placeholder=""
                type="text"
                {...register("title", { required: true })}
                crossOrigin=""
                color="white"
              />
              {errors.title && (
                <Typography color="red" variant="small">
                  {errors.title.message}
                </Typography>
              )}

              {/* <Input
                variant="standard"
                label="Price"
                placeholder="0.1(SOL)"
                type="number"
                {...register("price", { required: true })}
                crossOrigin=""
              />
              {errors.price && (
                <Typography color="red" variant="small">
                  This field is required
                </Typography>
              )} */}

              {/* <Controller
              name="genre"
              control={control}
              defaultValue=""
              rules={{ required: false }}
              render={({ field: { onChange } }) => (
                <Select variant="standard" label="Attribute" onChange={onChange}>
                  <Option value="Skateboard">Skateboard</Option>
                  <Option value="Dance">Dance</Option>
                  <Option value="Artwork">Art</Option>
                </Select>
              )}
            /> */}

              <Input
                variant="standard"
                label="Items Avaiable"
                placeholder="100"
                type="number"
                {...register("quantity", { required: true })}
                crossOrigin=""
                defaultValue={10}
                readOnly={true}
              />
              {errors.quantity && (
                <Typography color="red" variant="small">
                  {errors.quantity.message}
                </Typography>
              )}
            </div>

            <div className="flex justify-center m-5">
              <Button type="submit">Create </Button>
            </div>
          </form>
        </div>
      ) : (
        <Typography variant="h4">connect wallet</Typography>
      )}
    </>
  );
};
