import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { toggleMessageRead, deleteMessage } from "@/server/actions/messages";

export const metadata: Metadata = { title: "Messages", robots: { index: false, follow: false } };

export default async function MessagesPage() {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Messages</h1>
        {unread > 0 ? <Badge variant="warning">{unread} unread</Badge> : null}
      </div>

      {messages.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No messages yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-lg border p-4 ${message.read ? "border-border" : "border-amber-500/50 bg-amber-500/5"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.name}</span>
                    {message.read ? null : <Badge variant="warning">new</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <a href={`mailto:${message.email}`} className="underline">{message.email}</a>
                    {message.subject ? ` · ${message.subject}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {message.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                  </span>
                  <form action={toggleMessageRead}>
                    <input type="hidden" name="id" value={message.id} />
                    <Button type="submit" variant="outline" size="sm">
                      {message.read ? "Mark unread" : "Mark read"}
                    </Button>
                  </form>
                  <DeleteButton action={deleteMessage} id={message.id} label="Delete" confirmMessage="Delete this message?" />
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm">{message.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
