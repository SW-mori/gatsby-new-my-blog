import { BASE_URL } from "../constants";

describe("Testing for Header banner", () => {
  beforeEach(() => {
    cy.login("test@test.com", "testUser");
    cy.visit(`${BASE_URL}/dashboard`);
  });

  it("Confirming the screen display", () => {
    cy.contains("ホーム画面");
    cy.contains("マイページ");
    cy.contains("エラーログ一覧");
    cy.contains("設定");
    cy.contains("ログアウト");
    cy.contains("JA");
    cy.contains("EN");
  });

  it("Screen Transition Testing", () => {
    cy.contains("ホーム画面").click();
    cy.url().should("eq", `${BASE_URL}/`);
    cy.contains("マイページ").click();
    cy.url().should("eq", `${BASE_URL}/dashboard/`);
    cy.contains("エラーログ一覧").click();
    cy.url().should("eq", `${BASE_URL}/error-logs/`);
    cy.contains("設定").click();
    cy.url().should("eq", `${BASE_URL}/settings/`);
    cy.contains("EN").click();
    cy.url().should("eq", `${BASE_URL}/en/settings/`);
    cy.contains("JA").click();
    cy.url().should("eq", `${BASE_URL}/settings/`);
    cy.contains("ログアウト").click();
    cy.url().should("eq", `${BASE_URL}/login/`);
  });
});
