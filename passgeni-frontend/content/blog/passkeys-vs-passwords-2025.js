export const contentHtml = `
<h2>What passkeys actually are</h2>
<p>A passkey is a cryptographic key pair — a private key stored on your device and a public key registered with the website. When you log in, your device signs a challenge with the private key and the server verifies with the public key. No password is transmitted. No password is stored on the server. Phishing is structurally impossible because the signing is domain-specific: a fake site cannot use your passkey for the real site.</p>
<p>This is not new technology — it's the FIDO2/WebAuthn standard, developed since 2013, made mainstream by Apple, Google, and Microsoft's joint push in 2022.</p>

<h2>Where passkeys are genuinely better than passwords</h2>
<p>Passkeys eliminate phishing, credential stuffing, and brute force in one architectural change. There is no credential to phish. There is no password to stuff. There is nothing to brute force. For sites that implement passkeys correctly, these three attack vectors — which account for the majority of account compromise — simply don't apply.</p>
<p>They're also genuinely more convenient in practice: unlock with Face ID, Touch ID, or your device PIN. No typing, no clipboard, no password manager browser extension needed.</p>

<h2>Where passkeys still have problems</h2>
<p><strong>Ecosystem lock-in:</strong> Apple passkeys sync to iCloud Keychain. Google passkeys sync to Google Password Manager. Cross-ecosystem use requires a third-party manager like 1Password or Bitwarden. If you switch platforms, passkey migration is still clunky.</p>
<p><strong>Device dependency:</strong> No phone, no login — unless you've set up backup methods. This is fine until your device is lost or broken at 2am before a critical deadline.</p>
<p><strong>Adoption is incomplete:</strong> As of 2025, passkeys are supported by major consumer services (Apple, Google, Microsoft, GitHub, Dropbox) but are absent from the majority of enterprise software, banking systems, and niche SaaS platforms. Passwords aren't going anywhere for the next 5-10 years for most people's credential portfolios.</p>

<h2>The right answer in 2025</h2>
<p>Use passkeys wherever they're available and well-implemented. Keep strong unique passwords for everything else — which is still most things. The presence of passkeys on some services doesn't reduce the need for strong password hygiene on services that haven't made the switch. PassGeni remains relevant precisely because the transition will take years, not months.</p>
`;