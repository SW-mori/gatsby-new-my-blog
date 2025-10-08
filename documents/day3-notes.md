# Day 3: 動的ページ生成 学習メモ

## 🎯 目的

Gatsby Node API を使用して、Markdown ファイルから動的にページを生成できるようにする。

---

## 🕐 午前 9:30〜11:30：`gatsby-node.js` の実装

### 学んだこと

- Gatsby では Node API の `createPages` を使って動的ページを生成できる。
- GraphQL で Markdown の `slug` を取得し、テンプレートと紐づける。
- ページ生成時に `context` でテンプレートへデータを渡すことができる。

### コード例（概要）

```js
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allMarkdownRemark {
        nodes {
          frontmatter {
            slug
          }
        }
      }
    }
  `);

  result.data.allMarkdownRemark.nodes.forEach((node) => {
    createPage({
      path: node.frontmatter.slug,
      component: require.resolve("./src/templates/blog-post.tsx"),
      context: { slug: node.frontmatter.slug },
    });
  });
};
```

---

## 🕐 午前 11:30〜12:30：GraphQL クエリを記事ページに渡す

### 学んだこと

- `context` に渡したデータはテンプレート内で GraphQL クエリに利用できる。
- ページ固有の情報（`slug`）をもとに記事データを取得できる。

### ポイント

- 各記事ページは `/gatsby-markdown-page` のように自動生成される。
- `pageQuery` の `$slug` 変数でフィルタリング。

---

## 🕐 午後 13:30〜15:30：記事リストとリンクの作成

### 学んだこと

- トップや記事一覧ページで `Link` を使って各詳細ページに遷移できるようにする。
- デザインを少し整え、記事タイトル・日付・抜粋を一覧表示。

### ポイント

- Markdown から取得した `slug` を `<Link to={slug}>` で使用。
- スタイルを SCSS モジュールで管理。

---

## 🕐 午後 15:30〜17:30：ページネーションとタグ機能

### 学んだこと

- ページネーションでは `skip` と `limit` を GraphQL に渡して制御。
- タグ別ページを作成して、特定のタグの記事一覧を表示。
- `createPage` を複数回呼び出してタグページも動的生成。

### 振り返り

- Gatsby のデータ層と Node API の連携を理解できた。
- SSG の強みを活かした動的ルーティングの仕組みを実装。

---

## ✅ 成果物

- `gatsby-node.js` による Markdown ページ自動生成
- 記事詳細テンプレート (`blog-post.tsx`)
- 記事一覧ページとページネーション
- タグページ生成機能
