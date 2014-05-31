var buster = require('buster');

var lewd = require('../src/lewd');

function assertFailedWithMessage(condition, value, message) {
    try {
        condition(value);
    } catch (e) {
        buster.referee.assert.equals(e.name, 'ConditionViolationException');
        buster.referee.assert.equals(e.message, message);
        return;
    }

    buster.referee.assert(false, 'An exception should have been thrown');
}

buster.testCase('custom messages', {
    'simple': function () {
        var condition = lewd.Boolean().because('it must be so');
        assertFailedWithMessage(condition, 42, 'it must be so');
    },
    'nested': function () {
        var condition = lewd.all(String, lewd.all(/^\d/, lewd.regex(/\d$/).because('must start and end with a digit')));
        assertFailedWithMessage(condition, '4x', 'must start and end with a digit');
    },
    'with params': function () {
        var condition;
        
        condition = lewd.Boolean().because('The problem was at ${pathStr}');
        assertFailedWithMessage(condition, 'x', 'The problem was at .');

        condition = lewd.array(String).because('at: ${pathStr}');
        assertFailedWithMessage(condition, ['x', 42], 'at: #1');

        condition = lewd.object({
            a: { b: lewd.all(/^\d/, lewd.regex(/\d$/)).because('${pathStr} must start and end with a digit') }
        });
        assertFailedWithMessage(condition, { a: { b: '' } }, 'a.b must start and end with a digit');
    },
    'for object keys and values': function () {
        var condition;
        
        condition = lewd.object({ $k: lewd.regex(/^a/).because('i say so') });
        assertFailedWithMessage(condition, { x: null }, 'i say so');
        
        condition = lewd.object({ $v: lewd.regex(/^a/).because('i say so') });
        assertFailedWithMessage(condition, { x: 'b' }, 'i say so');
    },
    'for some condition': function () {
        var condition;
        
        condition = lewd.some(String, Number, null).because('Must be either a string, number or null');
        assertFailedWithMessage(condition, false, 'Must be either a string, number or null');

        condition = lewd.not(lewd.some(String, Number, null)).because('Must be neither a string, number or null');
        assertFailedWithMessage(condition, 42, 'Must be neither a string, number or null');
    }
});
