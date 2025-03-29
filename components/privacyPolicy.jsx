// components/PrivacyPolicy.jsx
const PrivacyPolicy = () => {
    return (
      <div className="privacy-container">
        <h1 className="title">Politique de confidentialité</h1>

        <div className="content-scroll">
          <section className="intro-section">
            <p className="paragraph">
              Bienvenue sur la page de confidentialité d'AIO EVENTS ! Nous respectons profondément votre vie privée et nous nous engageons à maintenir la confidentialité et la sécurité de vos informations personnelles. Veuillez prendre un moment pour comprendre comment nous collectons, utilisons et protégeons vos données.
            </p>
          </section>

          <section className="section">
            <h2 className="section-header">1. Collecte d'informations</h2>

            <h3 className="subsection-header">1.1 Informations personnelles :</h3>
            <p className="paragraph">
              Lorsque vous créez un compte sur AIO Events, nous collectons des informations personnelles essentielles, notamment votre nom, votre adresse e-mail et les détails de votre profil. Ces informations sont cruciales pour créer une expérience utilisateur personnalisée et sécurisée.
            </p>

            <h3 className="subsection-header">1.2 Détails des transactions :</h3>
            <p className="paragraph">
              Pour faciliter les transactions fluides, nous pouvons collecter des informations de paiement, y compris les détails de la carte de crédit. Rassurez-vous, nous mettons en œuvre des mesures de sécurité robustes pour protéger vos données financières.
            </p>
          </section>

          <section className="section">
            <h2 className="section-header">2. Utilisation des informations</h2>

            <h3 className="subsection-header">2.1 Amélioration des services :</h3>
            <p className="paragraph">
              Vos informations sont principalement utilisées pour améliorer votre expérience sur AIO Events. Cela inclut la fourniture personnalisée de recommandations, facilitant une communication efficace et améliorant la prestation globale des services.
            </p>

            <h3 className="subsection-header">2.2 Communications :</h3>
            <p className="paragraph">
              Nous pouvons utiliser vos coordonnées pour vous envoyer des mises à jour pertinentes, des newsletters et du matériel promotionnel liés à AIO EVENTS. Vous avez toujours la possibilité de vous désinscrire de ces communications à tout moment.
            </p>
          </section>

          <section className="section">
            <h2 className="section-header">3. Sécurité des données</h2>

            <h3 className="subsection-header">3.1 Stockage sécurisé :</h3>
            <p className="paragraph">
              Toutes vos données sont stockées en toute sécurité sur nos serveurs. Nous utilisons des mesures de sécurité conformes aux normes de l'industrie pour nous protéger contre l'accès, divulgation ou modification de vos informations personnelles.
            </p>

            <h3 className="subsection-header">3.2 Sécurité des paiements :</h3>
            <p className="paragraph">
              Comme indiqué dans nos Conditions générales, nous prenons des mesures rigoureuses pour sécuriser les transactions de paiement, garantissant la confidentialité et l'intégrité des données financières.
            </p>
          </section>

          <section className="section">
            <h2 className="section-header">4. Cookies et technologies de suivi</h2>

            <h3 className="subsection-header">4.1 Utilisation des cookies :</h3>
            <p className="paragraph">
              AIO Events utilise des cookies pour améliorer votre expérience de navigation. Ces cookies nous aident à comprendre le comportement utilisateur, préférences et améliorer nos services. Vous pouvez gérer vos préférences en matière de cookies via les paramètres de votre navigateur.
            </p>
          </section>

          <section className="section">
            <h2 className="section-header">5. Partenariats avec des tiers</h2>

            <h3 className="subsection-header">5.1 Transparence du partenariat :</h3>
            <p className="paragraph">
              En cas de partenariats stratégiques, de parrainages ou de collaborations promotionnelles, nous pouvons partager des informations avec des tiers. Cependant, nous veillons à ce que ces partenariats correspondent à notre engagement envers votre vie privée.
            </p>
          </section>

          <section className="section">
            <h2 className="section-header">6. Contrôles utilisateur</h2>

            <h3 className="subsection-header">6.1 Paramètres du compte :</h3>
            <p className="paragraph">
              Vous avez un contrôle total sur les paramètres de votre compte, vous permettant de gérer les informations que vous choisissez de partager et de contrôler les communications que vous souhaitez recevoir. Accédez et modifiez facilement ces paramètres via le tableau de bord de votre compte.
            </p>
          </section>

          <section className="section">
            <h2 className="section-header">7. Mises à jour des politiques</h2>

            <h3 className="subsection-header">7.1 Notification des modifications :</h3>
            <p className="paragraph">
              AIO Events se réserve le droit de mettre à jour périodiquement cette politique de confidentialité. Les utilisateurs seront informés de tout changement important via les notifications de la plateforme ou par e-mail.
            </p>

            <h3 className="subsection-header">7.2 Consentement aux mises à jour :</h3>
            <p className="paragraph">
              En continuant à utiliser AIO Events après la mise à jour de la politique de confidentialité, vous consentez implicitement aux conditions révisées.
            </p>
          </section>

          <section className="contact-section">
            <h2 className="section-header">8. Contactez-nous</h2>

            <h3 className="subsection-header">8.1 Questions et préoccupations :</h3>
            <p className="paragraph">
              Si vous avez des questions, des préoccupations ou des demandes concernant votre confidentialité sur AIO Events, veuillez contacter notre équipe dédiée à la confidentialité à contact@aio.events.
            </p>

            <p className="closing">
              Nous apprécions votre confiance et vous remercions d'avoir choisi AIO EVENTS comme plateforme événementielle mobile préférée.
            </p>
          </section>
        </div>

        <style jsx>{`
          .privacy-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
          }

          .title {
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
            color: #333;
          }

          .content-scroll {
            max-height: 80vh;
            overflow-y: auto;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 8px;
          }

          .section {
            margin-bottom: 25px;
          }

          .section-header {
            font-size: 18px;
            font-weight: 600;
            margin: 25px 0 15px 0;
            color: #2c3e50;
          }

          .subsection-header {
            font-size: 16px;
            font-weight: 500;
            margin: 15px 0 10px 0;
            color: #34495e;
          }

          .paragraph {
            font-size: 14px;
            line-height: 1.6;
            color: #666;
            margin-bottom: 15px;
          }

          .closing {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-top: 20px;
            text-align: center;
          }

          @media (max-width: 768px) {
            .privacy-container {
              padding: 15px;
            }

            .content-scroll {
              max-height: 70vh;
            }
          }
        `}</style>
      </div>
    );
  };

  export default PrivacyPolicy;
