"use client";

import { ActionIcon, TextInput } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";

export const SearchBox = ({
  value,
  onChange,
  placeholder = "案件コード・案件名で検索",
  w = 260,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  w?: number | string;
}) => {
  const clearable = value.trim().length > 0;

  return (
    <TextInput
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      placeholder={placeholder}
      w={w}
      size="sm"
      leftSection={<IconSearch size={16} />}
      rightSection={
        clearable ? (
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={() => onChange("")}
            aria-label="clear"
          >
            <IconX size={16} />
          </ActionIcon>
        ) : undefined
      }
    />
  );
};

export default SearchBox;
