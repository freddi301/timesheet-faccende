"use client"

import { Fragment, useEffect, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListDivider from "@mui/joy/ListDivider";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { Textarea } from "@mui/joy";
import { saveFormData } from "./actions/submitForm";

const people = {
  "1": { name: "Alice" },
  "2": { name: "Cristiana" },
  "3": { name: "Frederik" },
};

const chores = {
  "1": { name: "Lavatrice" },
  "2": { name: "Panni" },
  "3": { name: "Piatti" },
  "4": { name: "Cucinare" },
  "5": { name: "Mettere a posto" },
  "6": { name: "Pulizie" },
  "7": { name: "Altro" },
};

export default function Home() {
  return <MyForm/>
}

function MyForm() {
  "use client"
  const [currentPerson, setCurrentPerson] = useLocalStorage("loggedPerson", "");
    const [currentChore, setCurrentChore] = useState("");
    const [timeSpent, setTimeSpent] = useState(0);
    const [startTimestamp, setStartTimestamp] = useState(Date.now());
    const [isCountingTime, setIsCountingTime] = useState(false);
    const [note, setNote] = useState("");
    useEffect(() => {
      if (isCountingTime) {
        const intervalId = setInterval(() => {
          setTimeSpent((timeSpent) => timeSpent + 1000);
        }, 1000);
        return () => clearInterval(intervalId);
      }
    }, [isCountingTime]);
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <MyRadio
          value={currentPerson}
          onChange={setCurrentPerson}
          options={Object.entries(people).map(([key, value]) => ({
            value: key,
            label: value.name,
          }))}
          orientation="horizontal"
        />
        <Box sx={{ height: "200px", overflowY: "auto" }}>
          <MyRadio
            value={currentChore}
            onChange={setCurrentChore}
            options={Object.entries(chores).map(([key, value]) => ({
              value: key,
              label: value.name,
            }))}
            orientation="vertical"
          />
        </Box>
        <FormControl>
          <FormLabel>Note</FormLabel>
          <Textarea
            minRows={2}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </FormControl>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
          <FormControl>
            <FormLabel>Inizio</FormLabel>
            <Input
              type="datetime-local"
              value={new Date(
                startTimestamp - new Date().getTimezoneOffset() * 60 * 1000
              )
                .toISOString()
                .slice(0, 16)}
              onChange={(event) => {
                console.log(event.target.value);
                setStartTimestamp(new Date(event.target.value).getTime());
              }}
            />
          </FormControl>
          <Button
            onClick={() => {
              setStartTimestamp(Date.now());
            }}
          >
            Ora
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
          <FormControl>
            <FormLabel>Tempo [minuti]</FormLabel>
            <Input
              sx={{ width: 200 }}
              value={Math.trunc(timeSpent / 1000 / 60)}
              onChange={(event) =>
                setTimeSpent(event.target.valueAsNumber * 60 * 1000)
              }
              endDecorator={`secondi ${Math.trunc(timeSpent / 1000) % 60}`}
            />
          </FormControl>
          <Button
            onClick={() => {
              setIsCountingTime(!isCountingTime);
            }}
          >
            {isCountingTime ? "Pausa" : "Conteggia"}
          </Button>
        </Box>
        <Button
          onClick={() => {
            saveFormData();
          }}
        >
          Inserisci
        </Button>
      </Box>
    );
}

function MyRadio({
  value,
  onChange,
  options,
  orientation,
}: {
  value: string;
  onChange(value: string): void;
  options: Array<{ value: string; label: string }>;
  orientation: "vertical" | "horizontal";
}) {
  return (
    <RadioGroup overlay>
      <List
        component="div"
        variant="outlined"
        orientation={orientation}
        sx={{
          borderRadius: "sm",
          boxShadow: "sm",
        }}
      >
        {options.map(({ value, label }, index) => (
          <Fragment key={value}>
            {index !== 0 && <ListDivider />}
            <ListItem>
              <Radio id={value} value={value} label={label} />
            </ListItem>
          </Fragment>
        ))}
      </List>
    </RadioGroup>
  );
}

