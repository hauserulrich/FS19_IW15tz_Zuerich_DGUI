const fact = require('../../www/js/fancymath.js');

/**
 * test factorial calculations
 */
function testFactorial()
{
	const res = fact(3);
	expect(res).toBe(6);
}

test('FACTORIAL calculate', testFactorial);
