const abs = Math.abs;

/**
 * Возвращает пары соседних элементов массива от первого до последнего
 * @param arr : Array<N>
 * @return Array<[N, N]>
 */
function pairs(arr){
	let len = arr.length-1;
	let res = [];
	for(let i=0;i<len; ++i){
		res.push([arr[i],arr[i+1]]);
	}
	return res;
}
/**
 * Возвращает пары соседних элементов массива, добавляя к ним пару последнего с первым
 * @param arr : Array<N>
 * @return Array<[N, N]>
 */
function opairs(arr){
	let len = arr.length-1;
	let res = [];
	for(let i=0;i<len; ++i){
		res.push([arr[i],arr[i+1]]);
	}
	res.push([arr[len],arr[0]]);
	return res;
}



module.exports = {
	pairs,
	opairs
};