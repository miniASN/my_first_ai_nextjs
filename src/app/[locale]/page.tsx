import React from "react";
import { prisma } from "@/lib/prisma";
import AddRecordModalClient from "@/components/AddRecordModalClient";
import TransactionList from "@/components/TransactionList";
import { getTranslations } from "next-intl/server";

type HomeTranslations = {
  (key: string): string;
};

function formatCurrency(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: Date, t: HomeTranslations, locale: string): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  if (days === 0) {
    return `${t("today")} ${time}`;
  }

  if (days === 1) {
    return `${t("yesterday")} ${time}`;
  }

  return new Intl.DateTimeFormat(locale, {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("home");

  let transactions: Awaited<ReturnType<typeof prisma.transaction.findMany>> = [];
  let summary = { income: 0, expense: 0, balance: 0 };
  let error: string | null = null;

  try {
    transactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
      take: 50,
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const monthlyTransactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const income = monthlyTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const expense = monthlyTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    summary = { income, expense, balance: income - expense };
  } catch (caughtError: unknown) {
    error = toErrorMessage(caughtError);
  }

  return (
    <>
      <header className="top-nav">
        <div className="brand">{t("brand")}</div>
        <AddRecordModalClient />
      </header>

      <div className="dashboard-grid">
        <div className="glass-panel">
          <div className="title">{t("monthlyBalance")}</div>
          <div className="amount-large">{formatCurrency(summary.balance, locale)}</div>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "16px" }}>
            {t("income")} <span style={{ color: "var(--success)", fontWeight: 500 }}>{formatCurrency(summary.income, locale)}</span>
            {" · "}
            {t("expense")} <span style={{ color: "var(--danger)", fontWeight: 500 }}>{formatCurrency(summary.expense, locale)}</span>
          </p>
        </div>

        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="title" style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "4px" }}>{t("monthlyExpense")}</div>
            <div className="amount-large" style={{ fontSize: "28px", background: "none", color: "var(--danger)", WebkitTextFillColor: "initial" }}>
              {formatCurrency(summary.expense, locale)}
            </div>
          </div>
          <div style={{ marginTop: "16px" }}>
            <div className="title" style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "4px" }}>{t("monthlyIncome")}</div>
            <div className="amount-large" style={{ fontSize: "28px", background: "none", color: "var(--success)", WebkitTextFillColor: "initial" }}>
              {formatCurrency(summary.income, locale)}
            </div>
          </div>
        </div>

        <div className="glass-panel">
          <div className="title">{t("quickActions")}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "24px" }}>
            <button className="btn-primary" style={{ background: "rgba(255,255,255,0.03)", boxShadow: "none", border: "1px solid var(--border-glass)", color: "var(--text-main)", fontWeight: 500 }}>{t("monthlyBudget")}</button>
            <button className="btn-primary" style={{ background: "rgba(255,255,255,0.03)", boxShadow: "none", border: "1px solid var(--border-glass)", color: "var(--text-main)", fontWeight: 500 }}>{t("categoryManagement")}</button>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "32px", marginBottom: "48px" }}>
        <div className="title" style={{ marginBottom: "24px", fontSize: "20px" }}>{t("recentDetails")}</div>
        {error ? (
          <div style={{ color: "var(--danger)", padding: "20px" }}>{t("error")}: {error}</div>
        ) : transactions.length > 0 ? (
          <TransactionList transactions={transactions} locale={locale} formatDate={(date) => formatDate(date, t, locale)} />
        ) : (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>◎</div>
            <p>{t("noRecords")}</p>
          </div>
        )}
      </div>
    </>
  );
}
