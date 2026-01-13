"use client";

import {
  Alert,
  Button,
  CopyButton,
  Divider,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  deleteUserAction,
  resetUserPasswordAction,
  upsertUserAction,
} from "@/lib/users/actions";
import type { ActionState, UserEditInitial, UserRole } from "@/types/users";
import FormActions from "../ui/Form/FormActions";
import {
  CancelLinkButton,
  DangerButton,
  SubmitButton,
} from "../ui/Form/FormButtons";
import { RequiredFormRow } from "../ui/Form/FormRow";

export const UserEditFormClient = ({
  initial,
}: {
  initial: UserEditInitial;
}) => {
  const [upState, upAction, upPending] = useActionState<ActionState, FormData>(
    upsertUserAction,
    null
  );

  const [delState, setDelState] = useState<ActionState>(null);
  const [delPending, setDelPending] = useState(false);

  const [resetState, setResetState] = useState<ActionState>(null);
  const [resetPending, setResetPending] = useState(false);

  const isEdit = !!initial.id;
  const cancelHref = isEdit ? `/users/${initial.id}` : "/users";

  // 同じ成功で何度も開かないようにガード（作成完了モーダル用）
  const createdModalOpenedRef = useRef(false);

  useEffect(() => {
    if (createdModalOpenedRef.current) return;

    // 新規作成時のみ：初期パスワードが返ってきたら完了モーダル
    if (!isEdit && upState?.ok && upState.data?.password) {
      createdModalOpenedRef.current = true;

      const { name, email, password } = upState.data;
      const copyText = `作成完了しました\n\n名前: ${name}\nメール: ${email}\n初期パスワード: ${password}`;

      modals.open({
        title: "ユーザー作成完了",
        centered: true,
        children: (
          <Stack gap="sm">
            <Text size="sm">
              以下の情報を利用者に案内してください（初期パスワードはこの画面でのみ表示する運用がおすすめです）。
            </Text>

            <Divider />

            <Stack gap={6}>
              <Group justify="space-between">
                <Text fw={600} size="sm">
                  名前
                </Text>
                <Text size="sm">{name}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={600} size="sm">
                  メール
                </Text>
                <Text size="sm">{email}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={600} size="sm">
                  初期パスワード
                </Text>
                <Text size="sm">{password}</Text>
              </Group>
            </Stack>

            <Group justify="flex-end" mt="sm">
              <CopyButton value={copyText}>
                {({ copied, copy }) => (
                  <Button onClick={copy} variant="light">
                    {copied ? "コピーしました" : "まとめてコピー"}
                  </Button>
                )}
              </CopyButton>
              <Button onClick={() => modals.closeAll()}>閉じる</Button>
            </Group>
          </Stack>
        ),
      });
    }
  }, [upState, isEdit]);

  const openPasswordIssuedModal = (payload: {
    name: string;
    email: string;
    password: string;
    title?: string;
  }) => {
    const { name, email, password, title } = payload;
    const copyText = `${
      title ?? "パスワードを再発行しました"
    }\n\n名前: ${name}\nメール: ${email}\n新しいパスワード: ${password}`;

    modals.open({
      title: title ?? "パスワード再発行",
      centered: true,
      children: (
        <Stack gap="sm">
          <Text size="sm">
            新しいパスワードを発行しました。利用者に案内してください。
          </Text>

          <Divider />

          <Stack gap={6}>
            <Group justify="space-between">
              <Text fw={600} size="sm">
                名前
              </Text>
              <Text size="sm">{name}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={600} size="sm">
                メール
              </Text>
              <Text size="sm">{email}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={600} size="sm">
                新しいパスワード
              </Text>
              <Text size="sm">{password}</Text>
            </Group>
          </Stack>

          <Group justify="flex-end" mt="sm">
            <CopyButton value={copyText}>
              {({ copied, copy }) => (
                <Button onClick={copy} variant="light">
                  {copied ? "コピーしました" : "まとめてコピー"}
                </Button>
              )}
            </CopyButton>
            <Button onClick={() => modals.closeAll()}>閉じる</Button>
          </Group>
        </Stack>
      ),
    });
  };

  return (
    <Paper p="md" withBorder radius="sm">
      <Stack gap="sm">
        {upState?.ok === false ? (
          <Alert color="red" title="エラー">
            {upState.message}
          </Alert>
        ) : null}

        {delState?.ok === false ? (
          <Alert color="red" title="削除エラー">
            {delState.message}
          </Alert>
        ) : null}

        {resetState?.ok === false ? (
          <Alert color="red" title="再発行エラー">
            {resetState.message}
          </Alert>
        ) : null}

        <form action={upAction}>
          <Stack gap="sm">
            <input type="hidden" name="id" value={initial.id ?? ""} />

            <RequiredFormRow label="名前">
              <TextInput name="name" defaultValue={initial.name} required />
            </RequiredFormRow>

            <RequiredFormRow label="メールアドレス">
              <TextInput
                name="email"
                defaultValue={initial.email}
                required
                type="email"
              />
            </RequiredFormRow>

            <RequiredFormRow label="権限">
              <Select
                name="role"
                defaultValue={(initial.role ?? "user") as UserRole}
                data={[
                  { value: "admin", label: "admin" },
                  { value: "user", label: "user" },
                ]}
                required
              />
            </RequiredFormRow>

            <FormActions>
              <Group justify="space-between" style={{ width: "100%" }}>
                <Group gap="sm">
                  {/* 削除ボタン（既存） */}
                  <DangerButton
                    type="button"
                    loading={delPending}
                    disabled={!isEdit}
                    onClick={() => {
                      const id = initial.id;
                      if (!id) return;

                      modals.openConfirmModal({
                        title: "削除確認",
                        children: (
                          <Text size="sm">
                            このユーザーを削除します。よろしいですか？
                          </Text>
                        ),
                        labels: { confirm: "削除する", cancel: "キャンセル" },
                        confirmProps: { color: "red" },
                        onConfirm: async () => {
                          setDelState(null);
                          setDelPending(true);
                          try {
                            const res = await deleteUserAction(id);
                            if (res?.ok === false) setDelState(res);
                            if (res?.ok) window.location.href = "/users";
                          } finally {
                            setDelPending(false);
                          }
                        },
                      });
                    }}
                  >
                    削除
                  </DangerButton>

                  {/* ✅ 追加：パスワード再発行（編集時のみ） */}
                  <Button
                    type="button"
                    variant="outline"
                    loading={resetPending}
                    disabled={!isEdit}
                    onClick={() => {
                      const id = initial.id;
                      if (!id) return;

                      modals.openConfirmModal({
                        title: "パスワード再発行",
                        children: (
                          <Text size="sm">
                            新しいパスワードを発行します。現在のパスワードは無効になります。よろしいですか？
                          </Text>
                        ),
                        labels: { confirm: "再発行する", cancel: "キャンセル" },
                        confirmProps: { color: "blue" },
                        onConfirm: async () => {
                          setResetState(null);
                          setResetPending(true);
                          try {
                            const res = await resetUserPasswordAction(id);
                            if (res?.ok === false) {
                              setResetState(res);
                              return;
                            }
                            if (res?.ok && res.data?.password) {
                              openPasswordIssuedModal({
                                name: res.data.name,
                                email: res.data.email,
                                password: res.data.password,
                                title: "パスワードを再発行しました",
                              });
                            }
                          } finally {
                            setResetPending(false);
                          }
                        },
                      });
                    }}
                  >
                    パスワード再発行
                  </Button>
                </Group>

                <Group gap="sm">
                  <CancelLinkButton href={cancelHref}>
                    キャンセル
                  </CancelLinkButton>
                  <SubmitButton loading={upPending}>
                    {isEdit ? "更新" : "登録"}
                  </SubmitButton>
                </Group>
              </Group>
            </FormActions>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
};

export default UserEditFormClient;
