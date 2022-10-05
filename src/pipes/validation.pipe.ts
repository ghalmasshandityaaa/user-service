import { ArgumentMetadata, HttpException, Injectable, PipeTransform, ValidationError } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    let errors: ValidationError[];
    try {
      errors = await validate(object);
    } catch (e) {
      return value;
    }

    const errorBody: ErrorBody[] = [];
    for (let i = 0; i < errors.length; i++) {
      const body = new ErrorBody();
      body.property = errors[i].property;
      body.messages = [];

      for (const key in errors[i].constraints) {
        body.messages.push(errors[i].constraints[key]);
      }

      errorBody.push(body);
    }

    if (errors.length > 0) {
      throw new HttpException(
        { message: 'Validation failed', errors: errorBody },
        400,
      );
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

class ErrorBody {
  property: string;
  messages: string[];
}
