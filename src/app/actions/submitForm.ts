"use server"

import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function saveFormData() {
  "use server";
  const response = await notion.pages.create({
    parent: {
      database_id: "8581dfcfecac4db89de263b318b39ce0",
    },
    properties: {
      Persona: {
        type: "rich_text",
        rich_text: [{ text: { content: "Tomatoes" } }],
      },
    },
  });
  console.log(response);
}
