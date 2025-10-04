// お問い合わせフォーム処理API
// このファイルはNode.jsサーバーで使用することを想定しています

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// CORS設定
app.use(cors());
app.use(express.json());

// メール送信設定
const transporter = nodemailer.createTransporter({
    service: 'gmail', // または他のメールサービス
    auth: {
        user: 'lotuscard0722@gmail.com',
        pass: process.env.EMAIL_PASSWORD // 環境変数からパスワードを取得
    }
});

// お問い合わせフォーム処理
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // バリデーション
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'すべての項目を入力してください。' });
        }
        
        // メールアドレスの形式チェック
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: '正しいメールアドレスを入力してください。' });
        }
        
        // 管理者宛メール
        const adminMailOptions = {
            from: 'lotuscard0722@gmail.com',
            to: 'lotuscard0722@gmail.com',
            subject: `【お問い合わせ】${subject}`,
            html: `
                <h2>お問い合わせが届きました</h2>
                <p><strong>お名前:</strong> ${name}</p>
                <p><strong>メールアドレス:</strong> ${email}</p>
                <p><strong>件名:</strong> ${subject}</p>
                <p><strong>メッセージ:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><small>送信日時: ${new Date().toLocaleString('ja-JP')}</small></p>
            `
        };
        
        // 自動返信メール
        const autoReplyOptions = {
            from: 'lotuscard0722@gmail.com',
            to: email,
            subject: '【LotusCard】お問い合わせありがとうございます',
            html: `
                <h2>お問い合わせありがとうございます</h2>
                <p>${name} 様</p>
                <p>この度は、LotusCardにお問い合わせいただき、誠にありがとうございます。</p>
                <p>以下の内容でお問い合わせを承りました：</p>
                <hr>
                <p><strong>件名:</strong> ${subject}</p>
                <p><strong>メッセージ:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p>内容を確認の上、2営業日以内にご返信いたします。</p>
                <p>今しばらくお待ちください。</p>
                <br>
                <p>LotusCard運営チーム</p>
                <p>メール: lotuscard0722@gmail.com</p>
            `
        };
        
        // メール送信
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(autoReplyOptions);
        
        res.json({ message: 'お問い合わせを送信しました。' });
        
    } catch (error) {
        console.error('メール送信エラー:', error);
        res.status(500).json({ error: '送信に失敗しました。しばらくしてから再度お試しください。' });
    }
});

module.exports = app;
