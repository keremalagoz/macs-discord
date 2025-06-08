// commands/duyuru.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Yönetim ekibi rollerinin tam isimleri
const YONETIM_ROL_ISIMLERI = [
    'Başkan', 'Başkan Yardımcısı', 'Genel Koordinatör', 'Denetim Kurulu',
    'Eğitim ve Akademik Koordinatörlüğü', 'Proje ve Geliştirme Koordinatörlüğü',
    'RG ve Dış İlişkiler Koordinatörlüğü', 'Sponsorluk Koordinatörlüğü',
    'Tasarım Koordinatörlüğü', 'Sosyal Medya Koordinatörlüğü',
    'İletişim ve Tanıtım Koordinatörlüğü', 'İnsan İlişkileri (Human Relations) Koordinatörlüğü',
    'Etkinlik ve Organizasyon Koordinatörlüğü', 'Veri ve Teknik Altyapı Koordinatörlüğü'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duyuru')
        .setDescription('Embed formatında bir duyuru yayınlar.')
        .addStringOption(option =>
            option.setName('mesaj')
                .setDescription('Duyuru metni.')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Duyurunun gönderileceği kanal.')
                .setRequired(true)),

    async execute(interaction) {
        // Kullanıcının yönetim rollerinden birine sahip olup olmadığını kontrol et
        const hasPermission = interaction.member.roles.cache.some(role => YONETIM_ROL_ISIMLERI.includes(role.name));

        if (!hasPermission) {
            return interaction.reply({ content: '❌ Bu komutu kullanmak için yetkiniz bulunmuyor.', ephemeral: true });
        }

        const message = interaction.options.getString('mesaj');
        const channel = interaction.options.getChannel('kanal');

        const duyuruEmbed = new EmbedBuilder()
            .setColor('#FFD700') // Altın sarısı
            .setTitle('📢 Duyuru!')
            .setDescription(message)
            .setTimestamp()
            .setFooter({ text: `Duyuran: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await channel.send({ embeds: [duyuruEmbed] });
        await interaction.reply({ content: `Duyurunuz başarıyla ${channel} kanalına gönderildi.`, ephemeral: true });
    },
};