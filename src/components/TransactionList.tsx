"use client";

import React from "react";
import { deleteTransaction } from "@/app/actions";
import { useTranslations } from "next-intl";
import { normalizeCategory } from "@/lib/categories";

interface TransactionListItem {
  id: string;
  type: string;
  amount: number;
  category: string;
  title: string;
  formattedDate: string;
}

interface TransactionListProps {
  transactions: TransactionListItem[];
  locale: string;
}

function formatAmount(amount: number, type: string, locale: string): string {
  const numeric = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
  }).format(amount);

  return type === "income" ? `+¥${numeric}` : `-¥${numeric}`;
}

export default function TransactionList({ transactions, locale }: TransactionListProps) {
  const t = useTranslations("home");

  async function handleDelete(id: string) {
    if (confirm(t("deleteConfirm"))) {
      await deleteTransaction(id);
    }
  }

  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="transaction-item">
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flex: 1 }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                border: "1px solid var(--border-glass)"
              }}
            >
              {transaction.type === "expense" ? "−" : "+"}
            </div>
            <div className="transaction-info">
              <h4 style={{ fontSize: "16px", marginBottom: "4px" }}>{transaction.title}</h4>
              <p style={{ opacity: 0.8 }}>
                {t(`categories.${normalizeCategory(transaction.category)}`)} · {transaction.formattedDate}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div className={`amount ${transaction.type}`} style={{ fontSize: "18px" }}>
              {formatAmount(transaction.amount, transaction.type, locale)}
            </div>
            <button
              onClick={() => handleDelete(transaction.id)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "18px",
                padding: "4px",
                opacity: 0.6,
                transition: "opacity 0.2s"
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.opacity = "0.6";
              }}
              title={t("delete")}
              aria-label={t("delete")}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}