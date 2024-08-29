import { Exclude, Expose } from 'class-transformer';
import { Category } from 'src/entity/category.entity';
import { CategoryName } from 'src/shared/enum/category-name.enum';

export class CategoryShowResponse {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _name: CategoryName;

  constructor(id: number, name: CategoryName) {
    this._id = id;
    this._name = name;
  }

  @Expose()
  get id() {
    return this._id;
  }

  @Expose()
  get name() {
    return this._name;
  }

  static from(categories: Category[]) {
    return categories.map((c) => new CategoryShowResponse(c.id, c.name));
  }
}
