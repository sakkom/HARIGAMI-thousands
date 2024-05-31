"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Input, Typography } from "@material-tailwind/react";
import { Center } from "@/style/Style";
import { PreviewPaper } from "../PreviewPaper";

type Inputs = {
  image: FileList | null;
  title: string;
  price: number;
  quantity: number;
};

const MintForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <Center>
      <div className="w-1/3 h-max">
        <form onSubmit={handleSubmit(onSubmit)}>
          <PreviewPaper register={register} watch={watch} />

          <div className="flex flex-col gap-3">
            <Input
              variant="standard"
              label="Title"
              placeholder="タイトル"
              type="text"
              {...register("title", { required: true })}
              crossOrigin=""
            />
            {errors.title && (
              <Typography color="red" variant="small">
                This field is required
              </Typography>
            )}

            <Input
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
            )}

            <Input
              variant="standard"
              label="Quantity"
              placeholder="100(発行枚数)"
              type="number"
              {...register("quantity", { required: true })}
              crossOrigin=""
            />
            {errors.quantity && (
              <Typography color="red" variant="small">
                This field is required
              </Typography>
            )}
          </div>

          <Center>
            <Button type="submit">Mint</Button>
          </Center>
        </form>
      </div>
    </Center>
  );
};

export default MintForm;
