import React, { useState } from "react";
import "./TermsOfSale.css";

interface TermsOfSaleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TermsOfSale: React.FC<TermsOfSaleModalProps> = ({ isOpen, onClose }) => {

    const [language, setLanguage] = useState("da");

    if (!isOpen) {
        return null;
    }

    const renderContent = () => {
        switch (language) {
            case "da":
                return (
                    <>
                        <h1>Salgs- og leveringsbetingelser</h1>
                        <p>Disse salgs- og leveringsbetingelser gælder for køb af varer på vores hjemmeside. Ved at afgive en bestilling accepterer du betingelserne nedenfor.</p>
                        <h2>1. Bestilling og betaling</h2>
                        <p>Alle priser er angivet i DKK og inkl. moms. Betaling kan ske med kreditkort, MobilePay eller andre angivne betalingsmetoder.</p>
                        <h2>2. Levering</h2>
                        <p>Vi leverer inden for vores leveringsområde. Den forventede leveringstid er 30-60 minutter. Du kan vælge mellem rå (ubagte) pizzaer til hjemmebagning eller færdigbagte pizzaer klar til servering.</p>
                        <h2>3. Fortrydelsesret</h2>
                        <p>Da vores produkter er madvarer fremstillet efter din bestilling, er der ingen fortrydelsesret i henhold til forbrugeraftaleloven § 18, stk. 2, nr. 4. Dette gælder både for rå og færdigbagte pizzaer.</p>
                        <h2>4. Reklamation</h2>
                        <p>Kontakt os hurtigst muligt på [din email / telefon] ved fejl i din ordre.</p>
                    </>
                );
            case "en":
                return (
                    <>
                        <h1>Terms of Sale and Delivery</h1>
                        <p>These terms of sale apply to purchases made on our website. By placing an order, you agree to these terms.</p>
                        <h2>1. Orders and payment</h2>
                        <p>All prices are stated in DKK and include VAT. Payment can be made by credit card, MobilePay, or other specified methods.</p>
                        <h2>2. Delivery</h2>
                        <p>We deliver within our delivery area. Expected delivery time is 30-60 minutes. You can choose between raw (unbaked) pizzas for baking at home or ready-baked pizzas for immediate consumption.</p>
                        <h2>3. Right of cancellation</h2>
                        <p>As our products are food items made to your specifications, no right of cancellation applies under the Danish Consumer Contracts Act § 18, section 2, no. 4. This applies to both raw and ready-baked pizzas.</p>
                        <h2>4. Complaints</h2>
                        <p>Please contact us immediately at [your email / phone] if there is a problem with your order.</p>
                    </>
                );
            case "de":
                return (
                    <>
                        <h1>Verkaufs- und Lieferbedingungen</h1>
                        <p>Diese Verkaufs- und Lieferbedingungen gelten für Bestellungen über unsere Website. Mit Ihrer Bestellung akzeptieren Sie diese Bedingungen.</p>
                        <h2>1. Bestellung und Bezahlung</h2>
                        <p>Alle Preise sind in DKK inkl. MwSt. angegeben. Die Zahlung kann per Kreditkarte, MobilePay oder anderen angegebenen Zahlungsmethoden erfolgen.</p>
                        <h2>2. Lieferung</h2>
                        <p>Wir liefern innerhalb unseres Liefergebiets. Die voraussichtliche Lieferzeit beträgt 30-60 Minuten. Sie können zwischen rohen (ungebackenen) Pizzen zum Selbstbacken oder fertig gebackenen Pizzen zur sofortigen Verzehr wählen.</p>
                        <h2>3. Widerrufsrecht</h2>
                        <p>Da unsere Produkte Lebensmittel sind, die nach Ihren Vorgaben zubereitet werden, besteht kein Widerrufsrecht gemäß dem dänischen Verbrauchervertragsgesetz § 18 Abs. 2 Nr. 4. Dies gilt sowohl für rohe als auch für fertig gebackene Pizzen.</p>
                        <h2>4. Reklamation</h2>
                        <p>Bitte kontaktieren Sie uns umgehend unter [Ihre E-Mail / Telefonnummer], wenn es ein Problem mit Ihrer Bestellung gibt.</p>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="terms-container">
                     <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0rem',
              background: '#8d4a5b',
              color: '#ffffff',
            }}
          >
            <div style={{ flex: '1 1 150px', padding: '1rem', fontSize: '15px', margin: 0 }}>
              <p>
                <span  style={{ cursor: 'pointer', color: '#ffffff' }}>
                  Mackies Pizza Truck
                </span>
              </p>
              <p>{new Date().getFullYear()} Mackie's Pizza Truck</p>
            </div>

            <div style={{ flex: '1 1 150px', padding: '1rem', fontSize: '15px', margin: 0 }}>
              <p>Cvr nr.:</p>
              <p>15475285</p>
            </div>

            <div style={{ flex: '1 1 150px', padding: '1rem', fontSize: '15px', margin: 0 }}>
              <p>Adresse:</p>
              <p>Østergade 10, 8983 Gjerlev J</p>
            </div>

          {/*   <div style={{ flex: '1 1 150px', padding: '1rem', fontSize: '15px', margin: 0 }}>
              <p>Telefon:</p>
              <p>+45 5152 1216</p>
            </div> */}

            <div style={{ flex: '1 1 150px', padding: '1rem', fontSize: '15px', margin: 0 }}>
              <p>Email:</p>
              <p>admin@mackies-pizza.dk</p>
            </div>
{/* 
            <div style={{ flex: '1 1 150px', padding: '1rem', fontSize: '15px', margin: 0 }}>
              <p>MobilePay:</p>
              <p>5152 1216</p>
            </div> */}
          </div>
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

export default TermsOfSale;
