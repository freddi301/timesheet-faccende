"use server";

import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const database_id = "8581dfcfecac4db89de263b318b39ce0";

export async function saveFormData({
  AutoreId,
  FaccendaId,
  Note,
  Data,
  Minuti,
}: {
  AutoreId: string;
  FaccendaId: string;
  Note: string;
  Data: number;
  Minuti: number;
}) {
  await notion.pages.create({
    parent: {
      database_id,
    },
    properties: {
      Autore: {
        type: "select",
        select: { id: AutoreId },
      },
      Faccenda: {
        type: "select",
        select: { id: FaccendaId },
      },
      Note: {
        type: "rich_text",
        rich_text: [{ text: { content: Note } }],
      },
      Data: {
        type: "date",
        date: { start: new Date(Data).toISOString() },
      },
      Minuti: {
        type: "number",
        number: Minuti,
      },
    },
  });
}

export async function getTableDescription() {
  return await notion.databases.retrieve({ database_id });
}
