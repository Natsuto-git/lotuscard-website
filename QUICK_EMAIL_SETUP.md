# 簡単メール送信設定（5分で完了）

実際にメールが届くようにするための最も簡単な方法です。

## 方法1: Web3Forms（推奨・無料）

### 1. Web3Formsアカウント作成（2分）
1. [https://web3forms.com/](https://web3forms.com/)にアクセス
2. 「Get Started」をクリック
3. メールアドレス（lotuscard0722@gmail.com）を入力
4. アクセスキーを取得

### 2. コード更新（1分）
**script.js の 939行目を更新:**
```javascript
access_key: 'YOUR_ACTUAL_ACCESS_KEY', // 取得したアクセスキーに変更
```

### 3. テスト（2分）
1. お問い合わせフォームで送信
2. lotuscard0722@gmail.com にメールが届くことを確認

## 方法2: Formspree（無料・簡単）

### 1. Formspreeアカウント作成（2分）
1. [https://formspree.io/](https://formspree.io/)にアクセス
2. アカウントを作成
3. 新しいフォームを作成
4. フォームIDを取得（例：xqkzrqkn）

### 2. コード更新（1分）
**script.js の 956行目を更新:**
```javascript
'https://formspree.io/f/xqkzrqkn', // 取得したフォームIDに変更
```

### 3. テスト（2分）
1. お問い合わせフォームで送信
2. lotuscard0722@gmail.com にメールが届くことを確認

## 方法3: Netlify Forms（Netlifyでホスティングの場合）

### 1. HTMLフォームに属性追加（1分）
```html
<form id="contact-form" name="contact" method="POST" data-netlify="true">
```

### 2. Netlifyでデプロイ（2分）
1. Netlifyにサイトをデプロイ
2. フォーム送信が自動的に処理される

## 最も簡単な方法：Web3Forms

1. [Web3Forms](https://web3forms.com/)でアカウント作成
2. アクセスキーをコピー
3. script.js の 939行目の `'a1b2c3d4-e5f6-7890-abcd-ef1234567890'` を実際のキーに変更
4. 完了！

## 確認方法

送信後、コンソールで以下のメッセージが表示されれば成功：
```
Web3Forms送信成功: {success: true}
```

## トラブルシューティング

### メールが届かない場合
1. アクセスキーが正しいか確認
2. スパムフォルダを確認
3. コンソールでエラーメッセージを確認

### 送信エラーが発生する場合
1. ネットワーク接続を確認
2. フォームの必須項目がすべて入力されているか確認
3. ブラウザのコンソールでエラーメッセージを確認
