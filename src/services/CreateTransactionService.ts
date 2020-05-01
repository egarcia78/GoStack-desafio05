import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const { total } = this.transactionsRepository.getBalance();

    if (!title || !value || !type) {
      throw new Error('Parameter(s) is missing');
    }

    // if (!['income', 'outcome'].includes(type))
    if (type !== 'income' && type !== 'outcome') {
      throw new Error('Invalid transaction type');
    }

    if (value <= 0) {
      throw new Error('Invalid value amount');
    }

    if (type === 'outcome' && total < value) {
      throw new Error('You do not have enought balance');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
