import dayjs, { type FormatObject } from 'dayjs'
import jalalidayPlugin from 'jalaliday'
import dayjsTimeZonePlugin from 'dayjs/plugin/timezone'
import dayjsUTCPlugin from 'dayjs/plugin/utc'
dayjs.extend(dayjsUTCPlugin)
dayjs.extend(dayjsTimeZonePlugin)
dayjs.extend(jalalidayPlugin)

const TehranTimeZone = 'Asia/Tehran'

export function jalaliDate(date?: string, format: 'date' | 'dateTime' | string = 'date') {
	if (!date) return undefined
	if (format === 'date') format = 'YYYY/MM/DD'
	else if (format === 'dateTime') format = 'HH:mm YYYY/MM/DD'

	return dayjs(date).tz(TehranTimeZone).calendar('jalali').locale('fa').format(format)
}

export function getJalaliWrapper(date?: string) {
	return dayjs(date).tz(TehranTimeZone).calendar('jalali').locale('fa')
}

export function getGregoryWrapper(date?: string) {
	return dayjs(date, { jalali: true } as FormatObject).tz(TehranTimeZone)
}

export function gregoryDate(date?: string, mode: 'date' | 'dateTime' | string = 'date') {
	if (!date) return false
	const format = mode === 'date' ? 'YYYY/MM/DD' : ' HH:mm YYYY/MM/DD'
	return dayjs(date, { jalali: true } as FormatObject)
		.tz(TehranTimeZone)
		.format(format)
}

export function sleep(milliseconds: number) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export function formatAmount(
	amount?: number | string | null,
	currency: string | null = 'ریال',
	emptySign = '--'
) {
	if (!amount) return emptySign
	if (Number(amount).toLocaleString() === '0') return emptySign
	let amountStr
	if (amount && Number(amount) < 0) amountStr = `${Math.abs(Number(amount)).toLocaleString()} -`
	else amountStr = Number(amount).toLocaleString()

	if (currency) return `${amountStr} ${currency}`
	else return amountStr
}

const extensionFileTypeMap = {
	jpg: 'application/jpg',
	jpeg: 'application/jpeg',
	png: 'application/png',
	doc: 'file-word',
	dotx: 'file-word',
	xlsx: 'file-excel',
	xls: 'file-excel',
	xlsm: 'file-excel',
	mp4: 'video',
	mkv: 'video',
	zip: 'application/zip',
	rar: 'application/rar',
	pdf: 'application/pdf',
	excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export function downloadFile(
	fileName: string,
	file: ArrayBuffer | Blob,
	fileType: keyof typeof extensionFileTypeMap
) {
	const blobFile = new Blob([file], { type: extensionFileTypeMap[fileType] })

	const url = URL.createObjectURL(blobFile)

	if (fileType === 'pdf') {
		window.open(url)
		return
	}

	const link = document.createElement('a')
	link.href = url

	const extension = fileType === 'excel' ? 'xlsx' : fileType

	link.download = fileName + '_' + new Date().toLocaleString('fa') + '.' + extension
	document.body.appendChild(link)

	link.click()
	URL.revokeObjectURL(url)
	document.body.removeChild(link)
}

export function copyToClipboard(val: string) {
	const elem = document.createElement('textarea')
	elem.value = val
	document.body.appendChild(elem)
	elem.select()
	document.execCommand('copy')
	document.body.removeChild(elem)
}

export function makeRandomColor() {
	return '#' + ('00000' + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)).slice(-6)
}
