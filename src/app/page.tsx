import { getTableDescription } from "./actions/submitForm";
import { MyForm } from "./components/MyForm";

export default async function Home() {
  const tableDescriptionInitialData = await getTableDescription();
  if (tableDescriptionInitialData.properties.Autore.type !== "select")
    throw new Error("Autore non è un select");
  if (tableDescriptionInitialData.properties.Faccenda.type !== "select")
    throw new Error("Faccenda non è un select");
  const autori = tableDescriptionInitialData.properties.Autore.select.options;
  const faccende =
    tableDescriptionInitialData.properties.Faccenda.select.options;
  return <MyForm autori={autori} faccende={faccende} />;
}
