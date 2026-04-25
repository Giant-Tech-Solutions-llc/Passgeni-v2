// =============================================================
// PASSGENI — GUIDE CONTENT
// password-compliance-for-devops-sre
// =============================================================

export const toc = [
  { id: "the-devops-challenge",     title: "The DevOps compliance challenge"          },
  { id: "credential-types",         title: "Credential types and compliance scope"    },
  { id: "secrets-vs-compliance",    title: "Secrets management vs compliance proof"   },
  { id: "provenance",               title: "Password provenance: what it is and why"  },
  { id: "workflow",                 title: "Certificate workflow for DevOps teams"    },
  { id: "rotation-requirements",    title: "Rotation requirements by framework"       },
  { id: "infrastructure-as-code",   title: "IaC and pipeline integration"            },
  { id: "env-files",                title: ".env files and compliance risk"           },
  { id: "audit-evidence",           title: "Building an audit evidence package"      },
  { id: "checklist",                title: "DevOps compliance checklist"              },
];

export const contentHtml = `
<h2 id="the-devops-challenge">The DevOps compliance challenge</h2>
<p>DevOps and SRE teams manage more credentials than any other function in most organisations. Service accounts, database passwords, API keys, CI/CD tokens, Kubernetes secrets, cloud IAM credentials, container registry passwords — the list is long and often undocumented.</p>
<p>The compliance challenge is not generating strong credentials. Tools like HashiCorp Vault, AWS Secrets Manager, and Doppler handle secure storage and rotation. The challenge is <em>proving</em> that credentials meet specific compliance standards at the moment they were created.</p>
<p>When a SOC 2 auditor asks "show me evidence that your production database password was generated to CC6.1 requirements," the typical DevOps answer is: "we use Vault and rotate every quarter." That's a process claim, not evidence. The auditor needs to see that a specific credential met a specific standard at a documented point in time.</p>
<p>This is the gap that compliance certificates close — without adding meaningful operational overhead.</p>

<h2 id="credential-types">Credential types and compliance scope</h2>
<p>Not every credential in your environment is in scope for every compliance framework. Understanding which credentials require compliance documentation helps prioritise where to invest:</p>

<div class="req-row"><span class="req-label">Production database passwords</span><span class="req-value">SOC 2, HIPAA (if ePHI), PCI-DSS (if CDE), ISO 27001 — highest priority</span></div>
<div class="req-row"><span class="req-label">Cloud IAM service account keys</span><span class="req-value">All frameworks if managing in-scope infrastructure</span></div>
<div class="req-row"><span class="req-label">Kubernetes service account tokens</span><span class="req-value">SOC 2, ISO 27001 — if cluster manages in-scope workloads</span></div>
<div class="req-row"><span class="req-label">CI/CD pipeline credentials</span><span class="req-value">SOC 2, ISO 27001 — deployment pipeline security</span></div>
<div class="req-row"><span class="req-label">Container registry credentials</span><span class="req-value">SOC 2, ISO 27001 — supply chain security</span></div>
<div class="req-row"><span class="req-label">Third-party API keys</span><span class="req-value">Depends on data accessed — lower compliance burden but still document</span></div>
<div class="req-row"><span class="req-label">Internal service-to-service tokens</span><span class="req-value">Varies — in-scope if services handle regulated data</span></div>
<div class="req-row"><span class="req-label">Development environment credentials</span><span class="req-value">Generally out of scope if production data is not accessible</span></div>

<p>Priority rule: if the credential provides access to systems that process or store data covered by a compliance framework, that credential is in scope and should have documented provenance.</p>

<h2 id="secrets-vs-compliance">Secrets management vs compliance proof</h2>
<p>Secrets management and compliance proof are related but distinct problems. Understanding the distinction prevents teams from assuming that "we use Vault" answers audit questions about password compliance.</p>
<ul>
  <li><strong>Secrets management solves:</strong> secure storage (encryption at rest and in transit), access control (who can read which secrets), rotation automation (TTL-based renewal), audit logging (who accessed what, when), and secret injection (runtime delivery without plaintext exposure).</li>
  <li><strong>Secrets management does NOT solve:</strong> proof that the secret was generated to a specific compliance standard, documentation of the entropy source used, demonstration that the secret met HIPAA or PCI-DSS requirements at the moment of creation, or a machine-verifiable record of generation parameters for auditors.</li>
  <li><strong>Compliance certificates solve:</strong> exactly the gap above. They provide the generation-time evidence that secrets management platforms are architecturally unable to provide (because they don't control how secrets are created — only how they're stored).</li>
</ul>
<p>The optimal workflow: generate credentials using PassGeni with a compliance preset (getting a certificate), store them in Vault or AWS Secrets Manager, and tag the secret with the PassGeni certificate URL. You get the operational benefits of secrets management plus the compliance evidence of a certificate.</p>

<h2 id="provenance">Password provenance: what it is and why auditors care</h2>
<p>Password provenance is proof of how a credential was created: what standard it was generated to, what entropy source was used, what character rules were applied, and when the generation occurred.</p>
<p>Auditors care about provenance because:</p>
<ul>
  <li><strong>Policy enforcement is not self-proving:</strong> Having a policy that says "all database passwords must be 20+ characters with full character set" doesn't prove any specific database password actually meets that requirement. Provenance closes this gap.</li>
  <li><strong>Human credential creation is unverifiable:</strong> If an engineer manually created a service account password, there is no way to prove it was cryptographically random, met length requirements, or used an appropriate entropy source. Machine-generated credentials with provenance documents eliminate this ambiguity.</li>
  <li><strong>Rotation events need documentation:</strong> When a credential is rotated (on schedule or due to compromise), auditors want to see that the replacement met compliance standards. A certificate generated at rotation time provides this.</li>
  <li><strong>Litigation and incident response:</strong> After a breach, investigators ask whether credential weaknesses contributed. Machine-generated credentials with documented compliance properties are a strong defense against negligence claims.</li>
</ul>
<p>A PassGeni compliance certificate is machine-readable provenance in a cryptographically signed format. The ES256 signature means the record cannot be altered retroactively — making it reliable evidence even under adversarial scrutiny.</p>

<h2 id="workflow">Certificate workflow for DevOps teams</h2>
<p>The standard workflow for generating and documenting compliant credentials:</p>
<ol>
  <li><strong>Select compliance preset:</strong> Identify the most demanding compliance standard applicable to the credential's target system. Use FIPS 140-3 for federal/DoD contexts; SOC 2 for general SaaS infrastructure; HIPAA for healthcare systems; PCI-DSS for payment systems.</li>
  <li><strong>Generate via PassGeni:</strong> Use the web interface or API with the selected preset. PassGeni validates parameters server-side and issues a generation_session_id.</li>
  <li><strong>Certify immediately:</strong> Use the generation_session_id (valid 60 seconds) to request the compliance certificate. You receive a cert_url.</li>
  <li><strong>Store credential in secrets manager:</strong> HashiCorp Vault, AWS Secrets Manager, Doppler, 1Password Secrets Automation — whatever your team uses.</li>
  <li><strong>Tag with certificate URL:</strong> Add the cert_url as metadata alongside the credential:
    <ul>
      <li>Vault: <code>vault kv metadata put secret/db-prod passgeni-cert="https://passgeni.ai/cert/[id]"</code></li>
      <li>AWS Secrets Manager: Add tag <code>PassGeniCert: https://passgeni.ai/cert/[id]</code></li>
      <li>Doppler: Add URL to the secret's note field</li>
      <li>Kubernetes: Add annotation <code>passgeni.ai/cert-url</code> to the Secret resource</li>
    </ul>
  </li>
  <li><strong>Update system documentation:</strong> Add the cert URL to the runbook, system diagram, or infrastructure documentation for the target system.</li>
</ol>
<p>For teams using the PassGeni API (Authority tier), steps 2–3 can be fully automated as part of Terraform, Ansible, or custom provisioning scripts. The cert_url becomes a Terraform output that flows into tagging and documentation automatically.</p>

<h2 id="rotation-requirements">Rotation requirements by framework</h2>
<p>Rotation schedules differ significantly across compliance frameworks. The trend in modern guidance is away from mandatory periodic rotation toward evidence-based rotation:</p>

<div class="req-row"><span class="req-label">NIST 800-63B (baseline)</span><span class="req-value">Rotate only on evidence of compromise — no mandatory schedule</span></div>
<div class="req-row"><span class="req-label">HIPAA §164.312</span><span class="req-value">No mandated schedule — immediately on compromise or role change; annually for privileged accounts as best practice</span></div>
<div class="req-row"><span class="req-label">PCI-DSS v4.0 Req 8.3</span><span class="req-value">Rotate only on suspected compromise (v4.0 removed mandatory periodic rotation)</span></div>
<div class="req-row"><span class="req-label">SOC 2 CC6.1</span><span class="req-value">Auditor discretion — expect annual rotation for privileged accounts to be question-free</span></div>
<div class="req-row"><span class="req-label">ISO 27001 A.9</span><span class="req-value">Per documented policy — typically quarterly for privileged service accounts</span></div>
<div class="req-row"><span class="req-label">FIPS 140-3 / DoD STIG</span><span class="req-value">90 days for privileged accounts — STIG-specific</span></div>

<p>Every rotation event should generate a new PassGeni compliance certificate for the replacement credential. The old certificate provides historical audit trail; the new certificate covers the current credential. Together they demonstrate continuous compliance across rotation events — exactly what SOC 2 Type II and ISO 27001 auditors want to see.</p>

<h2 id="infrastructure-as-code">IaC and pipeline integration</h2>
<p>Integrating PassGeni certificate generation into infrastructure-as-code workflows ensures compliance documentation is generated automatically, not manually:</p>
<ul>
  <li><strong>Terraform:</strong> Use a <code>null_resource</code> or <code>terraform-provider-http</code> to call the PassGeni API during apply. Store the cert_url as a Terraform output. Reference it in a <code>tags</code> block on the associated resource (RDS instance, EKS cluster, etc.).</li>
  <li><strong>Pulumi:</strong> Call the PassGeni REST API from a Pulumi ComponentResource during stack deployment. Return the cert_url as a stack output.</li>
  <li><strong>Ansible:</strong> Add a PassGeni API task to credential provisioning playbooks using <code>uri</code> module. Register the cert_url and write it to a host variable file.</li>
  <li><strong>GitHub Actions:</strong> Add a step to credential rotation workflows that calls PassGeni API and stores the cert_url as a step output. Archive it as a workflow artifact for audit retention.</li>
  <li><strong>Kubernetes Operators:</strong> For teams managing credentials via Kubernetes operators (External Secrets, Sealed Secrets), add a PassGeni certificate annotation to generated Secret resources at creation time.</li>
</ul>
<p>The PassGeni API requires an Authority tier API key. Each API call to POST /api/generate followed by POST /api/generate-certificate produces a cert_url in the response. API calls are logged in the team's audit trail.</p>

<h2 id="env-files">Environment files and compliance risk</h2>
<p>Environment files (.env, .env.production, .env.local) are an audit liability that DevOps teams should be aware of:</p>
<ul>
  <li><strong>Plaintext storage:</strong> .env files store credentials in plaintext. If committed to version control (a common mistake), they expose credentials permanently. If stored on developer workstations, they create uncontrolled access vectors.</li>
  <li><strong>No provenance:</strong> .env files contain the credential value only — no documentation of how it was created, when, to what standard, or by whom. From a compliance standpoint, these credentials are undocumented.</li>
  <li><strong>No access controls:</strong> .env files have filesystem-level access controls at best. Anyone with read access to the file can read all credentials in it, with no audit log.</li>
  <li><strong>The compliant alternative:</strong> Generate credentials using PassGeni (capturing the cert_url), inject them at runtime via a secrets manager (Vault agent, AWS Parameter Store, Doppler sync). The application references the credential at runtime; it is never stored in a .env file; the cert_url provides compliance documentation.</li>
</ul>
<p>If .env files are unavoidable in your environment, at minimum: ensure they are in .gitignore and never committed; generate their contents using PassGeni with the appropriate compliance preset; document the cert_url in the associated application's runbook.</p>

<h2 id="audit-evidence">Building an audit evidence package</h2>
<p>When preparing for a SOC 2, HIPAA, or PCI-DSS audit as a DevOps/SRE team, the credential evidence package should include:</p>
<ol>
  <li><strong>Written infrastructure credential policy:</strong> A document covering minimum password length by credential type, approved generation tools, secrets manager requirements, rotation schedule, and off-boarding procedures. Use PassGeni's Policy Generator with your applicable standards.</li>
  <li><strong>Credential inventory:</strong> A register of all in-scope credentials: system name, credential type, applicable compliance standard, rotation date, cert URL. This can be a simple CSV or CMDB table.</li>
  <li><strong>Compliance certificates:</strong> For each in-scope credential: the cert URL demonstrating it was generated to the stated compliance standard. Auditors can independently verify each certificate.</li>
  <li><strong>Secrets manager configuration:</strong> Export or screenshot showing encryption-at-rest configuration, access policies, and audit logging settings for your secrets management platform.</li>
  <li><strong>Rotation logs:</strong> Evidence of credential rotation events with dates. PassGeni's dashboard (Assurance tier) shows certificate history as a rotation log.</li>
  <li><strong>Access reviews:</strong> Documentation showing periodic review of which service accounts exist and who has access to retrieve credentials from the secrets manager.</li>
</ol>
<p>This package addresses the credential control evidence requirements for SOC 2 CC6.1, HIPAA §164.312, PCI-DSS Requirement 8, and ISO 27001 Annex A.9.</p>

<h2 id="checklist">DevOps compliance checklist</h2>
<p>Use this checklist when onboarding a new system to compliance requirements or preparing for an audit:</p>
<ol>
  <li>Identify all credentials associated with the target system or audit scope</li>
  <li>Classify each credential by applicable compliance framework</li>
  <li>Rotate any credential created without documented provenance — generate replacement via PassGeni with appropriate preset</li>
  <li>Collect certificate URL for each rotated or new credential</li>
  <li>Store credential in approved secrets manager (Vault, AWS SM, Doppler)</li>
  <li>Tag each secret with PassGeni cert URL in secrets manager metadata</li>
  <li>Add cert URLs to system runbook and infrastructure documentation</li>
  <li>Create or update credential inventory spreadsheet / CMDB entry</li>
  <li>Configure rotation schedule and calendar reminder (per applicable framework)</li>
  <li>Generate written credential policy using PassGeni Policy Generator</li>
  <li>Export secrets manager access policy configuration for audit evidence</li>
  <li>Test credential rotation workflow end-to-end (including cert URL capture)</li>
  <li>For CI/CD credentials: verify no credentials in version control (.env check, git history scan)</li>
  <li>For Authority tier teams: verify API-based certificate generation working in provisioning pipeline</li>
</ol>

<div class="callout">
  <strong>Start with production database credentials and cloud IAM service accounts.</strong> These are the credentials with the highest compliance exposure. Generate them using PassGeni FIPS 140-3 or SOC 2 preset — a single preset that satisfies all major frameworks simultaneously. Foundation plan (free) covers 3 certificates/month. Assurance ($19/month) provides unlimited certificates for full infrastructure coverage.
</div>
`;
