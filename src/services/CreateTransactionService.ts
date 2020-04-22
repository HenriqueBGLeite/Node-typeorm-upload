import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import CategoryRepository from '../repositories/CategoryRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError(
        'Insufficient balance to carry out a transaction',
        400,
      );
    }

    // Verificação Existe Categoria
    const categoriesRepository = getCustomRepository(CategoryRepository);

    let transactionRepository = await categoriesRepository.verifyCategory(
      category,
    );

    if (!transactionRepository) {
      // Processo quando não existe a categoria ainda
      transactionRepository = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(transactionRepository);
    }
    // Processo caso já exista a categoria

    const transaction = await transactionsRepository.create({
      title,
      type,
      value,
      category: transactionRepository,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
