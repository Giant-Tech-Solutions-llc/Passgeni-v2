// Legacy LemonSqueezy webhook — no longer active
export default function handler(req, res) {
  res.status(410).json({ error: "This webhook endpoint is no longer active." });
}
