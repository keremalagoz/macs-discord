// deploy-commands.js

// .env dosyasındaki ortam değişkenlerini process.env'ye yükler.
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Ortam değişkenlerinden gerekli bilgileri alıyoruz.
const clientId = process.env.clientId;
const guildId = process.env.guildId;
const token = process.env.TOKEN;

// Değişkenlerin var olup olmadığını kontrol edelim.
if (!clientId || !guildId || !token) {
    console.error("Hata: .env dosyasında clientId, guildId veya TOKEN değişkenlerinden biri eksik!");
    process.exit(1); // Değişken eksikse programı sonlandır.
}

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[UYARI] ${file} dosyasında 'data' bölümü bulunamadı.`);
    }
}

// Discord'un REST API'si ile iletişim kurmak için bir nesne oluştur.
const rest = new REST({ version: '10' }).setToken(token);

// Komutları dağıtmak için asenkron fonksiyonu çalıştır.
(async () => {
    try {
        console.log(`${commands.length} adet komut (/) yenileniyor.`);

        // Komutları Discord API'sine PUT metodu ile gönder.
        // Bu, belirtilen sunucudaki tüm komutları güncel olanlarla değiştirir.
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`${data.length} adet komut başarıyla yüklendi.`);
    } catch (error) {
        // Hata durumunda hatayı konsola yazdır.
        console.error(error);
    }
})();