/**
 * calculate the factorial of a number
 * @param {number} someint - the value to calculate the factorial of
 * @return {number} the calculated factorial
*/
function dofancymath(someint)
{
	if (1 === someint)
	{
		return 1;
	}
	return someint * dofancymath(someint - 1);
}

module.exports = dofancymath;
