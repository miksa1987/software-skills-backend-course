import Validator from 'validatorjs'

export const validateObject = (object: any, rules: any) => {
  const validation = new Validator(object, rules)

  return validation.passes()
}
