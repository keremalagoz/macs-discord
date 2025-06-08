// commands/duyuru.js

const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

// Yönetim ekibi rollerinin tam isimleri (Bu listeyi kendi sunucunuza göre düzenleyebilirsiniz)
const YONETIM_ROL_ISIMLERI = [
    'Başkan', 'Başkan Yardımcısı', 'Genel Koordinatör', 'Denetim Kurulu',
    'Eğitim ve Akademik Koordinatörlüğü', 'Proje ve Geliştirme Koordinatörlüğü',
    'RG ve Dış İlişkiler Koordinatörlüğü', 'Sponsorluk Koordinatörlüğü',
    'Tasarım Koordinatörlüğü', 'Sosyal Medya Koordinatörlüğü',
    'İletişim ve Tanıtım Koordinatörlüğü', 'İnsan İlişkileri (Human Relations) Koordinatörlüğü',
    'Etkinlik ve Organizasyon Koordinatörlüğü', 'Veri ve Teknik Altyapı Koordinatörlüğü'
];

module.exports = {
    // 1. Komutun yapısını ve seçeneklerini tanımlıyoruz.
    data: new SlashCommandBuilder()
        .setName('duyuru')
        .setDescription('Gelişmiş bir embed mesajı ile duyuru yayınlar.')
        .addStringOption(option =>
            option.setName('başlık')
                .setDescription('Duyurunun başlığı.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mesaj')
                .setDescription('Duyurunun ana metni.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('fotoğraf')
                .setDescription('Duyuruya eklenecek fotoğrafın URL adresi.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Başlığa tıklandığında gidilecek web adresi (URL).')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('alt_metin')
                .setDescription('Duyurunun en altına eklenecek küçük not.')
                .setRequired(false)),

    // 2. Komut çalıştırıldığında ne olacağını tanımlıyoruz.
    async execute(interaction) {
        // Komutu kullanan kişinin yönetim rollerinden birine sahip olup olmadığını kontrol et
        const hasPermission = interaction.member.roles.cache.some(role => YONETIM_ROL_ISIMLERI.includes(role.name));
        if (!hasPermission && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: '❌ Bu komutu kullanmak için yetkiniz bulunmuyor.', ephemeral: true });
        }

        // Komut seçeneklerinden gelen verileri alıyoruz
        const başlık = interaction.options.getString('başlık');
        const mesaj = interaction.options.getString('mesaj');
        const fotoğraf = interaction.options.getString('fotoğraf');
        const link = interaction.options.getString('link');
        const altMetin = interaction.options.getString('alt_metin');

        // Varsayılan kanal olarak '#duyurular' kanalını buluyoruz
        const duyuruKanali = interaction.guild.channels.cache.find(channel => channel.name === 'duyurular');
        if (!duyuruKanali) {
            return interaction.reply({ content: '❌ `#duyurular` adında bir kanal bulunamadı! Lütfen kanalı oluşturun.', ephemeral: true });
        }

        // Embed mesajını oluşturuyoruz
        const duyuruEmbed = new EmbedBuilder()
            .setColor(0x0099FF) // Canlı bir mavi renk
            .setTitle(başlık)
            .setDescription(mesaj)
            // Gönderenin sunucudaki takma adını ve avatarını "author" kısmına ekliyoruz
            .setAuthor({ name: `Duyuran: ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
            .setTimestamp();

        // Eğer kullanıcı link verdiyse, başlığa ekliyoruz
        if (link) {
            try {
                // Girilen linkin geçerli bir URL olup olmadığını kontrol ediyoruz
                new URL(link);
                duyuruEmbed.setURL(link);
            } catch (error) {
                return interaction.reply({ content: '❌ Geçersiz bir link URL\'i girdiniz. Lütfen `https://` ile başlayan tam bir adres girin.', ephemeral: true });
            }
        }
        
        // Eğer kullanıcı fotoğraf URL'i verdiyse, embed'e ekliyoruz
        if (fotoğraf) {
            try {
                // Girilen fotoğraf linkinin geçerli bir URL olup olmadığını kontrol ediyoruz
                new URL(fotoğraf);
                duyuruEmbed.setImage(fotoğraf);
            } catch (error) {
                return interaction.reply({ content: '❌ Geçersiz bir fotoğraf URL\'i girdiniz. Lütfen `https://` ile başlayan tam bir adres girin.', ephemeral: true });
            }
        }
        
        // Eğer kullanıcı alt metin verdiyse, footer'a ekliyoruz
        if (altMetin) {
            duyuruEmbed.setFooter({ text: altMetin });
        }

        // Oluşturulan embed'i '#duyurular' kanalına gönderiyoruz
        try {
            await duyuruKanali.send({ embeds: [duyuruEmbed] });
            await interaction.reply({ content: `✅ Duyurunuz başarıyla ${duyuruKanali} kanalına gönderildi.`, ephemeral: true });
        } catch (error) {
            console.error("Duyuru gönderme hatası:", error);
            await interaction.reply({ content: '❌ Duyuru gönderilirken bir hata oluştu. Botun o kanalda yazma izni olduğundan emin olun.', ephemeral: true });
        }
    },
};