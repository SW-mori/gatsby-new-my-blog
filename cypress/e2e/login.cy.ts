import { BASE_URL, LOGIN_TEST_ID } from "../constants";

describe("Testing for login page", () => {
  beforeEach(() => {
    cy.visit(`${BASE_URL}/login`);
  });

  it("Confirming the screen display", () => {
    cy.contains("ログイン");
    cy.contains("メールアドレス");
    cy.contains("パスワード");
  });

  it("Testing for Abnormal Input Values", () => {
    cy.get(`[data-testid="${LOGIN_TEST_ID.BUTTON}"]`).click();
    cy.contains("メールアドレスとパスワードを入力してください。");
    cy.get(`[data-testid="${LOGIN_TEST_ID.INPUT("email")}"]`)
      .clear()
      .type("test");
    cy.get(`[data-testid="${LOGIN_TEST_ID.INPUT("password")}"]`)
      .clear()
      .type("test");
    cy.get(`[data-testid="${LOGIN_TEST_ID.BUTTON}"]`).click();
    cy.contains("メールアドレスの形式が正しくありません。");
    cy.get(`[data-testid="${LOGIN_TEST_ID.INPUT("email")}"]`)
      .clear()
      .type("test@test.com");
    cy.get(`[data-testid="${LOGIN_TEST_ID.INPUT("password")}"]`)
      .clear()
      .type("test");
    cy.get(`[data-testid="${LOGIN_TEST_ID.BUTTON}"]`).click();
    cy.contains("パスワードは6文字以上で入力してください。");
    cy.get(`[data-testid="${LOGIN_TEST_ID.INPUT("email")}"]`)
      .clear()
      .type("test@test.com");
    cy.get(`[data-testid="${LOGIN_TEST_ID.INPUT("password")}"]`)
      .clear()
      .type("password");
    cy.get(`[data-testid="${LOGIN_TEST_ID.BUTTON}"]`).click();
    cy.contains("ログインに失敗しました。");
  });

  it("Testing for Normal Input Values", () => {
    cy.get(`[data-testid="${LOGIN_TEST_ID.INPUT("email")}"]`)
      .clear()
      .type("test@test.com");
    cy.get(`[data-testid="${LOGIN_TEST_ID.INPUT("password")}"]`)
      .clear()
      .type("testUser");
    cy.get(`[data-testid="${LOGIN_TEST_ID.BUTTON}"]`).click();
    cy.wait(500);
    cy.url().should("eq", `${BASE_URL}/`);
  });
});
