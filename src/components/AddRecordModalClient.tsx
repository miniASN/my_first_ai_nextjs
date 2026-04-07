"use client";

import React, { useState, useTransition } from "react";
import { addTransaction } from "@/app/actions";
import { useTranslations } from "next-intl";
import { CATEGORY_KEYS } from "@/lib/categories";

export default function AddRecordModalClient() {
  const t = useTranslations("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [isPending, startTransition] = useTransition();

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("type", type);

    startTransition(async () => {
      const result = await addTransaction(formData);
      if (result?.success) {
        setIsModalOpen(false);
        event.currentTarget.reset();
      }
    });
  }

  return (
    <>
      <button
        className="btn-primary"
        style={{ padding: "8px 16px", fontSize: "14px", boxShadow: "none" }}
        onClick={() => setIsModalOpen(true)}
      >
        {t("addRecord")}
      </button>

      {isModalOpen && (
        <div className="modal-overlay open" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <h3 className="title" style={{ fontSize: "20px", marginBottom: "24px" }}>
              {t("recordNew")}
            </h3>

            <div className="type-selector">
              <div
                className={`type-btn expense ${type === "expense" ? "active" : ""}`}
                onClick={() => setType("expense")}
              >
                {t("expense")}
              </div>
              <div
                className={`type-btn income ${type === "income" ? "active" : ""}`}
                onClick={() => setType("income")}
              >
                {t("income")}
              </div>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">{t("amount")}</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  required
                  className="form-input"
                  placeholder={t("amountPlaceholder")}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t("category")}</label>
                <select name="category" required className="form-select" defaultValue="food">
                  {CATEGORY_KEYS.map((category) => (
                    <option key={category} style={{ color: "black" }} value={category}>
                      {t(`categories.${category}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t("note")}</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="form-input"
                  placeholder={t("notePlaceholder")}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  {t("cancel")}
                </button>
                <button type="submit" className="btn-primary" disabled={isPending}>
                  {isPending ? t("saving") : t("saveRecord")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
