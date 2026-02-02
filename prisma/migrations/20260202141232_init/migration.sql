-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "AuthorType" AS ENUM ('CLIENT', 'TECHNICIAN');

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technicians" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "max_concurrent_tickets" INTEGER NOT NULL DEFAULT 3,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technicians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "TicketPriority" NOT NULL DEFAULT 'LOW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "resolved_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "opened_by" TEXT NOT NULL,
    "assigned_to" TEXT,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author_type" "AuthorType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "ticket_id" TEXT NOT NULL,
    "client_id" TEXT,
    "technician_id" TEXT,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_attachments" (
    "id" TEXT NOT NULL,
    "ticket_id" TEXT NOT NULL,
    "attachment_id" TEXT NOT NULL,

    CONSTRAINT "ticket_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "technicians_email_key" ON "technicians"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_attachments_attachment_id_key" ON "ticket_attachments"("attachment_id");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_opened_by_fkey" FOREIGN KEY ("opened_by") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "technicians"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "technicians"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_attachments" ADD CONSTRAINT "ticket_attachments_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_attachments" ADD CONSTRAINT "ticket_attachments_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "attachments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
