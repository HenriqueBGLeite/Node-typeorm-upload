import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class TransactionsRepository extends Repository<Category> {
  public async verifyCategory(category: string): Promise<Category | null> {
    const findCategory = await this.findOne({
      where: { title: category },
    });

    return findCategory || null;
  }

  public async findOneCategory(id: string): Promise<Category | null> {
    const category = await this.findOne({
      where: { id },
    });

    delete category?.created_at;
    delete category?.updated_at;

    return category || null;
  }
}

export default TransactionsRepository;
