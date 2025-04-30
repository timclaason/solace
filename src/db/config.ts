import {is, isEmpty, isNil} from 'ramda'

const booleanParser = (input: unknown) => {
    return isNil(input) || isEmpty(input) || !is(String, input) ? false : ['yes', 'true', '1'].includes(input.trim().toLocaleLowerCase())
}

export const usePostgres = booleanParser(process.env.USE_POSTGRES)