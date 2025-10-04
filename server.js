const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア設定
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// お問い合わせAPI
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
        
        // メール送信処理（実際のメール送信は環境に応じて実装）
        console.log('お問い合わせ受信:', {
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString()
        });
        
        // 成功レスポンス
        res.json({ 
            message: 'お問い合わせを送信しました。',
            success: true 
        });
        
    } catch (error) {
        console.error('お問い合わせ処理エラー:', error);
        res.status(500).json({ 
            error: '送信に失敗しました。しばらくしてから再度お試しください。' 
        });
    }
});

// 静的ファイルの配信
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`サーバーが起動しました: http://localhost:${PORT}`);
    console.log('お問い合わせフォームが利用可能です。');
});
