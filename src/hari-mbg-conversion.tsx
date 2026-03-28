import { List } from "@raycast/api";
import { useState } from "react";
import { ResultItem } from "./components/ResultItem";
import { convert } from "./utils/convert";
import { parseIdr } from "./utils/parse";

export default function Command() {
  const [input, setInput] = useState("");

  const idr = parseIdr(input);
  const { compound, decimals } = input.length > 0 && !isNaN(idr) && idr > 0
    ? convert(idr)
    : { compound: null, decimals: [] };

  return (
    <List searchBarPlaceholder="Enter IDR amount…" onSearchTextChange={setInput} filtering={false}>
      {compound && (
        <List.Section title="Breakdown">
          <ResultItem icon={{ source: "🍽️" }} title={compound.title} copy={compound.copy} />
        </List.Section>
      )}
      {decimals.length > 0 && (
        <List.Section title="Individual">
          {decimals.map(({ title, copy }) => (
            <ResultItem key={title} title={title} copy={copy} />
          ))}
        </List.Section>
      )}
    </List>
  );
}
