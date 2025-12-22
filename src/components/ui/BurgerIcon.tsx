"use client";

import { Box } from "@mantine/core";

export const BurgerIcon = ({ opened }: { opened: boolean }) => {
  return (
    <Box w={20} h={14} style={{ position: "relative" }}>
      <Box
        style={{
          position: "absolute",
          left: 0,
          top: opened ? 6 : 0,
          width: "100%",
          height: 2,
          background: "currentColor",
          borderRadius: 2,
          transition:
            "transform 180ms ease, top 180ms ease, opacity 180ms ease",
          transform: opened ? "rotate(45deg)" : "rotate(0deg)",
        }}
      />
      <Box
        style={{
          position: "absolute",
          left: 0,
          top: 6,
          width: "100%",
          height: 2,
          background: "currentColor",
          borderRadius: 2,
          transition: "opacity 140ms ease",
          opacity: opened ? 0 : 1,
        }}
      />
      <Box
        style={{
          position: "absolute",
          left: 0,
          top: opened ? 6 : 12,
          width: "100%",
          height: 2,
          background: "currentColor",
          borderRadius: 2,
          transition:
            "transform 180ms ease, top 180ms ease, opacity 180ms ease",
          transform: opened ? "rotate(-45deg)" : "rotate(0deg)",
        }}
      />
    </Box>
  );
};

export default BurgerIcon;
