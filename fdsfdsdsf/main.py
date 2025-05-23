import smtplib
from email.mime.text import MIMEText
import json
import socket
from time import sleep

def send_email():
    try:
        # Load config
        with open("config.json", "r") as file:
            config_data = json.load(file)

        sender = config_data["sender"]
        password = config_data["password"]
        recipient = "kvazar382@gmail.com"

        # Prepare message
        msg = MIMEText("Code: 111111")
        msg["Subject"] = "Notification"
        msg["From"] = sender
        msg["To"] = recipient

        # Retry logic
        max_retries = 3 
        for attempt in range(max_retries):
            try:
                # Connect to SMTP server
                with smtplib.SMTP("smtp.gmail.com", 587, timeout=10) as server:
                    server.starttls()
                    server.login(sender, password)
                    server.sendmail(sender, recipient, msg.as_string())
                    print("Email sent successfully!")
                    return True
                    
            except socket.gaierror:
                print(f"DNS resolution failed (attempt {attempt + 1}/{max_retries})")
                if attempt == max_retries - 1:
                    raise
                sleep(2)  # Wait before retrying
                
            except Exception as e:
                print(f"Error sending email: {str(e)}")
                return False

    except Exception as e:
        print(f"Fatal error: {str(e)}")
        return False

if __name__ == "__main__":
    send_email()