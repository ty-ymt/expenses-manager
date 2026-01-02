import { Badge, Group, Tabs } from "@mantine/core";

export type TabItem<T extends string> = {
  value: T;
  label: string;
  count?: number;
  disabled?: boolean;
};

type Props<T extends string> = {
  value: T;
  onChange: (v: T) => void;
  items: TabItem<T>[];
  tabWidth?: number;
  renderPanel: (active: T) => React.ReactNode;
};

export const PageTab = <T extends string>({
  value,
  onChange,
  items,
  tabWidth = 120,
  renderPanel,
}: Props<T>) => {
  if (items.length === 0) {
    return <>{null}</>;
  }
  return (
    <Tabs value={value} onChange={(v) => onChange(v as T)}>
      <Tabs.List>
        {items.map((it) => {
          const isActive = it.value === value;

          return (
            <Tabs.Tab
              key={it.value}
              value={it.value}
              disabled={it.disabled}
              w={tabWidth}
              style={{ backgroundColor: isActive ? "#FFF" : undefined }}
            >
              <Group gap={6} justify="center" wrap="nowrap">
                <span>{it.label}</span>
                {typeof it.count === "number" && (
                  <Badge size="sm" variant={isActive ? "filled" : "light"}>
                    {it.count}
                  </Badge>
                )}
              </Group>
            </Tabs.Tab>
          );
        })}
      </Tabs.List>

      <Tabs.Panel value={value} pt="sm">
        {renderPanel(value)}
      </Tabs.Panel>
    </Tabs>
  );
};

export default PageTab;
