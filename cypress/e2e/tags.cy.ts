import { BASE_URL, TAGS_TEST_ID } from "../constants";

describe("Testing for home page", () => {
  beforeEach(() => {
    cy.login("test@test.com", "testUser");
    cy.visit(`${BASE_URL}/tags/seo/`);
  });

  it("Confirming the screen display", () => {
    cy.contains("タグ: seo");
    cy.contains("シェア:");
    cy.contains("Twitter");
    cy.contains("Facebook");
    cy.contains("LinkedIn");
    cy.contains("高度なSEOとメタ情報");
    cy.contains("2025/10/20");
    cy.contains("記事一覧に戻る");
  });

  it("Test to see if it navigates to the relevant article page", () => {
    cy.contains("高度なSEOとメタ情報").click();
    cy.url().should("eq", `${BASE_URL}/posts/seo/`);
  });

  it("Test to see if it navigates to the article list page", () => {
    cy.contains("記事一覧に戻る").click();
    cy.url().should("eq", `${BASE_URL}/`);
  });

  it("Testing whether the share link is correct", () => {
    cy.get(`[data-testid="${TAGS_TEST_ID.SHARE("twitter")}"]`)
      .should("have.attr", "target", "_blank")
      .should("have.attr", "href")
      .and("include", "https://twitter.com");
    cy.get(`[data-testid="${TAGS_TEST_ID.SHARE("facebook")}"]`)
      .should("have.attr", "target", "_blank")
      .should("have.attr", "href")
      .and("include", "https://www.facebook.com");
    cy.get(`[data-testid="${TAGS_TEST_ID.SHARE("linkedIn")}"]`)
      .should("have.attr", "target", "_blank")
      .should("have.attr", "href")
      .and("include", "https://www.linkedin.com");
  });
});
