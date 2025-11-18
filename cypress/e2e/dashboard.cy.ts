import { BASE_URL, DASHBOARD_TEST_ID } from "../constants";

describe("Testing for dashboard page", () => {
  beforeEach(() => {
    cy.login("test@test.com", "testUser");
    cy.visit(`${BASE_URL}/dashboard`);
  });

  it("Confirming the screen display", () => {
    cy.contains("マイページ");
    cy.contains("UID:");
    cy.contains("1XvorCECIocgB2rKAwBb1Y7MvDo2");
    cy.contains("メールアドレス:");
    cy.contains("test@test.com");
    cy.contains("登録日時:");
    cy.contains("2025/11/4 16:56:25");
    cy.contains("最終ログイン:");
  });

  it("Logout Process Test", () => {
    cy.get(`[data-testid="${DASHBOARD_TEST_ID.BUTTON}"]`).click();
    cy.url().should("eq", `${BASE_URL}/login/`);
  });
});
