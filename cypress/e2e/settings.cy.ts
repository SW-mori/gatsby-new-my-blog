import { BASE_URL, SETTINGS_TEST_ID } from "../constants";

describe("Testing for settings page", () => {
  beforeEach(() => {
    cy.login("test@test.com", "testUser");
    cy.visit(`${BASE_URL}/settings`);
  });

  it("Confirming the screen display", () => {
    cy.contains("プロフィール設定");
    cy.contains("画像を変更");
    cy.contains("画像を削除");
    cy.contains("表示名");
    cy.contains("プロフィール画像URL");
    cy.contains("保存");
    cy.contains("パスワード変更");
    cy.contains("アカウント削除");
    cy.contains(
      "この操作は取り消せません。アカウントを完全に削除するには「DELETE」と入力してください。"
    );
    cy.contains("削除");
    cy.contains("通知設定");
    cy.contains("メール通知");
    cy.contains("コメント通知");
    cy.contains("セキュリティ通知");
  });

  it("Profile Update", () => {
    cy.get(`[data-testid="${SETTINGS_TEST_ID.INPUT("name")}"]`)
      .clear()
      .type("tests");
    cy.get(`[data-testid="${SETTINGS_TEST_ID.INPUT("url")}"]`)
      .clear()
      .type("https://placehold.jp/300x300.png");
    cy.get(`[data-testid="${SETTINGS_TEST_ID.BUTTON.PROFILE}"]`).click();
    cy.contains("保存しました！");
    cy.contains("プロフィールを更新しました。");
  });

  it("Password Update", () => {
    cy.get(`[data-testid="${SETTINGS_TEST_ID.INPUT("currentPassword")}"]`)
      .clear()
      .type("testUser");
    cy.get(`[data-testid="${SETTINGS_TEST_ID.INPUT("newPassword")}"]`)
      .clear()
      .type("testUser");
    cy.get(`[data-testid="${SETTINGS_TEST_ID.BUTTON.PASSWORD}"]`).click();
    cy.contains("保存しました！");
    cy.contains("パスワードを更新しました。");
  });

  // Since there is only one account, the end-to-end test for account deletion is skipped.

  it("Notification settings", () => {
    cy.get(`[data-testid="${SETTINGS_TEST_ID.CHECK("email")}"]`).click();
    cy.get(`[data-testid="${SETTINGS_TEST_ID.CHECK("comment")}"]`).click();
    cy.get(`[data-testid="${SETTINGS_TEST_ID.CHECK("security")}"]`).click();
    cy.contains("保存中...");
    cy.contains("設定を保存しました");
  });
});
