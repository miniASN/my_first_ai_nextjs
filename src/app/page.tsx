import React from "react";
import { prisma } from "@/lib/prisma";
import AddRecordModalClient from "@/components/AddRecordModalClient";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `今天 ${hours}:${minutes}`;
  } else if (days === 1) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `昨天 ${hours}:${minutes}`;
  } else {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month}-${day} ${hours}:${minutes}`;
  }
}

function formatTxAmount(amount: number, type: string): string {
  const formatted = new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
  }).format(amount);

  return type === "income" ? `+¥${formatted}` : `-¥${formatted}`;
}

export default async function Home() {
  let transactions: any[] = [];
  let summary = { income: 0, expense: 0, balance: 0 };
  let error = null;

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
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    summary = { income, expense, balance: income - expense };
  } catch (e: any) {
    error = e.message || String(e);
  }

  return (
    <>
      <header className="top-nav">
        <div className="brand">✦ AstroBook</div>
        <AddRecordModalClient />
      </header>

      <div className="dashboard-grid">
        <div className="glass-panel">
          <div className="title">本月结余</div>
          <div className="amount-large">{formatCurrency(summary.balance)}</div>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "16px" }}>
            收入 <span style={{ color: "var(--success)", fontWeight: 500 }}>{formatCurrency(summary.income)}</span>
            {" · "}
            支出 <span style={{ color: "var(--danger)", fontWeight: 500 }}>{formatCurrency(summary.expense)}</span>
          </p>
        </div>

        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="title" style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "4px" }}>本月支出</div>
            <div className="amount-large" style={{ fontSize: "28px", background: "none", color: "var(--danger)", WebkitTextFillColor: "initial" }}>
              {formatCurrency(summary.expense)}
            </div>
          </div>
          <div style={{ marginTop: "16px" }}>
            <div className="title" style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "4px" }}>本月收入</div>
            <div className="amount-large" style={{ fontSize: "28px", background: "none", color: "var(--success)", WebkitTextFillColor: "initial" }}>
              {formatCurrency(summary.income)}
            </div>
          </div>
        </div>

        <div className="glass-panel">
          <div className="title">快速操作</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "24px" }}>
            <button className="btn-primary" style={{ background: "rgba(255,255,255,0.03)", boxShadow: "none", border: "1px solid var(--border-glass)", color: "var(--text-main)", fontWeight: 500 }}>月度预算设置</button>
            <button className="btn-primary" style={{ background: "rgba(255,255,255,0.03)", boxShadow: "none", border: "1px solid var(--border-glass)", color: "var(--text-main)", fontWeight: 500 }}>资金分类管理</button>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "32px", marginBottom: "48px" }}>
        <div className="title" style={{ marginBottom: "24px", fontSize: "20px" }}>近期明细</div>
        {error ? (
          <div style={{ color: "var(--danger)", padding: "20px" }}>エラー: {error}</div>
        ) : transactions.length > 0 ? (
          <div className="transaction-list">
            {transactions.map((t) => (
              <div key={t.id} className="transaction-item">
                <div style={{ display: "flex", gap: "16px", alignItems: "center", flex: 1 }}>
                  <div style={{
                    width: "48px", height: "48px",
                    borderRadius: "50%", background: "rgba(255,255,255,0.03)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px", border: "1px solid var(--border-glass)"
                  }}>
                    {t.type === 'expense' ? '💸' : '💰'}
                  </div>
                  <div className="transaction-info">
                    <h4 style={{ fontSize: "16px", marginBottom: "4px" }}>{t.title}</h4>
                    <p style={{ opacity: 0.8 }}>{t.category} · {formatDate(new Date(t.date))}</p>
                  </div>
                </div>
                <div className={`amount ${t.type}`} style={{ fontSize: "18px" }}>
                  {formatTxAmount(t.amount, t.type)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
            <p>还没有记录，点击右上角的「+ 记一笔」开始记账吧！</p>
          </div>
        )}
      </div>
    </>
  );
}
