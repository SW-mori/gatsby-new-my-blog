import { BASE_URL, POSTS_TEST_ID, TAGS_TEST_ID } from "../constants";

describe("Testing for posts page", () => {
  beforeEach(() => {
    cy.login("test@test.com", "testUser");
    cy.visit(`${BASE_URL}/posts/catch-up/`);
  });

  it("Confirming the screen display", () => {
    cy.contains("Gatsbyの基礎と環境構築");
    cy.contains("2025/10/06");
    cy.contains("Gatsby公式サイトの「What is Gatsby?」を確認");
    cy.contains("Next.jsやViteとの違いを整理");
    cy.contains("Node.js / Gatsby CLI をインストール");
    cy.contains("サンプルプロジェクト作成（gatsby new）");
    cy.contains("開発サーバー起動とプロジェクト構造確認");
    cy.contains("ページ作成、Layoutコンポーネント導入");
    cy.contains("gatsby-plugin-react-helmet でSEOタグを設定");
    cy.contains("シェア:");
    cy.contains("Twitter");
    cy.contains("Facebook");
    cy.contains("LinkedIn");
    cy.contains("コメント");
    cy.contains("問い合わせ");
    cy.contains("お名前:");
    cy.contains("メールアドレス:");
    cy.contains("メッセージ:");
    cy.contains("送信");
  });

  it("Testing whether the share link is correct", () => {
    cy.get(`[data-testid="${POSTS_TEST_ID.SHARE("twitter")}"]`)
      .should("have.attr", "target", "_blank")
      .should("have.attr", "href")
      .and("include", "https://twitter.com");
    cy.get(`[data-testid="${POSTS_TEST_ID.SHARE("facebook")}"]`)
      .should("have.attr", "target", "_blank")
      .should("have.attr", "href")
      .and("include", "https://www.facebook.com");
    cy.get(`[data-testid="${POSTS_TEST_ID.SHARE("linkedIn")}"]`)
      .should("have.attr", "target", "_blank")
      .should("have.attr", "href")
      .and("include", "https://www.linkedin.com");
  });

  it("Testing whether the share link is correct", () => {
    cy.get(`[data-testid="${POSTS_TEST_ID.INPUT("name")}"]`)
      .clear()
      .type("test");
    cy.get(`[data-testid="${POSTS_TEST_ID.INPUT("email")}"]`)
      .clear()
      .type("test@test.com");
    cy.get(`[data-testid="${POSTS_TEST_ID.INPUT("message")}"]`)
      .clear()
      .type("テストです。");
    cy.get(`[data-testid="${POSTS_TEST_ID.BUTTON}"]`).click();
    cy.contains("送信に失敗しました。もう一度お試しください。");
  });
});
