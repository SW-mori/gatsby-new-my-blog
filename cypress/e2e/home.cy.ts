import { BASE_URL, HOME_TEST_ID } from "../constants";

describe("Testing for home page", () => {
  beforeEach(() => {
    cy.login("test@test.com", "testUser");
  });

  it("Confirming the screen display", () => {
    cy.contains("記事一覧 - ページ 1");
    cy.contains("すべてのタグ");
    cy.contains("e2e");
    cy.contains("responsive");
    cy.contains("次へ");
    cy.contains("関連記事");
    cy.contains("React Hooks入門");
    cy.contains("Gatsbyで外部APIを扱う方法");
    cy.contains("GraphQLの基本");
  });

  it("Article Search Test", () => {
    cy.get(`[data-testid="${HOME_TEST_ID.SEARCH}"]`).clear().type("e2e");
    cy.contains("E2Eテストの作成");
    cy.get(`[data-testid="${HOME_TEST_ID.SEARCH}"]`).clear().type("エラー");
    cy.contains("Cypressの導入");
  });

  it("Article Filtering Test", () => {
    cy.get(`[data-testid="${HOME_TEST_ID.SELECT}"]`).select("e2e");
    cy.contains("E2Eテストの作成");
    cy.get(`[data-testid="${HOME_TEST_ID.SELECT}"]`).select("responsive");
    cy.contains("各ページのレスポンシブ対応");
  });

  it("Pagination Test", () => {
    cy.get(`[data-testid="${HOME_TEST_ID.BUTTON.NEXT}"]`).click();
    cy.url().should("eq", `${BASE_URL}/posts/2/`);
    cy.get(`[data-testid="${HOME_TEST_ID.BUTTON.PREV}"]`).click();
    cy.url().should("eq", `${BASE_URL}/`);
  });
});
