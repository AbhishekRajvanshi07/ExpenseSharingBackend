/**
 * balances format:
 * balances[A][B] = amount B owes A
 */

function addBalance(balances, creditor, debtor, amount) {
  if (!balances[creditor]) balances[creditor] = {};
  balances[creditor][debtor] =
    (balances[creditor][debtor] || 0) + amount;
}

function simplifyBalances(balances) {
  const users = Object.keys(balances);

  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      const u1 = users[i];
      const u2 = users[j];

      const u1u2 = balances[u1]?.[u2] || 0;
      const u2u1 = balances[u2]?.[u1] || 0;

      const net = u1u2 - u2u1;

      if (net > 0) {
        balances[u1][u2] = net;
        delete balances[u2]?.[u1];
      } else if (net < 0) {
        balances[u2][u1] = -net;
        delete balances[u1]?.[u2];
      } else {
        delete balances[u1]?.[u2];
        delete balances[u2]?.[u1];
      }
    }
  }

  return balances;
}

exports.calculateBalances = (expenses, settlements = []) => {
  const balances = {};

  // 1️⃣ Expenses
  for (const expense of expenses) {
    const paidBy = expense.paidBy.toString();

    for (const split of expense.splits) {
      const userId = split.user.toString();

      if (userId !== paidBy) {
        addBalance(balances, paidBy, userId, split.amount);
      }
    }
  }

  // 2️⃣ Settlements
  for (const settlement of settlements) {
    const from = settlement.from.toString(); // debtor
    const to = settlement.to.toString();     // creditor
    addBalance(balances, to, from, -settlement.amount);
  }

  return removeZeroBalances(simplifyBalances(balances));
        
};

function removeZeroBalances(balances) {
  for (const creditor in balances) {
    for (const debtor in balances[creditor]) {
      if (balances[creditor][debtor] === 0) {
        delete balances[creditor][debtor];
      }
    }
    if (Object.keys(balances[creditor]).length === 0) {
      delete balances[creditor];
    }
  }
  return balances;
}

