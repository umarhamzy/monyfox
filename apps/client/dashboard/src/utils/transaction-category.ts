import { type TransactionCategory } from "@monyfox/common-data";
import { depthFirstSearch, Graph } from "graph-data-structure";

export function isCycleInTransactionCategories(
  transactionCategories: TransactionCategory[],
): boolean {
  const graph = new Graph();
  transactionCategories.forEach((category) => {
    if (category.parentTransactionCategoryId !== null) {
      graph.addEdge(category.id, category.parentTransactionCategoryId);
    }
  });
  try {
    depthFirstSearch(graph, { errorOnCycle: true });
  } catch (e) {
    return true;
  }
  return false;
}

export type TransactionCategoryWithChildren = TransactionCategory & {
  children: TransactionCategoryWithChildren[];
};

export function getTransactionCategoriesWithChildren(
  transactionCategories: TransactionCategory[],
): TransactionCategoryWithChildren[] {
  function getChildren(
    parentId: string | null,
  ): TransactionCategoryWithChildren[] {
    return transactionCategories
      .filter((category) => category.parentTransactionCategoryId === parentId)
      .map((category) => ({
        ...category,
        children: getChildren(category.id),
      }));
  }
  return getChildren(null);
}
