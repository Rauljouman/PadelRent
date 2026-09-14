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
        var host = _configuration["Email:Host"];
        var port = int.Parse(_configuration["Email:Port"] ?? "587");
        var username = _configuration["Email:Username"];
        var password = _configuration["Email:Password"];
        var from = _configuration["Email:From"];

        if (
            string.IsNullOrWhiteSpace(host) ||
            string.IsNullOrWhiteSpace(username) ||
            string.IsNullOrWhiteSpace(password) ||
            string.IsNullOrWhiteSpace(from)
        )
        {
            throw new Exception("La configuración de email no está completa.");
        }

        var email = new MimeMessage();

        email.From.Add(MailboxAddress.Parse(from));
        email.To.Add(MailboxAddress.Parse(destinatario));
        email.Subject = asunto;

        email.Body = new TextPart("html")
        {
            Text = contenidoHtml
        };

        using var smtp = new SmtpClient();

        await smtp.ConnectAsync(host, port, SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(username, password);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}