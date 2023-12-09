import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.BRAVO_SMTP_AKI_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.apiClient.authentications["api-key"].apiKey = apiKey;

const sendConfirmationMail = async (
  email,
  name,
  firstName,
  lastName,
  token
) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [
      {
        email: email,
        name: name,
      },
    ];
    sendSmtpEmail.templateId = 3;
    sendSmtpEmail.params = {
      firstName: firstName,
      lastName: lastName,
    };
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("API called successfully. Returned data:", data);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

export default sendConfirmationMail;
