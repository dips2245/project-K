import { useTranslation } from 'react-i18next';

const Section = ({ title, children }) => (
    <div style={{ marginBottom: '32px' }}>
        <h2 style={{
            fontSize: '18px', fontWeight: 600, color: '#f5f5f5',
            margin: '0 0 12px', letterSpacing: '-0.02em',
            fontFamily: "'Plus Jakarta Sans', 'PolySans', sans-serif",
        }}>{title}</h2>
        {children}
    </div>
);

const Para = ({ children }) => (
    <p style={{
        fontSize: '14px', lineHeight: 1.8, color: '#b0b0b0',
        margin: '0 0 10px', fontFamily: "'Plus Jakarta Sans', 'PolySans', sans-serif",
    }}>{children}</p>
);

const List = ({ items }) => (
    <ul style={{ paddingLeft: '20px', margin: '8px 0 16px' }}>
        {items.map((item, i) => (
            <li key={i} style={{
                fontSize: '14px', lineHeight: 1.8, color: '#b0b0b0',
                marginBottom: '6px', fontFamily: "'Plus Jakarta Sans', 'PolySans', sans-serif",
            }}>{item}</li>
        ))}
    </ul>
);

const Terms = () => {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    return (
        <div style={{
            minHeight: '100vh',
            background: '#000000',
            fontFamily: "'Plus Jakarta Sans', 'PolySans', sans-serif",
            color: '#e0e0e0',
        }}>
            {/* Header */}
            <div style={{
                borderBottom: '1px solid #222',
                background: '#0d0d0d',
                padding: '40px 40px 32px',
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{
                        fontSize: 'clamp(24px, 3vw, 36px)',
                        fontWeight: 700, letterSpacing: '-0.03em',
                        color: '#f5f5f5', margin: '0 0 6px',
                        fontFamily: 'inherit',
                    }}>
                        Terms & Conditions
                    </h1>
                    <p style={{ fontSize: '13px', color: '#9a9a9a', margin: 0 }}>
                        Last updated: June 2026
                    </p>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
                <Section title="1. Acceptance of Terms">
                    <Para>
                        By accessing or using Bliss Nepal (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;), you agree to be bound by these Terms & Conditions. If you do not agree, do not use our website or services. These terms are governed by the laws of <strong>Nepal</strong>.
                    </Para>
                </Section>

                <Section title="2. Age Restriction — 18+ Only">
                    <Para>
                        Bliss Nepal is an <strong>adult-oriented store</strong>. You must be <strong>18 years or older</strong> to browse, purchase, or interact with this website. By using this site, you confirm that:
                    </Para>
                    <List items={[
                        'You are at least 18 years of age.',
                        'You are legally capable of entering into binding contracts under Nepali law.',
                        'You will not share our content with minors.',
                        'You understand that some products are of an intimate nature.',
                    ]} />
                    <Para>
                        We reserve the right to verify your age and refuse service if we suspect you are under 18.
                    </Para>
                </Section>

                <Section title="3. Products & Descriptions">
                    <Para>
                        All products are intended for <strong>intimate wellness and adult pleasure</strong>. We make every effort to display accurate descriptions, images, and specifications. However:
                    </Para>
                    <List items={[
                        'Colors and finishes may vary slightly from on-screen images.',
                        'Product specifications (materials, dimensions) are provided by manufacturers.',
                        'We do not guarantee that product descriptions are error-free.',
                        'All products are sold as &ldquo;novelty&rdquo; or &ldquo;wellness&rdquo; items unless otherwise specified.',
                    ]} />
                </Section>

                <Section title="4. Medical Disclaimer">
                    <Para>
                        Our products are <strong>not intended to diagnose, treat, cure, or prevent any disease</strong>. If you have any medical condition, consult a healthcare professional before using any intimate wellness product. We recommend:
                    </Para>
                    <List items={[
                        'Performing a patch test before using new lubricants or topical products.',
                        'Using products as directed in the included instructions.',
                        'Discontinuing use if irritation or discomfort occurs.',
                    ]} />
                </Section>

                <Section title="5. Ordering & Payment">
                    <Para>
                        We accept the following payment methods within Nepal:
                    </Para>
                    <List items={[
                        'Cash on Delivery (COD) — Pay when your order arrives.',
                        'WhatsApp Order — Place via WhatsApp for personalized assistance.',
                    ]} />
                    <Para>
                        All prices are listed in <strong>Nepali Rupees (NPR)</strong>. We reserve the right to modify prices at any time. Orders are subject to availability. We may cancel orders if fraud is suspected.
                    </Para>
                </Section>

                <Section title="6. Shipping & Delivery (Nepal)">
                    <Para>
                        We ship across <strong>Nepal</strong> via trusted courier services:
                    </Para>
                    <List items={[
                        'Delivery time: 3–7 business days (depending on location).',
                        'Remote areas may take longer.',
                        'All packages are shipped in <strong>plain, discreet, unmarked packaging</strong>. No product names, logos, or adult content is visible on the exterior.',
                        'Shipping costs are calculated at checkout.',
                        'We are not responsible for delays caused by courier services or customs (within Nepal).',
                    ]} />
                </Section>

                <Section title="7. Discreet Packaging Promise">
                    <Para>
                        We take your <strong>privacy seriously</strong>. Every order is packed in a <strong>plain box or envelope</strong> with no indication of the contents or the sender beyond our registered business name. The return address uses our company name without reference to adult products.
                    </Para>
                </Section>

                <Section title="8. Returns & Exchanges">
                    <Para>
                        Due to the <strong>intimate nature</strong> of our products, we <strong>do not accept returns or exchanges</strong> on opened or used items for hygiene reasons.
                    </Para>
                    <List items={[
                        'Unopened, sealed items may be returned within 3 days of delivery.',
                        'Returns must be unused, in original packaging, with all seals intact.',
                        'Return shipping is borne by the customer.',
                        'Refunds are processed within 7 business days after inspection.',
                        'Damaged or incorrect items must be reported within 24 hours of delivery via WhatsApp with photo evidence.',
                    ]} />
                </Section>

                <Section title="9. Privacy & Data Protection">
                    <Para>
                        Your privacy is our priority. We comply with Nepal&rsquo;s <strong>Privacy Act 2075 (2018)</strong>. Key points:
                    </Para>
                    <List items={[
                        'We collect only what&rsquo;s necessary: name, address, phone, email.',
                        'Your data is used solely to fulfill orders and provide support.',
                        'We never share or sell your personal information to third parties.',
                        'Payment details are not stored by us (COD = no digital payment data).',
                        'You may request deletion of your data at any time via WhatsApp.',
                        'Our website uses localStorage for cart and language preferences — no external tracking cookies.',
                    ]} />
                </Section>

                <Section title="10. User Accounts">
                    <Para>
                        When you create an account on Bliss Nepal:
                    </Para>
                    <List items={[
                        'You are responsible for maintaining the confidentiality of your password.',
                        'You must provide accurate and complete information.',
                        'You may not use another person&rsquo;s account without permission.',
                        'We reserve the right to suspend accounts that violate these terms.',
                    ]} />
                </Section>

                <Section title="11. Prohibited Uses">
                    <Para>
                        You agree <strong>not</strong> to:
                    </Para>
                    <List items={[
                        'Use our site for any illegal purpose under Nepali law.',
                        'Attempt to access restricted areas (admin panels, other users&rsquo; data).',
                        'Post offensive, obscene, or harassing content (if review/comment features are used).',
                        'Use bots, scrapers, or automated tools without permission.',
                        'Resell our products without written authorization.',
                    ]} />
                </Section>

                <Section title="12. Intellectual Property">
                    <Para>
                        All content on this website — including text, images, logos, product descriptions, and design — is the property of Bliss Nepal unless otherwise credited. You may not reproduce, distribute, or modify any content without our written consent.
                    </Para>
                </Section>

                <Section title="13. Limitation of Liability">
                    <Para>
                        Bliss Nepal shall not be liable for:
                    </Para>
                    <List items={[
                        'Indirect, incidental, or consequential damages arising from product use.',
                        'Allergic reactions or sensitivities to materials (users must check ingredients/materials).',
                        'Delivery delays caused by third-party couriers.',
                        'Any damages exceeding the purchase price of the product in question.',
                    ]} />
                </Section>

                <Section title="14. Governing Law & Dispute Resolution">
                    <Para>
                        These terms are governed by the <strong>laws of Nepal</strong>. Any disputes shall first be attempted to be resolved through <strong>mediation</strong>. If unresolved, disputes shall be subject to the jurisdiction of the courts in <strong>Kathmandu, Nepal</strong>.
                    </Para>
                </Section>

                <Section title="15. Changes to Terms">
                    <Para>
                        We reserve the right to update these terms at any time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. Continued use of the site after changes constitutes acceptance of the updated terms.
                    </Para>
                </Section>

                <Section title="16. Contact Us">
                    <Para>
                        For questions about these terms, please contact us:
                    </Para>
                    <List items={[
                        'WhatsApp: Available on our website',
                        'Email: Via our Contact page',
                        'Based in: Nepal',
                    ]} />
                </Section>

                {/* Footer note */}
                <div style={{
                    marginTop: '48px', padding: '24px 0',
                    borderTop: '1px solid #222',
                    textAlign: 'center',
                }}>
                    <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                        &copy; {year} Bliss Nepal. {t('footer.rights')}
                    </p>
                    <p style={{ fontSize: '11px', color: '#888888', margin: '8px 0 0', fontWeight: 600 }}>
                        18+ Adult Store — Discreet Packaging Always
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
