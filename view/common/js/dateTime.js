const dateTime = (date) => {
	let now = new Date(),
		old = new Date(date);
	let {
		Y: nowY,
		M: nowM,
		D: nowD
	} = getYMD(now), {
		Y: oldY,
		M: oldM,
		D: oldD,
		h: oldh,
		m: oldm
	} = getYMD(old)
	let _date = formatNumber(oldh) + ":" + formatNumber(oldm)
	if (nowY === oldY && nowM === oldM && nowD === oldD) {
		return _date
	} else if (nowY === oldY && nowM === oldM && nowD === oldD + 1) {
		return "昨天" + _date
	} else {
		return `${oldY}/${oldM+1}/${oldD}`
	}
}

const getYMD = (date) => {
	return {
		Y: date.getFullYear(),
		M: date.getMonth(),
		D: date.getDate(),
		h: date.getHours(),
		m: date.getMinutes()
	}
}

const formatNumber = n => {
	n = n.toString();
	return n[1] ? n : "0" + n;
};


export default dateTime
