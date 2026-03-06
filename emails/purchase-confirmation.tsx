import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Heading,
} from "@react-email/components";
import { formatPrice } from "@/lib/format-price";
import { SITE_CONFIG } from "@/lib/constants";

interface PurchaseConfirmationEmailProps {
  items: {
    product_name: string;
    price: number;
    download_url: string;
  }[];
  total: number;
}

export default function PurchaseConfirmationEmail({
  items = [],
  total = 0,
}: PurchaseConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f5f5f5" }}>
        <Container
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "32px",
          }}
        >
          <Heading
            style={{
              color: "#6366F1",
              fontSize: "24px",
              marginBottom: "16px",
            }}
          >
            Grazie per il tuo acquisto!
          </Heading>

          <Text style={{ color: "#333", fontSize: "16px" }}>
            Ecco il riepilogo del tuo ordine e i link per scaricare i tuoi
            appunti.
          </Text>

          <Section
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: "12px",
              padding: "16px",
              margin: "24px 0",
            }}
          >
            {items.map((item, i) => (
              <Section
                key={i}
                style={{
                  marginBottom: "16px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #e5e5e5",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    margin: "0 0 4px",
                  }}
                >
                  {item.product_name}
                </Text>
                <Text style={{ color: "#666", margin: "0 0 8px" }}>
                  {formatPrice(item.price)}
                </Text>
                <Button
                  href={item.download_url}
                  style={{
                    backgroundColor: "#6366F1",
                    color: "#ffffff",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                >
                  Scarica ora
                </Button>
              </Section>
            ))}

            <Hr style={{ borderColor: "#d4d4d4", borderWidth: "2px" }} />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                margin: "12px 0 0",
              }}
            >
              Totale: {formatPrice(total)}
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <Text style={{ margin: 0, fontSize: "14px", color: "#92400E" }}>
              I link di download sono validi per 48 ore e puoi scaricare ogni
              file fino a 5 volte.
            </Text>
          </Section>

          <Hr style={{ borderColor: "#e5e5e5", margin: "24px 0" }} />

          <Text
            style={{
              color: "#999",
              fontSize: "12px",
              textAlign: "center" as const,
            }}
          >
            {SITE_CONFIG.name} — {SITE_CONFIG.tagline}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
