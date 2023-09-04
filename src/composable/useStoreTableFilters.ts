/* eslint-disable @typescript-eslint/no-explicit-any */
// ? vue
import { computed, ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
// ? utils
import { jalaliDate } from '@/composable/useUtils'
// ? types
import type { LocationQuery, LocationQueryRaw } from 'vue-router'
import type { DataTablePageEvent, DataTableProps } from 'primevue/datatable'

type Obj = Record<string, unknown>
type TreeSelectAnswer = { checked: boolean }
type TreeSelect = { key: keyof Filters; checkbox: boolean }
export type TablePageEvent = Partial<DataTablePageEvent>
export type Filters<T = Record<string, unknown>> = Record<keyof T, unknown>

export type QueriesManifest<T = Record<string, unknown>> = {
	arrays?: Array<keyof T>
	treeSelect?: TreeSelect[]
	numbers?: Array<keyof T>
	numArrays?: Array<keyof T>
	rangeDates?: { from: string; to: string }[]
	autoComplete?: { filterKey: keyof T; label: string; modelKey: keyof T }[]
}

export type FiltersManifest<T = Record<string, unknown>> = Record<
	keyof T,
	{
		title: string
		options?: any[]
		show?: boolean
		loading?: boolean
		optionLabel?: string
		optionValue?: string
		model_key?: string // just for autoComplete types
		optionLabelTemplate?: (payload: any) => string // just for select and multiSelect
		getOptions?: ($event?: { originalEvent: Event; query: string }) => void // just for autoComplete types
		type:
			| 'date'
			| 'price'
			| 'string'
			| 'select'
			| 'treeSelect'
			| 'rangeDate'
			| 'multiSelect'
			| 'autoComplete'
	}
>

export type FilterChip = {
	title: string
	label: string
	filter: string
	value: string | number
	treeSelectVal?: Record<string, TreeSelectAnswer>
}

export type FilterChipsLocalStorage = Record<string /* route name */, FilterChip[]>

const show = ref(false)
const chips = ref([] as FilterChip[])
const filters = ref({} as Record<string, any>)

const CHIPS_LOCAL_STORAGE_KEY = 'pagesFilters'
const loadingMsg = 'Loading ... Please wait ...'
const emptyMsg = 'There are currently no registered cases.'
const currentPageReportTemplate = 'نمایش {first} تا {last} از {totalRecords} مورد'

export const defaultItemPerPage = 50
export const rowsOptions = [10, 20, 30, 50, 100, 200]

export default function useStoreTableFilters(payload = { withSort: false }) {
	const $route = useRoute()
	const $router = useRouter()

	onBeforeRouteLeave(() => {
		show.value = false
		chips.value = []
		filters.value = {}
	})

	const defaultTableProps = ref({
		value: [],
		lazy: true,
		dataKey: 'id',
		loading: true,
		paginator: true,
		totalRecords: 0,
		responsiveLayout: 'scroll',
		paginatorTemplate: paginatorTemplate(),
	} as DataTableProps)

	const sortProps = computed(() => {
		const obj = {} as { order: number; field: string }
		if (!$route.query.sort) return obj
		const sortQuery = $route.query.sort as string
		const order = sortQuery.charAt(sortQuery.length - 1)
		obj.order = order === '+' ? 1 : -1
		const field = sortQuery.slice(0, ($route.query.sort as string).length - 1)
		obj.field = field
		return obj
	})

	const tableProps = computed(() => {
		const obj = {
			...defaultTableProps.value,
			rowHover: true,
			rowsPerPageOptions: rowsOptions,
			rows: Number($route.query.itemPerPage) || 0,
			first: calcFirstItemIndex(Number($route.query.page), Number($route.query.itemPerPage)),
		} as DataTableProps

		if (payload.withSort) {
			obj.sortMode = 'single'
			obj.removableSort = true
			obj.sortOrder = sortProps.value.order
			obj.sortField = sortProps.value.field
		}

		return obj
	})

	return {
		show,
		chips,
		filters,
		sortProps,
		emptyMsg,
		tableProps,
		loadingMsg,
		rowsOptions,
		calcFirstItemIndex,
		paginatorTemplate,
		currentPageReportTemplate,

		updateTableProps: (payload: Partial<DataTableProps>) => {
			for (const key in payload) {
				defaultTableProps.value[key as keyof DataTableProps] = payload[key as keyof DataTableProps]
			}

			if (!defaultTableProps.value.totalRecords) defaultTableProps.value.totalRecords = 0
		},

		payloadAdapter: (event?: TablePageEvent, defaultItemPerPage = 50) => {
			const obj = {} as { page: number; itemPerPage: number; sort?: string },
				defaultPage = 1

			if (event) {
				if (event.page !== undefined) obj.page = event.page + 1
				if (event.rows !== undefined) obj.itemPerPage = event.rows
				if (event.sortField) obj.sort = event.sortField + (event.sortOrder === 1 ? '+' : '-')
				else obj.sort = undefined
			}

			if (obj.page === undefined) obj.page = Number($route.query.page) || defaultPage
			if (obj.itemPerPage === undefined)
				obj.itemPerPage = Number($route.query.itemPerPage) || defaultItemPerPage

			return obj
		},

		updateRouteQueries: async (filters: Filters | null, page?: number, itemPerPage?: number) => {
			const queries = filters === null ? $route.query : filters
			if (page) queries.page = page
			if (itemPerPage) queries.itemPerPage = itemPerPage

			await $router.replace({
				name: $route.name as string,
				query: queries as LocationQueryRaw,
			})
		},

		toggle: () => {
			show.value = !show.value
		},

		readyForQuery: (
			filters: Filters,
			_queriesManifest?: QueriesManifest,
			overwrites?: Record<string, unknown>
		) => {
			const storage = getChipsFromLocalStorage($route.name as string)
			const localStorageChips = storage[$route.name as string]

			const FiltersChips = localStorageChips.reduce((acc, chip) => {
				acc[chip.filter] = chip.value
				return acc
			}, {} as Filters)

			let result = { ...filters } as Filters
			if (!Object.keys($route.query).length) result = { ...result, ...FiltersChips }

			if (!_queriesManifest) {
				if (overwrites) return { ...result, ...overwrites }
				return result
			}

			const queriesManifest = JSON.parse(JSON.stringify(_queriesManifest)) as QueriesManifest

			if (queriesManifest.numArrays || queriesManifest.arrays) {
				let arr = [] as string[]
				if (queriesManifest.numArrays) arr = [...queriesManifest.numArrays]
				if (queriesManifest.arrays) arr = [...arr, ...queriesManifest.arrays]
				queriesManifest.arrays = arr
			}

			queriesManifest.arrays?.forEach((key) => {
				const val = result[key] as string[]
				if (key in result && val instanceof Array) {
					result[key] = val.join(',')
				} else if (key === 'education_year_id' && !val) {
					result[key] = 'undefined'
				}
			})

			queriesManifest.rangeDates?.forEach(({ from, to }) => {
				if (!from || !to || !(from in result)) return
				const val = result[from] as string[]
				if (val instanceof Array) {
					result[from] = val[0]
					result[to] = val[1]
				} else {
					result[from] = val
				}
			})

			queriesManifest.autoComplete?.forEach((manifest) => {
				if (!result[manifest.filterKey]) {
					delete result[manifest.modelKey + '_' + manifest.filterKey]
					delete result[manifest.modelKey + '_' + manifest.label]
				}

				const autoCompleteModel = result[manifest.modelKey] as Obj
				if (!autoCompleteModel) return

				result[manifest.modelKey + '_' + manifest.filterKey] = autoCompleteModel[manifest.filterKey]
				result[manifest.modelKey + '_' + manifest.label] = autoCompleteModel[manifest.label]
			})

			queriesManifest.treeSelect?.forEach(({ key, checkbox }) => {
				if (!key || !result[key]) return
				const b = result[key] as Record<string, TreeSelectAnswer>

				if (!checkbox) {
					result[key] = Object.keys(b).join(',')
					return
				} else {
					result[key] = Object.keys(b)
						.filter((k) => b[k].checked)
						.join(',')
				}
			})

			for (const key in result) {
				const property = result[key]
				if ((typeof property === 'string' && !property.length) || typeof property === 'object')
					delete result[key]
			}

			if (overwrites) return { ...result, ...overwrites }
			else return result
		},

		readFromQuery: (queriesManifest?: QueriesManifest, queries?: LocationQuery) => {
			const storage = getChipsFromLocalStorage($route.name as string)
			const localStorageChips = storage[$route.name as string]

			const FiltersChips = localStorageChips.reduce((acc, chip) => {
				acc[chip.filter] = chip.value
				return acc
			}, {} as Filters)

			const q = queries || $route.query
			let result = { ...q } as Filters

			if (!Object.keys(result).length) result = { ...FiltersChips, ...result }

			if (!queriesManifest) return result

			queriesManifest.arrays?.forEach((key) => {
				const val = result[key]
				if (key in result && typeof val === 'string') {
					result[key] = val.split(',')
				}
			})

			queriesManifest.numbers?.forEach((key) => {
				const val = result[key]
				if (val && typeof val === 'string' && !queriesManifest.arrays?.includes(key)) {
					result[key] = !isNaN(Number(val)) ? Number(val) : val
				}
			})

			queriesManifest.numArrays?.forEach((key) => {
				const val = result[key]
				if (key in result && typeof val === 'string') {
					if (key === 'education_year_id' && val === 'undefined') {
						result[key] = 'undefined'
						return
					}
					result[key] = val?.split(',')?.map((v) => Number(v))
				}
			})

			queriesManifest.rangeDates?.forEach(({ from, to }) => {
				if (!from || !to || !(from in result)) return
				if (result[from] && result[to]) {
					result[from] = [result[from], result[to]] as string[]
					delete result[to]
				}
			})

			queriesManifest.treeSelect?.forEach(({ key }) => {
				const treeSelect = localStorageChips.find((c) => c.filter === key)
				if (!treeSelect) return
				result[key] = treeSelect.treeSelectVal
			})

			queriesManifest.autoComplete?.forEach((manifest) => {
				// make empty autoComplete model
				if (!result[manifest.filterKey]) {
					result[manifest.modelKey] = undefined
					delete result[manifest.modelKey + '_' + manifest.filterKey]
					delete result[manifest.modelKey + '_' + manifest.label]
					return
				}
				// make autoComplete model
				result[manifest.modelKey] = {
					[manifest.filterKey]: result[manifest.modelKey + '_' + manifest.filterKey],
					[manifest.label]: result[manifest.modelKey + '_' + manifest.label],
				}

				delete result[manifest.modelKey + '_' + manifest.filterKey]
				delete result[manifest.modelKey + '_' + manifest.label]
			})

			return result
		},

		onRemoveFilterChip: (chip: FilterChip) => {
			chips.value = chips.value.filter((c: FilterChip) => c.filter !== chip.filter)
			const storage = getChipsFromLocalStorage($route.name as string)
			storage[$route.name as string] = chips.value
			storeChipsInLocalStorage(storage)
		},

		onClearFilterChips: () => {
			chips.value = []
			const storage = getChipsFromLocalStorage($route.name as string)
			storage[$route.name as string] = chips.value
			storeChipsInLocalStorage(storage)
		},

		buildFiltersChips: (filters: Filters, filtersManifest: FiltersManifest, onMounted = false) => {
			chips.value = []
			const storage = getChipsFromLocalStorage($route.name as string)
			const routeStorage = storage[$route.name as string]

			for (const filter in filtersManifest) {
				const filterSetting = filtersManifest[filter]
				let label, value, storedFilter

				if (onMounted) {
					storedFilter = routeStorage.find((sf) => sf.title === filterSetting.title)
				}

				if (storedFilter) {
					label = storedFilter.label
					value = storedFilter.value
				} else if (['string', 'price'].includes(filterSetting.type) && filters[filter]) {
					label = filters[filter] as string
					value = filters[filter] as string
				} else if (
					filterSetting.type === 'multiSelect' &&
					filters[filter] instanceof Array &&
					filterSetting.options?.length
				) {
					const values = [] as string[]
					const labels = [] as string[]
					const _filters = filters[filter] as string[]

					_filters.forEach((f) => {
						const filterObj = filterSetting.options?.find(
							(b) => b[filtersManifest[filter].optionValue as string] === f
						)

						if (!filterObj) return
						values.push(f)
						labels.push(filterObj[filtersManifest[filter].optionLabel as string])
					})

					const val = values.join(',')
					if (!val.length) continue
					label = labels.join(', ')
					value = val
				} else if (filterSetting.type === 'treeSelect' && filterSetting.options?.length) {
					const values = [] as string[]
					const labels = [] as string[]
					const _filters = filters[filter] as Record<string, TreeSelectAnswer>

					for (const f in _filters) {
						if (!_filters[f].checked) continue

						const filterObj = filterSetting.options?.find(
							(b) => b[filtersManifest[filter].optionValue as string] === Number(f)
						)

						if (!filterObj) continue
						values.push(f)
						labels.push(filterObj[filtersManifest[filter].optionLabel as string])
					}

					const val = values.join(',')
					if (!val.length) continue
					label = labels.join(', ')
					value = val
				} else if (filterSetting.type === 'select' && filterSetting.options?.length) {
					const filterObj = filterSetting.options?.find(
						(o) => o[filtersManifest[filter].optionValue as string] === (filters[filter] as string)
					)
					if (!filterObj) continue

					value = filters[filter] as string
					label = filterObj[filtersManifest[filter].optionLabel as string]
				} else if (filterSetting.type === 'date' && filters[filter]) {
					if (filters[filter] instanceof Array) {
						const val = filters[filter] as string[]
						label = `از ${jalaliDate(val[0])}`
						if (val[1]) label += ` تا ${jalaliDate(val[1] as string)}`
					} else {
						label = `از ${jalaliDate(filters[filter] as string)}`
					}
					value = filters[filter] as string
				} else if (filterSetting.type === 'autoComplete') {
					const autoCompleteModel = filters[filtersManifest[filter].model_key as string] as Obj

					if (!autoCompleteModel) continue

					label = autoCompleteModel[filtersManifest[filter].optionLabel as string]
					value = autoCompleteModel[filtersManifest[filter].optionValue as string]
				}

				if (value && label) {
					const payload = { filter, label, value, title: filterSetting.title } as FilterChip
					if (filterSetting.type === 'treeSelect') {
						payload.treeSelectVal = filters[filter] as Record<string, TreeSelectAnswer>
					}

					chips.value.push(payload)
				}
			}

			storage[$route.name as string] = chips.value

			storeChipsInLocalStorage(storage)
		},
	}
}

function getChipsFromLocalStorage(routeName: string) {
	let storage: FilterChipsLocalStorage
	const stringifiedStorage = localStorage.getItem(CHIPS_LOCAL_STORAGE_KEY)

	if (!stringifiedStorage) {
		storage = { [routeName]: [] }
		localStorage.setItem(CHIPS_LOCAL_STORAGE_KEY, JSON.stringify(storage))
		return storage
	}

	storage = JSON.parse(stringifiedStorage)
	if (!storage[routeName]) {
		storage[routeName] = []
	}

	return storage
}

function storeChipsInLocalStorage(storage: FilterChipsLocalStorage) {
	localStorage.setItem(CHIPS_LOCAL_STORAGE_KEY, JSON.stringify(storage))
}

function paginatorTemplate(withItemPerPage = false) {
	let paginator = 'PrevPageLink PageLinks NextPageLink'
	if (withItemPerPage) paginator += ' RowsPerPageDropdown'
	return paginator
}

function calcFirstItemIndex(page: number, perPage: number) {
	return page ? page * perPage - perPage : 0
}
