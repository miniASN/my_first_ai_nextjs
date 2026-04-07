"use client";

import React from "react";
import { deleteTransaction } from "@/app/actions";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  category: string;
  title: string;
  date: Date;
}

interface TransactionListProps {
  transactions: Transaction[];
  formatDate: (date: Date) => string;
}

function formatCurrency(amount: number, type: string): string {
  const formatted = new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
  }).format(amount);

  return type === "income" ? `+¥${formatted}` : `-¥${formatted}`;
}

export default function TransactionList({ transactions, formatDate }: TransactionListProps) {
  async function handleDelete(id: string) {
    if (confirm("确定要删除这条记录吗？")) {
      await deleteTransaction(id);
    }
  }

  return (
    <div className="transaction-list">
      {transactions.map((t) => (
        <div key={t.id} className="transaction-item">
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
                border: "1px solid var(--border-glass)",
              }}
            >
              {t.type === "expense" ? "💸" : "💰"}
            </div>
            <div className="transaction-info">
              <h4 style={{ fontSize: "16px", marginBottom: "4px" }}>{t.title}</h4>
              <p style={{ opacity: 0.8 }}>
                {t.category} · {formatDate(new Date(t.date))}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div className={`amount ${t.type}`} style={{ fontSize: "18px" }}>
              {formatCurrency(t.amount, t.type)}
            </div>
            <button
              onClick={() => handleDelete(t.id)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "18px",
                padding: "4px",
                opacity: 0.6,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
              title="删除"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
