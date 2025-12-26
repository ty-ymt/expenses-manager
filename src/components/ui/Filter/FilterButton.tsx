"use client";

import { ActionIcon, Box, Button, type ButtonProps, Text } from "@mantine/core";
import { IconChevronDown, IconX } from "@tabler/icons-react";
import { forwardRef, type ReactNode } from "react";

type Props = {
  label: string;
  isFiltering: boolean;
  onClick: () => void;
  onClear?: () => void;
  disabled?: boolean;

  // サイズ調整
  width?: number;
  radius?: number;
  iconColWidth?: number;

  // ボタン右アイコンを変更する場合
  rightIcon?: ReactNode;

  // 見た目の微調整
  color?: ButtonProps["color"];
  activeVariant?: ButtonProps["variant"];
  idleVariant?: ButtonProps["variant"];
};

export const FilterButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      label,
      isFiltering,
      onClick,
      onClear,
      disabled = false,

      width = 130,
      radius = 20,
      iconColWidth = 24,

      rightIcon,
      color = "blue",
      activeVariant = "filled",
      idleVariant = "light",
    },
    ref
  ) => {
    return (
      <Box pos="relative" display="inline-block">
        <Button
          ref={ref}
          color={color}
          variant={isFiltering ? activeVariant : idleVariant}
          w={width}
          radius={radius}
          onClick={onClick}
          disabled={disabled}
          styles={{
            inner: { overflow: "visible" },
            label: {
              width: "100%",
              display: "grid",
              gridTemplateColumns: `1fr ${iconColWidth}px`,
              alignItems: "center",
            },
          }}
        >
          <Text size="sm" span fw={600} ta="center">
            {label}
          </Text>

          <Box style={{ display: "flex", justifyContent: "center" }}>
            {rightIcon ?? <IconChevronDown size={16} />}
          </Box>
        </Button>

        {isFiltering && onClear && !disabled && (
          <ActionIcon
            size="sm"
            radius="xl"
            variant="filled"
            color="red"
            pos="absolute"
            top={-6}
            right={-6}
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
          >
            <IconX size={14} />
          </ActionIcon>
        )}
      </Box>
    );
  }
);

FilterButton.displayName = "FilterButton";

export default FilterButton;
