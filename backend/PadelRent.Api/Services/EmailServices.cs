using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace PadelRent.Api.Services;

public class EmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task EnviarEmailAsync(string destinatario, string asunto, string contenidoHtml)
    {
        var smtpHost = _configuration["Email:SmtpHost"];
        var smtpPortText = _configuration["Email:SmtpPort"];
        var smtpUser = _configuration["Email:SmtpUser"];
        var smtpPassword = _configuration["Email:SmtpPassword"];
        var fromEmail = _configuration["Email:FromEmail"];
        var fromName = _configuration["Email:FromName"] ?? "PadelRent";

        if (
            string.IsNullOrWhiteSpace(smtpHost) ||
            string.IsNullOrWhiteSpace(smtpPortText) ||
            string.IsNullOrWhiteSpace(smtpUser) ||
            string.IsNullOrWhiteSpace(smtpPassword) ||
            string.IsNullOrWhiteSpace(fromEmail)
        )
        {
            throw new Exception("La configuración de email no está completa.");
        }

        if (!int.TryParse(smtpPortText, out var smtpPort))
        {
            throw new Exception("El puerto SMTP no es válido.");
        }

        var email = new MimeMessage();

        email.From.Add(new MailboxAddress(fromName, fromEmail));
        email.To.Add(MailboxAddress.Parse(destinatario));
        email.Subject = asunto;

        email.Body = new TextPart("html")
        {
            Text = contenidoHtml
        };

        using var smtp = new SmtpClient();

        smtp.Timeout = 60000;

        var secureSocketOptions = smtpPort == 465
            ? SecureSocketOptions.SslOnConnect
            : SecureSocketOptions.StartTlsWhenAvailable;

        try
        {
            await smtp.ConnectAsync(smtpHost, smtpPort, secureSocketOptions);
            await smtp.AuthenticateAsync(smtpUser, smtpPassword);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            throw new Exception($"No se pudo enviar el email: {ex.Message}");
        }
    }
}