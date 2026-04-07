"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { locales } from "@/i18n";
import { normalizeCategory } from "@/lib/categories";

function revalidateHomeRoutes() {
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
  }
}

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export interface TransactionFormData {
  type: string;
  amount: number;
  category: string;
  title: string;
  date?: string;
}

export async function addTransaction(formData: FormData) {
  try {
    const type = formData.get("type") as string;
    const amount = formData.get("amount") as string;
    const category = normalizeCategory(formData.get("category") as string);
    const title = formData.get("title") as string;

    await prisma.transaction.create({
      data: {
        type,
        amount: Number.parseFloat(amount),
        category,
        title,
        date: new Date(),
      },
    });

    revalidateHomeRoutes();
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to create transaction:", error);
    return { success: false, error: toErrorMessage(error, "Failed to save record") };
  }
}

export async function getTransactions(limit = 50) {
  try {
    return await prisma.transaction.findMany({
      orderBy: { date: "desc" },
      take: limit,
    });
  } catch (error: unknown) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
}

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
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const expense = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  } catch (error: unknown) {
    console.error("Failed to calculate monthly summary:", error);
    return { income: 0, expense: 0, balance: 0 };
  }
}

export async function deleteTransaction(id: string) {
  try {
    await prisma.transaction.delete({
      where: { id },
    });

    revalidateHomeRoutes();
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to delete transaction:", error);
    return { success: false, error: toErrorMessage(error, "Failed to delete record") };
  }
}
