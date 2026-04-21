using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace FantasyApi.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendResetPasswordEmailAsync(string toEmail, string resetLink)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Phoenix Fantasy", _config["Email:From"]??""));
            message.To.Add(new MailboxAddress("", toEmail??""));
            message.Subject = "Reset Your Password";

            message.Body = new TextPart("html")
            {
                Text = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                        <h2 style='color: #f97316;'>Phoenix Fantasy</h2>
                        <h3>Reset Your Password</h3>
                        <p>You requested a password reset. Click the button below to reset your password.</p>
                        <p>This link will expire in <strong>1 hour</strong>.</p>
                        <a href='{resetLink}' 
                           style='background-color: #f97316; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;'>
                            Reset Password
                        </a>
                        <p>If you didn't request this, ignore this email.</p>
                    </div>"
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(
                _config["Email:Host"],
                int.Parse(_config["Email:Port"]!),
                SecureSocketOptions.StartTls
            );
            await smtp.AuthenticateAsync(_config["Email:Username"], _config["Email:Password"]);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }

        public async Task SendPasswordChangedEmailAsync(string toEmail, string firstName)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Phoenix Fantasy", _config["Email:From"]??""));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = "Your Password Was Changed";

            message.Body = new TextPart("html")
            {
                Text = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                        <h2 style='color: #f97316;'>Phoenix Fantasy</h2>
                        <h3>Password Changed</h3>
                        <p>Hi {firstName},</p>
                        <p>Your password was successfully changed.</p>
                        <p>If this wasn't you, please contact support immediately as your account may be compromised.</p>
                        <p style='color: #f97316; font-weight: bold;'>If you did not make this change, secure your account immediately.</p>
                        <p>— Phoenix Fantasy Team</p>
                    </div>"
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(
                _config["Email:Host"],
                int.Parse(_config["Email:Port"]!),
                SecureSocketOptions.StartTls
            );
            await smtp.AuthenticateAsync(_config["Email:Username"], _config["Email:Password"]);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }
    }
}