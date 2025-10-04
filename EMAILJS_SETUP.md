# EmailJS セットアップ手順

このファイルでは、お問い合わせフォームで実際にメールを送信するためのEmailJSの設定手順を説明します。

## 1. EmailJSアカウント作成

1. [EmailJS公式サイト](https://www.emailjs.com/)にアクセス
2. 「Sign Up」でアカウントを作成
3. メールアドレスで認証

## 2. メールサービス設定

### Gmail の場合

1. EmailJSダッシュボードで「Email Services」をクリック
2. 「Add New Service」をクリック
3. 「Gmail」を選択
4. Gmailアカウントでログイン
5. サービス名を「service_lotuscard」に設定
6. 「Create Service」をクリック

### その他のメールサービス

- Outlook: Microsoftアカウントでログイン
- Yahoo: Yahooアカウントでログイン
- カスタムSMTP: サーバー情報を入力

## 3. メールテンプレート作成

### 管理者宛メールテンプレート

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

### 自動返信メールテンプレート

1. 新しいテンプレートを作成
2. テンプレート名を「template_auto_reply」に設定
3. 以下の内容を設定：

**件名:**
```
【LotusCard】お問い合わせありがとうございます
```

**本文:**
```html
<h2>お問い合わせありがとうございます</h2>
<p>{{to_name}} 様</p>
<p>この度は、LotusCardにお問い合わせいただき、誠にありがとうございます。</p>
<p>以下の内容でお問い合わせを承りました：</p>
<hr>
<p><strong>件名:</strong> {{original_subject}}</p>
<p><strong>メッセージ:</strong></p>
<p>{{message}}</p>
<hr>
<p>内容を確認の上、2営業日以内にご返信いたします。</p>
<p>今しばらくお待ちください。</p>
<br>
<p>LotusCard運営チーム</p>
<p>メール: lotuscard0722@gmail.com</p>
```

## 4. 公開キーの取得

1. 「Account」タブをクリック
2. 「API Keys」セクションで公開キーをコピー
3. 以下のファイルで公開キーを更新：

### email-config.js
```javascript
const EMAIL_CONFIG = {
    serviceId: 'service_lotuscard',
    templateId: 'template_contact',
    publicKey: 'YOUR_PUBLIC_KEY_HERE', // ここに公開キーを貼り付け
    // ...
};
```

### index.html
```html
<script type="text/javascript">
    (function(){
        emailjs.init("YOUR_PUBLIC_KEY_HERE"); // ここに公開キーを貼り付け
    })();
</script>
```

## 5. テスト送信

1. ウェブサイトでお問い合わせフォームを開く
2. テストデータを入力して送信
3. 管理者メールと自動返信メールが届くことを確認

## 6. 本番環境での注意点

- 公開キーはクライアントサイドに露出するため、セキュリティ設定を適切に行う
- スパム対策として送信制限を設定
- メール送信ログを監視
- 定期的にテンプレートを更新

## トラブルシューティング

### メールが送信されない場合

1. 公開キーが正しく設定されているか確認
2. サービスIDとテンプレートIDが正しいか確認
3. ブラウザのコンソールでエラーメッセージを確認
4. EmailJSのダッシュボードで送信ログを確認

### 自動返信が送信されない場合

1. テンプレートIDが正しいか確認
2. 送信者メールアドレスが設定されているか確認
3. メールサービスの設定を確認

## 料金プラン

- 無料プラン: 月200通まで
- 有料プラン: より多くの送信数と高度な機能

詳細は[EmailJS料金ページ](https://www.emailjs.com/pricing/)を確認してください。
