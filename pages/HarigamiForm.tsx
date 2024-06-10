"use client";

import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Button,
  Input,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { Center } from "@/components/layouts/Style";
import { PreviewPaper } from "@/components/PreviewPaper";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUmiIdentity } from "@/hooks/useUmi";
import { createHarigamiVersion } from "@/action/HarigamiVersion";

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
  genre: z.string(),
  quantity: z.coerce
    .number()
    .min(1, "Quantity is required and must be greater than 0"),
});

export type HarigamiInputs = z.infer<typeof HarigamiInputsSchema>;

export const HarigamiForm: React.FC = () => {
  const wallet = useWallet();
  const umiIdentity = useUmiIdentity(wallet);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm<HarigamiInputs>({ resolver: zodResolver(HarigamiInputsSchema) });

  const onSubmit: SubmitHandler<HarigamiInputs> = async (data) => {
    const message = await createHarigamiVersion(umiIdentity, data);
    console.log(message);
  };

  return (
    <Center className="items-center min-h-screen-minus-48">
      <div className="w-1/3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <PreviewPaper register={register} watch={watch} errors={errors} />

          <div className="flex flex-col gap-3">
            <Input
              variant="standard"
              label="Name"
              placeholder=""
              type="text"
              {...register("title", { required: true })}
              crossOrigin=""
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

            <Controller
              name="genre"
              control={control}
              defaultValue=""
              rules={{ required: false }}
              render={({ field: { onChange } }) => (
                <Select
                  variant="standard"
                  label="Attribute"
                  onChange={onChange}
                >
                  <Option value="Skateboard">Skateboard</Option>
                  <Option value="Dance">Dance</Option>
                  <Option value="Artwork">Art</Option>
                </Select>
              )}
            />

            <Input
              variant="standard"
              label="Items Avaiable"
              placeholder="100"
              type="number"
              {...register("quantity", { required: true })}
              crossOrigin=""
            />
            {errors.quantity && (
              <Typography color="red" variant="small">
                {errors.quantity.message}
              </Typography>
            )}
          </div>

          <Center>
            <Button type="submit">Create HARIGAMI Version</Button>
          </Center>
        </form>
      </div>
    </Center>
  );
};
