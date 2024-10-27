class Validator {

  string() {
    return new StringValidator();
  }

  array() {
    return new ArrayValidator();
  }

  object() {
    return new ObjectValidator();
  }
}


class StringValidator {
  constructor() {
    this.conditions = []; 
  }

  // С заглавной буквы
  startsFromUpperCase() {
    this.conditions.push(value => /^[A-Z]/.test(value));
    return this;
  }

  // Длина строки
  length(expectedLength) {
    this.conditions.push(value => value.length === expectedLength);
    return this;
  }

  // Восклицательный знак
  hasExclamation() {
    this.conditions.push(value => /!/.test(value));
    return this;
  }

  // Валидности строки
  isValid(value) {
    // Является ли значение строкой
    if (typeof value !== 'string') {
      return false;
    }
    return this.conditions.every(condition => condition(value));
  }
}

// Валидатор для массивов
class ArrayValidator {
  constructor() {
    this.maxDepthValue = null; 
  }

  // Является ли значение массивом
  isValid(value) {
    if (!Array.isArray(value)) {
      return false;
    }
    // Максимальная глубина
    if (this.maxDepthValue !== null) {
      return this.checkMaxDepth(value, 0) <= this.maxDepthValue;
    }
    return true;
  }

  // Глубина вложенности
  maxDepth(depth) {
    this.maxDepthValue = depth;
    return this; // Возвращаем this для цепочки вызовов
  }

  // Рекурс чека глубины вложенности
  checkMaxDepth(value, currentDepth) {
    let maxDepth = currentDepth;

    for (const item of value) {
      if (Array.isArray(item)) {
        const depth = this.checkMaxDepth(item, currentDepth + 1);
        maxDepth = Math.max(maxDepth, depth);
      }
    }

    return maxDepth;
  }
}

// Валидатор для объектов
class ObjectValidator {
  constructor() {
    this.shapeDefinition = {}; 
  }

  // Определение полей объекта и их валидаторов
  shape(shape) {
    this.shapeDefinition = shape;
    return this; 
  }

  // Чек объекта на соответствие заданной форме
  isValid(value) {
    // Объект ли
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    // ПО всем полями и проверяем их валидность
    return Object.entries(this.shapeDefinition).every(([key, validator]) => {
      return validator.isValid(value[key]); 
    });
  }
}

export default Validator; //Экпортируем зис щит
