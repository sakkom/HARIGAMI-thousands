"use client";

import { FC } from "react";
import { ButtonGroup, Button } from "@material-tailwind/react";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import { Center } from "./Style";
import Paper from "@mui/material/Paper";

export const BottomBar: FC = () => {
  return (
    <Center>
      <ButtonGroup
        size="lg"
        ripple={true}
        color="deep-purple"
        className="fixed-button-group"
      >
        <Button>
          <HomeIcon />
        </Button>
        <Button>
          <PersonIcon />
        </Button>
      </ButtonGroup>
    </Center>
  );
};
