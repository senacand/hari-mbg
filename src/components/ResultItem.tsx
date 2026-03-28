import { Action, ActionPanel, Image, List } from "@raycast/api";

type Props = {
  title: string;
  copy: string;
  icon?: Image.ImageLike;
};

export function ResultItem({ title, copy, icon }: Props) {
  return (
    <List.Item
      title={title}
      icon={icon}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard content={copy} />
        </ActionPanel>
      }
    />
  );
}
