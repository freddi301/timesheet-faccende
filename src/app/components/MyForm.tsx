"use client";

import React, { Fragment, useEffect, useState } from "react";
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
import { Alert, Textarea } from "@mui/joy";
import { saveFormData } from "../actions/submitForm";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import "./style.css";

export function MyForm({
  autori,
  faccende,
}: {
  autori: Array<{ id: string; name: string; color: string }>;
  faccende: Array<{ id: string; name: string; color: string }>;
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/service-worker.js").then(
          function (registration) {
            console.log(
              "Service Worker registration successful with scope: ",
              registration.scope
            );
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, []);
  const [isCountingTime, setIsCountingTime] = useState(false);
  const FormValidator = z.object({
    AutoreId: z.string(),
    FaccendaId: z.string(),
    Note: z.string(),
    Data: z.number(),
  });
  const form = useForm({
    defaultValues: {
      AutoreId: undefined as any as string,
      FaccendaId: undefined as any as string,
      Note: "",
      Data: Date.now(),
      Minuti: 0,
    } as z.infer<typeof FormValidator>,
    validatorAdapter: zodValidator,
    validators: {
      onSubmit: FormValidator,
    },
    async onSubmit({ value }) {
      try {
        await saveFormData({
          ...FormValidator.parse(value),
          Minuti: Number(Minuti.toFixed(1)),
        });
        form.reset();
        setHasSuccess(true);
      } catch (error) {
        console.error(error);
        alert("Errore nell'inserimento dei dati");
        throw error;
      }
    },
  });
  const [Minuti, setMinuti] = useState(0);
  useEffect(() => {
    if (isCountingTime) {
      let lastTime = Date.now();
      const intervalId = setInterval(() => {
        const now = Date.now();
        setMinuti((minuti) => minuti + (now - lastTime) / 1000 / 60);
        lastTime = now;
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isCountingTime]);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [gif, setGif] = useState("");
  useEffect(() => {
    getRandomGif().then(setGif);
  }, []);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
        <form.Field
          name="AutoreId"
          validators={{
            onChange: FormValidator.shape.AutoreId,
          }}
        >
          {(field) => (
            <Fragment>
              <MyRadio
                value={field.state.value}
                onChange={field.handleChange}
                options={autori.map((value) => ({
                  value: value.id,
                  label: value.name,
                  color: value.color,
                }))}
                orientation="horizontal"
              />
              {field.state.meta.errors.length > 0 && (
                <Alert color="danger">
                  {field.state.meta.errors.join(", ")}
                </Alert>
              )}
            </Fragment>
          )}
        </form.Field>
        <form.Field
          name="FaccendaId"
          validators={{
            onChange: FormValidator.shape.FaccendaId,
          }}
        >
          {(field) => (
            <React.Fragment>
              <Box sx={{ height: "300px", overflowY: "auto" }}>
                <MyRadio
                  value={field.state.value}
                  onChange={field.handleChange}
                  options={faccende.map((value) => ({
                    value: value.id,
                    label: value.name,
                    color: value.color,
                  }))}
                  orientation="vertical"
                />
              </Box>
              {field.state.meta.errors.length > 0 && (
                <Alert color="danger">
                  {field.state.meta.errors.join(", ")}
                </Alert>
              )}
            </React.Fragment>
          )}
        </form.Field>
        <form.Field name="Note">
          {(field) => (
            <FormControl>
              <FormLabel>Note</FormLabel>
              <Textarea
                minRows={2}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormControl>
          )}
        </form.Field>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
          <form.Field name="Data">
            {(field) => (
              <Fragment>
                <FormControl>
                  <FormLabel>Inizio</FormLabel>
                  <Input
                    type="datetime-local"
                    value={new Date(
                      field.state.value -
                        new Date().getTimezoneOffset() * 60 * 1000
                    )
                      .toISOString()
                      .slice(0, 16)}
                    onChange={(event) => {
                      field.handleChange(
                        new Date(event.target.value).getTime()
                      );
                    }}
                  />
                </FormControl>
                <Button
                  onClick={() => {
                    field.handleChange(Date.now());
                  }}
                >
                  Ora
                </Button>
              </Fragment>
            )}
          </form.Field>
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
          <FormControl>
            <FormLabel>Tempo [minuti]</FormLabel>
            <Input
              sx={{ width: 200 }}
              value={Math.trunc(Minuti)}
              onChange={(event) => {
                const asNumber = Number(event.target.value);
                if (asNumber) {
                  setMinuti(asNumber);
                } else {
                  setMinuti(0);
                }
              }}
              endDecorator={`secondi ${Math.trunc(Minuti * 60) % 60}`}
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
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Sto inserendo" : "Submit"}
            </Button>
          )}
        </form.Subscribe>
      </Box>
      {hasSuccess && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          onClick={() => setHasSuccess(false)}
        >
          <img src={gif} style={{ maxWidth: "100%", maxHeight: "100%" }} />
        </div>
      )}
    </form>
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
  options: Array<{ value: string; label: string; color: string }>;
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
        {options.map((item, index) => (
          <Fragment key={item.value}>
            {index !== 0 && <ListDivider />}
            <ListItem>
              <Radio
                id={item.value}
                value={item.value}
                label={item.label}
                checked={item.value === value}
                onChange={(event) => onChange(event.target.value)}
              />
            </ListItem>
          </Fragment>
        ))}
      </List>
    </RadioGroup>
  );
}

async function getRandomGif() {
  const response = await fetch(
    "https://api.giphy.com/v1/gifs/random?api_key=0UTRbFtkMxAplrohufYco5IY74U8hOes&tag=nice job&rating=pg-13"
  );
  const data = await response.json();
  return data.data.images.original.url;
}
