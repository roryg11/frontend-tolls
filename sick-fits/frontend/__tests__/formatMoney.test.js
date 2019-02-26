import formatMoney from "../lib/formatMoney";

describe('formatMoney function', () => {
    it('works with fractional dollars', () => {
        expect(formatMoney(1)).toEqual("$0.01");
        expect(formatMoney(1001)).toEqual('$10.01');
    });

    it('should leave cents off for whole dollars', ()=>{
        expect(formatMoney(10000)).toEqual('$100');
        expect(formatMoney(5001000)).toEqual('$50,010');
    });
})