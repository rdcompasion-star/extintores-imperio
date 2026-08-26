import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { formatCLP, formatDate } from "@/lib/format";
import { calculateQuote, calculateLineTotal } from "@/lib/quote-calculations";
import type { Quote } from "@/lib/quote-queries";
import type { Settings } from "@/lib/settings";

const RED = "#8a1f1f";
const INK = "#1a1a1a";
const GRAY = "#5b5b5b";
const BORDER = "#d8d8d8";

const styles = StyleSheet.create({
  page: { paddingTop: 36, paddingBottom: 52, paddingHorizontal: 40, fontSize: 9.5, color: INK, fontFamily: "Helvetica" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  logo: { width: 150, height: 56, objectFit: "contain", objectPosition: "left", marginBottom: 6 },
  companyName: { fontSize: 13, fontFamily: "Helvetica-Bold", color: INK },
  companyLine: { fontSize: 8.5, color: GRAY, marginTop: 1 },
  quoteBox: { alignItems: "flex-end" },
  quoteTitle: { fontSize: 16, fontFamily: "Helvetica-Bold", color: RED, marginBottom: 2 },
  quoteMeta: { fontSize: 8.5, color: GRAY, marginTop: 1 },
  sectionTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: RED, letterSpacing: 0.5, marginBottom: 4, textTransform: "uppercase" },
  clientBox: { flexDirection: "row", gap: 24, marginBottom: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: BORDER },
  clientCol: { flex: 1 },
  clientLine: { fontSize: 9, color: INK, marginTop: 1.5 },
  clientLineMuted: { fontSize: 9, color: GRAY, marginTop: 1.5 },
  table: { marginBottom: 12 },
  tableHeaderRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: INK, paddingBottom: 4, marginBottom: 2 },
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: BORDER, paddingVertical: 4 },
  thCode: { width: "16%", fontSize: 7.5, fontFamily: "Helvetica-Bold", color: GRAY, textTransform: "uppercase" },
  thName: { width: "34%", fontSize: 7.5, fontFamily: "Helvetica-Bold", color: GRAY, textTransform: "uppercase" },
  thQty: { width: "10%", fontSize: 7.5, fontFamily: "Helvetica-Bold", color: GRAY, textTransform: "uppercase", textAlign: "right" },
  thPrice: { width: "14%", fontSize: 7.5, fontFamily: "Helvetica-Bold", color: GRAY, textTransform: "uppercase", textAlign: "right" },
  thDiscount: { width: "12%", fontSize: 7.5, fontFamily: "Helvetica-Bold", color: GRAY, textTransform: "uppercase", textAlign: "right" },
  thTotal: { width: "14%", fontSize: 7.5, fontFamily: "Helvetica-Bold", color: GRAY, textTransform: "uppercase", textAlign: "right" },
  tdCode: { width: "16%", fontSize: 6.8, color: GRAY },
  tdName: { width: "34%", fontSize: 8.5, color: INK },
  tdSize: { fontSize: 7.5, color: GRAY },
  tdQty: { width: "10%", fontSize: 8.5, color: INK, textAlign: "right" },
  tdPrice: { width: "14%", fontSize: 8.5, color: INK, textAlign: "right" },
  tdDiscount: { width: "12%", fontSize: 8.5, color: GRAY, textAlign: "right" },
  tdTotal: { width: "14%", fontSize: 8.5, fontFamily: "Helvetica-Bold", color: INK, textAlign: "right" },
  summaryWrap: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 14 },
  summaryBox: { width: 220 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  summaryLabel: { fontSize: 9, color: GRAY },
  summaryValue: { fontSize: 9, color: INK },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: 5, marginTop: 3, borderTopWidth: 1, borderTopColor: INK },
  totalLabel: { fontSize: 11, fontFamily: "Helvetica-Bold", color: INK },
  totalValue: { fontSize: 11, fontFamily: "Helvetica-Bold", color: RED },
  termsBox: { marginBottom: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: BORDER },
  termRow: { flexDirection: "row", marginTop: 2 },
  termLabel: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: INK, width: 110 },
  termValue: { fontSize: 8.5, color: GRAY, flex: 1 },
  obsBox: { marginTop: 6 },
  obsText: { fontSize: 8.5, color: GRAY },
  footer: { position: "absolute", bottom: 22, left: 40, right: 40, borderTopWidth: 0.5, borderTopColor: BORDER, paddingTop: 6, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7.5, color: GRAY },
});

// Los códigos largos (ej. "MTE-PQS-25KG-CARRO") no tienen espacios, así que
// el layout de react-pdf no los envuelve y desbordan sobre la columna
// siguiente. Se inserta un espacio angosto después de cada guion para que
// pueda partir la línea ahí sin perder el guion visible.
function wrapCode(code: string): string {
  return code.replace(/-/g, "-​");
}

function discountLabel(type: string, value: number) {
  if (type === "percent") return `${value}%`;
  if (type === "amount") return formatCLP(value);
  return "—";
}

export function QuoteDocument({
  quote,
  settings,
  logoDataUri,
}: {
  quote: Quote;
  settings: Settings;
  logoDataUri: string | null;
}) {
  const totals = calculateQuote({
    lines: quote.items.map((i) => ({
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      discountType: i.discountType,
      discountValue: i.discountValue,
    })),
    globalDiscountType: quote.discountType,
    globalDiscountValue: quote.discountValue,
    vatRate: quote.vatRate,
  });

  const terms = [
    { label: "Forma de pago", value: quote.paymentTerms },
    { label: "Plazo de entrega", value: quote.deliveryTerms },
    { label: "Despacho", value: quote.dispatchTerms },
    { label: "Garantía", value: quote.warrantyTerms },
    { label: "Información adicional", value: quote.extraTerms },
  ].filter((t) => t.value && t.value.trim());

  return (
    <Document
      title={`Cotización ${quote.number}`}
      author={settings.companyName}
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerRow}>
          <View>
            {logoDataUri ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={logoDataUri} style={styles.logo} />
            ) : null}
            <Text style={styles.companyName}>{settings.legalName || settings.companyName}</Text>
            {settings.rut ? <Text style={styles.companyLine}>RUT: {settings.rut}</Text> : null}
            <Text style={styles.companyLine}>{settings.address.full}</Text>
            <Text style={styles.companyLine}>
              {settings.phoneDisplay} · {settings.email}
            </Text>
          </View>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteTitle}>COTIZACIÓN {quote.number}</Text>
            <Text style={styles.quoteMeta}>Fecha: {formatDate(quote.issueDate)}</Text>
            <Text style={styles.quoteMeta}>Válida hasta: {formatDate(quote.validUntil)}</Text>
            {quote.seller ? <Text style={styles.quoteMeta}>Vendedor: {quote.seller}</Text> : null}
          </View>
        </View>

        <View style={styles.clientBox}>
          <View style={styles.clientCol}>
            <Text style={styles.sectionTitle}>Cliente</Text>
            <Text style={styles.clientLine}>{quote.client.name}</Text>
            <Text style={styles.clientLineMuted}>RUT: {quote.client.rut}</Text>
            {quote.client.contact ? <Text style={styles.clientLineMuted}>Contacto: {quote.client.contact}</Text> : null}
            {quote.client.activity ? <Text style={styles.clientLineMuted}>Giro: {quote.client.activity}</Text> : null}
          </View>
          <View style={styles.clientCol}>
            <Text style={styles.sectionTitle}>Contacto y dirección</Text>
            {quote.client.phone ? <Text style={styles.clientLineMuted}>Tel: {quote.client.phone}</Text> : null}
            {quote.client.email ? <Text style={styles.clientLineMuted}>{quote.client.email}</Text> : null}
            {quote.client.address ? <Text style={styles.clientLineMuted}>{quote.client.address}</Text> : null}
            <Text style={styles.clientLineMuted}>
              {[quote.client.comuna, quote.client.city].filter(Boolean).join(", ")}
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow} fixed>
            <Text style={styles.thCode}>Código</Text>
            <Text style={styles.thName}>Producto / Servicio</Text>
            <Text style={styles.thQty}>Cant.</Text>
            <Text style={styles.thPrice}>Precio</Text>
            <Text style={styles.thDiscount}>Desc.</Text>
            <Text style={styles.thTotal}>Total</Text>
          </View>
          {quote.items.map((item) => (
            <View key={item.id} style={styles.tableRow} wrap={false}>
              <Text style={styles.tdCode}>{wrapCode(item.code)}</Text>
              <View style={styles.tdName}>
                <Text>{item.name}</Text>
                {item.sizeLabel ? <Text style={styles.tdSize}>{item.sizeLabel}</Text> : null}
              </View>
              <Text style={styles.tdQty}>
                {item.quantity} {item.unit}
              </Text>
              <Text style={styles.tdPrice}>{formatCLP(item.unitPrice)}</Text>
              <Text style={styles.tdDiscount}>{discountLabel(item.discountType, item.discountValue)}</Text>
              <Text style={styles.tdTotal}>{formatCLP(calculateLineTotal(item))}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryWrap}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCLP(totals.subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Descuento</Text>
              <Text style={styles.summaryValue}>
                {totals.discountAmount > 0 ? `-${formatCLP(totals.discountAmount)}` : formatCLP(0)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Neto</Text>
              <Text style={styles.summaryValue}>{formatCLP(totals.net)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>IVA {Math.round(quote.vatRate * 100)}%</Text>
              <Text style={styles.summaryValue}>{formatCLP(totals.vatAmount)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>{formatCLP(totals.total)}</Text>
            </View>
          </View>
        </View>

        {terms.length > 0 && (
          <View style={styles.termsBox} wrap={false}>
            <Text style={styles.sectionTitle}>Condiciones comerciales</Text>
            {terms.map((t) => (
              <View key={t.label} style={styles.termRow}>
                <Text style={styles.termLabel}>{t.label}</Text>
                <Text style={styles.termValue}>{t.value}</Text>
              </View>
            ))}
          </View>
        )}

        {quote.observations.trim() && (
          <View style={styles.obsBox} wrap={false}>
            <Text style={styles.sectionTitle}>Observaciones</Text>
            <Text style={styles.obsText}>{quote.observations}</Text>
          </View>
        )}

        {settings.bank.accountNumber ? (
          <View style={styles.termsBox} wrap={false}>
            <Text style={styles.sectionTitle}>Datos bancarios</Text>
            <View style={styles.termRow}>
              <Text style={styles.termValue}>
                {settings.bank.name} · {settings.bank.accountType} · Cta. {settings.bank.accountNumber} ·{" "}
                {settings.bank.holder} · RUT {settings.bank.holderRut}
                {settings.bank.email ? ` · ${settings.bank.email}` : ""}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {settings.legalName || settings.companyName} · {settings.phoneDisplay} · {settings.email}
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
