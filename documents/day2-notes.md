# Day 2: Gatsby データ取得と GraphQL 学習メモ

## 🎯 目的

Gatsby のデータ層（GraphQL）を理解し、外部データ（Markdown や画像）を扱えるようにする。

---

## 🕐 午前 9:30〜11:30：GraphQL と useStaticQuery の理解

### ✅ 学んだこと

- Gatsby は GraphQL を内部的に使用して、**ビルド時にデータをまとめて取得** する。
- `gatsby develop` を実行すると、GraphQL プレイグラウンド（[http://localhost:8000/\_\_\_graphql](http://localhost:8000/___graphql)）でデータ構造を確認できる。
- React の中でデータを取得するには `useStaticQuery` または `graphql` タグを使用。

### 💡 ポイント

- `graphql` タグはビルド時に解析される（実行時にネットワーク通信は発生しない）。
- サイトメタ情報や Markdown など、すべて GraphQL 経由で取得するのが Gatsby 流。

---

## 🕐 午前 11:30〜12:30：画像最適化と gatsby-plugin-image

### ✅ 使用プラグイン

```bash
npm install gatsby-plugin-image gatsby-plugin-sharp gatsby-transformer-sharp
```

### ✅ 設定（gatsby-config.ts）

```ts
plugins: [
  `gatsby-plugin-sass`,
  `gatsby-plugin-image`,
  `gatsby-plugin-sharp`,
  `gatsby-transformer-sharp`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `images`,
      path: `${__dirname}/src/images`,
    },
  },
];
```

### ✅ コード例

```tsx
import { StaticImage } from "gatsby-plugin-image";

<StaticImage
  src="../images/sample.png"
  alt="サンプル画像"
  width={600}
  height={400}
  placeholder="blurred"
/>;
```

### 💡 学び

- `<StaticImage>` は**ビルド時に最適化された画像を自動生成**する。
- `placeholder="blurred"` でフェードインエフェクトを簡単に実装可能。

---

## 🕐 午後 13:30〜15:30：Markdown データの読み込み

### ✅ 使用プラグイン

```bash
npm install gatsby-source-filesystem gatsby-transformer-remark
```

### ✅ 設定（gatsby-config.ts）

```ts
{
  resolve: `gatsby-source-filesystem`,
  options: {
    name: `content`,
    path: `${__dirname}/content`,
  },
},
`gatsby-transformer-remark`,
```

### ✅ Markdown ファイル例

`content/first-post.md`

```md
---
title: "初めてのGatsbyブログ"
date: "2025-10-06"
---

Gatsby を使って最初の Markdown ブログを作成しました。
```

### ✅ GraphQL クエリ例

```graphql
query {
  allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
    nodes {
      id
      excerpt
      frontmatter {
        title
        date(formatString: "YYYY/MM/DD")
      }
    }
  }
}
```

### ✅ React 側での表示例

```tsx
{
  posts.map((post) => (
    <article key={post.id}>
      <h3>{post.frontmatter.title}</h3>
      <p>{post.frontmatter.date}</p>
      <p>{post.excerpt}</p>
    </article>
  ));
}
```

### 💡 学び

- `gatsby-source-filesystem` が Markdown ファイルを読み取り、
- `gatsby-transformer-remark` がそれを **GraphQL 経由で利用可能な形に変換**。
- Gatsby は「ファイルをデータ」として扱う静的サイトジェネレーター。

---

## 🕐 午後 15:30〜17:30：記事一覧表示とスタイル調整

### ✅ SCSS モジュールの設定

```bash
npm install sass
```

### ✅ ファイル例

`src/pages/index.module.scss`

```scss
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
}

.intro {
  color: #555;
  font-size: 16px;
  margin-bottom: 20px;
}

.image {
  border-radius: 8px;
  margin-bottom: 30px;
}

.postList {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.post {
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
}

.postTitle {
  color: #333;
  font-size: 20px;
  margin-bottom: 8px;
}

.postDate {
  color: #888;
  font-size: 14px;
  margin-bottom: 12px;
}

.postExcerpt {
  color: #444;
  font-size: 15px;
}
```

### 💡 学び

- Gatsby では SCSS モジュールを使うと、各コンポーネントごとにクラススコープを分離できる。
- CSS の衝突を防ぎつつ、スタイルを明確に管理できる。

---

## 📘 まとめ

| 分野           | 学んだ内容                   | Gatsby 機能                                             |
| -------------- | ---------------------------- | ------------------------------------------------------- |
| データ層       | GraphQL による静的データ取得 | `graphql`, `useStaticQuery`                             |
| 画像最適化     | 高速・レスポンシブ画像       | `gatsby-plugin-image`                                   |
| コンテンツ管理 | Markdown をソースに利用      | `gatsby-source-filesystem`, `gatsby-transformer-remark` |
| スタイル       | SCSS モジュール              | `gatsby-plugin-sass`                                    |

---

## 🗂️ 次回（Day3）予定

- `gatsby-node.ts` を使用して Markdown から動的ページを自動生成
- 記事詳細ページ・タグページの作成
- ページネーション実装
