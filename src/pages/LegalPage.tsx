import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const LegalPage: React.FC = () => {
  const { pathname } = useLocation();
  const isPrivacy = pathname.includes('confidentialite');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e8d9c0' }}>
      <Header />

      {/* Hero */}
      <section className="bg-black pt-16 lg:pt-18">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-gold-400/60 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Kairouan Academy</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
            {isPrivacy ? 'Politique de Confidentialité' : 'Mentions Légales'}
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-black/8 p-8 md:p-12 prose prose-gray max-w-none">
            {isPrivacy ? (
              <>
                <h2>1. Collecte des données</h2>
                <p>Kairouan Academy collecte les données personnelles nécessaires à la création de votre compte, au traitement de vos commandes et à l'amélioration de nos services. Ces données incluent votre nom, adresse email et informations de paiement.</p>

                <h2>2. Utilisation des données</h2>
                <p>Vos données sont utilisées exclusivement pour :</p>
                <ul>
                  <li>La gestion de votre compte étudiant</li>
                  <li>Le traitement de vos commandes et paiements</li>
                  <li>L'envoi de confirmations et notifications liées à vos cours</li>
                  <li>L'amélioration de notre plateforme</li>
                </ul>

                <h2>3. Protection des données</h2>
                <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction. L'authentification est assurée par Supabase Auth et les paiements par Stripe (certifié PCI DSS).</p>

                <h2>4. Vos droits (RGPD)</h2>
                <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
                <ul>
                  <li><strong>Droit d'accès</strong> : consulter les données que nous détenons sur vous</li>
                  <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
                  <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
                  <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
                </ul>
                <p>Pour exercer ces droits, contactez-nous à <strong>contact@kairouaneditions.com</strong>.</p>

                <h2>5. Cookies</h2>
                <p>Notre site utilise uniquement des cookies essentiels au fonctionnement de la plateforme (session d'authentification). Aucun cookie publicitaire ou de traçage tiers n'est utilisé.</p>

                <h2>6. Conservation des données</h2>
                <p>Vos données sont conservées le temps nécessaire à la fourniture du service. En cas de suppression de compte, vos données personnelles sont effacées dans un délai de 30 jours, à l'exception des données de facturation conservées 10 ans conformément aux obligations légales.</p>

                <h2>7. Contact</h2>
                <p>Pour toute question relative à la protection de vos données : <strong>contact@kairouaneditions.com</strong></p>
              </>
            ) : (
              <>
                <h2>1. Éditeur du site</h2>
                <p>Le site Kairouan Academy est édité par <strong>Kairouan Éditions</strong>, situé en Belgique.</p>
                <p>Contact : contact@kairouaneditions.com</p>

                <h2>2. Hébergement</h2>
                <p>Le site est hébergé par <strong>Vercel Inc.</strong> (San Francisco, CA, USA) et la base de données par <strong>Supabase</strong> (hébergement EU).</p>

                <h2>3. Propriété intellectuelle</h2>
                <p>L'ensemble des contenus présents sur ce site (textes, vidéos, images, logos) sont protégés par le droit d'auteur et sont la propriété exclusive de Kairouan Éditions. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.</p>

                <h2>4. Conditions de vente</h2>
                <p>L'achat d'un cours donne accès au contenu pédagogique correspondant. Les paiements sont traités de manière sécurisée via <strong>Stripe</strong> (cartes bancaires, Bancontact) et <strong>PayPal</strong>. Sauf mention contraire sur la fiche produit, l'accès aux cours achetés est illimité dans le temps.</p>

                <h2>5. Droit de rétractation</h2>
                <p>Conformément à l'article 16 de la directive 2011/83/UE et à la législation belge, le droit de rétractation ne s'applique pas aux contenus numériques fournis sur un support immatériel dont l'exécution a commencé avec l'accord exprès du consommateur.</p>

                <h2>6. Responsabilité</h2>
                <p>Kairouan Éditions s'efforce d'assurer l'exactitude des informations diffusées sur ce site mais ne saurait être tenu responsable des erreurs ou omissions éventuelles. Le contenu des cours est fourni à titre pédagogique et ne constitue pas un avis juridique ou religieux officiel.</p>

                <h2>7. Droit applicable</h2>
                <p>Les présentes mentions légales sont soumises au droit belge. Tout litige sera soumis à la juridiction compétente de Belgique.</p>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LegalPage;
