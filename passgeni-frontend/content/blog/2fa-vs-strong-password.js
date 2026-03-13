export const contentHtml = `
<h2>Two different attack surfaces</h2>
<p>2FA and strong passwords solve different problems. A strong password protects against brute force and credential stuffing. 2FA protects against phishing and credential theft — cases where the attacker already has your password. You need both, but for different reasons.</p>

<h2>What a strong password actually protects you against</h2>
<p>Without 2FA, a strong password is your only defence against: brute force attacks on your account, credential stuffing from previous breaches, and password spray attacks. A 16-character high-entropy password makes all three infeasible regardless of the hashing algorithm used server-side.</p>

<h2>What 2FA actually protects you against</h2>
<p>2FA protects against phishing (you gave your password to a fake site), keyloggers (malware recorded your typing), shoulder surfing, and data breaches where plaintext passwords were leaked. In all these cases your strong password is already compromised — 2FA is the backup.</p>

<h2>Where each fails independently</h2>
<p><strong>Strong password, no 2FA:</strong> You're phished. Attacker has your password. Nothing stops them. One successful phishing email and your strong password is useless.</p>
<p><strong>2FA, weak password:</strong> Attacker brute-forces your weak password, then calls you pretending to be your bank asking for your "verification code." SIM-swap attacks specifically target 2FA. A weak password makes this worth attempting.</p>

<h2>The combination is multiplicative, not additive</h2>
<p>Strong password + 2FA means an attacker needs to both crack or steal your password AND intercept your second factor. These are separate attack vectors. Defeating both simultaneously is exponentially harder than defeating either alone.</p>
<p>Use PassGeni to generate a high-entropy password, then enable 2FA on every account that offers it. Prefer authenticator apps (Google Authenticator, Authy) over SMS — SIM-swap attacks can intercept SMS codes. For critical accounts, a hardware key like YubiKey is the most resistant option available.</p>

<h2>The priority order if you have to choose</h2>
<p>For email accounts: prioritise 2FA. Email account access lets attackers reset every other password. For everything else: strong unique password first, then 2FA as the second layer. Never use the same password twice regardless of 2FA status — credential stuffing doesn't care about 2FA if the site doesn't implement rate limiting.</p>
`;