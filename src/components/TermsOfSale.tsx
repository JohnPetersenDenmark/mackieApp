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
                        <h1>✅ Handelsbetingelser for Mackies Pizza Truck</h1>
                        <p><strong>Virksomhed:</strong> Mackies Pizza Truck<br />
                            <strong>CVR:</strong> 15475285<br />
                            <strong>Ejer:</strong> Niels Wolthers<br />
                            <strong>Adresse:</strong> Østergade 10, 8983 Gjerlev J<br />
                            <strong>Email:</strong> nielswolthers@hotmail.com<br />
                            <strong>Lovvalg:</strong> Danmark</p>

                        <hr />

                        <h2>Handelsbetingelser</h2>
                        <p>Velkommen til Mackies Pizza Truck. Ved at bestille og afhente pizzaer hos os accepterer du følgende betingelser:</p>

                        <ol>
                            <li><strong>Generelt</strong><br />
                                Disse betingelser gælder for alle køb hos Mackies Pizza Truck.
                            </li>
                            <li><strong>Virksomhedsoplysninger</strong><br />
                                Mackies Pizza Truck drives af Niels Wolthers med CVR 15475285, beliggende på Østergade 10, 8983 Gjerlev J.
                            </li>
                            <li><strong>Produkter og priser</strong><br />
                                Alle priser er angivet i DKK og inkluderer moms.
                            </li>
                            <li><strong>Betaling</strong><br />
                                Betaling kan ske på følgende måder:<br />
                                - Kredit- eller betalingskort via Flatpay online ved bestilling<br />
                                - Kontant betaling ved afhentning ved trucken<br />
                                - Betaling med kort via truckens kassesystem ved afhentning<br />
                                Betaling skal være gennemført før eller ved afhentning.
                            </li>
                            <li><strong>Afhentning</strong><br />
                                Pizzaerne afhentes ved Mackies Pizza Truck på den placering og det tidspunkt, der fremgår af vores hjemmeside. Vi offentliggør altid en uges fremtidig kalender med dato, tid og lokation for truckens standplads.
                            </li>
                            <li><strong>Fortrydelsesret og returnering</strong><br />
                                Da der er tale om fødevarer, gælder der ikke fortrydelsesret. Skulle der være fejl i ordren, bedes kunden kontakte os hurtigst muligt for løsning.
                            </li>
                            <li><strong>Ansvarsbegrænsning</strong><br />
                                Vi er ikke ansvarlige for indirekte tab eller følgefejl.
                            </li>
                            <li><strong>Lovvalg og værneting</strong><br />
                                Disse betingelser er underlagt dansk lovgivning, og tvister afgøres ved danske domstole.
                            </li>
                            <li><strong>Lovvalg og værneting (detaljeret)</strong><br />
                                Disse handelsbetingelser er underlagt og skal fortolkes i overensstemmelse med lovgivningen i Kongeriget Danmark. Enhver tvist, der opstår som følge af eller i forbindelse med disse betingelser, skal afgøres ved de danske domstole med eksklusiv jurisdiktion.
                            </li>
                        </ol>
                    </>
                );
            case "en":
                return (
                    <>
                        <h1>✅ Terms & Conditions for Mackies Pizza Truck</h1>
                        <p><strong>Business name:</strong> Mackies Pizza Truck<br />
                            <strong>CVR (Company Reg. No.):</strong> 15475285<br />
                            <strong>Owner:</strong> Niels Wolthers<br />
                            <strong>Address:</strong> Østergade 10, 8983 Gjerlev J, Denmark<br />
                            <strong>Email:</strong> nielswolthers@hotmail.com<br />
                            <strong>Governing Law:</strong> Denmark</p>

                        <hr />

                        <h2>Terms & Conditions</h2>
                        <p>Welcome to Mackies Pizza Truck. By ordering and picking up pizzas from us, you accept the following terms:</p>

                        <ol>
                            <li><strong>General</strong><br />
                                These terms apply to all purchases from Mackies Pizza Truck.
                            </li>
                            <li><strong>Company Information</strong><br />
                                Mackies Pizza Truck is operated by Niels Wolthers, CVR 15475285, located at Østergade 10, 8983 Gjerlev J.
                            </li>
                            <li><strong>Products and Prices</strong><br />
                                All prices are stated in DKK and include VAT.
                            </li>
                            <li><strong>Payment</strong><br />
                                Payment can be made in the following ways:<br />
                                - By credit/debit card via Flatpay online when ordering<br />
                                - By cash at the truck upon pickup<br />
                                - By card via the truck’s point-of-sale system at pickup<br />
                                Payment must be completed before or at the time of pickup.
                            </li>
                            <li><strong>Pickup</strong><br />
                                Pizzas are picked up from Mackies Pizza Truck at the location and time listed on our website. We publish a weekly calendar showing the upcoming locations and times.
                            </li>
                            <li><strong>Right of Withdrawal and Returns</strong><br />
                                As the products are food items, no right of withdrawal applies. If there is an error in your order, please contact us promptly to resolve it.
                            </li>
                            <li><strong>Limitation of Liability</strong><br />
                                We are not liable for indirect losses or consequential damages.
                            </li>
                            <li><strong>Governing Law and Jurisdiction</strong><br />
                                These terms are governed by Danish law, and disputes will be settled by the Danish courts.
                            </li>
                            <li><strong>Detailed Governing Law Clause</strong><br />
                                These terms and conditions are subject to and shall be interpreted in accordance with the laws of the Kingdom of Denmark. Any dispute arising out of or in connection with these terms shall be settled exclusively by the Danish courts.
                            </li>
                        </ol>
                    </>
                );
            case "de":
                return (
                    <>
                        <h1>✅ Allgemeine Geschäftsbedingungen (AGB) für Mackies Pizza Truck</h1>
                        <p><strong>Unternehmen:</strong> Mackies Pizza Truck<br />
                            <strong>USt-IdNr. (CVR):</strong> 15475285<br />
                            <strong>Adresse:</strong> Østergade 10, 8983 Gjerlev J, Dänemark<br />
                            <strong>E-Mail:</strong> nielswolthers@hotmail.com<br />
                            <strong>Anwendbares Recht:</strong> Dänemark</p>

                        <hr />

                        <h2>AGB</h2>
                        <p>Willkommen bei Mackies Pizza Truck. Durch die Bestellung und Abholung von Pizza bei uns akzeptieren Sie die folgenden Bedingungen:</p>

                        <ol>
                            <li><strong>Allgemeines</strong><br />
                                Diese Bedingungen gelten für alle Einkäufe bei Mackies Pizza Truck.
                            </li>
                            <li><strong>Unternehmensinformationen</strong><br />
                                Mackies Pizza Truck wird von Niels Wolthers betrieben, CVR 15475285, mit Sitz in Østergade 10, 8983 Gjerlev J.
                            </li>
                            <li><strong>Produkte und Preise</strong><br />
                                Alle Preise sind in DKK angegeben und enthalten die gesetzliche Mehrwertsteuer.
                            </li>
                            <li><strong>Zahlung</strong><br />
                                Die Zahlung kann auf folgende Weise erfolgen:<br />
                                - Online per Kredit- oder Debitkarte über Flatpay bei der Bestellung<br />
                                - Barzahlung bei Abholung am Truck<br />
                                - Kartenzahlung über das Kassensystem am Truck<br />
                                Die Zahlung muss vor oder bei der Abholung abgeschlossen sein.
                            </li>
                            <li><strong>Abholung</strong><br />
                                Die Pizzen werden am Mackies Pizza Truck an dem auf unserer Website angegebenen Ort und zur angegebenen Zeit abgeholt. Wir veröffentlichen wöchentlich einen Kalender mit Datum, Uhrzeit und Standort des Trucks.
                            </li>
                            <li><strong>Widerrufsrecht und Rückgabe</strong><br />
                                Da es sich um Lebensmittel handelt, besteht kein Widerrufsrecht. Bei Fehlern in der Bestellung kontaktieren Sie uns bitte umgehend zur Klärung.
                            </li>
                            <li><strong>Haftungsbeschränkung</strong><br />
                                Wir haften nicht für indirekte Schäden oder Folgeschäden.
                            </li>
                            <li><strong>Gerichtsstand und anwendbares Recht</strong><br />
                                Diese Bedingungen unterliegen dem dänischen Recht. Streitigkeiten werden ausschließlich vor dänischen Gerichten verhandelt.
                            </li>
                            <li><strong>Detaillierte Klausel zum anwendbaren Recht</strong><br />
                                Diese Geschäftsbedingungen unterliegen dem Recht des Königreichs Dänemark und sind entsprechend auszulegen. Alle Streitigkeiten im Zusammenhang mit diesen Bedingungen werden ausschließlich vor dänischen Gerichten ausgetragen.
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

export default TermsOfSale;
