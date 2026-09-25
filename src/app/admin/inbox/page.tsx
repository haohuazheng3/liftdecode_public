import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { inboxMessages } from "@/lib/db/schema";
import { Empty, PageHead, StatusTag, Table, Td, Th } from "../_components/ui";
import { ago, fmtDate } from "../_components/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Inbox · Admin",
  description: "Mail delivered to the test inbox, with DKIM / SPF / DMARC results.",
  robots: { index: false, follow: false },
};

interface AuthSummary {
  dkim: string | null;
  spf: string | null;
  dmarc: string | null;
}

/** Pull `dkim=pass`, `spf=fail`, `dmarc=…` out of the Authentication-Results header, whatever its casing. */
function authSummary(headers: Record<string, string> | null | undefined): AuthSummary | null {
  if (!headers) return null;
  const key = Object.keys(headers).find((k) => k.toLowerCase() === "authentication-results");
  const value = key ? headers[key] : null;
  if (!value) return null;
  const pick = (name: string) => {
    const m = value.match(new RegExp(`(?:^|[\\s;])${name}=([a-z]+)`, "i"));
    return m ? m[1].toLowerCase() : null;
  };
  return { dkim: pick("dkim"), spf: pick("spf"), dmarc: pick("dmarc") };
}

function AuthTag({ name, value }: { name: string; value: string | null }) {
  if (!value) return <span className="tag text-ink-3">{name} —</span>;
  return <StatusTag status={value === "pass" ? "pass" : value === "none" ? "none" : "fail"} label={`${name} ${value}`} />;
}

function fmtBytes(n: number | null): string {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export default async function AdminInboxPage() {
  const rows = await db
    .select({
      id: inboxMessages.id,
      toAddr: inboxMessages.toAddr,
      fromAddr: inboxMessages.fromAddr,
      subject: inboxMessages.subject,
      textBody: inboxMessages.textBody,
      headers: inboxMessages.headers,
      rawSize: inboxMessages.rawSize,
      receivedAt: inboxMessages.receivedAt,
    })
    .from(inboxMessages)
    .orderBy(desc(inboxMessages.receivedAt))
    .limit(200);

  return (
    <div>
      <PageHead
        eyebrow="Admin · Inbox"
        title={
          <>
            Mail that <em>landed</em>.
          </>
        }
        sub="Anything sent to an @liftdecode.com address routed through the Email Worker. Latest 200. Use it to check transactional mail and authentication before launch."
      />

      {rows.length === 0 ? (
        <Empty>Nothing received yet. Send a test message to any @liftdecode.com address and it shows up here.</Empty>
      ) : (
        <Table minWidth={900}>
          <thead>
            <tr>
              <Th>Received</Th>
              <Th>To</Th>
              <Th>From</Th>
              <Th>Subject</Th>
              <Th>Auth</Th>
              <Th className="text-right">Size</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => {
              const auth = authSummary(m.headers);
              return (
                <tr key={m.id}>
                  <Td mono>
                    <span title={fmtDate(m.receivedAt)}>{ago(m.receivedAt)}</span>
                  </Td>
                  <Td className="break-all font-mono text-xs">{m.toAddr}</Td>
                  <Td className="break-all font-mono text-xs">{m.fromAddr}</Td>
                  <Td className="max-w-[26rem]">
                    <div className="text-ink break-words">{m.subject || <span className="text-ink-3">(no subject)</span>}</div>
                    {m.textBody ? (
                      <details className="mt-2">
                        <summary className="cursor-pointer select-none text-xs text-ink-3 hover:text-ink inline-flex items-center min-h-11 sm:min-h-0 sm:py-1">
                          Text body
                        </summary>
                        <pre className="slab-inset mt-2 p-3 text-[12px] leading-relaxed font-sans text-ink-2 whitespace-pre-wrap break-words max-h-96 overflow-auto">
                          {m.textBody}
                        </pre>
                      </details>
                    ) : (
                      <div className="text-xs text-ink-3 mt-1">no text part</div>
                    )}
                  </Td>
                  <Td>
                    {auth ? (
                      <div className="flex flex-col items-start gap-1">
                        <AuthTag name="dkim" value={auth.dkim} />
                        <AuthTag name="spf" value={auth.spf} />
                        <AuthTag name="dmarc" value={auth.dmarc} />
                      </div>
                    ) : (
                      <span className="text-ink-3 text-xs">no auth header</span>
                    )}
                  </Td>
                  <Td mono className="text-right">
                    {fmtBytes(m.rawSize)}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
