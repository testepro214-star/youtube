const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/tiktok', async (req, res) => {
    const username = req.query.username ? req.query.username.replace('@', '').trim() : '';
    
    if (!username) {
        return res.status(400).json({ success: false, message: 'Username é obrigatório' });
    }

    try {
        const targetUrl = `https://www.tikwm.com/api/user/info?unique_id=${encodeURIComponent(username)}`;
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            timeout: 8000
        });

        if (response.data && response.data.code === 0) {
            const user = response.data.data.user;
            const stats = response.data.data.stats;

            return res.json({
                success: true,
                nickname: user.nickname,
                unique_id: user.unique_id,
                avatar: user.avatar,
                followerCount: stats.followerCount
            });
        }

        return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
