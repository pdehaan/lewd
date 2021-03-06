'use strict';

var util = require('util');

var _ = require('lodash'),
    buster = require('buster');

var helper = require('./../helper'),
    lewd = require('../../src/lewd'),
    Condition = require('../../src/condition/Condition');

var assert = buster.referee.assert,
    assertExceptionWithName = helper.assertExceptionWithName;

buster.testCase('coercion', {
    'within objects': function () {
        var condition = lewd.object({ a: lewd(Boolean).coerce() }),
            obj = { a: 1 },
            result = condition(obj);

        assert.same(result, obj);
        assert.equals(result, { a: true });
    },
    'within arrays': function () {
        var condition = lewd([lewd.integer().coerce()]),
            array = [42, 1.3, 0],
            result = condition(array);

        assert.same(result, array);
        assert.equals(result, [42, 1, 0]);
    },
    '"integer condition"': {
        successful: function () {
            assert.same(lewd.integer().coerce()(42), 42);
            assert.same(lewd.integer().coerce()(42.3), 42);
        },
        failed: function () {
            assertExceptionWithName(function () {
                lewd.integer().coerce()('42');
            }, 'ConditionViolationException');
            assertExceptionWithName(function () {
                lewd.integer().coerce()('42x');
            }, 'ConditionViolationException');
        }
    },
    '"isoDateTime" condition': {
        successful: function () {
            var date = new Date(),
                value = lewd.isoDateTime().coerce()(date.toISOString());

            assert(_.isDate(value), 'Value is a Date object');
            assert.same(value.getTime(), date.getTime());
        },
        failed: function () {
            assertExceptionWithName(function () {
                lewd.isoDateTime().coerce()('1234');
            }, 'ConditionViolationException');
        }
    },
    '"Boolean" condition': function () {
        assert.same(lewd.Boolean().coerce()('1'), true);
        assert.same(lewd.Boolean().coerce()(0), false);
        assert.same(lewd.coerce(Boolean)('1'), true);
        assert.same(lewd.coerce(Boolean)(0), false);
    },
    '"String" condition': function () {
        var value = lewd.String().coerce()(42);
        assert.same(value, '42');
    }
});
