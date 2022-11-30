
export const calculate = (birthday: number): number => {
	let remainder = 0
	let sumResult = 0
	while(birthday != 0) {
		remainder = birthday % 10
		sumResult += remainder
		birthday = Math.floor(birthday / 10)
	}

	if (sumResult > 9) {
		return calculate(sumResult)
	}

	return sumResult
}
