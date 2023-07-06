import nodemailer, {Transporter} from 'nodemailer'

export class MailService {
    private transporter: Transporter
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            secure: false,
            auth:{
                user: "classifiedafrica@gmail.com",
                pass: "wswjbcvamccqfpoa"
            },
            tls: {
                minVersion: 'TLSv1.2'
            }
        })
    }

    async sendActivationMail(to, link){
        await this.transporter.sendMail({
            from: "classifiedafrica@gmail.com",
            to: to,
            subject: 'Activation du compte pour ' + 'http://localhost:8080',
            text: '',
            html:
                `
                <div>
                    <h1>Pour activer suivez le lien</h1>
                    <a href="${link}">${link}</a>
                </div>
                `
        })
    }

    async feedback(topic, email, text){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: 'nigorshkov99@gmail.com',
            subject: topic,
            text: '',
            html:
                `
                <div>
                    <h1>Сообщение от пользователя</h1>
                </div>
                `
        })
    }
}
