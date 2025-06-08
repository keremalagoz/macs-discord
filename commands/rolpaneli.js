// commands/rolpaneli.js
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rol-paneli-gonder')
        .setDescription('Uzmanlık alanı rolleri için buton panelini gönderir.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator) // Sadece adminler kullanabilir
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Panelin gönderileceği kanal.')
                .setRequired(true)),

    async execute(interaction) {
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