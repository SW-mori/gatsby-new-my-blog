# Gatsby とは

Gatsby（Gatsby.js）は、React をベースにした 静的サイトジェネレーター（SSG） のひとつ。

Jamstack（JavaScript, API, Markup）アーキテクチャに対応していて、パフォーマンスが高く、SEO に強いのが特徴。

React + GraphQL を使ったモダンなフロントエンド開発環境を提供。

公式サイト: https://www.gatsbyjs.org/

🔑 Gatsby の特徴

1. React ベース

   → コンポーネント志向で開発できるので、React の知識がそのまま活かせる。

2. 静的サイト生成（SSG）

   → ビルド時に HTML を生成するため、表示が速く、セキュリティリスクも少ない。

3. GraphQL でのデータ取得

   → 画像や Markdown、CMS（WordPress、Contentful、Sanity など）からデータを取得する際に、GraphQL を使って柔軟にクエリできる。

4. プラグインが豊富

   → 画像最適化（gatsby-plugin-image）、SEO 対応、PWA 化、Sitemap 生成など、多くの機能をプラグインで簡単に追加できる。

5. 高速な表示

   → 自動的にコード分割やプリフェッチを行い、Lighthouse スコアが高く出やすい。

🚀 代表的なユースケース

・ブログやポートフォリオ
Markdown + Gatsby で簡単に作れる。

・企業のコーポレートサイト
表示速度が重要なランディングページや LP。

・ヘッドレス CMS と組み合わせたサイト
例: WordPress をヘッドレス化してフロントを Gatsby で構築。

🛠 簡単な使い方の流れ

Gatsby CLI をインストール

`npm install -g gatsby-cli`

プロジェクトを作成

`gatsby new my-site`

`cd my-site`

開発サーバーを起動

`gatsby develop`

本番ビルド

`gatsby build`

`gatsby serve`

⚖️ Next.js との違い

・Gatsby: 静的サイト生成が得意。GraphQL によるデータ統合が強み。小～中規模サイト向け。

・Next.js: SSG + SSR（サーバーサイドレンダリング）両対応。柔軟で大規模アプリ向け。

🌍 Gatsby の基本概念

Gatsby は 静的サイトジェネレーター（SSG） ですが、単に Markdown を HTML に変換するだけの仕組みではなく、React + GraphQL を使ったモダンなフロントエンド開発環境 を提供します。

1. React コンポーネント

・UI を React コンポーネントで作成します。

・ページは src/pages 配下のファイルが自動的にルーティングされます。

・例: src/pages/about.js → /about でアクセス可能。

2. GraphQL データレイヤー

・Gatsby の特徴的な仕組みが「GraphQL によるデータ統合」です。

・さまざまなデータソースを GraphQL スキーマに統合 して扱える。

- Markdown ファイル

- JSON / YAML

- ヘッドレス CMS（Contentful, Sanity, WordPress など）

- 外部 API

- 画像ファイル

📌 例：Markdown の記事を GraphQL で取得

`query {
  allMarkdownRemark {
    nodes {
      frontmatter {
        title
        date
      }
      excerpt
    }
  }
}`

3. プラグインとテーマ

Gatsby には公式・非公式合わせて数千のプラグインが存在する。

・gatsby-plugin-image: 画像最適化

・gatsby-plugin-sitemap: サイトマップ自動生成

・gatsby-plugin-manifest: PWA 対応

・gatsby-plugin-google-analytics: GA 埋め込み

さらに「テーマ」を使うと、ブログやポートフォリオの雛形をすぐに利用できます。

4. ビルドとデプロイ

・gatsby build で静的ファイル（HTML, JS, CSS, 画像）が生成されます。

・ホスティング先は自由：

- Netlify / Vercel → デプロイが簡単で無料枠あり

- GitHub Pages

- AWS S3 + CloudFront

- Firebase Hosting

⚡ Gatsby のメリット

1. パフォーマンスが非常に高い

   → 自動でコード分割・画像最適化・プリフェッチされる。

2. SEO に強い

   → 静的 HTML が生成されるのでクローラーに優しい。

3. 豊富なデータ統合

   → Markdown も CMS も API も統一して GraphQL で扱える。

4. Jamstack 向け

   → サーバーレス構成でセキュリティが高く、コストも低い。

⚠️ Gatsby のデメリット

1. ビルドが重い・遅い（特に大規模サイト）

   → ページ数が増えるとビルド時間が長くなる。

2. SSR / ISR の柔軟性が Next.js より弱い

   → 動的なページ生成は少し工夫が必要。

3. GraphQL 学習コスト

   → Gatsby 特有の GraphQL クエリの書き方に慣れる必要がある。

💡 Gatsby が向いているケース

・技術ブログやポートフォリオサイト

・中小規模のコーポレートサイト

・ヘッドレス CMS と組み合わせたメディアサイト

・高速な静的 LP（ランディングページ）

## パフォーマンス計測

- Lighthouse を用いてパフォーマンス・SEO・アクセシビリティをチェック
  - 指標例：
    - FCP（First Contentful Paint）
    - LCP（Largest Contentful Paint）
    - CLS（Cumulative Layout Shift）
- 画像最適化やキャッシュ設定によってスコアが改善される

## Incremental Build（増分ビルド）

- 変更があったページだけを再ビルドする仕組み
  - 大規模サイトでのビルド時間短縮に有効
- Gatsby Cloud が提供する機能で、GitHub 連携で自動ビルド可能
- 差分ビルドの流れ：
  1. Markdown やコンテンツを更新
  2. 更新されたページだけ再生成
  3. ビルド時間が短縮され、即座にプレビュー可能

## Gatsby Cloud の特徴

- GitHub 連携で自動ビルド
- Incremental Build 対応
- ビルドログでどのページが更新されたかを確認可能
- 開発効率の向上、CI/CD に近い運用が可能

## 知っておくと便利なポイント

- ビルド後の `/public` を直接見ると生成結果を確認できる
- ビルドの高速化には
  - 画像最適化
  - キャッシュ利用
  - Incremental Build
    が重要
- Gatsby Cloud を使うとローカルでのビルド時間の課題を解消可能
