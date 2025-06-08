// index.js
const fs = require('node:fs');
const path = require('node:path');
// SADECE BİR TANE discord.js require'ı olmalı ve tümünü içermeli
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config(); // .env dosyasındaki değişkenleri yükler
const token = process.env.TOKEN;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// Komutları yükleme
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[UYARI] ${filePath} dosyasındaki komut "data" veya "execute" özelliğine sahip değil.`);
    }
}

// Bot hazır olduğunda
client.once(Events.ClientReady, () => {
    console.log(`${client.user.tag} olarak giriş yapıldı ve bot aktif!`);
});

// Slash komutlarını dinleme
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Komutu çalıştırırken bir hata oluştu!', ephemeral: true });
    }
});


// Buton etkileşimlerini dinleme
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    const roleMap = {
        'role_siber': 'Siber Güvenlik',
        'role_yapayzeka': 'Yapay Zeka',
        'role_oyun': 'Oyun Geliştirme',
        'role_web': 'Web Geliştirme',
        'role_mobil': 'Mobil Geliştirme'
    };

    const roleName = roleMap[interaction.customId];
    if (!roleName) return; // Bizim tanımlamadığımız bir butonsa işlem yapma

    const role = interaction.guild.roles.cache.find(r => r.name === roleName);
    if (!role) {
        return interaction.reply({ content: `"${roleName}" rolü sunucuda bulunamadı! Lütfen bir yöneticiyle iletişime geçin.`, ephemeral: true });
    }

    const member = interaction.member;

    try {
        if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role);
            await interaction.reply({ content: `✅ **${role.name}** rolü başarıyla kaldırıldı.`, ephemeral: true });
        } else {
            await member.roles.add(role);
            await interaction.reply({ content: `✅ **${role.name}** rolü başarıyla eklendi.`, ephemeral: true });
        }
    } catch (error) {
        console.error("Rol verme/alma hatası:", error);
        await interaction.reply({ content: 'Rolünüzü güncellerken bir hata oluştu. Lütfen tekrar deneyin.', ephemeral: true });
    }
});


client.login(token);

// RENDER İÇİN WEB SUNUCUSU KODU
//---------------------------------//
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Render'ın verdiği portu veya yerelde 3000'i kullan

app.get('/', (req, res) => {
  res.send('Bot Aktif!'); // Tarayıcıdan adrese girilince görünecek mesaj
});

app.listen(port, () => {
  console.log(`Web sunucusu ${port} portunda başlatıldı.`);
});
//---------------------------------//