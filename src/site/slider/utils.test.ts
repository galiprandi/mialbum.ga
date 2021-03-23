import { toLongDate } from './utils'

describe('Test correct parse date', () => {
    it('Testing: "10/01/2017"', () => {
        const toTest = '10/01/2017'
        expect(toLongDate(toTest)).toBe('martes, 10 de enero de 2017')
    })
    it('Testing: "10012017"', () => {
        const toTest = '10012017'
        expect(toLongDate(toTest)).toBe('10012017')
    })
})