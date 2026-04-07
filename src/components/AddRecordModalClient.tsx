"use client";

import React, { useState, useTransition } from "react";
import { addTransaction } from "@/app/actions";

export default function AddRecordModalClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [isPending, startTransition] = useTransition();

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("type", type);

    startTransition(async () => {
      const res = await addTransaction(formData);
      if (res?.success) {
        setIsModalOpen(false);
        (e.target as HTMLFormElement).reset();
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
        + 记一笔
      </button>

      {isModalOpen && (
        <div className="modal-overlay open" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="title" style={{ fontSize: "20px", marginBottom: "24px" }}>记录新的一笔</h3>

            <div className="type-selector">
              <div
                className={`type-btn expense ${type === "expense" ? "active" : ""}`}
                onClick={() => setType("expense")}
              >
                支出
              </div>
              <div
                className={`type-btn income ${type === "income" ? "active" : ""}`}
                onClick={() => setType("income")}
              >
                收入
              </div>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">金额</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  required
                  className="form-input"
                  placeholder="输入金额, 例如 100.00"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">类别</label>
                <select name="category" required className="form-select">
                  <option style={{ color: "black" }} value="餐饮美食">餐饮美食</option>
                  <option style={{ color: "black" }} value="数码电子">数码电子</option>
                  <option style={{ color: "black" }} value="房租水电">房租水电</option>
                  <option style={{ color: "black" }} value="交通出行">交通出行</option>
                  <option style={{ color: "black" }} value="副业收入">副业收入</option>
                  <option style={{ color: "black" }} value="工资收入">工资收入</option>
                  <option style={{ color: "black" }} value="其他">其他</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">备注明细</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="form-input"
                  placeholder="购买了什么？例如: 星巴克咖啡"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  取消
                </button>
                <button type="submit" className="btn-primary" disabled={isPending}>
                  {isPending ? "保存中..." : "保存记录"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
