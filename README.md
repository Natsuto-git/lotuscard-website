# LotusCard ウェブサイト

LotusCard公式ウェブサイトです。

## 機能

- レスポンシブデザイン
- アニメーション効果
- お問い合わせフォーム
- モーダルウィンドウ

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを作成し、以下の設定を行ってください：

```env
PORT=3000
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_SERVICE=gmail
EMAIL_USER=lotuscard0722@gmail.com
NODE_ENV=production
```

### 3. サーバーの起動

```bash
# 開発モード
npm run dev

# 本番モード
npm start
```

## お問い合わせフォーム

ウェブサイト内でお問い合わせフォームが利用できます。

### 機能

- フォームバリデーション
- 送信状態の表示
- 成功・エラーメッセージ
- 自動返信メール（設定時）

### API エンドポイント

- `POST /api/contact` - お問い合わせ送信

## デプロイ

### Heroku でのデプロイ

1. Heroku CLI をインストール
2. アプリケーションを作成
3. 環境変数を設定
4. デプロイ

```bash
heroku create your-app-name
heroku config:set EMAIL_PASSWORD=your_password
git push heroku main
```

### Vercel でのデプロイ

1. Vercel CLI をインストール
2. プロジェクトをデプロイ

```bash
npm i -g vercel
vercel
```

## ファイル構成

```
├── index.html          # メインHTMLファイル
├── styles.css          # CSSスタイル
├── script.js           # JavaScript機能
├── server.js           # サーバーファイル
├── package.json        # 依存関係
├── api/
│   └── contact.js      # お問い合わせAPI
└── images/             # 画像ファイル
```

## ライセンス

MIT License
