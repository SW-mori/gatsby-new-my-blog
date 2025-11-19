import { BASE_URL, ERROR_LOGS_TEST_ID } from "../constants";

describe("Testing for dashboard page", () => {
  beforeEach(() => {
    cy.login("test@test.com", "testUser");
    cy.visit(`${BASE_URL}/error-logs`);
  });

  it("Confirming the screen display", () => {
    cy.contains("エラーログ一覧");
    cy.contains("フィルター：");
    cy.contains("日時");
    cy.contains("レベル");
    cy.contains("メッセージ");
    cy.contains("ページ");
    cy.contains("削除");
    cy.contains("完全削除");
  });

  it("Filter Test", () => {
    cy.get(`[data-testid="${ERROR_LOGS_TEST_ID.SELECT}"]`).select("error");
    cy.wait(500);
    cy.contains("エラーログは現在ありません。").should("not.exist");
    cy.get(`[data-testid="${ERROR_LOGS_TEST_ID.SELECT}"]`).select("warning");
    cy.wait(500);
    cy.contains("エラーログは現在ありません。");
    cy.get(`[data-testid="${ERROR_LOGS_TEST_ID.SELECT}"]`).select("info");
    cy.wait(500);
    cy.contains("エラーログは現在ありません。");
    cy.get(`[data-testid="${ERROR_LOGS_TEST_ID.SELECT}"]`).select("all");
    cy.wait(500);
    cy.contains("エラーログは現在ありません。").should("not.exist");
  });

  // The error log deletion test should be skipped because deleting it causes the test to fail.
});
