"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface TransactionFormData {
  type: string;
  amount: number;
  category: string;
  title: string;
  date?: string;
}

// 取引を追加する Server Action
export async function addTransaction(formData: FormData) {
  try {
    const type = formData.get("type") as string;
    const amount = formData.get("amount") as string;
    const category = formData.get("category") as string;
    const title = formData.get("title") as string;

    await prisma.transaction.create({
      data: {
        type,
        amount: parseFloat(amount),
        category,
        title,
        date: new Date(),
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create transaction:", error);
    return { success: false, error: error.message || "保存に失敗しました" };
  }
}

// 取引一覧を取得する関数
export async function getTransactions(limit = 50) {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
      take: limit,
    });
    return transactions;
  } catch (error: any) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
}

// 月収支を計算する関数
export async function getMonthlySummary() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  } catch (error: any) {
    console.error("Failed to calculate monthly summary:", error);
    return { income: 0, expense: 0, balance: 0 };
  }
}

// 取引を削除する Server Action
export async function deleteTransaction(id: string) {
  try {
    await prisma.transaction.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete transaction:", error);
    return { success: false, error: error.message || "削除に失敗しました" };
  }
}
