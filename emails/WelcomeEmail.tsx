import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  userEmail?: string;
}

export const WelcomeEmail = ({ userEmail }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Você está na lista! 🎉 Acesso exclusivo ao Pinex em breve</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Logo */}
        <Section style={logoSection}>
          <Img
            src="https://pinex.site/logo.png"
            width="100"
            height="60"
            alt="Pinex"
            style={logo}
          />
        </Section>

        {/* Título */}
        <Heading style={h1}>Você está dentro! 🎉</Heading>

        {/* Mensagem principal */}
        <Text style={text}>E aí! Que bom ter você por aqui.</Text>

        <Text style={text}>
          Seu email <strong>{userEmail}</strong> acabou de entrar para a nossa
          lista VIP. Isso significa que quando o <strong>Pinex</strong> estiver
          prontinho, você vai ser um dos primeiros a colocar a mão na massa.
        </Text>

        <Text style={text}>
          Estamos trabalhando duro para criar algo que vai transformar a forma
          como você salva e organiza suas inspirações. Pensa em ter tudo que te
          inspira sempre à mão, de um jeito super prático e bonito.
        </Text>

        {/* Box de destaque */}
        <Section style={highlightBox}>
          <Text style={highlightText}>
            ✨ <strong>Acesso antecipado exclusivo</strong>
          </Text>
          <Text style={highlightSubtext}>
            Você vai receber seu convite antes de todo mundo. Fique de olho na
            sua caixa de entrada!
          </Text>
        </Section>

        <Text style={text}>
          Enquanto isso, se quiser trocar uma ideia ou tiver alguma sugestão, é
          só responder este email ou me chamar no X (Twitter) @watheushenry. A
          gente adora ouvir o que você tem a dizer!
        </Text>

        <Text style={signature}>
          Até logo,
          <br />
          <strong>Time Pinex</strong> 📌
        </Text>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            © 2025 Pinex. Todos os direitos reservados.
          </Text>
          <Text style={footerText}>
            Você está recebendo este email porque se cadastrou em{" "}
            <Link href="https://pinex.site" style={link}>
              pinex.site
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

// Estilos
const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    'Onest, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
};

const logoSection = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logo = {
  margin: "0 auto",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "32px",
  fontWeight: "700",
  textAlign: "center" as const,
  margin: "0 0 24px",
  lineHeight: "1.2",
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const highlightBox = {
  backgroundColor: "#f3f4f6",
  borderRadius: "12px",
  padding: "24px",
  margin: "32px 0",
  border: "2px solid #e5e7eb",
};

const highlightText = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 8px",
  textAlign: "center" as const,
};

const highlightSubtext = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0",
  textAlign: "center" as const,
  lineHeight: "1.5",
};

const signature = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "32px 0 0",
};

const footer = {
  borderTop: "1px solid #e5e7eb",
  marginTop: "48px",
  paddingTop: "24px",
};

const footerText = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0 0 8px",
  textAlign: "center" as const,
};

const link = {
  color: "#3b82f6",
  textDecoration: "underline",
};
