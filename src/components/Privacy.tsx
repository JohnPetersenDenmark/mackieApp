import React, { useState } from "react";
import "./TermsOfSale.css";

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const Privacy: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {

    const [language, setLanguage] = useState("da");

    if (!isOpen) {
        return null;
    }

    const renderContent = () => {
        switch (language) {
            case "da":
                return (
                    <>

                        <h1>🔐 Privatlivspolitik for Mackies Pizza Truck</h1>
                        <p>Vi behandler dine personoplysninger i overensstemmelse med GDPR og gældende databeskyttelseslovgivning.</p>

                        <ol>
                            <li><strong>Oplysninger vi indsamler</strong><br />
                                Vi indsamler følgende oplysninger:<br />
                                - Navn<br />
                                - Kontaktoplysninger (e-mail, telefonnummer)<br />
                                - Betalingsinformation (kun via sikre betalingssystemer, vi opbevarer ikke kortoplysninger)<br />
                                - Ordrehistorik
                            </li>
                            <li><strong>Anvendelse af data</strong><br />
                                Dine oplysninger bruges til at behandle ordrer, yde kundeservice og håndtere betalinger.
                            </li>
                            <li><strong>Datasikkerhed</strong><br />
                                Vi anvender sikre betalingsløsninger (fx Flatpay) og kører vores IT-systemer med passende sikkerhedsforanstaltninger for at beskytte dine data.
                            </li>
                            <li><strong>Videregivelse af data</strong><br />
                                Dine oplysninger deles kun med nødvendige tredjepartsleverandører som betalingsudbydere og IT-services, der er underlagt fortrolighed.
                            </li>
                            <li><strong>Dine rettigheder</strong><br />
                                Du har ret til at:<br />
                                - Anmode om indsigt i de oplysninger, vi har om dig<br />
                                - Få rettet urigtige oplysninger<br />
                                - Få dine oplysninger slettet (medmindre lovgivning kræver opbevaring)<br />
                                - Trække samtykke tilbage, hvor det er relevant<br />
                                - Klage til Datatilsynet, hvis du mener, vi behandler dine oplysninger forkert
                            </li>
                            <li><strong>Kontakt</strong><br />
                                For spørgsmål om dine data eller udøvelse af dine rettigheder kan du kontakte os på:<br />
                                Email: <a href="mailto:nielswolthers@hotmail.com">nielswolthers@hotmail.com</a>
                            </li>
                        </ol>

                    </>
                );
            case "en":
                return (
                    <>
                        <h1>🔐 Privacy Policy for Mackies Pizza Truck</h1>
                        <p>We process your personal data in accordance with the GDPR and applicable data protection laws.</p>

                        <ol>
                            <li><strong>Data We Collect</strong><br />
                                We collect the following personal data:<br />
                                - Name<br />
                                - Contact details (email, phone number)<br />
                                - Payment information (only via secure payment systems; we do not store card details)<br />
                                - Order history
                            </li>
                            <li><strong>How We Use Your Data</strong><br />
                                Your data is used to process orders, provide customer service, and handle payments.
                            </li>
                            <li><strong>Data Security</strong><br />
                                We use secure payment systems (e.g., Flatpay) and maintain our IT systems with appropriate security measures to protect your data.
                            </li>
                            <li><strong>Data Sharing</strong><br />
                                Your data is only shared with necessary third-party providers such as payment processors and IT service providers, all of whom are bound by confidentiality.
                            </li>
                            <li><strong>Your Rights</strong><br />
                                You have the right to:<br />
                                - Request access to the data we hold about you<br />
                                - Have incorrect data corrected<br />
                                - Have your data deleted (unless legal obligations require retention)<br />
                                - Withdraw consent where applicable<br />
                                - File a complaint with the Danish Data Protection Agency (Datatilsynet) if you believe we are mishandling your data
                            </li>
                            <li><strong>Contact</strong><br />
                                For questions regarding your data or to exercise your rights, please contact us at:<br />
                                Email: <a href="mailto:nielswolthers@hotmail.com">nielswolthers@hotmail.com</a>
                            </li>
                        </ol>
                    </>
                );
            case "de":
                return (
                    <>
                        <h1>🔐 Datenschutzrichtlinie für Mackies Pizza Truck</h1>
  <p>Wir verarbeiten Ihre personenbezogenen Daten gemäß der DSGVO und den geltenden Datenschutzgesetzen.</p>

  <ol>
    <li><strong>Welche Daten wir erfassen</strong><br />
      Wir erfassen folgende personenbezogene Daten:<br />
      - Name<br />
      - Kontaktdaten (E-Mail, Telefonnummer)<br />
      - Zahlungsinformationen (nur über sichere Zahlungssysteme; keine Speicherung von Kartendaten)<br />
      - Bestellhistorie
    </li>
    <li><strong>Verwendung der Daten</strong><br />
      Ihre Daten werden zur Abwicklung von Bestellungen, zur Kundenbetreuung und zur Zahlungsabwicklung verwendet.
    </li>
    <li><strong>Datensicherheit</strong><br />
      Wir nutzen sichere Zahlungssysteme (z. B. Flatpay) und schützen unsere IT-Systeme mit geeigneten Maßnahmen.
    </li>
    <li><strong>Datenweitergabe</strong><br />
      Ihre Daten werden nur an notwendige Dienstleister wie Zahlungsanbieter und IT-Dienstleister weitergegeben, die zur Vertraulichkeit verpflichtet sind.
    </li>
    <li><strong>Ihre Rechte</strong><br />
      Sie haben das Recht:<br />
      - Auskunft über die gespeicherten Daten zu verlangen<br />
      - Unrichtige Daten berichtigen zu lassen<br />
      - Die Löschung Ihrer Daten zu verlangen (sofern keine gesetzliche Aufbewahrungspflicht besteht)<br />
      - Ihre Einwilligung jederzeit zu widerrufen<br />
      - Eine Beschwerde bei der Datenschutzbehörde (Datatilsynet) einzureichen, wenn Sie eine rechtswidrige Verarbeitung vermuten
    </li>
    <li><strong>Kontakt</strong><br />
      Bei Fragen oder zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte per E-Mail:<br />
      <a href="mailto:nielswolthers@hotmail.com">nielswolthers@hotmail.com</a>
    </li>
  </ol>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="terms-container">

            <div className="terms-flag-selector">
                <span>
                    <img
                        src="/images/flagDenmark.png"
                        alt="da"
                        onClick={() => setLanguage("da")}
                        style={{ cursor: 'pointer', width: '24px', height: '24px' }}
                    />
                </span>
                <span>
                    <img
                        src="/images/flagUK.png"
                        alt="en"
                        onClick={() => setLanguage("en")}
                        style={{ cursor: 'pointer', width: '24px', height: '24px' }}
                    />
                </span>
                <span>
                    <img
                        src="/images/flagGermany.png"
                        alt="de"
                        onClick={() => setLanguage("de")}
                        style={{ cursor: 'pointer', width: '24px', height: '24px' }}
                    />
                </span>
            </div>
            {renderContent()}
            <button className={language === "de" ? "active" : ""} onClick={onClose}>Ok</button>
        </div>
    );
}

export default Privacy;
