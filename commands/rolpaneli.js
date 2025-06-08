// commands/rolpaneli.js

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');

// YENİ: Yönetim ekibi rollerinin tam isimleri, duyuru komutuyla aynı
const YONETIM_ROL_ISIMLERI = [
    'Yönetim Ekibi'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rol-paneli-gonder')
        .setDescription('Uzmanlık alanı rolleri için buton panelini gönderir.')
        // KALDIRILDI: .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        // Artık izin kontrolünü kod içinde yapacağız.
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Panelin gönderileceği kanal.')
                .setRequired(true)),

    async execute(interaction) {
        // YENİ: Komutu kullanan kişinin yönetim rollerinden birine sahip olup olmadığını kontrol et
        const hasPermission = interaction.member.roles.cache.some(role => YONETIM_ROL_ISIMLERI.includes(role.name));
        // Yönetim rolü yoksa ve aynı zamanda sunucu Yöneticisi de değilse, komutu engelle
        if (!hasPermission && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: '❌ Bu komutu kullanmak için yetkiniz bulunmuyor.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('kanal');

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🚀 Uzmanlık Alanı Rolleri')
            .setDescription('İlgilendiğiniz alanlara ait rolleri almak için aşağıdaki butonlara tıklayabilirsiniz. Rolü bırakmak için butona tekrar tıklamanız yeterlidir.');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('role_siber')
                    .setLabel('Siber Güvenlik')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🛡️'),
                new ButtonBuilder()
                    .setCustomId('role_yapayzeka')
                    .setLabel('Yapay Zeka')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🤖'),
                new ButtonBuilder()
                    .setCustomId('role_oyun')
                    .setLabel('Oyun Geliştirme')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🎮'),
                new ButtonBuilder()
                    .setCustomId('role_web')
                    .setLabel('Web Geliştirme')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🌐'),
                new ButtonBuilder()
                    .setCustomId('role_mobil')
                    .setLabel('Mobil Geliştirme')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📱'),
            );

        await channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: `Rol paneli başarıyla ${channel} kanalına gönderildi.`, ephemeral: true });
    },
};