// test.js - Hata ayıklama için minimal test dosyası

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// 1. KODUN GÖRDÜĞÜ DEĞİŞKENLERİ KONTROL EDELİM
//----------------------------------------------------
console.log("--- DEĞİŞKEN KONTROLÜ BAŞLADI ---");

// Güvenlik için token'ın sadece varlığını ve son 5 hanesini yazdıracağız.
console.log("TOKEN Değişkeni Yüklendi mi?:", process.env.TOKEN ? `Evet, sonu ...${process.env.TOKEN.slice(-5)}` : "HAYIR, YÜKLENEMEDİ!");
console.log("clientId Değişkeni Yüklendi mi?:", process.env.clientId ? "Evet, yüklendi." : "HAYIR, YÜKLENEMEDİ!");
console.log("guildId Değişkeni Yüklendi mi?:", process.env.guildId ? "Evet, yüklendi." : "HAYIR, YÜKLENEMEDİ!");

const testClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

console.log("Intents (İzinler) doğru ayarlanmış mı?:", testClient.options.intents.has(GatewayIntentBits.Guilds) ? "Evet, doğru." : "HAYIR, YANLIŞ!");

console.log("--- DEĞİŞKEN KONTROLÜ BİTTİ ---");
//----------------------------------------------------


// 2. GİRİŞ YAPMAYI DENEYELİM
//----------------------------------------------------
console.log("Botu başlatma denemesi yapılıyor...");

testClient.once('ready', () => {
    console.log("!!! BAŞARILI: Bot hazır ve Discord'a giriş yaptı!");
    console.log(`Giriş yapan bot: ${testClient.user.tag}`);
    // Test başarılı olduğu için 5 saniye sonra işlemi sonlandır.
    setTimeout(() => process.exit(0), 5000);
});

testClient.login(process.env.TOKEN).catch(err => {
    console.error("!!! HATA: Giriş yapılırken bir hata oluştu!");
    console.error(err);
    process.exit(1); // Hata ile işlemi sonlandır.
});
//----------------------------------------------------