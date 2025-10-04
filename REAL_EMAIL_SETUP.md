# 実際にメールが届く設定手順

このファイルでは、お問い合わせフォームから実際にメールが届くようにするための設定手順を説明します。

## 方法1: EmailJS（推奨）

### 1. EmailJSアカウント作成
1. [EmailJS公式サイト](https://www.emailjs.com/)にアクセス
2. アカウントを作成
3. ダッシュボードにログイン

### 2. メールサービス設定
1. 「Email Services」をクリック
2. 「Add New Service」をクリック
3. 「Gmail」を選択
4. Gmailアカウント（lotuscard0722@gmail.com）でログイン
5. サービス名を「service_lotuscard」に設定
6. 「Create Service」をクリック

### 3. メールテンプレート作成
1. 「Email Templates」をクリック
2. 「Create New Template」をクリック
3. テンプレート名を「template_contact」に設定
4. 以下の内容を設定：

**件名:**
```
【お問い合わせ】{{subject}}
```

**本文:**
```html
<h2>お問い合わせが届きました</h2>
<p><strong>お名前:</strong> {{from_name}}</p>
<p><strong>メールアドレス:</strong> {{from_email}}</p>
<p><strong>件名:</strong> {{subject}}</p>
<p><strong>メッセージ:</strong></p>
<p>{{message}}</p>
<hr>
<p><small>送信日時: {{sent_date}}</small></p>
```

### 4. 公開キーの取得
1. 「Account」タブをクリック
2. 「API Keys」セクションで公開キーをコピー
3. 以下のファイルで公開キーを更新：

**script.js の 924行目:**
```javascript
'your_public_key' // ここに公開キーを貼り付け
```

**index.html の 318行目:**
```javascript
emailjs.init("YOUR_PUBLIC_KEY_HERE"); // ここに公開キーを貼り付け
```

## 方法2: Web3Forms（簡単）

### 1. Web3Formsアカウント作成
1. [Web3Forms公式サイト](https://web3forms.com/)にアクセス
2. アカウントを作成
3. アクセスキーを取得

### 2. 設定更新
**script.js の 939行目:**
```javascript
access_key: 'YOUR_WEB3FORMS_KEY', // ここにアクセスキーを貼り付け
```

## 方法3: Formspree（無料）

### 1. Formspreeアカウント作成
1. [Formspree公式サイト](https://formspree.io/)にアクセス
2. アカウントを作成
3. 新しいフォームを作成
4. フォームIDを取得

### 2. 設定更新
**script.js の 956行目:**
```javascript
'https://formspree.io/f/YOUR_FORM_ID', // ここにフォームIDを貼り付け
```

## 方法4: Netlify Forms（Netlifyでホスティングの場合）

### 1. HTMLフォームに属性を追加
```html
<form name="contact" method="POST" data-netlify="true">
    <!-- フォーム要素 -->
</form>
```

### 2. Netlifyでホスティング
1. Netlifyにサイトをデプロイ
2. フォーム送信が自動的に処理される

## 推奨設定

最も簡単で確実な方法は **EmailJS** です：

1. EmailJSアカウントを作成
2. Gmailサービスを連携
3. テンプレートを作成
4. 公開キーを取得
5. コード内の公開キーを更新

## テスト方法

1. お問い合わせフォームで送信
2. コンソールで送信ログを確認
3. lotuscard0722@gmail.com にメールが届くことを確認

## トラブルシューティング

### メールが届かない場合
1. 公開キーが正しく設定されているか確認
2. サービスIDとテンプレートIDが正しいか確認
3. Gmailの設定で「安全性の低いアプリのアクセス」を有効化
4. スパムフォルダを確認

### 送信エラーが発生する場合
1. ブラウザのコンソールでエラーメッセージを確認
2. ネットワーク接続を確認
3. フォームの必須項目がすべて入力されているか確認
