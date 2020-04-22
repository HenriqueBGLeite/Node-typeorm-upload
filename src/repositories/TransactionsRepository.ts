import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = this.find();
    const valorInicial = 0;

    const income = (await transactions).reduce((total, valor) => {
      if (valor.type === 'income') {
        return total + valor.value;
      }
      return total;
    }, valorInicial);

    const outcome = (await transactions).reduce((total, valor) => {
      if (valor.type === 'outcome') {
        return total + valor.value;
      }
      return total;
    }, valorInicial);

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
