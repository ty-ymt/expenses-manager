"use client";

import { Alert, Button, Paper, Stack, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import createClient from "@/lib/platform/supabaseClient";

export const SigninForm = () => {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Paper p="md" withBorder radius="sm" maw={600} w="100%">
      <Stack gap="sm">
        {err ? (
          <Alert color="red" title="サインイン失敗">
            {err}
          </Alert>
        ) : null}

        <TextInput
          label="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
        <TextInput
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
        />

        <Button
          loading={loading}
          onClick={async () => {
            setErr(null);
            setLoading(true);
            try {
              const { error } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password,
              });
              if (error) {
                setErr(error.message);
                return;
              }
              router.push("/"); // 最初の遷移先は好みでOK
              router.refresh();
            } finally {
              setLoading(false);
            }
          }}
        >
          サインイン
        </Button>
      </Stack>
    </Paper>
  );
};

export default SigninForm;
